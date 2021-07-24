import React from "react";
//import { Form, Button, Card, Alert } from "react-bootstrap";
//import { useAuth } from "../contexts/AuthContext";
//import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
//import { Container } from "react-bootstrap";

import { Nav } from "react-bootstrap";

export default function BarraPublic() {
  return (
    <Nav bg="light" expand="lg" className="d-flex">
      <Nav.Item>
        <Nav.Link>
          <Link to="/dp">Departamentos</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link>
          <Link to="/ingresos">Ingresos/Egresos</Link>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item className="ml-auto">
        <Nav.Link>
          <Link to="/login">Login</Link>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
