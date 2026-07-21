const cache = {};

async function fetchJson(filename) {
    if (cache[filename]) {
        return cache[filename];
    }
    const response = await fetch(`/data/${filename}.json`);
    if (!response.ok) throw new Error(`Erro ao carregar ${filename}`);
    
    const data = await response.json();
    cache[filename] = data; // Salva para a próxima vez
    return data;
}

export const F1Data = {
    getDrivers: () => fetchJson('drivers'),
    getTeams: () => fetchJson('teams'),
    getSchedule: () => fetchJson('schedule'),
    getHistory: () => fetchJson('history'),
    getCircuits: () => fetchJson('circuits')
};