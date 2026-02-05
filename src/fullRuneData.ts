// src/fullRuneData.ts

export const RUNE_BASE = "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/";

// Cesty k obrázkům jednotlivých run (DataDragon je má trochu chaoticky)
export const RUNE_IMAGES: Record<string, string> = {
  // STROMY
  "Precision": "7201_Precision.png",
  "Domination": "7200_Domination.png",
  "Sorcery": "7202_Sorcery.png",
  "Resolve": "7204_Resolve.png",
  "Inspiration": "7203_Whimsy.png",

  // KEYSTONES (Hlavní)
  "Press the Attack": "Precision/PressTheAttack/PressTheAttack.png",
  "Lethal Tempo": "Precision/LethalTempo/LethalTempoTemp.png",
  "Fleet Footwork": "Precision/FleetFootwork/FleetFootwork.png",
  "Conqueror": "Precision/Conqueror/Conqueror.png",
  "Electrocute": "Domination/Electrocute/Electrocute.png",
  "Dark Harvest": "Domination/DarkHarvest/DarkHarvest.png",
  "Hail of Blades": "Domination/HailOfBlades/HailOfBlades.png",
  "Summon Aery": "Sorcery/SummonAery/SummonAery.png",
  "Arcane Comet": "Sorcery/ArcaneComet/ArcaneComet.png",
  "Phase Rush": "Sorcery/PhaseRush/PhaseRush.png",
  "Grasp of the Undying": "Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
  "Aftershock": "Resolve/VeteranAftershock/VeteranAftershock.png",
  "Guardian": "Resolve/Guardian/Guardian.png",
  "Glacial Augment": "Inspiration/GlacialAugment/GlacialAugment.png",
  "First Strike": "Inspiration/FirstStrike/FirstStrike.png",

  // MALÉ RUNY (Výběr těch nejčastějších)
  // Precision
  "Triumph": "Precision/Triumph.png",
  "Presence of Mind": "Precision/PresenceOfMind/PresenceOfMind.png",
  "Legend: Alacrity": "Precision/LegendAlacrity/LegendAlacrity.png",
  "Legend: Tenacity": "Precision/LegendTenacity/LegendTenacity.png",
  "Last Stand": "Sorcery/LastStand/LastStand.png",
  "Coup de Grace": "Precision/CoupDeGrace/CoupDeGrace.png",
  // Domination
  "Sudden Impact": "Domination/SuddenImpact/SuddenImpact.png",
  "Taste of Blood": "Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png",
  "Eyeball Collection": "Domination/EyeballCollection/EyeballCollection.png",
  "Treasure Hunter": "Domination/TreasureHunter/TreasureHunter.png",
  "Ultimate Hunter": "Domination/UltimateHunter/UltimateHunter.png",
  // Sorcery
  "Manaflow Band": "Sorcery/ManaflowBand/ManaflowBand.png",
  "Nimbus Cloak": "Sorcery/NimbusCloak/6361.png",
  "Transcendence": "Sorcery/Transcendence/Transcendence.png",
  "Scorch": "Sorcery/Scorch/Scorch.png",
  "Gathering Storm": "Sorcery/GatheringStorm/GatheringStorm.png",
  // Resolve
  "Demolish": "Resolve/Demolish/Demolish.png",
  "Second Wind": "Resolve/SecondWind/SecondWind.png",
  "Bone Plating": "Resolve/BonePlating/BonePlating.png",
  "Overgrowth": "Resolve/Overgrowth/Overgrowth.png",
  "Unflinching": "Resolve/Random/RandomResolve.png", // Fallback
  // Inspiration
  "Magical Footwear": "Inspiration/MagicalFootwear/MagicalFootwear.png",
  "Biscuit Delivery": "Inspiration/BiscuitDelivery/BiscuitDelivery.png",
  "Cosmic Insight": "Inspiration/CosmicInsight/CosmicInsight.png"
};

// Struktura celé stránky
export interface FullRunePage {
  primaryTree: string;
  keystone: string;
  primarySlots: [string, string, string];
  secondaryTree: string;
  secondarySlots: [string, string];
}

