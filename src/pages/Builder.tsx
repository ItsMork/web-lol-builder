import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Routing
import { fetchAllChampions, fetchAllItems, fetchChampionDetail } from '../api';
import { findChampion, getRecommendedBuild } from '../logic';
import type { RiotChampion, ProBuild, RiotItem, RiotChampionDetail } from '../types';
import { getFullRunePage, RUNE_BASE, RUNE_IMAGES } from '../fullRuneData';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sword, Shield, Zap, Coins, ArrowLeft, Flame, Heart, Activity, Move, Crosshair } from 'lucide-react';

// ... (funkce sortItemsWithBootsFirst a RuneIcon zkopíruj z původního App.tsx nebo si je nech tady) ...
function sortItemsWithBootsFirst(items: string[]): string[] {
  const bootKeywords = ["Boots", "Shoes", "Greaves", "Treads", "Steelcaps", "Soles"];
  const bootIndex = items.findIndex(item => bootKeywords.some(keyword => item.includes(keyword)));
  if (bootIndex > 0) {
    const newItems = [...items];
    const boot = newItems.splice(bootIndex, 1)[0];
    newItems.unshift(boot);
    return newItems;
  }
  return items;
}

const RuneIcon = ({ name, size = "md", active = true }: { name: string, size?: "sm" | "md" | "lg" | "xl", active?: boolean }) => {
  const imagePath = RUNE_IMAGES[name];
  const sizeClass = { "sm": "w-8 h-8", "md": "w-10 h-10", "lg": "w-12 h-12", "xl": "w-16 h-16" }[size];
  if (!imagePath) return <div className={`${sizeClass} rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px]`}>{name}</div>;
  return (
    <Tooltip>
      <TooltipTrigger><img src={RUNE_BASE + imagePath} alt={name} className={`${sizeClass} rounded-full ${active ? "" : "grayscale opacity-50"}`} /></TooltipTrigger>
      <TooltipContent><p className="font-bold text-yellow-500">{name}</p></TooltipContent>
    </Tooltip>
  );
};

