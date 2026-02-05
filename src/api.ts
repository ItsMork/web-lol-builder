import { RiotChampion, RiotItem, RiotChampionDetail } from './types';

// Funkce pro stahování šampionů (tu už jsi tam měl)
export async function fetchAllChampions(): Promise<Record<string, RiotChampion>> {
  const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.2.1/data/en_US/champion.json");
  const data = await response.json();
  return data.data;
}

// NOVÁ FUNKCE PRO STAHOVÁNÍ ITEMŮ (Tohle ti tam chybělo)
export async function fetchAllItems(): Promise<Record<string, RiotItem>> {
  const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.2.1/data/en_US/item.json");
  const data = await response.json();
  return data.data;
}

export async function fetchChampionDetail(id: string): Promise<RiotChampionDetail> {
  const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.2.1/data/en_US/champion/${id}.json`);
  const data = await response.json();
  return data.data[id];
}