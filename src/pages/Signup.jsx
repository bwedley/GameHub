import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../cssComponents/Signup.css";
import fundo from "../imagens/background2.jpg";
import { useAuth } from "../contexts/AuthContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { platforms } = useAuth();

  const navigate = useNavigate();
  const pathTelaInicial = () => {
    navigate("/");
  };

  const submeterDados = async (dados) => {
    try {
      const credenciais = await createUserWithEmailAndPassword(
        auth,
        dados.email,
        dados.password
      );

      await updateProfile(credenciais.user, {
        displayName: dados.name,
      });

      alert(
        `Cadastro realizado, bem-vindo ${dados.name
          .split(" ")
          .slice(0, 2)
          .join(" ")}`
      );
      navigate("/");
    } catch (error) {
      const msg = listaMensagensErro(error?.code);
      alert(msg);
    }
  };
  const listaMensagensErro = (erro) => {
    switch (erro) {
      case "auth/email-already-in-use":
        return "E-email já está em uso";
      default:
        return "Erro ao criar a conta";
    }
  };

  return (
    <Container
      fluid
      className="body-signup"
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: "contain",
        backgroundPosision: "center",
        cursor: "pointer",
      }}
    >
      <Row className="justify-content-md-center text-white p-3">
        <Col xs={12} lg={6}>
          <h2 className="mb-4 text-center"> Criar Conta </h2>
          <Form onSubmit={handleSubmit(submeterDados)}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nome completo</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Digite seu nome"
                {...register("name", {
                  required: "O nome é obrigatório.",
                  minLength: {
                    value: 6,
                    message: "O nome deve conter no mínimo 6 caracteres.",
                  },
                })}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>
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
              <Form.Label>Crie uma senha forte</Form.Label>
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

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirme sua senha</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Digite sua senha"
                {...register("confirmPassword", {
                  required: "Confirme sua senha.",
                  validate: (v) =>
                    v === watch("password") || "As senhas não coincidem.",
                  minLength: {
                    value: 6,
                    message: "A senha deve conter pelo menos 6 caracteres",
                  },
                })}
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quais plataformas você joga?</Form.Label>
              <Row>
                {platforms.map((plat) => (
                  <Col xs={4} md="auto" key={plat}>
                    <Form.Check
                      className="mb-2 custom-checkbox"
                      key={plat}
                      type="checkbox"
                      label={plat}
                      value={plat}
                      {...register("platforms", {
                        required:
                          "Selecione pelo menos sua plataforma principal.",
                      })}
                      isInvalid={!!errors.platforms}
                    />
                  </Col>
                ))}
              </Row>
              <Form.Control.Feedback
                type="invalid"
                style={{ display: "block" }}
              >
                {errors.platforms?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-3 w-100">
              Criar Conta
            </Button>
            <Button
              onClick={pathTelaInicial}
              variant="secondary"
              className="w-100"
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
