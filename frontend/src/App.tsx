import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Closet from "./pages/Closet";
import Matches from "./pages/Matches";
import FitGuide from "./pages/FitGuide";
import StylistAI from "./pages/StylistAI";
import TryOn from "./pages/TryOn";

import Login from "./pages/Login";
import Register from "./pages/Register";

import type { ReactNode } from "react";

function PrivateRoute({ children }: { children: ReactNode }) {
  const loggedUser = localStorage.getItem("loggedUser");
  return loggedUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas de Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout protegido */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Rotas Filhas */}
          <Route path="closet" element={<Closet />} />
          <Route path="matches" element={<Matches />} />
          <Route path="fit" element={<FitGuide />} />
          <Route path="stylist" element={<StylistAI />} />
          <Route path="tryon" element={<TryOn />} />

          {/* Rota Coringa */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
