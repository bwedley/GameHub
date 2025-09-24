import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { pegarEstados } from "../services/api";
import "../cssComponents/Signup.css";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import fundo from "../imagens/background2.jpg";

export default function FormAnuncio() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [estados, setEstados] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { usuario, platforms } = useAuth();
  const navigate = useNavigate();
  const pathTelaInicial = () => {
    navigate("/");
  };

  const submeterDados = async (dados) => {
    if (!usuario) {
      setError("Você precisa logar para criar uma sessão de jogo.");
      return;
    }
    try {
      setError("");
      setSuccess("");
      const dadosAnuncio = {
        jogo: dados.jogo,
        descricao: dados.descricao,
        horario: dados.horario,
        plataformas: [].concat(dados.plataformas || []),
        estado: dados.estado,
        contato: dados.contato,
        autor: {
          uid: usuario.uid,
          nome: usuario.displayName || usuario.email.split("@")[0],
          email: usuario.email,
        },
        criadoEm: serverTimestamp(),
        ativo: true,
      };
      await addDoc(collection(db, "anuncios"), dadosAnuncio);
      setSuccess("Sessão de jogo criada com sucesso!");
      reset();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar sessão", error);
      setError("Erro ao criar sessão. Tente novamente");
      alert(error);
    }
  };

  useEffect(() => {
    pegarEstados()
      .then((res) => {
        console.log(res);
        setEstados(res);
      })
      .catch((err) => console.error("Erro:", err));
  }, []);
  // return (
  //   <Container
  //     fluid
  //     className="d-flex flex-column justify-content-center body-signup"
  //     style={{ backgroundImage: `url(${fundo})` }}
  //   >
  //     <h1 className="mb-4 text-center text-white">Em desenvolvimento...</h1>
  //     <Button
  //       onClick={pathTelaInicial}
  //       variant="primary"
  //       className="w-25 d-flex justify-content-center align-self-center"
  //     >
  //       Voltar
  //     </Button>
  //   </Container>
  // );
  return (
    <Container
      fluid
      className="body-signup"
      style={{
        // backgroundImage: imagem ? `url(${imagem})` : "none",
        backgroundImage: `url(${fundo})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <Row className="justify-content-md-center text-white p-3">
        <Col md={6} xs={12} lg={6}>
          <h2 className="mb-4 text-center"> Criar Sessão </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit(submeterDados)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formJogo">
                  <Form.Label>Jogo</Form.Label>
                  <Form.Control
                    type="text"
                    name="jogo"
                    placeholder="Ex: Terraria, No Man's Sky, etc."
                    {...register("jogo", {
                      required: "O nome do jogo é obrigatório.",
                      minLength: {
                        value: 2,
                        message: "O nome deve conter no mínimo 2 caracteres.",
                      },
                    })}
                    isInvalid={!!errors.jogo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.jogo?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
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
                        message:
                          "O horário deve conter no mínimo 2 caracteres.",
                      },
                    })}
                    isInvalid={!!errors.horario}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.horario?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formPlataformas">
              <Form.Label>Qual plataforma você jogará?</Form.Label>
              <Row>
                {platforms.map((plat) => (
                  <Col xs={6} md={5} key={plat}>
                    <Form.Check
                      className="mb-2"
                      type="checkbox"
                      label={plat}
                      value={plat}
                      {...register("plataformas", {
                        required: "Selecione pelo menos uma plataforma.",
                      })}
                      isInvalid={!!errors.plataformas}
                    />
                  </Col>
                ))}
              </Row>
              <Form.Control.Feedback
                type="invalid"
                style={{ display: "block" }}
              >
                {errors.plataformas?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEstados">
              <Form.Label>Que estado você mora?</Form.Label>
              <Form.Select
                size={5}
                className="mb-2"
                {...register("estado", {
                  required: "Selecione seu estado.",
                })}
                isInvalid={!!errors.estado}
              >
                <option value="">Selecione um estado</option>
                {estados.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback
                type="invalid"
                style={{ display: "block" }}
              >
                {errors.estado?.message}
              </Form.Control.Feedback>
            </Form.Group>
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

            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="mb-3 w-100"
            >
              Criar Sessão
            </Button>
            <Button
              onClick={pathTelaInicial}
              variant="secondary"
              className="w-100"
              size="lg"
            >
              Voltar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

//https://firebase.google.com/docs/auth/admin/errors?hl=pt-br
