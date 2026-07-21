import { F1Data } from '../services/api.js';
import { getTeamById, calculateStandings, getCircuitById } from '../modules/helpers.js';
import { buildDriverRanking, getDriverSeasonStats } from '../services/standings.js';
import { renderDriverPage } from '../modules/driver.js';
import { renderPerformanceChart } from '../modules/charts.js';
import { initHeader } from '../modules/header.js';
import { initCountdown } from '../modules/countdown.js';

async function init() {
    initHeader();

    const params = new URLSearchParams(window.location.search);
    const driverId = params.get("id");
    if (!driverId) return;

    try {
        // 1. BUSCA OS DADOS
        const [drivers, teams, schedule, circuits] = await Promise.all([
            F1Data.getDrivers(),
            F1Data.getTeams(),
            F1Data.getSchedule(),
            F1Data.getCircuits()
        ]);

        if (schedule && circuits) {
            initCountdown(schedule, circuits);
        }

        // 1. Processamento (Lógica de Negócio)
        const { driverStats } = calculateStandings(schedule, drivers, teams);
        const driver = drivers.find(d => d.id === driverId);

        if (!driver) {
            console.error("Piloto não encontrado");
            return;
        }

        const team = getTeamById(driver.teamId, teams);
        const ranking = buildDriverRanking(driverStats);
        const seasonStats = getDriverSeasonStats(driver.id, ranking, driverStats);


        // 1. Filtrar apenas as corridas que já possuem resultados
        const finishedRaces = schedule.filter(race => race.result?.race);

        // 2. Preparar as arrays para o Chart.js
        const labels = [];
        const pointsEvolution = [];
        let totalPoints = 0;

        finishedRaces.forEach(race => {
            // Buscar as informações do circuito para o Eixo X
            const circuit = getCircuitById(race.circuitId, circuits);

            // Cria uma sigla com as 3 primeiras letras do país ou nome (ex: BAH, SAU, AUS)
            const circuitSigla = circuit ? circuit.country.substring(0, 3).toUpperCase() : "GP";
            labels.push(circuitSigla);

            // 3. Calcular pontos ganhos NESTA corrida (Corrida + Sprint)
            let pointsInThisRace = 0;

            // Procura o piloto no resultado da corrida principal
            const raceResult = race.result.race.find(r => r.driverId === driver.id);
            if (raceResult) {
                pointsInThisRace += (raceResult.points || 0);
            }

            // Procura o piloto no resultado da Sprint (se existir)
            if (race.result.sprint) {
                const sprintResult = race.result.sprint.find(r => r.driverId === driver.id);
                if (sprintResult) {
                    pointsInThisRace += (sprintResult.points || 0);
                }
            }

            // Soma ao total acumulado do campeonato e guarda na array do Eixo Y
            totalPoints += pointsInThisRace;
            pointsEvolution.push(totalPoints);
        });


        // 2. Renderização (Visual)
        renderDriverPage(driver, team, seasonStats);

        // 4. Renderizar o gráfico (chamando aquela função do módulo charts.js)
        renderPerformanceChart('driverChart', labels, pointsEvolution, 'Pontos', team.themeMain);

    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
    }
}

init();