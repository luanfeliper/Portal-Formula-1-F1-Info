// js/modules/homeSummary.js
import { formatDriverName } from "./helpers.js";

export function renderLastResult(lastRaceData) {
    const container = document.getElementById("lastResultContainer");
    if (!container || !lastRaceData) return;

    const { circuit, results } = lastRaceData;
    container.style.display = "grid";

    const podium = results.filter(r => r.position <= 3);
    const top10 = results.filter(r => r.position > 3 && r.position <= 10);

    container.innerHTML = `
        <h2>Último Resultado - ${circuit.grandPrixName}</h2>
        <div class="podium-cards"></div>
        <div class="table-container top10-table-container">
            <table><tbody></tbody></table>
        </div>
    `;

    const podiumContainer = container.querySelector(".podium-cards");
    const tbody = container.querySelector("tbody");

    // ===== PÓDIO =====
    podium.forEach(result => {
        const { driver, team, position } = result;
        const { firstName, lastName } = formatDriverName(driver.name);

        const card = document.createElement("a");
        card.href = `driver.html?id=${driver.id}`;
        card.classList.add("card", `top${position}`, team.themeClass);

        card.innerHTML = `
            <div class="driver-img-container ${team.themeClass}">
                <img class="driver-img" src="${driver.image}" alt="${driver.name}">
            </div>
            <div class="driver-info">
                <h3 class="driver-info-position">${position}º</h3>
                <p class="driver-info-name">${firstName} <strong>${lastName}</strong><br></p>
                <span class="driver-info-team-name">${team.name}</span>
            </div>
        `;
        podiumContainer.appendChild(card);
    });

    // ===== TOP 10 =====
    top10.forEach(result => {
        const { driver, team, position } = result;
        const { firstName, lastName } = formatDriverName(driver.name);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="num">${position}º</td>
            <td>
                <a href="driver.html?id=${driver.id}" class="table-link">
                    ${firstName} <strong>${lastName}</strong>
                </a>
            </td>
            <td>${team.name}</td>
        `;
        tbody.appendChild(row);
    });
}

// js/modules/homeSummary.js

export function renderNextRaces(racesToShow) {
    const section = document.querySelector(".next-gp");
    if (!section || !racesToShow.length) return;

    section.style.display = "block";
    section.innerHTML = `<h2>Próximos GPs</h2><div id="nextGpContainer"></div>`;
    const container = section.querySelector("#nextGpContainer");

    racesToShow.forEach(race => {
        // Caso 1: Fim da Temporada
        if (race.type === "season-end") {
            const endCard = document.createElement("div");
            endCard.classList.add("season-end-card");
            endCard.innerHTML = `
                <div class="gp-info">
                    <h3>Fim da Temporada</h3>
                    <h4>Não há mais GPs este ano</h4>
                </div>
            `;
            container.appendChild(endCard);
            return;
        }

        // Caso 2: Corrida Real
        const { circuit, status } = race;
        const card = document.createElement("a");
        card.href = `schedule.html?round=${race.round}`;
        card.className = status === "live" ? "gp-card card-status-live" : "gp-card";

        card.innerHTML = `
            <div class="gp-info">
                <h3>${circuit.grandPrixName} ${race.displayDate}</h3>
                <h4>${circuit.name}</h4>
                <div class="gp-img">
                    <img src="${circuit.trackImage}" alt="Circuito ${circuit.name}">
                </div>
                <p>País: <strong>${circuit.country}</strong></p>
                <p>Voltas: <strong>${circuit.laps}</strong></p>
                <p>Extensão: <strong>${circuit.length}</strong></p>
            </div>
        `;
        container.appendChild(card);
    });
}