// PŘEDNASTAVENÉ STRÁNKY (Tady definujeme "Standardní buildy")
const RUNE_PRESETS: Record<string, FullRunePage> = {
  "Conqueror": {
    primaryTree: "Precision",
    keystone: "Conqueror",
    primarySlots: ["Triumph", "Legend: Alacrity", "Last Stand"],
    secondaryTree: "Resolve",
    secondarySlots: ["Second Wind", "Overgrowth"]
  },
  "Lethal Tempo": {
    primaryTree: "Precision",
    keystone: "Lethal Tempo",
    primarySlots: ["Triumph", "Legend: Alacrity", "Coup de Grace"],
    secondaryTree: "Domination",
    secondarySlots: ["Taste of Blood", "Treasure Hunter"]
  },
  "Press the Attack": {
    primaryTree: "Precision",
    keystone: "Press the Attack",
    primarySlots: ["Presence of Mind", "Legend: Alacrity", "Coup de Grace"],
    secondaryTree: "Inspiration",
    secondarySlots: ["Biscuit Delivery", "Cosmic Insight"]
  },
  "Fleet Footwork": {
    primaryTree: "Precision",
    keystone: "Fleet Footwork",
    primarySlots: ["Presence of Mind", "Legend: Alacrity", "Coup de Grace"],
    secondaryTree: "Domination",
    secondarySlots: ["Taste of Blood", "Treasure Hunter"]
  },
  "Electrocute": {
    primaryTree: "Domination",
    keystone: "Electrocute",
    primarySlots: ["Sudden Impact", "Eyeball Collection", "Treasure Hunter"],
    secondaryTree: "Precision",
    secondarySlots: ["Triumph", "Coup de Grace"]
  },
  "Dark Harvest": {
    primaryTree: "Domination",
    keystone: "Dark Harvest",
    primarySlots: ["Taste of Blood", "Eyeball Collection", "Ultimate Hunter"],
    secondaryTree: "Sorcery",
    secondarySlots: ["Transcendence", "Gathering Storm"]
  },
  "Hail of Blades": {
    primaryTree: "Domination",
    keystone: "Hail of Blades",
    primarySlots: ["Sudden Impact", "Eyeball Collection", "Treasure Hunter"],
    secondaryTree: "Precision",
    secondarySlots: ["Triumph", "Legend: Alacrity"]
  },
  "Arcane Comet": {
    primaryTree: "Sorcery",
    keystone: "Arcane Comet",
    primarySlots: ["Manaflow Band", "Transcendence", "Scorch"],
    secondaryTree: "Inspiration",
    secondarySlots: ["Biscuit Delivery", "Cosmic Insight"]
  },
  "Summon Aery": {
    primaryTree: "Sorcery",
    keystone: "Summon Aery",
    primarySlots: ["Manaflow Band", "Transcendence", "Scorch"],
    secondaryTree: "Resolve",
    secondarySlots: ["Bone Plating", "Revitalize"] // Revitalize nemam ikonu, fallbackne
  },
  "Phase Rush": {
    primaryTree: "Sorcery",
    keystone: "Phase Rush",
    primarySlots: ["Manaflow Band", "Transcendence", "Gathering Storm"],
    secondaryTree: "Inspiration",
    secondarySlots: ["Magical Footwear", "Cosmic Insight"]
  },
  "Grasp of the Undying": {
    primaryTree: "Resolve",
    keystone: "Grasp of the Undying",
    primarySlots: ["Demolish", "Second Wind", "Overgrowth"],
    secondaryTree: "Inspiration",
    secondarySlots: ["Magical Footwear", "Biscuit Delivery"]
  },
  "Aftershock": {
    primaryTree: "Resolve",
    keystone: "Aftershock",
    primarySlots: ["Demolish", "Bone Plating", "Unflinching"],
    secondaryTree: "Inspiration",
    secondarySlots: ["Magical Footwear", "Cosmic Insight"]
  },
  "Guardian": {
    primaryTree: "Resolve",
    keystone: "Guardian",
    primarySlots: ["Font of Life", "Bone Plating", "Revitalize"], 
    secondaryTree: "Inspiration",
    secondarySlots: ["Biscuit Delivery", "Cosmic Insight"]
  },
  "Glacial Augment": {
    primaryTree: "Inspiration",
    keystone: "Glacial Augment",
    primarySlots: ["Magical Footwear", "Biscuit Delivery", "Cosmic Insight"],
    secondaryTree: "Resolve",
    secondarySlots: ["Bone Plating", "Unflinching"]
  },
  "First Strike": {
    primaryTree: "Inspiration",
    keystone: "First Strike",
    primarySlots: ["Magical Footwear", "Biscuit Delivery", "Cosmic Insight"],
    secondaryTree: "Sorcery",
    secondarySlots: ["Manaflow Band", "Transcendence"]
  }
};

// Funkce, která vrátí celou stránku podle jména hlavní runy
export function getFullRunePage(runeString: string): FullRunePage | null {
  // Očekáváme string jako "Conqueror" nebo "Conqueror + Domination"
  // Vezmeme jen první část (Keystone)
  const keystoneName = runeString.split("+")[0].trim();
  
  return RUNE_PRESETS[keystoneName] || null;
}