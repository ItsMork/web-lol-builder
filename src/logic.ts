import type { ProBuild, RiotChampion } from './types';
import { exactBuilds } from './championBuilds';

// 1. Funkce na opravu jména (pomocná)
export function formatName(name: string): string {
    if (!name) return "";
    return name.trim()
               .replace(/[' .]/g, '')
               .toLowerCase()
               .split(' ')
               .map(w => w.charAt(0).toUpperCase() + w.slice(1))
               .join(''); 
}

// 2. Funkce na hledání šampiona (TATO TI CHYBĚLA)
export function findChampion(input: string, allData: Record<string, RiotChampion>): RiotChampion | undefined {
    const cleanInput = input.toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundKey = Object.keys(allData).find(key => 
        key.toLowerCase() === cleanInput
    );
    if (foundKey) return allData[foundKey];
    return undefined;
}

// 3. Hlavní logika pro 6 itemů
export function getRecommendedBuild(champion: RiotChampion): ProBuild {
    
    // Přednost má manuální seznam
    const knownBuild = exactBuilds[champion.id];
    if (knownBuild) return knownBuild;

    // Automatická logika
    const tags = champion.tags;
    const stats = champion.stats;
    const resource = champion.partype; 

    // --- MAGES ---
    if (tags.includes("Mage")) {
        if (tags.includes("Support")) {
            return { 
                runes: "Summon Aery", 
                items: ["Ionian Boots of Lucidity", "Zaz'Zak's Realmspike", "Imperial Mandate", "Rylai's Crystal Scepter", "Morellonomicon", "Vigilant Wardstone"] 
            };
        }
        if (resource !== "Mana") {
            return { 
                runes: "Conqueror", 
                items: ["Sorcerer's Shoes", "Riftmaker", "Liandry's Torment", "Zhonya's Hourglass", "Rabadon's Deathcap", "Void Staff"] 
            };
        }
        return { 
            runes: "Arcane Comet", 
            items: ["Sorcerer's Shoes", "Luden's Companion", "Shadowflame", "Zhonya's Hourglass", "Rabadon's Deathcap", "Void Staff"] 
        };
    }

    // --- MARKSMAN ---
    if (tags.includes("Marksman")) {
        if (resource === "Mana" && stats.attackrange < 550) {
            return { 
                runes: "Press the Attack", 
                items: ["Ionian Boots of Lucidity", "Trinity Force", "Manamune", "Spear of Shojin", "Ravenous Hydra", "Guardian Angel"] 
            };
        }
        return { 
            runes: "Lethal Tempo", 
            items: ["Berserker's Greaves", "Kraken Slayer", "Infinity Edge", "Lord Dominik's Regards", "Bloodthirster", "Guardian Angel"] 
        };
    }

    // --- ASSASSIN ---
    if (tags.includes("Assassin")) {
        if (stats.attackdamage < 60) { 
             return { 
                 runes: "Electrocute", 
                 items: ["Sorcerer's Shoes", "Lich Bane", "Shadowflame", "Zhonya's Hourglass", "Rabadon's Deathcap", "Banshee's Veil"] 
             };
        }
        return { 
            runes: "Electrocute", 
            items: ["Ionian Boots of Lucidity", "Voltaic Cyclosword", "Youmuu's Ghostblade", "Serylda's Grudge", "Edge of Night", "Guardian Angel"] 
        };
    }

    // --- TANK ---
    if (tags.includes("Tank")) {
        if (tags.includes("Support")) {
            return { 
                runes: "Glacial Augment", 
                items: ["Boots of Swiftness", "Celestial Opposition", "Knight's Vow", "Zeke's Convergence", "Thornmail", "Abyssal Mask"] 
            };
        }
        return { 
            runes: "Grasp of the Undying", 
            items: ["Plated Steelcaps", "Heartsteel", "Sunfire Aegis", "Thornmail", "Spirit Visage", "Warmog's Armor"] 
        };
    }

    // --- FIGHTER ---
    if (tags.includes("Fighter")) {
        if (stats.attackspeed > 0.67) {
            return { 
                runes: "Lethal Tempo", 
                items: ["Berserker's Greaves", "Blade of the Ruined King", "Guinsoo's Rageblade", "Wit's End", "Death's Dance", "Guardian Angel"] 
            };
        }
        return { 
            runes: "Conqueror", 
            items: ["Plated Steelcaps", "Sundered Sky", "Black Cleaver", "Sterak's Gage", "Death's Dance", "Spirit Visage"] 
        };
    }

    // --- SUPPORT ---
    if (tags.includes("Support")) {
        return { 
            runes: "Summon Aery", 
            items: ["Ionian Boots of Lucidity", "Dream Maker", "Moonstone Renewer", "Redemption", "Ardent Censer", "Mikael's Blessing"] 
        };
    }

    // --- OSTATNÍ ---
    return { 
        runes: "Conqueror", 
        items: ["Plated Steelcaps", "Trinity Force", "Sterak's Gage", "Black Cleaver", "Death's Dance", "Guardian Angel"] 
    };
}