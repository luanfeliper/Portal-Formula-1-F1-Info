// js/modules/drivers.js
import { getTeamById, formatDriverName } from "./helpers.js";

// CRIAÇÃO DRIVER CARDS
export function createDriverCards(drivers, teams) {
    const container = document.getElementById("driversCardContainer");
    if (!container) return;

    container.innerHTML = "";

    drivers.forEach(driver => {
        const team = getTeamById(driver.teamId, teams);
        if (!team) {
            console.warn(`Team not found for driver ${driver.name}`);
            return;
        }

        const { firstName, lastName } = formatDriverName(driver.name);

        const card = document.createElement("a");
        card.href = `driver.html?id=${driver.id}`;
        card.classList.add("driver-card", team.themeClass);

        card.innerHTML = `
            <span class="driver-card__abbr">${driver.abbr}</span>
            <div class="driver-card__info">
                
                <div class="driver-card__header">
                    <span class="driver-card__name">
                        ${firstName} <br> <strong>${lastName}</strong>
                    </span>
                    <span class="driver-card__number">
                        ${driver.number}
                    </span>
                </div>

                <div class="driver-card__footer">
                    <div class="driver-card__meta">
                        <div class="driver-card__icon">
                            <img class="driver-card__icon-nac" src="${driver.countryFlag}" alt="${driver.country}">
                        </div>
                        <span>${driver.country}</span>
                    </div>

                    <div class="driver-card__meta">
                        <div class="driver-card__icon">
                            <img src="${team.logo}" alt="${team.name}">
                        </div>
                        <span>${team.name}</span>
                    </div>
                </div>
            </div>

            <div class="driver-card__image-container ${team.themeClass}">
                <img src="${driver.image}" alt="${driver.name}" loading="lazy">
            </div>
        `;

        container.appendChild(card);
    });
}

export function renderDriversHero() {
    const hero = document.getElementById("driverHero");
    if (!hero) return;
    hero.innerHTML = `
        <div class="drivers-hero-content">
            <h1>Pilotos do grid 2026</h1>
            <p>Conheça cada candidato ao título Mundial</p>
        </div>
    `;
}