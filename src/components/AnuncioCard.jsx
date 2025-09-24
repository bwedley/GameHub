import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import buscarJogo from "./BuscarJogo";
import "../cssComponents/AnuncioCard.css";
import fundo from "../imagens/imagemControle.png";

export default function AnuncioCard({
  id,
  jogo,
  plataformas,
  estado,
  horario,
}) {
  const navigate = useNavigate();
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    async function pegarImagem() {
      const dadosJogo = await buscarJogo(jogo);
      if (dadosJogo) {
        setImagem(dadosJogo[0].background_image);
      }
    }
    pegarImagem();
  }, [jogo]);

  return (
    <Card
      className="mb-4 w-100 cardAnuncio h-100 d-flex flex-column"
      style={{
        // backgroundImage: imagem ? `url(${imagem})` : "none",
        backgroundImage: `url(${fundo})`,
        backgroundSize: "contain",
        backgroundPosision: "center",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/anuncio/${id}`)}
    >
      <Card.Body
        className="rounded d-flex flex-column flex-grow-1"
        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
      >
        <Card.Title className="text-center" style={{ fontSize: "4vh" }}>
          {jogo}
        </Card.Title>
        <Card.Text className="text-center flex-grow-1">
          Plataforma:{" "}
          {plataformas.length > 2
            ? `${plataformas.slice(0, 2).join(" ● ")} + ${
                plataformas.length - 2
              }`
            : plataformas.join(" ● ")}
          <br />
          Estado: {estado} <br />
          Horário: {horario}
        </Card.Text>
        <Button variant="primary" className="mx-auto d-block">
          Ver detalhes
        </Button>
      </Card.Body>
    </Card>
  );
}
