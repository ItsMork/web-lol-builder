export interface ChampionStats {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
}

export interface RiotChampion {
    id: string;
    key: string;
    name: string;
    title: string;
    tags: string[];
    partype: string;
    stats: ChampionStats;
}

export interface ProBuild {
    runes: string;
    items: string[];
}

export interface RiotItem {
  name: string;
  plaintext: string;
  image: {
    full: string;
  };
  gold: {
    total: number;
    base: number;
    sell: number;
  };
  description: string;
}

export interface RiotSpell {
  id: string;
  name: string;
  description: string;
  image: { full: string };
}

export interface RiotChampionDetail extends RiotChampion {
  passive: {
    name: string;
    description: string;
    image: { full: string };
  };
  spells: RiotSpell[];
}


export interface ProBuild {
  items: string[];
  runes: string;
  skillOrder: string[];
}

export interface RiotChampionSkin {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

export interface RiotChampionDetail extends RiotChampion {
  lore: string;
  passive: {
    name: string;
    description: string;
    image: { full: string };
  };
  spells: RiotSpell[];
  skins: RiotChampionSkin[];
}

export interface RiotChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number; // Magic Resist
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

export interface RiotChampionDetail extends RiotChampion {
  lore: string;
  passive: {
    name: string;
    description: string;
    image: { full: string };
  };
  spells: RiotSpell[];
  skins: RiotChampionSkin[];
  stats: RiotChampionStats; // <--- NOVÉ: Statistiky
}