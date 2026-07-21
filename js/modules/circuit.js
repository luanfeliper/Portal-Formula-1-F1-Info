// js/modules/circuit.js

export function renderCircuitPage(circuit, sprintResults, raceResults) {
    document.title = `${circuit.grandPrixName}`;

    renderCircuitHero(circuit);
    renderCircuitContent(circuit);
    renderCircuitResults(sprintResults, raceResults);
}

function renderCircuitHero(circuit) {
    const hero = document.getElementById("circuitHero");
    if (!hero) return;

    hero.innerHTML = `
        <div class="circuit-hero__content">
            <h1>${circuit.grandPrixName}</h1>
        </div>
    `;

    hero.style.backgroundImage =
        `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${circuit.flag})`;
}

function renderCircuitContent(circuit) {
    const container = document.getElementById("circuitContainer");
    if (!container) return;

    container.innerHTML = `
        <section class="circuit-content">
            <div class="circuit__header">
                <h1>${circuit.name}</h1>
            </div>

            <div class="circuit-main__container">

                <div class="circuit__image">
                    <img src="${circuit.trackImage}" alt="${circuit.name}">
                </div>

                <div class="circuit-aside">

                    <div class="circuit-aside__info">
                        <div class="circuit__info-line">
                            <h3>Extensão</h3>
                            <span><strong>${circuit.length}</strong></span>
                        </div>

                        <div class="circuit__info-line">
                            <h3>Número de Voltas</h3>
                            <span><strong>${circuit.laps}</strong></span>
                        </div>

                        <div class="circuit__info-line">
                            <h3>Tipo de Circuito</h3>
                            <span><strong>${circuit.type}</strong></span>
                        </div>

                        <div class="circuit__info-line">
                            <h3>Sentido</h3>
                            <span><strong>${circuit.direction}</strong></span>
                        </div>
                    </div>

                    <div class="circuit-aside__history">
                        <div class="circuit__info-line">
                            <h3>Primeiro Gran Prix</h3>
                            <span><strong>${circuit.firstGP}</strong></span>
                        </div>

                        <div class="circuit__info-line">
                            <h3>Volta mais rápida</h3>
                            <span><strong>${circuit.lapRecord.time}</strong></span>
                            <p>${circuit.lapRecord.driver} (${circuit.lapRecord.year})</p>
                        </div>
                    </div>

                </div>

                <div class="circuit__description">
                    <p>${circuit.description}</p>
                </div>

            </div>
        </section>
    `;
}

function renderCircuitResults(sprintResults, raceResults) {
    const resultsSection = document.getElementById("circuitResults");
    if (!resultsSection) return;

    if (!sprintResults.length && !raceResults.length) {
        resultsSection.style.display = "none";
        resultsSection.innerHTML = "";
        return;
    }

    let html = `<h2>Resultado</h2>`;

    if (sprintResults.length > 0 && raceResults.length > 0) {
        html += `
            <div class="results-selector">
                <select id="resultType">
                    <option value="race">Corrida Principal</option>
                    <option value="sprint">Sprint</option>
                </select>
            </div>
        `;
    }

    html += `<div class="circuit-results">`;

    if (sprintResults.length > 0) {
        const hiddenClass = raceResults.length > 0 ? 'hidden' : '';
        html += `
            <div id="tab-sprint" class="circuit-results__content ${hiddenClass}">
                <h3>Sprint</h3>
                <div class="table-container circuit-table__container">
                    <table>
                        <thead>
                            <tr>
                                <th class="num">Posição</th>
                                <th>Piloto</th>
                                <th>Equipe</th>
                                <th class="num">Pontos</th>
                            </tr>
                        </thead>
                        <tbody>${buildRows(sprintResults)}</tbody>
                    </table>
                </div>
            </div>
        `;
    }

    if (raceResults.length > 0) {
        html += `
            <div id="tab-race" class="circuit-results__content">
                <h3>Corrida</h3>
                <div class="table-container circuit-table__container">
                    <table>
                        <thead>
                            <tr>
                                <th class="num">Posição</th>
                                <th>Piloto</th>
                                <th>Equipe</th>
                                <th class="num">Pontos</th>
                            </tr>
                        </thead>
                        <tbody>${buildRows(raceResults)}</tbody>
                    </table>
                </div>
            </div>
        `;
    }

    html += `</div>`;
    resultsSection.innerHTML = html;
    resultsSection.style.display = "block";

    setupTabsListener();
}

function buildRows(results) {
    return results.map(r => {
        const numericPosition = Number(r.position);
        const displayPosition = !isNaN(numericPosition) ? `${numericPosition}º` : r.position;

        return `
            <tr>
                <td class="num">${displayPosition}</td>
                <td>${r.driver.name}</td>
                <td>${r.team?.name || "-"}</td>
                <td class="num">${r.points}</td>
            </tr>
        `;
    }).join("");
}

// Alterar entre Sprint e Corrida Principal
function setupTabsListener() {
    const select = document.getElementById('resultType');
    if (!select) return;

    select.addEventListener('change', (e) => {
        const type = e.target.value;
        const raceTab = document.getElementById('tab-race');
        const sprintTab = document.getElementById('tab-sprint');

        // Alterna a classe 'hidden' baseado na condição (true adiciona, false remove)
        raceTab?.classList.toggle('hidden', type !== 'race');
        sprintTab?.classList.toggle('hidden', type === 'race');
    });
}