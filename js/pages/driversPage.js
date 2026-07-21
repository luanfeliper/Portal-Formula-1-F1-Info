import { F1Data } from '../services/api.js';      // Busca os dados
import { createDriverCards, renderDriversHero } from '../modules/drivers.js'; // Renderiza o HTML
import { initHeader } from '../modules/header.js';       // Carrega o menu
import { initCountdown } from '../modules/countdown.js';

async function init() {
    initHeader();
    renderDriversHero();

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

        // 2. EXECUTA A CRIAÇÃO DOS CARDS
        // Repassamos os dados
        if (drivers && teams) {
            createDriverCards(drivers, teams);
        }

    } catch (error) {
        console.error("Erro ao inicializar página de pilotos:", error);
    }
}

init();