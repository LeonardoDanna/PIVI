import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// Importação das Páginas Reais
import Dashboard from "./pages/Dashboard";
import Closet from "./pages/Closet";
import Matches from "./pages/Matches";
import FitGuide from "./pages/FitGuide";
import StylistAI from "./pages/StylistAI";
import TryOn from "./pages/TryOn";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota pai define o Layout (Menu + Área de Conteúdo) */}
        <Route path="/" element={<MainLayout />}>
          {/* Rota Index: É a "Home", carrega o Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Rotas Filhas */}
          <Route path="closet" element={<Closet />} />
          <Route path="matches" element={<Matches />} />
          <Route path="fit" element={<FitGuide />} />
          <Route path="stylist" element={<StylistAI />} />
          <Route path="tryon" element={<TryOn />} />

          {/* Rota Coringa: Se digitar algo errado, volta para o início */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
