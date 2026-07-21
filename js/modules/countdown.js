// js/modules/countdown.js

import { getCircuitById, getRaceStatus } from "./helpers.js";

let countdownInterval = null;

export function initCountdown(schedule, circuits) {
    // Limpa qualquer timer antigo antes de rodar novamente
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    const container = document.getElementById("countdown");
    if (!container || !schedule?.length || !circuits?.length) return;

    const now = new Date();

    const liveRace = schedule.find(race => getRaceStatus(race, now) === "live");
    const nextRace = schedule.find(race => getRaceStatus(race, now) === "upcoming");
    const targetRace = liveRace || nextRace;

    if (!targetRace) {
        container.style.display = "none";
        return;
    }

    const circuit = getCircuitById(targetRace.circuitId, circuits);
    if (!circuit) return;

    // Renderiza o HTML
    container.innerHTML = `
        <a href="schedule.html?round=${targetRace.round}" class="countdown-link">
            <div class="countdown-bar-container">
                <div class="race-identity">
                    <span class="countdown-race-card-round">Round ${targetRace.round}</span>
                    <div class="mini-flag-name-gp">
                        <div class="mini-flag-container">
                            <img src="${circuit.flag}" alt="Bandeira ${circuit.country}" class="mini-flag">
                        </div>
                        <span class="gp-title">${liveRace ? "EM ANDAMENTO" : circuit.country}</span>
                    </div>
                    <span class="gp-date">${targetRace.displayDate}</span>
                </div>

                <div class="time-display">
                    <div class="countdown-digits">
                        <div class="digit-group"><span id="days">00</span><small>D</small></div>
                        <div class="digit-group"><span id="hours">00</span><small>H</small></div>
                        <div class="digit-group"><span id="minutes">00</span><small>M</small></div>
                        <div class="digit-group"><span id="seconds">00</span><small>S</small></div>
                    </div>
                </div>
            </div>
        </a>
    `;

    if (liveRace) return;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");

    const timeString = targetRace.time.includes("Z") || targetRace.time.includes("+") 
        ? targetRace.time 
        : `${targetRace.time}Z`;
    const raceStart = new Date(`${targetRace.endDate}T${timeString}`).getTime();

    const updateTimer = () => {
        const diff = raceStart - Date.now();

        if (diff <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            
            // Re-executa para o status 'live' assumir a tela naturalmente
            initCountdown(schedule, circuits);
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.innerText = d.toString().padStart(2, "0");
        hoursEl.innerText = h.toString().padStart(2, "0");
        minsEl.innerText = m.toString().padStart(2, "0");
        secsEl.innerText = s.toString().padStart(2, "0");
    };

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
}