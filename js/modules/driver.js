// js/modules/driver.js

import {
    calculateAge,
    formatDriverName
} from "./helpers.js";

export function renderDriverPage(driver, team, seasonStats) {
    document.title = `${driver.name}`;

    renderDriverHero(driver, team);
    renderDriverContent(driver, team, seasonStats);
}

function renderDriverHero(driver, team) {
    const hero = document.getElementById("driverHero");
    if (!hero) return;

    const { firstName, lastName } = formatDriverName(driver.name);

    hero.innerHTML = `
        <div class="driver-hero ${team.themeClass}">
            <div class="driver-hero__content">
                <div class="driver-hero__meta">
                    <div class="driver-hero__bg-number">${driver.number}</div>
                    <div class="driver-hero__image">
                        <img src="${driver.image}" alt="${driver.name}">
                    </div>
                </div>
                <div class="driver-hero__info">
                    <span class="driver-name">${firstName}</span>
                    <span class="driver-surname"><strong>${lastName}</strong></span>
                </div>
            </div>
        </div>
    `;
}

function renderDriverContent(driver, team, seasonStats) {
    const container = document.getElementById("driverProfileContainer");
    if (!container) return;

    const age = driver.dateOfBirth ? calculateAge(driver.dateOfBirth) : "-";

    const dataFormatada = driver.dateOfBirth
        ? driver.dateOfBirth.split("-").reverse().join("/")
        : "-";

    container.innerHTML = `
        <section class="driver-profile__content">
            <div class="driver-header">
                <h2>Biografia</h2>
                <div class="driver__info-line-container">
                    <div class="driver__info-line">
                        <h3>Nacionalidade</h3>
                        <span><strong>${driver.country}</strong></span>
                    </div>
                    <div class="driver__info-line">
                        <h3>Nascimento</h3>
                        <span><strong>${driver.placeOfBirth}</strong></span>
                    </div>
                    <div class="driver__info-line">
                        <h3>Data</h3>
                        <span><strong>${dataFormatada}</strong></span>
                    </div>
                    <div class="driver__info-line">
                        <h3>Idade</h3>
                        <span><strong>${age} anos</strong></span>
                    </div>
                </div>
            </div>

            <div class="driver-team_container">

                <h2>Equipe</h2>

                    <a href="team.html?id=${team.id}" class="driver-team-card ${team.themeClass}">
                        <div class="driver-team-card__meta">
                            <div class="driver-team-card__bg-name">${team.name}</div>
                            <div class="driver-team-card__image">
                                <img src="${team.imageCar}" alt="${team.name}">
                            </div>
                        </div>

                        <span class="driver-team-card__name">${team.name}</span>
                    </a>

            </div>

            <div class="driver-statistics__container">
                <h1>Estatísticas</h1>

                <div class="driver-statistics">
                    <div class="driver-statistics__season">
                        <h2>Temporada 2026</h2>
                        <div class="driver-statistics__info">

                            <div class="driver__info-line">
                                <h3>Posição no Campeonato</h3>
                                <span><strong>${seasonStats.championshipPosition}º</strong></span>
                            </div>

                            <div class="driver__info-line">
                                <h3>Pontos</h3>
                                <span><strong>${seasonStats.points}</strong></span>
                            </div>

                            <div class="driver__info-line">
                                <h3>Vitórias</h3>
                                <span><strong>${seasonStats.wins}</strong></span>
                            </div>

                            <div class="driver__info-line">
                                <h3>Pódios</h3>
                                <span><strong>${seasonStats.podiums}</strong></span>
                            </div>

                            <div class="driver__info-line">
                                <h3>Top 10</h3>
                                <span><strong>${seasonStats.pointsFinishes}</strong></span>
                            </div>

                            <div class="driver__info-line">
                                <h3>DNFs</h3>
                                <span><strong>${seasonStats.dnf}</strong></span>
                            </div>

                            <div class="driver__info-line">
                                <h3>DNSs</h3>
                                <span><strong>${seasonStats.dns}</strong></span>
                            </div>

                            <div class="driver__info-line">
                                <h3>GPs Disputados</h3>
                                <span><strong>${seasonStats.races}</strong></span>
                            </div>
                        </div>
                    </div>

                    <div class="driver-statistics__history">
                        <h2>Carreira (até 2025)</h2>
                        <div class="driver-statistics__info">
                            <div class="driver__info-line">
                                <h3>GPs Disputados</h3> <span><strong>${driver.careerGps}</strong></span> </div>
                            <div class="driver__info-line">
                                <h3>Temporada de Estreia</h3> <span><strong>${driver.debutSeason}</strong></span> </div>
                            <div class="driver__info-line">
                                <h3>Títulos Mundiais</h3> <span><strong>${driver.worldTitles}</strong></span> </div>
                            <div class="driver__info-line">
                                <h3>Vitórias</h3> <span><strong>${driver.careerWins}</strong></span> </div>
                            <div class="driver__info-line">
                                <h3>Pódios</h3> <span><strong>${driver.careerPodiums}</strong></span> </div>
                            <div class="driver__info-line">
                                <h3>Pole Positions</h3> <span><strong>${driver.polePositions}</strong></span> </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="driver-statistics__chart">
                    <h2>Evolução da Temporada</h2>
                    <div class="chart-container">
                        <canvas id="driverChart"></canvas>
                    </div>
                </div>
            </div>
            
        </section> 
    `;
}