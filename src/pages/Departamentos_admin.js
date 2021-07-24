import React, { useState, useEffect } from "react";
//import { Card, Button, Alert } from "react-bootstrap";
//import { useAuth } from "./../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import BarraPrivada from "../components/Barra_pri";
import { db } from "../firebase";

function Departamentos_admin() {
  const [posts, setPosts] = useState([]);

  const getdb = async () => {
    const docs = [];
    const querySnapshot = await db.collection("departamentos").get();
    querySnapshot.forEach((doc) => {
      //console.log(doc.data());
      docs.push({ ...doc.data(), id: doc.id });
    });
    setPosts(docs);
    //console.log(docs.map((e) => console.log(e)));
  };

  useEffect(() => {
    getdb();
    //sentdb();
  }, []);

  //const [error, setError] = useState("");
  //const { currentUser, logout } = useAuth();
  //const history = useHistory();

  //async function handleLogout() {
  //setError("");

  //try {
  //await logout();
  //history.push("/login");
  //} catch {
  //setError("Failed to log out ");
  //}
  //}

  return (
    <>
      <BarraPrivada />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="w-100">
          <h2 className="text-center mb-4">Lista Acredores</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Enero</th>
                <th>Febrero</th>
                <th>Marzo</th>
                <th>Abril</th>
                <th>Mayo</th>
                <th>Junio</th>
                <th>Julio</th>
                <th>Agosto</th>
                <th>Septiembre</th>
                <th>Octubre</th>
                <th>Noviembre</th>
                <th>Diciembre</th>
              </tr>
            </thead>
            <tbody>
              {
                //posts.map((e) => console.log(e.id))
                //console.log(posts)
                posts.map((e) => (
                  <tr>
                    <td>
                      <Link to={`/agregar_ingreso/${e.id}`}>{e.id}</Link>
                    </td>
                    <td>{e.name}</td>
                    <td>{e.enero.estado && "pagado"}</td>
                    <td>{e.febrero.estado && "pagado"}</td>
                    <td>{e.marzo.estado && "pagado"}</td>
                    <td>{e.abril.estado && "pagado"}</td>
                    <td>{e.mayo.estado && "pagado"}</td>
                    <td>{e.junio.estado && "pagado"}</td>
                    <td>{e.julio.estado && "pagado"}</td>
                    <td>{e.agosto.estado && "pagado"}</td>
                    <td>{e.septiembre.estado && "pagado"}</td>
                    <td>{e.octubre.estado && "pagado"}</td>
                    <td>{e.noviembre.estado && "pagado"}</td>
                    <td>{e.diciembre.estado && "pagado"}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
}

export default Departamentos_admin;
