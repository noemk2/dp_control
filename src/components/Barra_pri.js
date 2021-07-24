import React, { useState } from "react";
//import { Form, Button, Card, Alert } from "react-bootstrap";
//import { useAuth } from "../contexts/AuthContext";
//import Table from "react-bootstrap/Table";
//import { Link } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
//import { Container } from "react-bootstrap";

import { useAuth } from "./../contexts/AuthContext";

import { Nav } from "react-bootstrap";

export default function BarraPrivada() {
  //const [error, setError] = useState("");
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out ");
      console.log(error, currentUser);
    }
  }

  return (
    <Nav bg="light" expand="lg" className="d-flex">
      <Nav.Item>
        <Nav.Link>
          <Link to="/">Lista de Departamentos</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link>
          <Link to="/ingresos_egresos">Agregar Un Gasto</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link>
          <Link to="/agregar_ingreso">Agregar Un Ingreso</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link>
          <Link to="/resumen_op">Resumen</Link>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item className="ml-auto">
        <Nav.Link>
          <button onClick={handleLogout}>LogOut</button>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
