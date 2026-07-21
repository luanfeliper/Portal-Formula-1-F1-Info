// js/modules/homeStandings.js

export function renderStandingsTables(sortedDrivers, sortedTeams) {
    const standingsSection = document.getElementById("standings");
    if (!standingsSection || !sortedDrivers || !sortedTeams) return;

    // Helper interno apenas para gerar o HTML das linhas
    const renderDriverRows = (list, startOffset) => list.map((d, i) => `
        <tr>
            <td class="num">${i + startOffset}º</td>
            <td>${d.name}</td>
            <td>${d.teamName}</td>
            <td class="num">${d.points}</td>
        </tr>
    `).join("");

    const teamRows = sortedTeams.map((t, i) => `
        <tr>
            <td class="num">${i + 1}º</td>
            <td>${t.name}</td>
            <td class="num">${t.points}</td>
        </tr>
    `).join("");

    // Injeção do HTML Completo
    standingsSection.innerHTML = `
        <h2>Campeonato 2026</h2>

        <div class="standing-table-container">
            <h3>Classificação de Pilotos</h3>
            <div class="table-container standings-table-container driver-table-container">
                <table class="driver-table driver-table1">
                    <thead>
                        <tr>
                            <th class="num">Posição</th>
                            <th>Piloto</th>
                            <th>Equipe</th>
                            <th class="num">Pontos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderDriverRows(sortedDrivers.slice(0, 11), 1)}
                    </tbody>
                </table>

                <table class="driver-table driver-table2">
                    <thead>
                        <tr>
                            <th class="num">Posição</th>
                            <th>Piloto</th>
                            <th>Equipe</th>
                            <th class="num">Pontos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderDriverRows(sortedDrivers.slice(11), 12)}
                    </tbody>
                </table>
            </div>

            <h3>Classificação de Equipes</h3>
            <div class="table-container standings-table-container team-table-container">
                <table class="team-table">
                    <thead>
                        <tr>
                            <th class="num">Posição</th>
                            <th>Equipe</th>
                            <th class="num">Pontos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${teamRows}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="standings-button-container">
            <a href="standings.html" class="button standings-button">Mais Resultados</a>
            <a href="standings.html" class="button standings-button">Classificação Completa</a>
            <a href="schedule.html" class="button standings-button">Calendário</a>
        </div>
    `;
}