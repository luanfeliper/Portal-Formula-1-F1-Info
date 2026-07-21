// Função genérica de desempate por pontos e posições
const createTieBreakerComparator = () => (a, b) => {
    if (b.points !== a.points) return b.points - a.points;

    for (let pos = 1; pos <= 50; pos++) {
        const aCount = a.positions?.[pos] || 0;
        const bCount = b.positions?.[pos] || 0;

        if (bCount !== aCount) return bCount - aCount;
    }

    return (a.name || a.teamName || "").localeCompare(b.name || b.teamName || "");
};

const tieBreakerSort = createTieBreakerComparator();

/**
 * Organiza o ranking de pilotos baseado nos pontos e critérios de desempate.
 */
export function buildDriverRanking(driverStats) {
    return Object.entries(driverStats)
        .map(([driverId, stats]) => ({
            driverId,
            points: stats.points,
            positions: stats.positions,
            name: stats.name || ""
        }))
        .sort(tieBreakerSort);
}

/**
 * Organiza o ranking de equipes baseado nos pontos e critérios de desempate.
 */
export function buildTeamRanking(teamStats) {
    return Object.entries(teamStats)
        .map(([teamId, stats]) => ({
            teamId,
            points: stats.points,
            positions: stats.positions,
            teamName: stats.name || ""
        }))
        .sort(tieBreakerSort);
}

/**
 * Processa as estatísticas detalhadas de um piloto específico para a temporada.
 */
export function getDriverSeasonStats(driverId, ranking, driverStats) {
    const championshipPosition = ranking.findIndex(d => d.driverId === driverId) + 1;
    const stats = driverStats[driverId];

    if (!stats) {
        return {
            championshipPosition: "-",
            points: 0,
            wins: 0,
            podiums: 0,
            pointsFinishes: 0,
            races: 0,
            dnf: 0,
            dns: 0
        };
    }

    const positions = stats.positions || {};
    const wins = positions[1] || 0;
    const podiums = (positions[1] || 0) + (positions[2] || 0) + (positions[3] || 0);
    const pointsFinishes = Object.entries(positions)
        .filter(([pos]) => Number(pos) <= 10)
        .reduce((sum, [, count]) => sum + count, 0);

    const numericRaces = Object.values(positions).reduce((sum, count) => sum + count, 0);

    return {
        championshipPosition,
        points: stats.points,
        wins,
        podiums,
        pointsFinishes,
        races: numericRaces + (stats.dnf || 0),
        dnf: stats.dnf || 0,
        dns: stats.dns || 0
    };
}

/**
 * Calcula os pontos e posições para um piloto dentro de uma equipe.
 */
const calculateDriverStats = (driverStats) => {
    if (!driverStats) return { wins: 0, podiums: 0, top10s: 0, dnf: 0, dns: 0 };

    const p = driverStats.positions || {};
    const wins = p[1] || 0;
    const podiums = (p[1] || 0) + (p[2] || 0) + (p[3] || 0);
    const top10s = Object.entries(p)
        .filter(([pos]) => Number(pos) <= 10)
        .reduce((sum, [, count]) => sum + count, 0);

    return {
        wins,
        podiums,
        top10s,
        dnf: driverStats.dnf || 0,
        dns: driverStats.dns || 0
    };
};

/**
 * Processa as estatísticas detalhadas de uma equipe para a temporada.
 */
export function getTeamSeasonStats(team, teamDrivers, driverStats, teamStats, teamRanking) {
    const championshipPosition = teamRanking.findIndex(t => t.teamId === team.id) + 1;
    const points = teamStats[team.id]?.points || 0;
    const races = teamStats[team.id]?.races || 0;

    const totals = teamDrivers.reduce((acc, driver) => {
        const driverStats_ = calculateDriverStats(driverStats[driver.id]);
        return {
            wins: acc.wins + driverStats_.wins,
            podiums: acc.podiums + driverStats_.podiums,
            top10s: acc.top10s + driverStats_.top10s,
            dnfs: acc.dnfs + driverStats_.dnf,
            dnss: acc.dnss + driverStats_.dns
        };
    }, { wins: 0, podiums: 0, top10s: 0, dnfs: 0, dnss: 0 });

    return {
        championshipPosition,
        points,
        wins: totals.wins,
        podiums: totals.podiums,
        top10s: totals.top10s,
        dnfs: totals.dnfs,
        dnss: totals.dnss,
        races
    };
}