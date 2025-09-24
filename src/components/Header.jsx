import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../cssComponents/Header.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const pathCadastro = () => {
    navigate("/cadastro");
  };
  const pathLogin = () => {
    navigate("/entrar");
  };

  const { usuario, handleLogout } = useAuth();

  const confirmLogout = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (erro) {
      alert(erro);
    }
  };

  return (
    <Navbar
      // bg="secondary"
      // variant="dark"
      expand="lg"
      className="shadow-sm navbarHeader"
    >
      <Container>
        <Navbar.Brand href="/" className="brandHeader">
          GameHub
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            borderColor: "white",
          }}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="d-flex align-items-center">
            <br />
            {!usuario ? (
              <>
                <Button
                  onClick={pathLogin}
                  variant="outline-light"
                  className="me-2 mb-3 mb-lg-0 p-3 p-lg-2 w-100"
                >
                  Login
                </Button>
                <Button
                  onClick={pathCadastro}
                  variant="outline-light"
                  className="me-2 mb-3 mb-lg-0 p-3 p-lg-2 w-100"
                >
                  CriarConta
                </Button>
              </>
            ) : (
              <>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-light"
                    className="me-2 mb-3 mb-lg-0 p-3 p-lg-2"
                    style={{ minWidth: "150px" }}
                  >
                    Olá,{" "}
                    {usuario?.displayName
                      ? usuario.displayName.split(" ")[0]
                      : usuario?.email.split("@")[0]}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/criar-sessao")}>
                      Criar Sessão
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/dashboard")}>
                      Configurações
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={confirmLogout}>Sair</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
