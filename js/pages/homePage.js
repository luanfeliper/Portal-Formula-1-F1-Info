// js/pages/indexPage.js

import { F1Data } from '../services/api.js';

import {
    getTeamById,
    calculateStandings,
    getLastFinishedRace,
    buildRaceResults,
    getCircuitById,
    getRaceStatus
} from '../modules/helpers.js';

import { initHeader } from '../modules/header.js';
import { initCountdown } from '../modules/countdown.js';

import { renderHomeHero } from '../modules/home.js';
import { renderStandingsTables } from '../modules/homeStandings.js';
import { renderLastResult, renderNextRaces } from '../modules/homeSummary.js';
import { renderHistoryTables } from '../modules/homeHistory.js';


// --- SORT AUXILIAR HISTÓRICO ---
const sortHistoryData = (arr, key) => {
    return [...arr].sort((a, b) => {
        if (b[key] !== a[key]) return b[key] - a[key];
        return a.name.localeCompare(b.name);
    });
};

async function init() {

    initHeader();
    renderHomeHero();

    try {
        const [drivers, teams, schedule, circuits, history] = await Promise.all([
            F1Data.getDrivers(),
            F1Data.getTeams(),
            F1Data.getSchedule(),
            F1Data.getCircuits(),
            F1Data.getHistory()
        ]);

        if (schedule && circuits) {
            initCountdown(schedule, circuits);
        }

        const now = new Date();

        // =========================
        // 1. SEÇÃO CLASSIFICAÇÃO CAMPEONATO
        // =========================

        const { driverStats, teamStats } = calculateStandings(schedule, drivers, teams);

        const tieBreakerSort = (a, b) => {
            if (b.points !== a.points) return b.points - a.points;

            const maxPosition = drivers.length;
            for (let pos = 1; pos <= maxPosition; pos++) {
                const aCount = a.positions[pos] || 0;
                const bCount = b.positions[pos] || 0;
                if (bCount !== aCount) return bCount - aCount;
            }

            return a.name.localeCompare(b.name);
        };

        const sortedDrivers = drivers.map(d => ({
            ...driverStats[d.id],
            name: d.name,
            teamName: getTeamById(d.teamId, teams)?.name || "N/A"
        })).sort(tieBreakerSort);

        const sortedTeams = teams.map(t => ({
            ...teamStats[t.id],
            name: t.name
        })).sort(tieBreakerSort);

        renderStandingsTables(sortedDrivers, sortedTeams);

        // =========================
        // 2. SEÇÃO ÚLTIMO RESULTADO
        // =========================

        const lastRace = getLastFinishedRace(schedule);
        if (lastRace) {
            const circuit = getCircuitById(lastRace.circuitId, circuits);
            const results = buildRaceResults(lastRace, drivers, teams);
            renderLastResult({ circuit, results });
        }

        // =========================
        // 3. SEÇÃO PRÓXIMAS CORRIDAS
        // =========================

        const liveRace = schedule.find(r => getRaceStatus(r, now) === "live");

        const upcoming = schedule
            .filter(r => getRaceStatus(r, now) === "upcoming")
            .sort((a, b) =>
                new Date(`${a.endDate}T${a.time}`) - new Date(`${b.endDate}T${b.time}`)
            );

        if (!liveRace && upcoming.length === 0) {
            renderNextRaces([]); // Passa array vazio para esconder a seção
            // Ou simplesmente não chama a função se preferir lidar com isso aqui
        } else {
            // Sua lógica atual de montar o racesToShow
            const racesToShow = liveRace
                ? [liveRace, upcoming[0]]
                : upcoming.slice(0, 2);

            const finalRaces = racesToShow
                .filter(r => r !== undefined) // Garante que não passamos itens undefined
                .map(r => ({
                    ...r,
                    circuit: getCircuitById(r.circuitId, circuits),
                    status: getRaceStatus(r, now)
                }));

            // Lógica do card de fim de temporada (apenas se houver pelo menos uma corrida)
            if (finalRaces.length === 1 && !liveRace) {
                finalRaces.push({ type: "season-end" });
            }

            renderNextRaces(finalRaces);
        }

        // =========================
        // 4. SEÇÃO HISTÓRIA
        // =========================

        if (history) {
            const sortedTitles = sortHistoryData(history.mostTitles, 'titles');
            const sortedWins = sortHistoryData(history.mostWins, 'wins');

            renderHistoryTables(sortedTitles, sortedWins);
        }

    } catch (error) {
        console.error("Erro ao carregar a Home:", error);
    }
}

init();