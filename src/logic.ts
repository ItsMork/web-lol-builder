import { RiotChampion, ProBuild } from './types';
import { exactBuilds } from './championBuilds'; // Načteme tvůj soubor s buildy

// Pomocná mapa pro automatické doplnění stromu (aby fungovaly obrázky)
const RUNE_TREES: Record<string, string> = {
  // Precision
  "Conqueror": "Precision",
  "Lethal Tempo": "Precision",
  "Press the Attack": "Precision",
  "Fleet Footwork": "Precision",
  // Domination
  "Electrocute": "Domination",
  "Dark Harvest": "Domination",
  "Hail of Blades": "Domination",
  "Predator": "Domination",
  // Sorcery
  "Summon Aery": "Sorcery",
  "Arcane Comet": "Sorcery",
  "Phase Rush": "Sorcery",
  // Resolve
  "Grasp of the Undying": "Resolve",
  "Aftershock": "Resolve",
  "Guardian": "Resolve",
  // Inspiration
  "Glacial Augment": "Inspiration",
  "First Strike": "Inspiration",
  "Unsealed Spellbook": "Inspiration"
};

// Funkce, která "opraví" název runy (přidá k ní strom)
function fixRuneName(runeName: string): string {
  // Pokud už tam plus je, nic neděláme
  if (runeName.includes("+")) return runeName;

  // Jinak najdeme správný strom a přidáme ho
  const tree = RUNE_TREES[runeName];
  if (tree) {
    return `${runeName} + ${tree}`;
  }
  return runeName; // Kdybychom strom nenašli, vrátíme původní text
}

// Funkce pro hledání šampiona
export function findChampion(name: string, allChampions: Record<string, RiotChampion>): RiotChampion | undefined {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return Object.values(allChampions).find(c => 
    c.name.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanName ||
    c.id.toLowerCase() === cleanName
  );
}

// HLAVNÍ LOGIKA
export function getRecommendedBuild(champ: RiotChampion): ProBuild {
  // Výchozí hodnoty
  let items = ["Boots", "Health Potion"];
  let runes = "Conqueror + Domination";
  let skillOrder = ["Q", "E", "W"]; // Výchozí pořadí kouzel

  // 1. ZKUSÍME NAJÍT PŘESNÝ BUILD V SOUBORU
  const champId = champ.id; 
  const champNameClean = champ.name.replace(/[^a-zA-Z]/g, ""); 

  // Hledáme podle ID nebo jména
  const specificBuild = exactBuilds[champId] || exactBuilds[champNameClean] || exactBuilds[champ.name];

  if (specificBuild) {
    // Pokud máme přesný build, použijeme ho
    items = specificBuild.items;
    runes = fixRuneName(specificBuild.runes); // Opravíme název runy pro obrázky
  } else {
    // 2. POKUD NEMÁME BUILD, POUŽIJEME ODHAD PODLE ROLE (Záloha)
    if (champ.tags.includes("Marksman")) {
      items = ["Kraken Slayer", "Infinity Edge", "Berserker's Greaves", "Lord Dominik's Regards", "Bloodthirster", "Guardian Angel"];
      runes = "Lethal Tempo + Precision";
    } else if (champ.tags.includes("Mage")) {
      items = ["Luden's Companion", "Sorcerer's Shoes", "Shadowflame", "Rabadon's Deathcap", "Zhonya's Hourglass", "Void Staff"];
      runes = "Arcane Comet + Inspiration";
    } else if (champ.tags.includes("Assassin")) {
      items = ["Youmuu's Ghostblade", "Opportunity", "Ionian Boots of Lucidity", "Serylda's Grudge", "Axiom Arc", "Edge of Night"];
      runes = "Electrocute + Precision";
    } else if (champ.tags.includes("Tank")) {
      items = ["Heartsteel", "Sunfire Aegis", "Plated Steelcaps", "Thornmail", "Kaenic Rookern", "Jak'Sho, The Protean"];
      runes = "Grasp of the Undying + Inspiration";
    } else if (champ.tags.includes("Support")) {
      items = ["Dream Maker", "Ionian Boots of Lucidity", "Moonstone Renewer", "Redemption", "Ardent Censer", "Dawncore"];
      runes = "Summon Aery + Resolve";
    } else if (champ.tags.includes("Fighter")) {
      items = ["Sundered Sky", "Plated Steelcaps", "Black Cleaver", "Sterak's Gage", "Death's Dance", "Guardian Angel"];
      runes = "Conqueror + Resolve";
    }
  }

  // 3. LOGIKA PRO SKILL ORDER (Kouzla)
  // Protože v championBuilds.ts nemáme skillOrder, určíme ho podle role
  if (champ.tags.includes("Marksman")) {
    skillOrder = ["Q", "W", "E"]; // Většina ADC maxuje Q pak W
  } else if (champ.tags.includes("Mage")) {
    skillOrder = ["Q", "E", "W"]; // Většina Mágů maxuje Q pak E
  } else if (champ.tags.includes("Support")) {
    skillOrder = ["E", "W", "Q"]; // Supporti často maxují štíty/healy
  } else {
    skillOrder = ["Q", "E", "W"]; // Univerzální
  }

  // Speciální výjimka pro Yasuo/Yone (aby to sedělo perfektně)
  if (champ.name === "Yasuo" || champ.name === "Yone") {
    skillOrder = ["Q", "E", "W"];
  }

  return { items, runes, skillOrder };
}