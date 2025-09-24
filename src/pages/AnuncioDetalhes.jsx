import {
  Col,
  Container,
  Row,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useForm } from "react-hook-form";

import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
// import buscarJogo from "../components/BuscarJogo";

import Header from "../components/Header";
import pegarInfoAnuncios from "../services/api";
import NaoEncontrada from "./NaoEncontrada";

export default function AnuncioDetalhes() {
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [imagem, setImagem] = useState(null);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const anuncioDono = usuario && anuncio && usuario.uid === anuncio.autor?.uid;

  const pathTelaInicial = () => {
    navigate("/");
  };

  async function listarJogos() {
    let listar;
    await getDocs(collection(db, "anuncios")).then((querySnapshot) => {
      listar = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    });
    return listar;
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const lista = await listarJogos();
        const pegarAnuncio = lista.find((item) => item.id === id);

        if (pegarAnuncio) {
          setAnuncio(pegarAnuncio);
        } else {
          setError("Sessão não encontrada.");
        }
      } catch (erro) {
        console.error("Erro ao carregar sessão:", erro);
        setError(`Erro ao carregar ${erro}`);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      carregarDados();
    }
  }, [id]);

  const deletarAnuncio = async () => {
    try {
      await deleteDoc(doc(db, "anuncios", id));
      setError("");
      navigate("/");
      alert("Sessão deletada com sucesso!");
    } catch (erro) {
      alert(`Erro ao deletar sessão: ${erro}`);
      setError("Não foi possível realizar a exlusão");
    }
  };

  const editarAnuncio = async (dadosEditados) => {
    try {
      const anuncioRef = doc(db, "anuncios", id);
      await updateDoc(anuncioRef, {
        descricao: dadosEditados.descricao,
        horario: dadosEditados.horario,
        contato: dadosEditados.contato,
      });

      setAnuncio((data) => ({
        ...data,
        ...dadosEditados,
      }));
      handleHideModalEditar();
      alert(`Edição realizada com sucesso!`);
    } catch (erro) {
      alert(`Erro ao editar sessão: ${erro}`);
      setError("Não foi possível realizar as edições");
    }
  };
  // https://www.react-hook-form.com/api/useform/reset/
  // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=pt-br

  const handleShowModalEditar = () => {
    reset({
      descricao: anuncio.descricao,
      horario: anuncio.horario,
      contato: anuncio.contato,
    });
    setModalEditar(true);
  };

  const handleHideModalEditar = () => setModalEditar(false);

  const handleShowModalExcluir = () => setModalExcluir(true);
  const handleHideModalExcluir = () => setModalExcluir(false);

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <Container className="flex-grow-1 py-5">
          <div className="text-center">
            <Spinner animation="border" variant="light" />
            <p className="mt-2" style={{ color: "#f1f1f1" }}>
              Carregando sessão...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !anuncio) {
    return <NaoEncontrada />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="flex-grow-1 py-5">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8} className="d-flex justify-content-center">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div
                  className="p-1 d-flex justify-content-between align-items-center mb-3"
                  style={{
                    backgroundColor: "#e9f7fe",
                    borderLeft: "5px solid #0d6efd",
                  }}
                >
                  <Card.Title className="h3 mb-0 fw-bold ms-1">
                    {anuncio.jogo}
                  </Card.Title>

                  <Badge pill bg="info" className="mb-3 text-muted">
                    Plataforma:{" "}
                    {anuncio.plataformas.length > 2
                      ? `${anuncio.plataformas.slice(0, 2).join(" ● ")} + ${
                          anuncio.plataformas.length - 2
                        }`
                      : anuncio.plataformas.join(" ● ")}
                  </Badge>
                </div>
                <Badge bg="dark" className="mb-3">
                  Usuário: {anuncio.autor.nome}
                </Badge>
                <Card.Text className="mb-3">
                  <strong>Descrição:</strong> {anuncio.descricao}
                </Card.Text>
                <Row className="mb-3">
                  <Col xs={6}>
                    <Card.Text>
                      <strong>Estado:</strong> {anuncio.estado}
                    </Card.Text>
                  </Col>
                  <Col xs={6}>
                    <Card.Text>
                      <strong>Horário:</strong> {anuncio.horario}
                    </Card.Text>
                  </Col>
                  <Col xs={6}>
                    <Card.Text>
                      <strong>Criado em:</strong>{" "}
                      {anuncio.criadoEm.toDate().toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </Card.Text>
                  </Col>
                  <Col xs={6}>
                    <Card.Text>
                      <strong>Contato:</strong> {anuncio.contato}
                    </Card.Text>
                  </Col>
                </Row>
                <Container className="d-flex flex-column"></Container>
                {anuncioDono ? (
                  <>
                    <Alert variant="info" className="text-center">
                      <strong>Você é o dono dessa sessão</strong>
                      <br />
                      Aguarde outros jogadores ou crie uma nova sessão!
                    </Alert>
                    <Container className="d-flex flex-column">
                      <Button
                        onClick={handleShowModalEditar}
                        variant="warning"
                        className="w-50 mt-3 align-self-center"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={handleShowModalExcluir}
                        variant="danger"
                        className="w-50 mt-3 align-self-center"
                      >
                        Deletar
                      </Button>
                    </Container>
                  </>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Container className="d-flex flex-column">
          {anuncioDono ? (
            ""
          ) : (
            <Button
              onClick={() =>
                alert(
                  usuario
                    ? "Você está confirmado na jogatina"
                    : "Você precisa estar logado para entrar em uma jogatina"
                )
              }
              variant="primary"
              className="w-50 mt-5 align-self-center"
            >
              Confirmar
            </Button>
          )}
          <Button
            onClick={pathTelaInicial}
            variant="secondary"
            className="w-50 align-self-center mt-5"
          >
            Voltar
          </Button>
        </Container>
        <footer
          className=" mt-auto"
          style={{
            position: "fixed",
            bottom: 0,
            left: "25%",
            width: "50%",
          }}
        ></footer>
      </Container>

      {/*----------------------- Modais pra ediçao e delecao------------------------------ */}
      <Modal show={modalExcluir} onHide={handleHideModalExcluir}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Você tem certeza que deseja excluir essa sessão? Esta ação não
            poderá ser desfeita.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideModalExcluir}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deletarAnuncio();
              handleHideModalExcluir();
            }}
          >
            Deletar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalEditar} onHide={handleHideModalEditar}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar edição</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(editarAnuncio)}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formDescricao">
              <Form.Label>Descreva sua sessão</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Descreva o grupo, objetivo, estilo de jogo, regras, vagas, tudo que você quiser. Lembre-se de ser respeitoso com todos."
                {...register("descricao", {
                  required: "A descrição é obrigatória.",
                  minLength: {
                    value: 10,
                    message: "A descrição deve conter pelo menos 10 caracteres",
                  },
                })}
                isInvalid={!!errors.descricao}
              />
              <Form.Control.Feedback type="invalid">
                {errors.descricao?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHorario">
              <Form.Label>Horário da Sessão</Form.Label>
              <Form.Control
                type="text"
                name="horario"
                placeholder="Ex: 20:00, Noite, Sábado 15h, etc."
                {...register("horario", {
                  required: "O Horário é obrigatório.",
                  minLength: {
                    value: 2,
                    message: "O horário deve conter no mínimo 2 caracteres.",
                  },
                })}
                isInvalid={!!errors.horario}
              />
              <Form.Control.Feedback type="invalid">
                {errors.horario?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formContato">
              <Form.Label>Deixe seu contato</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Discord: user#1234"
                {...register("contato", {
                  required: "O Contato é obrigatório.",
                  minLength: {
                    value: 4,
                    message: "O contato deve conter no mínimo 4 caracteres.",
                  },
                })}
                isInvalid={!!errors.contato}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contato?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleHideModalEditar}>
              Cancelar
            </Button>
            <Button variant="danger" type="submit">
              Salvar Alterações
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* https://react-bootstrap.netlify.app/docs/components/modal/ */}
    </div>
  );
}
