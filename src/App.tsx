import { useState, useEffect, useRef } from 'react';
import { Search, Sword, Shield, Footprints, Zap } from 'lucide-react';
import { fetchAllChampions } from './api';
import { findChampion, getRecommendedBuild } from './logic';
import type { RiotChampion, ProBuild } from './types';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Pomocná funkce na boty
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

function App() {
  const [input, setInput] = useState("");
  const [allData, setAllData] = useState<Record<string, RiotChampion>>({});
  const [foundChamp, setFoundChamp] = useState<RiotChampion | null>(null);
  const [build, setBuild] = useState<ProBuild | null>(null);
  const [loading, setLoading] = useState(true);
  
  // NOVÉ: Stav pro našeptávač
  const [suggestions, setSuggestions] = useState<RiotChampion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null); // Pro kliknutí mimo

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllChampions();
        setAllData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();

    // Zavření našeptávače při kliknutí jinam
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // NOVÉ: Funkce pro psaní do inputu (filtruje šampiony)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      // Filtrujeme podle jména (max 5 výsledků)
      const matches = Object.values(allData).filter(champ => 
        champ.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Hlavní funkce hledání (spustí se Enterem nebo tlačítkem)
  const executeSearch = (champName: string) => {
    const champ = findChampion(champName, allData);
    if (champ) {
      setFoundChamp(champ);
      const rawBuild = getRecommendedBuild(champ);
      setBuild({ ...rawBuild, items: sortItemsWithBootsFirst(rawBuild.items) });
      setShowSuggestions(false); // Zavřít našeptávač
      setInput(champ.name); // Doplnit jméno do inputu
    } else {
      alert("Šampion nenalezen!");
    }
  };

  // Kliknutí na položku v našeptávači
  const handleSuggestionClick = (champ: RiotChampion) => {
    executeSearch(champ.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch(input);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-12 px-4 font-sans">
      
      <div className="flex items-center gap-3 mb-8">
        <Sword className="h-10 w-10 text-yellow-500" />
        <h1 className="text-4xl font-extrabold tracking-tight text-yellow-500 uppercase">
          LoL Pro Builder
        </h1>
      </div>

      {/* KONTEJNER PRO VYHLEDÁVÁNÍ (s relativní pozicí pro našeptávač) */}
      <div className="w-full max-w-md mb-10 relative" ref={wrapperRef}>
        <div className="flex gap-2 relative z-20">
          <Input 
            placeholder="Hledat šampiona (např. Yasuo)..." 
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => input.length > 0 && setShowSuggestions(true)}
            className="bg-slate-900 border-slate-700 text-lg py-6"
          />
          <Button onClick={() => executeSearch(input)} className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-6 px-6">
            <Search className="h-5 w-5 mr-2" />
            Hledat
          </Button>
        </div>

        {/* NAŠEPTÁVAČ (Vyskakovací okno) */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-md shadow-xl z-50 overflow-hidden">
            {suggestions.map((champ) => (
              <div 
                key={champ.id}
                onClick={() => handleSuggestionClick(champ)}
                className="flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-800 last:border-0"
              >
                {/* Malý obrázek šampiona (z DataDragon) */}
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${champ.id}.png`} 
                  alt={champ.name}
                  className="w-10 h-10 rounded-full border border-yellow-600"
                />
                <div>
                  <p className="font-bold text-slate-100">{champ.name}</p>
                  <p className="text-xs text-slate-400">{champ.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && <p className="text-slate-400 animate-pulse">Načítám data z Riot API...</p>}

      {foundChamp && build && (
        <Card className="w-full max-w-2xl bg-slate-900 border-yellow-600/50 shadow-2xl shadow-yellow-900/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                {/* Velký obrázek v hlavičce */}
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${foundChamp.id}.png`} 
                  alt={foundChamp.name}
                  className="w-16 h-16 rounded-lg border-2 border-yellow-600 shadow-lg"
                />
                <div>
                  <CardTitle className="text-3xl font-bold text-white tracking-wide">
                    {foundChamp.name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-lg italic">
                    {foundChamp.title}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-end max-w-50">
                {foundChamp.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-slate-800 text-yellow-500 hover:bg-slate-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="text-blue-400 h-5 w-5" />
                <h3 className="text-lg font-semibold text-blue-400 uppercase tracking-widest">Runy</h3>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-xl font-medium text-slate-200">{build.runes}</span>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-yellow-500 h-5 w-5" />
                <h3 className="text-lg font-semibold text-yellow-500 uppercase tracking-widest">Full Build</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {build.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`
                      relative p-4 rounded-lg flex items-center justify-center text-center h-24 border transition-all hover:scale-105
                      ${index === 0 
                        ? "bg-slate-800/50 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                        : "bg-slate-800/30 border-slate-700 hover:border-yellow-500/50"
                      }
                    `}
                  >
                    {index === 0 && (
                      <Footprints className="absolute top-2 left-2 h-4 w-4 text-blue-400 opacity-50" />
                    )}
                    <span className={`font-semibold ${index === 0 ? "text-blue-200" : "text-slate-300"}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;