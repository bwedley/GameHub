import React, { useState, useEffect } from "react";
import { renderToString } from "react-dom/server";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Tab,
  Tabs,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import Header from "../components/Header";
import fundo from "../imagens/background2.jpg";

export default function Configuracoes() {
  const [anunciosUsuario, setAnunciosUsuarios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(true);
  const [displayName, setDisplayName] = useState("");

  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      setDisplayName(usuario.displayName || "");
      carregarAnunciosUsuario();
    }
  }, [usuario]);

  const carregarAnunciosUsuario = () => {
    if (!usuario) return;
    const q = query(
      collection(db, "anuncios"),
      where("autor.uid", "==", usuario.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const anuncios = [];
      querySnapshot.forEach((doc) => {
        anuncios.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setAnunciosUsuarios(anuncios);
      setLoadingAnuncios(false);
    });

    return () => unsubscribe();
  };

  //   const q = query(collection(db, "cities"), where("state", "==", "CA"));
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //   const cities = [];
  //   querySnapshot.forEach((doc) => {
  //       cities.push(doc.data().name);
  //   });
  //   console.log("Current cities in CA: ", cities.join(", "));
  // });

  const dadosImpressao = () => {
    return (
      <Row>
        {anunciosUsuario.map((anuncio) => (
          <Col md={6} lg={4} key={anuncio.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title className="h6">{anuncio.jogo}</Card.Title>
                <Card.Text>
                  <small className="text-muted">
                    <strong>Horario:</strong> {anuncio.horario}
                  </small>
                  <br />
                  <small className="text-muted">
                    <strong>Plataformas:</strong>{" "}
                    {Array.isArray(anuncio.plataformas)
                      ? anuncio.plataformas.join(", ")
                      : anuncio.plataforma}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const handleImpressao = () => {
    const htmlContent = renderToString(dadosImpressao());

    const htmlFull = `
      <html>
        <head>
          <title>Relatório</title>
          <link 
            rel="stylesheet" 
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          />
        </head>
        <body>
          <div id="root">${htmlContent}</div>
        </body>
      </html>
    `;

    const win = window.open();
    win.document.write(htmlFull);
    win.document.close();
    win.print();
  };

  if (!usuario) {
    return (
      <>
        <Header />
        <Container fluid className="body-signup">
          <Row className="justify-content-center p-3">
            <Col xs={12} lg={6}>
              <Alert variant="warning" className="text-center">
                <h4>Login Necessário</h4>
                <p>
                  Você precisa estar logado para acessar suas configurações.
                </p>
                <Button variant="primary" onClick={() => navigate("/")}>
                  Voltar
                </Button>
              </Alert>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container fluid className="body-signup">
        <Header />
        <Container className="py-4">
          <Row className="justify-content-center">
            <Col xs={12} lg={6}>
              <Card className="shadow p-3 mb-5 rounded">
                <Card.Header class="bg-primary text-white">
                  <h4>Configurações do Usuário</h4>
                </Card.Header>
                <Card.Body>
                  <Tabs defaultActiveKey="resumo" className="mb-3">
                    <Tab eventKey="usuario" title="Usuario">
                      Configurações do usuário ainda em desenvolvimento
                    </Tab>
                    <Tab eventKey="resumo" title="Resumo">
                      <Container className="d-flex justify-content-between align-item-center mb-3">
                        <h5>Meus anúncios ({anunciosUsuario.length})</h5>
                        <Button
                          variant="primary"
                          onClick={() => navigate("/criar-sessao")}
                        >
                          Nova Sessão
                        </Button>
                      </Container>
                      {loadingAnuncios ? (
                        <Container className="text-center">
                          <Spinner animation="border" />
                          <p className="mt-2">Carregando...</p>
                        </Container>
                      ) : anunciosUsuario.length === 0 ? (
                        <Alert variant="warning" className="text-center">
                          <h6>Você não possui sessões ativas/criadas</h6>
                          <Button
                            variant="primary"
                            onClick={() => navigate("/criar-sessao")}
                          >
                            Crie uma sessão
                          </Button>
                        </Alert>
                      ) : (
                        <Row>
                          {anunciosUsuario.map((anuncio) => (
                            <Col lg={14} key={anuncio.id} className="mb-3">
                              <Card>
                                <Card.Body>
                                  <Card.Title className="h6">
                                    {anuncio.jogo}
                                  </Card.Title>
                                  <Card.Text>
                                    <small className="text-muted">
                                      <strong>Horario:</strong>{" "}
                                      {anuncio.horario}
                                    </small>
                                    <br />
                                    <small className="text-muted">
                                      <strong>Plataformas:</strong>{" "}
                                      {Array.isArray(anuncio.plataformas)
                                        ? anuncio.plataformas.join(", ")
                                        : anuncio.plataforma}
                                    </small>
                                  </Card.Text>
                                  <Container className="d-flex justify-content-center">
                                    <Button
                                      variant="outline-primary"
                                      onClick={() =>
                                        navigate(`/anuncio/${anuncio.id}`)
                                      }
                                    >
                                      Ver
                                    </Button>
                                  </Container>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      )}
                    </Tab>
                    <Tab eventKey="contact" title="Contact" disabled>
                      Tab content for Contact
                    </Tab>
                  </Tabs>
                </Card.Body>
                <Button
                  variant="secondary"
                  className="mb-3"
                  onClick={handleImpressao}
                >
                  Imprimir Sessões
                </Button>
                <Button variant="primary" onClick={() => navigate("/")}>
                  Voltar
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

//https://react.dev/reference/react-dom/server/renderToString
