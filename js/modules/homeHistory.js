// js/modules/homeHistory.js

export function renderHistoryTables(sortedTitles, sortedWins) {
    const historySection = document.getElementById("history");
    if (!historySection) return;

    // Proteção caso os dados venham vazios
    if (!sortedTitles?.length || !sortedWins?.length) {
        historySection.style.display = "none";
        return;
    }

    // Apenas mapeia os dados para HTML, sem fazer .sort()
    const titlesRows = sortedTitles.map(driver => `
        <tr>
            <td>${driver.name}${driver.active ? '<span class="active-driver">*</span>' : ''}</td>
            <td>${driver.country}</td>
            <td class="num">${driver.titles}</td>
        </tr>
    `).join("");

    const winsRows = sortedWins.map(driver => `
        <tr>
            <td>${driver.name}${driver.active ? '<span class="active-driver">*</span>' : ''}</td>
            <td>${driver.country}</td>
            <td class="num">${driver.wins}</td>
        </tr>
    `).join("");

    // Injeta a estrutura completa no DOM
    historySection.innerHTML = `
        <div class="banner-history">
            <h2>Conheça a história</h2>
        </div>

        <div class="content history-container">
            <div class="history-table-container">
                <h2>Maiores Campeões</h2>
                <div class="table-container history-table-container most-titles-table-container">
                    <table class="most-titles-table">
                        <thead>
                            <tr>
                                <th>Piloto</th>
                                <th>País</th>
                                <th class="num">Títulos</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${titlesRows}
                        </tbody>
                    </table>
                </div>
                <p class="history-note">* Piloto em atividade</p>
            </div>

            <div class="history-table-container">
                <h2>Maiores Vencedores</h2>
                <div class="table-container history-table-container most-wins-table-container">
                    <table class="most-wins-table">
                        <thead>
                            <tr>
                                <th>Piloto</th>
                                <th>País</th>
                                <th class="num">Vitórias</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${winsRows}
                        </tbody>
                    </table>
                </div>
                <p class="history-note">* Piloto em atividade</p>
            </div>
        </div>
    `;
}