// js/modules/schedule.js

export function renderSchedule(processedSchedule) {
    const container = document.getElementById("scheduleGpContainer");
    if (!container) return;

    container.innerHTML = ""; // Limpa antes de renderizar

    processedSchedule.forEach(data => {
        const card = document.createElement("a");
        card.href = `circuit.html?id=${data.circuitId}`;
        card.classList.add("gp-card", "schedule-gp-card");

        if (data.cardExtraClass) {
            card.classList.add(data.cardExtraClass);
        }

        card.innerHTML = `
            <div class="race-card__header">
                <div class="race-card__meta">
                    <p class="race-card__round">Round ${data.round}</p>
                    <span class="race-card__date">${data.displayDate}</span>
                </div>
                <span class="race-card__status ${data.statusClass}">
                    ${data.statusText}
                </span>
            </div>
            <div class="race-card__info">
                <h3>${data.circuit.grandPrixName}</h3>
                <h4>${data.circuit.name}</h4>
            </div>
            <div class="race-card__media flag-img">
                <img 
                    src="${data.circuit.flag}"
                    alt="Bandeira ${data.circuit.country}"
                    data-flag="${data.circuit.flag}"
                    data-track="${data.circuit.trackImage}"
                >
            </div>
        `;

        card.dataset.round = data.round;
        container.appendChild(card);
    });
}

export function renderScheduleHero() {
    const hero = document.getElementById("scheduleHero");
    if (!hero) return;
    hero.innerHTML = `
        <div class="schedule-hero-content">
            <h1>Calendário Formula 1 2026</h1>
            <p>Confira todas as etapas do Campeonato Mundial</p>
        </div>
    `;
}

// Mantemos o hover exatamente como você fez, pois é puro UI
export function activateImageHover() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll(".schedule-gp-card").forEach(card => {
        const imgContainer = card.querySelector(".race-card__media");
        const img = card.querySelector("img");

        card.addEventListener("mouseenter", () => {
            img.style.opacity = "0";
            setTimeout(() => {
                img.src = img.dataset.track;
                imgContainer.classList.remove("flag-img");
                imgContainer.classList.add("track-img");
                img.style.opacity = "1";
            }, 150);
        });

        card.addEventListener("mouseleave", () => {
            img.style.opacity = "0";
            setTimeout(() => {
                img.src = img.dataset.flag;
                imgContainer.classList.remove("track-img");
                imgContainer.classList.add("flag-img");
                img.style.opacity = "1";
            }, 150);
        });
    });
}

// Em vez de ler a URL aqui, a função agora recebe o 'round' do controlador
export function highlightRace(roundId) {
    if (!roundId) return;

    document.querySelectorAll(".schedule-gp-card").forEach(card => {
        if (card.dataset.round == roundId) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.classList.add("highlighted-race");
        }
    });
}