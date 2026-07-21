// js/modules/team.js

export function renderTeamPage(team, teamDrivers, seasonStats) {
    document.title = `${team.name}`;

    renderTeamHero(team);
    renderTeamContent(team, teamDrivers, seasonStats);
}

function renderTeamHero(team) {
    const hero = document.getElementById("teamHero");
    if (!hero) return;

    hero.innerHTML = `
        <div class="team-hero ${team.themeClass}">
            <div class="team-hero__content">
                <div class="team-hero__name">
                    ${team.name}
                </div>

                <div class="team-hero__car">
                    <img src="${team.imageCar}" alt="${team.name} car">
                </div>

                <div class="team-hero__logo">
                    <img src="${team.logo}" alt="${team.name}">
                </div>

            </div>
        </div>
    `;
}

function renderTeamContent(team, drivers, seasonStats) {

    const container = document.getElementById("teamProfileContainer");
    if (!container) return;

    container.innerHTML = `
    
    <section class="team-profile__content">

        <div class="team-header">
            <h2>Perfil</h2>

            <div class="team__info-line-container">

                <div class="team__info-line">
                    <h3>Nome Completo</h3>
                    <span><strong>${team.fullName}</strong></span>
                </div>

                <div class="team__info-line">
                    <h3>Base</h3>
                    <span><strong>${team.base}</strong></span>
                </div>

                <div class="team__info-line">
                    <h3>Chefe de Equipe</h3>
                    <span><strong>${team.teamChief}</strong></span>
                </div>

                <div class="team__info-line">
                    <h3>Unidade de Potência</h3>
                    <span><strong>${team.powerUnit}</strong></span>
                </div>

                <div class="team__info-line">
                    <h3>Ano de Estreia</h3>
                    <span><strong>${team.firstEntry}</strong></span>
                </div>

            </div>
        </div>


        <div class="team-drivers">

            <h2>Pilotos</h2>

            <div class="team-drivers__grid">

                ${drivers.map(driver => `
                    <a href="driver.html?id=${driver.id}" class="team-driver-card ${team.themeClass}">
                        <div class="team-driver-card__meta">
                            <div class="team-driver-card__bg-number">${driver.number}</div>
                            <div class="team-driver-card__image">
                                <img src="${driver.image}" alt="${driver.name}">
                            </div>
                        </div>

                        <span class="team-driver-card__name">${driver.name}</span>
                    </a>
                `).join("")}

            </div>

        </div>


        <div class="team-statistics__container">

            <h1>Estatísticas</h1>

            <div class="team-statistics">

                <div class="team-statistics__season">

                    <h2>Temporada 2026</h2>

                    <div class="team-statistics__info">

                        <div class="team__info-line">
                            <h3>Posição no Campeonato</h3>
                            <span><strong>${seasonStats.championshipPosition}º</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>Pontos</h3>
                            <span><strong>${seasonStats.points}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>Vitórias</h3>
                            <span><strong>${seasonStats.wins}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>Pódios</h3>
                            <span><strong>${seasonStats.podiums}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>Top 10</h3>
                            <span><strong>${seasonStats.top10s}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>DNFs</h3>
                            <span><strong>${seasonStats.dnfs}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>DNSs</h3>
                            <span><strong>${seasonStats.dnss}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>GPs disputados</h3>
                            <span><strong>${seasonStats.races}</strong></span>
                        </div>

                    </div>

                </div>


                <div class="team-statistics__history">

                    <h2>História (até 2025)</h2>

                    <div class="team-statistics__info">

                        <div class="team__info-line">
                            <h3>Títulos Mundiais</h3>
                            <span><strong>${team.worldTitles}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>Vitórias</h3>
                            <span><strong>${team.careerWins}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>Pódios</h3>
                            <span><strong>${team.careerPodiums}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>Pole Positions</h3>
                            <span><strong>${team.polePositions}</strong></span>
                        </div>

                        <div class="team__info-line">
                            <h3>GPs disputados</h3>
                            <span><strong>${team.careerGps}</strong></span>
                        </div>

                    </div>

                </div>

            </div>

            </div> <div class="team-statistics__chart">
                <h2>Evolução da Temporada</h2>
                <div class="chart-container">
                    <canvas id="teamChart"></canvas>
                </div>
            </div>

        </div>
    </section>
    
    `;
}