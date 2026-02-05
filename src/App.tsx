import { useState, useEffect } from 'react';
import { fetchAllChampions } from './api';
import { findChampion, getRecommendedBuild } from './logic';
import type { RiotChampion, ProBuild } from './types'; // Důležité: "import type"
import './index.css';

function App() {
  const [input, setInput] = useState("");
  const [allData, setAllData] = useState<Record<string, RiotChampion>>({});
  const [foundChamp, setFoundChamp] = useState<RiotChampion | null>(null);
  const [build, setBuild] = useState<ProBuild | null>(null);
  const [loading, setLoading] = useState(true);

  // Načtení dat při startu
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllChampions();
        setAllData(data);
      } catch (e) {
        console.error("Chyba při stahování dat:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Hledání šampiona
  const handleSearch = () => {
    if (!input) return;
    const champ = findChampion(input, allData);
    if (champ) {
      setFoundChamp(champ);
      setBuild(getRecommendedBuild(champ)); // Tady se načte build z tvého velkého souboru
    } else {
      alert("Šampion nenalezen! Zkus zkontrolovat jméno.");
    }
  };

  // Odeslání Enterem
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={{ 
      padding: "40px", 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
      backgroundColor: "#091428", // Tmavě modrá LoL barva
      color: "#f0e6d2", // Zlatavá barva písma
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      
      <h1 style={{ color: "#d1b048", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "30px" }}>
        ⚔️ LoL Pro Builder
      </h1>
      
      {loading ? (
        <p>⏳ Stahuji data z Riotu...</p>
      ) : (
        <div style={{ display: "flex", gap: "10px", marginBottom: "40px", width: "100%", maxWidth: "500px" }}>
          <input 
            type="text" 
            placeholder="Napiš jméno (např. Yasuo, Teemo)" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ 
              flex: 1,
              padding: "15px", 
              fontSize: "16px", 
              borderRadius: "5px", 
              border: "2px solid #a09b8c",
              backgroundColor: "#1e2328",
              color: "white"
            }}
          />
          <button 
            onClick={handleSearch} 
            style={{ 
              padding: "0 25px", 
              cursor: "pointer", 
              background: "#d1b048", 
              border: "none", 
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "5px",
              color: "#091428"
            }}>
            HLEDAT
          </button>
        </div>
      )}

      {foundChamp && build && (
        <div style={{ 
          width: "100%", 
          maxWidth: "700px",
          border: "2px solid #785a28", 
          padding: "30px", 
          borderRadius: "10px", 
          background: "linear-gradient(135deg, #1e2328 0%, #0a0a0c 100%)",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)"
        }}>
          {/* Hlavička šampiona */}
          <div style={{ borderBottom: "1px solid #444", paddingBottom: "15px", marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "32px", color: "#f0e6d2" }}>
              {foundChamp.name.toUpperCase()}
            </h2>
            <span style={{ fontSize: "16px", color: "#a09b8c", fontStyle: "italic" }}>
              {foundChamp.title}
            </span>
            <div style={{ marginTop: "10px" }}>
              {foundChamp.tags.map(tag => (
                <span key={tag} style={{ 
                  background: "#3c3c41", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", marginRight: "5px" 
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Sekce Runy */}
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ color: "#d1b048", borderBottom: "1px solid #785a28", display: "inline-block", paddingBottom: "5px" }}>
              💎 RUNY
            </h3>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{build.runes}</p>
          </div>
            
          {/* Sekce Itemy - GRID */}
          <div>
            <h3 style={{ color: "#d1b048", borderBottom: "1px solid #785a28", display: "inline-block", paddingBottom: "5px", marginBottom: "15px" }}>
              🎒 FULL BUILD (6 Itemů)
            </h3>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {build.items.map((item, index) => (
                <div key={index} style={{ 
                  background: "#091428", 
                  border: index === 0 ? "2px solid #0acbe6" : "1px solid #5c5b57", // První item (boty) modře
                  padding: "15px", 
                  borderRadius: "8px",
                  flex: "1 0 30%", // Aby byly 3 na řádek (nebo méně na mobilu)
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  minWidth: "120px",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)"
                }}>
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {index === 0 ? "👢 " : "⚔️ "} {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;