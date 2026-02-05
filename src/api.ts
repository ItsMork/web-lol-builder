import type { RiotChampion } from './types';

// Odkaz na oficiální Riot API (verze 13.1.1)
const RIOT_API_URL = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json';

export async function fetchAllChampions(): Promise<Record<string, RiotChampion>> {
    try {
        console.log("Stahuji data šampionů z Riot API...");
        const response = await fetch(RIOT_API_URL);
        
        if (!response.ok) {
            throw new Error(`Chyba sítě: ${response.status}`);
        }

        const json = await response.json() as any;
        // Riot vrací data uvnitř vlastnosti "data"
        return json.data;
    } catch (error) {
        throw new Error(`Nepodařilo se načíst data: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    }
}