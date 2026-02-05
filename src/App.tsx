import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Builder from './pages/Builder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Hlavní stránka (Seznam šampionů) */}
        <Route path="/" element={<Home />} />
        
        {/* Stránka Builderu (Detail šampiona) */}
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;