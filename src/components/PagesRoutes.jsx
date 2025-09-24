import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AnuncioDetalhes from "../pages/AnuncioDetalhes";
import Signup from "../pages/Signup";
import TelaLogin from "../pages/TelaLogin";
import NaoEncontrada from "../pages/NaoEncontrada";
import FormAnuncio from "../pages/FormularioAnuncio";
import Configuracoes from "../pages/Configuracoes";

export default function PagesRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/entrar" element={<TelaLogin />} />
        <Route path="criar-sessao" element={<FormAnuncio />} />
        <Route path="/anuncio/:id" element={<AnuncioDetalhes />} />
        <Route path="/dashboard" element={<Configuracoes />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}
