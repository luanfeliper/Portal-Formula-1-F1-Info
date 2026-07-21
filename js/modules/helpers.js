// modules/helpers.js

const findById = (collection, id) => {
    return Array.isArray(collection)
        ? collection.find(item => item.id === id) || null
        : null;
};

export const getDriverById = (id, drivers) => findById(drivers, id);
export const getTeamById = (id, teams) => findById(teams, id);
export const getCircuitById = (id, circuits) => findById(circuits, id);

const parseDate = value => {
    return value instanceof Date ? value : new Date(value);
};

export const getRaceStatus = (race, now = new Date()) => {
    const raceStart = new Date(`${race.endDate}T${race.time}`);
    const raceEnd = new Date(raceStart.getTime() + 2 * 60 * 60 * 1000);

    if (now < raceStart) return 'upcoming';
    if (now <= raceEnd) return 'live';
    return 'completed';
};

export const formatDriverName = name => {
    const trimmed = String(name).trim();
    const parts = trimmed.split(/\s+/);

    if (parts.length <= 1) {
        return { firstName: trimmed, lastName: '' };
    }

    return {
        firstName: parts.slice(0, -1).join(' '),
        lastName: parts[parts.length - 1]
    };
};

export const calculateAge = dateValue => {
    const today = new Date();
    const birthDate = parseDate(dateValue);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }

    return age;
};

const getRaceDateTime = race => new Date(`${race.endDate}T${race.time}`);

export const getLastFinishedRace = (schedule, now = new Date()) => {
    if (!Array.isArray(schedule) || schedule.length === 0) return null;

    return schedule
        .filter(event => event.result?.race)
        .map(event => ({
            ...event,
            raceDateTime: getRaceDateTime(event)
        }))
        .filter(event => event.raceDateTime <= now)
        .sort((a, b) => b.raceDateTime - a.raceDateTime)[0] || null;
};

const normalizePosition = position => {
    const numeric = Number(position);
    return Number.isNaN(numeric) ? null : numeric;
};

const sortResultsByPosition = results => {
    return [...results].sort((a, b) => {
        const aPosition = normalizePosition(a.position);
        const bPosition = normalizePosition(b.position);

        if (aPosition === null && bPosition === null) return 0;
        if (aPosition === null) return 1;
        if (bPosition === null) return -1;
        return aPosition - bPosition;
    });
};

const buildResults = (resultList, drivers, teams) => {
    if (!Array.isArray(resultList)) return [];

    return sortResultsByPosition(resultList)
        .map(result => {
            const driver = getDriverById(result.driverId, drivers);
            if (!driver) return null;

            return {
                ...result,
                driver,
                team: getTeamById(driver.teamId, teams)
            };
        })
        .filter(Boolean);
};

export const buildRaceResults = (race, drivers, teams) => {
    return race?.result?.race ? buildResults(race.result.race, drivers, teams) : [];
};

export const buildSprintResults = (race, drivers, teams) => {
    return race?.result?.sprint ? buildResults(race.result.sprint, drivers, teams) : [];
};

const createDriverStats = drivers => {
    return drivers.reduce((stats, driver) => {
        stats[driver.id] = { points: 0, positions: {}, dnf: 0, races: 0, dns: 0 };
        return stats;
    }, {});
};

const createTeamStats = teams => {
    return teams.reduce((stats, team) => {
        stats[team.id] = { points: 0, positions: {}, races: 0, dnfs: 0, dns: 0 };
        return stats;
    }, {});
};

const addRaceResult = (result, driverMap, driverStats, teamStats, teamsParticipated) => {
    const driver = driverMap[result.driverId];
    if (!driver) return;

    const team = teamStats[driver.teamId];
    const driverStat = driverStats[driver.id];
    const points = Number(result.points) || 0;
    const position = result.position;
    const numericPosition = normalizePosition(position);

    driverStat.points += points;
    if (team) team.points += points;

    if (numericPosition !== null) {
        driverStat.races += 1;
        driverStat.positions[numericPosition] = (driverStat.positions[numericPosition] || 0) + 1;

        if (team) {
            team.positions[numericPosition] = (team.positions[numericPosition] || 0) + 1;
            teamsParticipated.add(driver.teamId);
        }
    } else if (position === 'DNF') {
        driverStat.races += 1;
        driverStat.dnf += 1;
        if (team) {
            team.dnfs += 1;
            teamsParticipated.add(driver.teamId);
        }
    } else if (position === 'DNS') {
        driverStat.dns += 1;
        if (team) team.dns += 1;
    }
};

const addSprintPoints = (result, driverMap, driverStats, teamStats) => {
    const driver = driverMap[result.driverId];
    if (!driver) return;

    const points = Number(result.points) || 0;
    driverStats[driver.id].points += points;
    const team = teamStats[driver.teamId];
    if (team) team.points += points;
};

export const calculateStandings = (schedule, drivers, teams) => {
    const driverStats = createDriverStats(drivers);
    const teamStats = createTeamStats(teams);
    const driverMap = Object.fromEntries(drivers.map(driver => [driver.id, driver]));

    if (!Array.isArray(schedule)) {
        return { driverStats, teamStats };
    }

    schedule.forEach(event => {
        if (event.result?.race) {
            const teamsParticipated = new Set();
            event.result.race.forEach(result => {
                addRaceResult(result, driverMap, driverStats, teamStats, teamsParticipated);
            });

            teamsParticipated.forEach(teamId => {
                if (teamStats[teamId]) {
                    teamStats[teamId].races += 1;
                }
            });
        }

        if (event.result?.sprint) {
            event.result.sprint.forEach(result => {
                addSprintPoints(result, driverMap, driverStats, teamStats);
            });
        }
    });

    return { driverStats, teamStats };
};
