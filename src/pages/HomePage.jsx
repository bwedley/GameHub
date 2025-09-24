import AnuncioCard from "../components/AnuncioCard";
import { Col, Container, Row, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import pegarInfoAnuncios from "../services/api";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";

export default function HomePage() {
  const [anuncios, setAnuncios] = useState([]);
  const [filtro, setFiltro] = useState("");

  // useEffect(() => {
  //   pegarInfoAnuncios()
  //     .then((res) => setAnuncios(res.data))
  //     .catch((err) => console.error("Erro:", err));
  // }, []);
  async function listarJogos() {
    // let listar;
    // await getDocs(collection(db, "anuncios")).then((querySnapshot) => {
    //   listar = querySnapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    // });
    // return listar;
    let listar;
    const anunciosRef = collection(db, "anuncios");
    const ordenarAnuncios = query(anunciosRef, orderBy("criadoEm", "desc"));

    await getDocs(ordenarAnuncios).then((querySnapshot) => {
      listar = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    });
    return listar;
  }

  useEffect(() => {
    async function carregarDados() {
      const lista = await listarJogos();
      setAnuncios(lista);
    }
    carregarDados();
  }, []);

  // console.log("aqui" + anuncios);
  const filtrarAnuncio = anuncios.filter((anuncio) =>
    anuncio.jogo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <Container className="py-3" role="region" aria-labelledby="filtrar-jogos">
        <h2 id="filtrar-jogos" className="mb-3" style={{ color: "#f1f1f1" }}>
          Filtrar por jogos
        </h2>
        <Form.Group controlId="filtroJogo">
          <Form.Label className="visually-hidden">Filtrar por Jogo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Busque por um jogo. Ex: Minecraft"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="mb-4 w-50"
            aria-label="Filtrar sessões por jogo"
          />
        </Form.Group>
        <Row className="center">
          {filtrarAnuncio.length > 0 ? (
            filtrarAnuncio.map((anuncio) => (
              <Col
                key={anuncio.id}
                xs={12}
                sm={6}
                lg={4}
                className="d-flex align-items-stretch"
              >
                <div
                  className="h-100 w-100 d-flex flex-column"
                  tabIndex={0}
                  role="group"
                  aria-label={`Anúncio do jogo ${anuncio.jogo}`}
                >
                  <AnuncioCard {...anuncio} />
                </div>
              </Col>
            ))
          ) : (
            <p
              role="alert"
              style={{
                color: "#ff7777",
                fontWeight: "bolder",
                fontSize: "2rem",
              }}
            >
              {" "}
              Sem anúncios disponíveis{" "}
            </p>
          )}
        </Row>
      </Container>
    </div>
  );
}
// https://getbootstrap.com/docs/5.3/utilities/display/
