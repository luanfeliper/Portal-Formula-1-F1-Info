// js/modules/teams.js
import { formatDriverName } from "./helpers.js";

// CRIAÇÃO TEAM CARDS
export function createTeamCards(teams, drivers) {
    const container = document.getElementById("teamsCardContainer");
    if (!container) return;

    container.innerHTML = "";

    teams.forEach(team => {
        const card = document.createElement("a");
        card.href = `team.html?id=${team.id}`;
        card.classList.add("team-card", team.themeClass);

        // Filtra pilotos da equipe
        const teamDrivers = drivers.filter(driver => driver.teamId === team.id);

        // Monta estrutura dos pilotos
        const driversHTML = teamDrivers.map(driver => {
            const { firstName, lastName } = formatDriverName(driver.name);

            return `
                <div class="team-card-driver">
                    <div class="team-card-driver__img-container">
                        <img src="${driver.image}" alt="${driver.name}" loading="lazy">
                    </div>
                    <div class="team-card-driver__info">
                        <span>
                            ${firstName} <strong>${lastName}</strong>
                        </span>
                    </div>
                </div>
            `;
        }).join("");

        card.innerHTML = `
            <div class="team-card__header">
                <div class="team-card__logo">
                    <img src="${team.logo}" alt="${team.name} Logo">
                </div>
                <span class="team-card__tittle">
                        ${team.name}
                </span>
            </div>

            <div class="team-card__car-image">
                <img src="${team.imageCar}" alt="Carro ${team.name}" loading="lazy">
            </div>

            <div class="team-card__footer">
                ${driversHTML}
            </div>
        `;

        container.appendChild(card);
    });
}

export function renderTeamsHero() {
    const hero = document.getElementById("teamsHero");
    if (!hero) return;
    hero.innerHTML = `
        <div class="teams-hero-content">
            <h1>Equipes F1 2026</h1>
            <p>Conheça todas as equipes da temporada atual</p>
        </div>
    `;
}