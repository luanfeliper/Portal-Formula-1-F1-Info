// js/pages/circuitPage.js
import { F1Data } from '../services/api.js';
import { buildRaceResults, buildSprintResults } from '../modules/helpers.js';
import { renderCircuitPage } from '../modules/circuit.js';
import { initHeader } from '../modules/header.js';
import { initCountdown } from '../modules/countdown.js';

// Pega o id do circuito da URL
function getCircuitIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function init() {
    initHeader();

    const circuitId = getCircuitIdFromUrl();
    if (!circuitId) return;

    try {
        // 1. Busca os dados
        const [circuits, schedule, drivers, teams] = await Promise.all([
            F1Data.getCircuits(),
            F1Data.getSchedule(),
            F1Data.getDrivers(),
            F1Data.getTeams()
        ]);

        if (schedule && circuits) {
            initCountdown(schedule, circuits);
        }

        // 2. Encontra o circuito atual
        const currentIndex = circuits.findIndex(c => c.id === circuitId);
        if (currentIndex === -1) {
            console.error("Circuito não encontrado");
            return;
        }

        const circuit = circuits[currentIndex];

        // 3. Busca a corrida correspondente no calendário
        const race = schedule.find(r => r.circuitId === circuitId);

        // 4. Constrói as tabelas de resultados, se a corrida já ocorreu
        let raceResults = [];
        let sprintResults = [];

        if (race && race.result) {
            if (race.result.race) {
                raceResults = buildRaceResults(race, drivers, teams);
            }
            if (race.result.sprint) {
                sprintResults = buildSprintResults(race, drivers, teams);
            }
        }

        // 5. Envia os dados para a camada visual
        renderCircuitPage(circuit, sprintResults, raceResults);

    } catch (error) {
        console.error("Erro ao carregar a página do circuito:", error);
    }
}

init();