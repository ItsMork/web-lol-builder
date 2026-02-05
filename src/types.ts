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