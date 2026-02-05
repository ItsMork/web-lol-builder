import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllChampions } from '../api';
import { RiotChampion } from '../types';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

export default function Home() {
  const [champs, setChamps] = useState<RiotChampion[]>([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllChampions().then(data => setChamps(Object.values(data)));
  }, []);

  const filtered = champs.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-500 mb-8 text-center uppercase tracking-widest">Seznam Šampionů</h1>
        
        <div className="relative max-w-md mx-auto mb-10">
          <Input 
            placeholder="Najít šampiona..." 
            className="bg-slate-900 border-slate-700 py-6 pl-10"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(champ => (
            <div 
              key={champ.id}
              onClick={() => navigate(`/builder?champion=${champ.id}`)}
              className="bg-slate-900 border border-slate-800 rounded-lg p-3 cursor-pointer hover:border-yellow-500 hover:scale-105 transition-all text-center group"
            >
              <img 
                src={`https://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${champ.id}.png`}
                alt={champ.name}
                className="w-full rounded mb-2 group-hover:opacity-80"
              />
              <p className="font-bold text-slate-200">{champ.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}