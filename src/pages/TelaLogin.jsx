import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../cssComponents/Signup.css";
import fundo from "../imagens/background2.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function TelaLogin() {
  const [logou, setLogou] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const pathTelaInicial = () => {
    navigate("/");
  };

  const { usuario, loading } = useAuth();

  const pathCadastro = () => {
    navigate("/cadastro");
  };

  useEffect(() => {
    if (usuario && !logou) {
      setLogou(true);
      alert(`Login realizado, bem-vindo ${usuario?.displayName.split(" ")[0]}`);
      navigate("/");
    }
  }, [usuario, logou]);

  const submeterDados = async (dados) => {
    if (loading) return;
    try {
      await signInWithEmailAndPassword(auth, dados.email, dados.password);
      const usuario = auth.usuario;
      const nome =
        usuario?.displayName?.split(" ")[0] || dados.email.split("@")[0];
      // alert(`Login realizado, bem-vindo ${nome}`);
      navigate("/");
    } catch (error) {
      const message = listaErros(error?.code);
      alert(message);
    }
  };

  const listaErros = (erro) => {
    switch (erro) {
      case "auth/user-not-found":
        return "Usuário não existe ou não foi encontrado.";
      case "auth/invalid-credential":
        return "E-mail ou senha incorretos";
      default:
        return `Falha ao logar na conta.${erro}`;
    }
  };

  return (
    <Container
      fluid
      className="body-signup"
      style={{
        // backgroundImage: imagem ? `url(${imagem})` : "none",
        backgroundImage: `url(${fundo})`,
        backgroundSize: "contain",
        backgroundPosision: "center",
        cursor: "pointer",
      }}
    >
      <Row className="justify-content-md-center text-white p-3">
        <Col xs={12} lg={6}>
          <h2 className="mb-4 text-center"> Entre com sua conta </h2>
          <Form onSubmit={handleSubmit(submeterDados)}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Digite seu melhor e-mail"
                {...register("email", {
                  required: "O email é obrigatório.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Digite um e-mail válido.",
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Digite sua senha"
                {...register("password", {
                  required: "A senha é obrigatória.",
                  minLength: {
                    value: 6,
                    message: "A senha deve conter pelo menos 6 caracteres",
                  },
                })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="mb-3 w-100">
              Login
            </Button>
            <Button
              onClick={pathTelaInicial}
              variant="secondary"
              className="w-100 mb-3"
            >
              Voltar
            </Button>
            <div
              className="mt-3 text-center text-primary"
              onClick={pathCadastro}
              variant="link"
              style={{ cursor: "pointer" }}
            >
              Não possui conta? Cadastre-se
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
