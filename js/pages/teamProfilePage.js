// js/pages/teamProfilePage.js
import { F1Data } from '../services/api.js';
import { getTeamById, calculateStandings, getCircuitById } from '../modules/helpers.js';
import { buildTeamRanking, getTeamSeasonStats } from '../services/standings.js';
import { renderTeamPage } from '../modules/team.js';
import { initHeader } from '../modules/header.js';
import { initCountdown } from '../modules/countdown.js';
import { renderPerformanceChart } from '../modules/charts.js';

function getTeamIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function init() {
    initHeader();

    const teamId = getTeamIdFromUrl();
    if (!teamId) return;

    try {
        // 1. BUSCA OS DADOs
        const [drivers, teams, schedule, circuits] = await Promise.all([
            F1Data.getDrivers(),
            F1Data.getTeams(),
            F1Data.getSchedule(),
            F1Data.getCircuits()
        ]);

        if (schedule && circuits) {
            initCountdown(schedule, circuits);
        }

        // 2. Calcula Regras de Negócio Globais
        const { driverStats, teamStats } = calculateStandings(schedule, drivers, teams);

        // 3. Isola os dados da equipe atual
        const team = getTeamById(teamId, teams);
        if (!team) {
            console.error("Equipe não encontrada");
            return;
        }

        const teamDrivers = drivers.filter(d => d.teamId === team.id);
        const teamRanking = buildTeamRanking(teamStats);

        // 4. Calcula Estatísticas Locais
        const seasonStats = getTeamSeasonStats(
            team,
            teamDrivers,
            driverStats,
            teamStats,
            teamRanking
        );

        // Cria um array apenas com os IDs dos pilotos da equipe para facilitar a busca
        const teamDriverIds = teamDrivers.map(d => d.id);

        // 1. Filtrar apenas as corridas que já possuem resultados
        const finishedRaces = schedule.filter(race => race.result?.race);

        // 2. Preparar as arrays para o Chart.js
        const labels = [];
        const pointsEvolution = [];
        let totalPoints = 0;

        finishedRaces.forEach(race => {
            // Buscar as informações do circuito para o Eixo X
            const circuit = getCircuitById(race.circuitId, circuits);
            const circuitSigla = circuit ? circuit.country.substring(0, 3).toUpperCase() : "GP";
            labels.push(circuitSigla);

            // 3. Calcular pontos ganhos NESTA corrida (Corrida + Sprint) por TODOS os pilotos da equipe
            let pointsInThisRace = 0;

            // Percorre todos os resultados da corrida principal
            race.result.race.forEach(r => {
                // Se o ID do piloto no resultado estiver na lista de pilotos da equipe, soma os pontos
                if (teamDriverIds.includes(r.driverId)) {
                    pointsInThisRace += (r.points || 0);
                }
            });

            // Percorre todos os resultados da Sprint (se existir)
            if (race.result.sprint) {
                race.result.sprint.forEach(r => {
                    if (teamDriverIds.includes(r.driverId)) {
                        pointsInThisRace += (r.points || 0);
                    }
                });
            }

            // Soma ao total acumulado do campeonato e guarda na array do Eixo Y
            totalPoints += pointsInThisRace;
            pointsEvolution.push(totalPoints);
        });

        // 5. Renderiza a Interface
        renderTeamPage(team, teamDrivers, seasonStats);

        // 6. Renderizar o gráfico
        // ATENÇÃO: Adicionei o rótulo 'Evolução de Pontos' que estava faltando nos parâmetros
        renderPerformanceChart('teamChart', labels, pointsEvolution, 'Pontos', team.themeMain);

    } catch (error) {
        console.error("Erro ao carregar o perfil da equipe:", error);
    }
}

init();