// js/pages/schedulePage.js
import { F1Data } from '../services/api.js';
import { getRaceStatus } from '../modules/helpers.js';
import { renderSchedule, renderScheduleHero, activateImageHover, highlightRace } from '../modules/schedule.js';
import { initHeader } from '../modules/header.js';
import { initCountdown } from '../modules/countdown.js';

async function init() {
    initHeader();

    try {
        // 1. Busca os dados brutos
        const [schedule, circuits] = await Promise.all([
            F1Data.getSchedule(),
            F1Data.getCircuits()
        ]);

        const now = new Date();
        let nextRaceMarked = false;

        if (schedule && circuits) {
            initCountdown(schedule, circuits);
        }

        // 2. Prepara e mescla os dados
        const processedSchedule = schedule.map(race => {
            const circuit = circuits.find(c => c.id === race.circuitId);
            if (!circuit) return null;

            const statusType = getRaceStatus(race, now);
            let statusText = "";
            let statusClass = "";
            let cardExtraClass = "";

            if (statusType === "completed") {
                statusText = "Encerrado";
                statusClass = "status-completed";
                cardExtraClass = "card-status-completed";
            } else if (statusType === "live") {
                statusText = "Ao Vivo";
                statusClass = "status-live";
                cardExtraClass = "card-status-live";
            } else if (statusType === "upcoming") {
                if (!nextRaceMarked) {
                    statusText = "Próximo";
                    statusClass = "status-next";
                    nextRaceMarked = true;
                } else {
                    statusText = "Em Breve";
                    statusClass = "status-upcoming";
                }
            }

            return {
                ...race,
                circuit,
                statusText,
                statusClass,
                cardExtraClass
            };
        }).filter(Boolean); // Remove nulos caso algum circuito não seja encontrado

        renderScheduleHero();
        
        // 3. Envia para renderizar
        renderSchedule(processedSchedule);

        // 4. Aplica os comportamentos de UI
        activateImageHover();

        // 5. Verifica a URL e aplica o destaque, se necessário
        const params = new URLSearchParams(window.location.search);
        const targetRound = params.get("round");
        highlightRace(targetRound);

    } catch (error) {
        console.error("Erro ao carregar o calendário:", error);
    }
}

init();