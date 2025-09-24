import React from "react";
import { Button } from "react-bootstrap";
import gato from "../imagens/gato.webp";
import { useNavigate } from "react-router-dom";
export default function NaoEncontrada() {
  const navigate = useNavigate();
  const pathTelaInicial = () => {
    navigate("/");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${gato})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            alignSelf: "flex-end",
            color: "White",

            backgroundColor: "black",
            width: "100%",
            textAlign: "center",
            marginBottom: 50,
            padding: 20,
          }}
        >
          <p
            style={{
              fontSize: "2rem",
            }}
          >
            POV: Você entrou em uma página que não existe.
          </p>
          {/* <p style={{ color: "white" }}>Voltar para a página principal</p> */}
          <Button onClick={pathTelaInicial} variant="secondary">
            Voltar ao início
          </Button>
        </div>
      </div>
    </>
  );
}
