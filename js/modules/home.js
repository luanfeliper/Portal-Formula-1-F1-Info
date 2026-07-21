export function renderHomeHero() {
    const hero = document.getElementById("homeHero");
    if (!hero) return;
    hero.innerHTML = `
        <div class="index-hero-content">
            <span class="badge">Ao Vivo</span>
            <h1>Temporada 2026</h1>
            <p>Acompanhe cada curva, cada ultrapassagem e cada vitória</p>
            <a href="schedule.html" class="button button-index-hero">Ver Calendário</a>
        </div>
    `;
}