export default function Builder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allChampions, setAllChampions] = useState<Record<string, RiotChampion>>({});
  const [allItems, setAllItems] = useState<Record<string, RiotItem>>({});

  const [foundChamp, setFoundChamp] = useState<RiotChampion | null>(null);
  const [champDetail, setChampDetail] = useState<RiotChampionDetail | null>(null); // NOVÉ: Detail kouzel
  const [build, setBuild] = useState<ProBuild | null>(null);

  useEffect(() => {
    async function load() {
      const [champs, items] = await Promise.all([fetchAllChampions(), fetchAllItems()]);
      setAllChampions(champs);
      setAllItems(items);

      // Pokud je v URL ?champion=Yasuo, rovnou ho načteme
      const queryChamp = searchParams.get("champion");
      if (queryChamp && champs[queryChamp]) {
        loadChampionBuild(champs[queryChamp]);
      }
    }
    load();
  }, [searchParams]);

  async function loadChampionBuild(champ: RiotChampion) {
    setFoundChamp(champ);
    const rawBuild = getRecommendedBuild(champ);
    setBuild({ ...rawBuild, items: sortItemsWithBootsFirst(rawBuild.items) });

    // Načteme detaily (kouzla)
    const detail = await fetchChampionDetail(champ.id);
    setChampDetail(detail);
  }

  const getItemDetails = (name: string) => Object.values(allItems).find(i => i.name === name);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-8 px-4 font-sans">

        {/* Tlačítko zpět */}
        <div className="w-full max-w-4xl mb-6 flex justify-start">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Zpět na seznam
          </Button>
        </div>

        {foundChamp && build && (
          <Card className="w-full max-w-4xl bg-slate-900 border-yellow-600/50 shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <div className="flex gap-6 items-center">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${foundChamp.id}.png`}
                  className="w-24 h-24 rounded-xl border-2 border-yellow-600 shadow-lg"
                />
                <div>
                  <CardTitle className="text-4xl font-bold text-white">{foundChamp.name}</CardTitle>
                  <CardDescription className="text-xl text-slate-400">{foundChamp.title}</CardDescription>
                  <div className="flex gap-2 mt-2">
                    {foundChamp.tags.map(t => <Badge key={t} className="bg-slate-800 text-yellow-500">{t}</Badge>)}
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* NOVÁ SEKCE: PŘÍBĚH A STATISTIKY */}
            <div className="bg-slate-950/50 p-6 border-b border-slate-800">
              {champDetail && (
                <div className="flex flex-col gap-6">

                  {/* 1. Lore (Příběh) */}
                  <p className="text-slate-400 italic text-sm leading-relaxed border-l-4 border-yellow-600 pl-4">
                    "{champDetail.lore}"
                  </p>

                  {/* 2. Statistiky (Grid) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* HP */}
                    <div className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-800">
                      <Heart className="text-green-500 w-5 h-5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Health</p>
                        <p className="text-slate-200 font-mono">{champDetail.stats.hp} <span className="text-green-600 text-xs">(+{champDetail.stats.hpperlevel})</span></p>
                      </div>
                    </div>
                    {/* Attack Damage */}
                    <div className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-800">
                      <Sword className="text-red-500 w-5 h-5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Attack Dmg</p>
                        <p className="text-slate-200 font-mono">{champDetail.stats.attackdamage} <span className="text-red-600 text-xs">(+{champDetail.stats.attackdamageperlevel})</span></p>
                      </div>
                    </div>
                    {/* Armor */}
                    <div className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-800">
                      <Shield className="text-yellow-500 w-5 h-5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Armor</p>
                        <p className="text-slate-200 font-mono">{champDetail.stats.armor} <span className="text-yellow-600 text-xs">(+{champDetail.stats.armorperlevel})</span></p>
                      </div>
                    </div>
                    {/* Move Speed */}
                    <div className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-800">
                      <Move className="text-blue-400 w-5 h-5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Move Speed</p>
                        <p className="text-slate-200 font-mono">{champDetail.stats.movespeed}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="pt-8 space-y-10">

              {/* 1. SEKCE: KOUZLA (NOVÉ) */}
              {champDetail && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="text-orange-500 h-6 w-6" />
                    <h3 className="text-xl font-bold text-orange-500 uppercase">Kouzla & Maxování</h3>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                    {/* Ikony kouzel */}
                    <div className="flex justify-between md:justify-start md:gap-8 mb-6">
                      {/* Pasivka */}
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex flex-col items-center gap-2">
                            <img src={`https://ddragon.leagueoflegends.com/cdn/14.2.1/img/passive/${champDetail.passive.image.full}`} className="w-12 h-12 rounded border border-slate-600" />
                            <span className="text-xs text-slate-500 font-bold">Passive</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-slate-900 border-orange-500 text-white">
                          <p className="font-bold text-orange-400">{champDetail.passive.name}</p>
                          <p className="text-xs mt-1">{champDetail.passive.description.replace(/<[^>]*>?/gm, '')}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Q W E R */}
                      {champDetail.spells.map((spell, i) => {
                        const hotkey = ["Q", "W", "E", "R"][i];
                        const isPriority = build.skillOrder[0] === hotkey; // Je to první skill na maxování?
                        return (
                          <Tooltip key={spell.id}>
                            <TooltipTrigger>
                              <div className="flex flex-col items-center gap-2 relative">
                                <div className="relative">
                                  <img src={`https://ddragon.leagueoflegends.com/cdn/14.2.1/img/spell/${spell.image.full}`} className={`w-12 h-12 rounded border ${isPriority ? "border-orange-500 shadow-[0_0_10px_orange]" : "border-slate-600"}`} />
                                  <span className="absolute -bottom-2 -right-2 bg-slate-900 text-slate-200 text-xs w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 font-bold">{hotkey}</span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-slate-900 border-orange-500 text-white">
                              <p className="font-bold text-orange-400">{spell.name}</p>
                              <p className="text-xs mt-1">{spell.description.replace(/<[^>]*>?/gm, '')}</p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>

                    {/* Skill Order Text */}
                    <div className="flex items-center gap-3 bg-orange-500/10 p-3 rounded border border-orange-500/20">
                      <span className="text-orange-500 font-bold">Skill Priority:</span>
                      {build.skillOrder.map((key, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${i === 0 ? "text-white" : "text-slate-400"}`}>{key}</span>
                          {i < 2 && <span className="text-slate-600">{'>'}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-slate-800" />

              {/* 2. SEKCE: RUNY (Zůstává stejné, jen zkopírované) */}
              <div>
                <div className="flex items-center gap-2 mb-4"><Zap className="text-blue-400 h-6 w-6" /><h3 className="text-xl font-bold text-blue-400 uppercase">Runy</h3></div>
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800">
                  {(() => {
                    const runePage = getFullRunePage(build.runes);
                    if (!runePage) return <p>Data chybí</p>;
                    return (
                      <div className="flex flex-col md:flex-row gap-8 justify-center">
                        {/* Primary */}
                        <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex-1">
                          <div className="flex justify-between mb-4 border-b border-slate-700 pb-2"><span className="text-yellow-500 font-bold">{runePage.primaryTree}</span><RuneIcon name={runePage.primaryTree} size="sm" active={false} /></div>
                          <div className="flex justify-center mb-4"><RuneIcon name={runePage.keystone} size="xl" /></div>
                          <div className="flex justify-between px-4">{runePage.primarySlots.map(r => <RuneIcon key={r} name={r} />)}</div>
                        </div>
                        {/* Secondary */}
                        <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex-1">
                          <div className="flex justify-between mb-4 border-b border-slate-700 pb-2"><span className="text-slate-300 font-bold">{runePage.secondaryTree}</span><RuneIcon name={runePage.secondaryTree} size="sm" active={false} /></div>
                          <div className="flex justify-center gap-4">{runePage.secondarySlots.map(r => <RuneIcon key={r} name={r} />)}</div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* 3. SEKCE: ITEMY */}
              <div>
                <div className="flex items-center gap-2 mb-4"><Shield className="text-yellow-500 h-6 w-6" /><h3 className="text-xl font-bold text-yellow-500 uppercase">Build</h3></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {build.items.map((item, i) => {
                    const data = getItemDetails(item);
                    return (
                      <Tooltip key={i}><TooltipTrigger>
                        <div className="bg-slate-800/40 border border-slate-700 p-4 rounded h-28 flex flex-col items-center justify-center text-center hover:border-yellow-500 transition-colors">
                          {data && <img src={`https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${data.image.full}`} className="w-10 h-10 mb-2 rounded" />}
                          <span className="text-sm font-semibold text-slate-300">{item}</span>
                        </div>
                      </TooltipTrigger><TooltipContent><p>{data?.plaintext}</p></TooltipContent></Tooltip>
                    )
                  })}
                </div>
              </div>
              <Separator className="bg-slate-800" />

              {/* 4. SEKCE: SKINY */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎨</span>
                  <h3 className="text-xl font-bold text-purple-400 uppercase">Skiny</h3>
                </div>

                {/* Jednoduchá mřížka skinů */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {champDetail && champDetail.skins.filter(skin => skin.num > 0).map((skin) => (
                    <div key={skin.id} className="group relative overflow-hidden rounded-lg border border-slate-800 hover:border-purple-500 transition-all cursor-pointer">
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${foundChamp.id}_${skin.num}.jpg`}
                        alt={skin.name}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-black/80 p-2 text-center translate-y-full group-hover:translate-y-0 transition-transform">
                        <span className="text-sm font-bold text-purple-200">{skin.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}