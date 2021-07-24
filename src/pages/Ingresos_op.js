import React, { useEffect, useState } from "react";
import { Form, Button, Card, Col, Row } from "react-bootstrap";
//import { useAuth } from "../contexts/AuthContext";
//import { Link, useHistory } from "react-router-dom";
import BarraPrivada from "../components/Barra_pri";

import { db } from "../firebase";
import Table from "react-bootstrap/Table";
import { Container } from "react-bootstrap";

export default function Ingresos_op() {
  const _new_date = new Date().getMonth();

  const [posts, setPosts] = useState([]);
  const [posts_gastos, setPosts_gastos] = useState([]); //gastos
  const [posts_gastos_otros, setPosts_gastos_otros] = useState([]); //gastos
  const [posts_saldo, setPosts_saldo] = useState([]); //gastos

  const [ingreso_pisos, setIngreso_pisos] = useState([]);
  const [ingreso_gasto, setIngreso_gasto] = useState([]);
  const [ingreso_gasto_otro, setIngreso_gasto_otro] = useState([]);
  const [saldo_anterior, setSaldo_anterior] = useState(0);
  const [saldo_next, setSaldo_next] = useState(0);

  const [_meses] = useState([
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]);
  const [new_mes, setNew_mes] = useState(_meses[_new_date]);

  //const fecha_boleta = new_mes == "" ? _meses[_new_date] : new_mes;

  //const ingresos_por_pisos =
  //ingreso_pisos === [] ? get_resultado() : ingreso_pisos;

  const handleInputChange = (e) => {
    //console.log(e.target.id);
    if (e.target.value === "") {
      setNew_mes(_meses[_new_date]); // seleccion del input
      //console.log("se ejecuta el vacio");
    } else {
      setNew_mes(e.target.value); // seleccion del input
    }
    //console.log(e.target.value);
    //console.log(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getupdate(
      saldo_anterior + ingreso_pisos[0]
        ? ingreso_pisos.reduce((a, b) => a + b)
        : 0 - ingreso_gasto[0] && ingreso_gasto_otro[0]
        ? ingreso_gasto.reduce((a, b) => a + b) +
          ingreso_gasto_otro.map((e) => e.monto).reduce((a, c) => a + c)
        : 0
    );

    //get_resultado_saldo();
    getdb();
  };

  const getupdate = async (total) => {
    const mes_next =
      _meses[_meses.findIndex((e) => e === new_mes) + 1].toLowerCase();

    await db.collection("saldos").doc(mes_next).set({
      monto: total,
    });
  };

  const getdb = async () => {
    const docs = [];
    const docs_gasto = [];
    const docs_gasto_otro = [];
    const docs_saldo = [];

    const querySnapshot = await db.collection("departamentos").get();
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });

    const querySnapshot_gasto = await db
      .collection("gastos")
      .where("obligatorio", "==", true)
      .get();
    querySnapshot_gasto.forEach((doc) => {
      docs_gasto.push({ ...doc.data(), id: doc.id });
    });

    const querySnapshot_gasto_otro = await db
      .collection("gastos")
      .where("obligatorio", "==", false)
      .get();
    querySnapshot_gasto_otro.forEach((doc) => {
      docs_gasto_otro.push({ ...doc.data(), id: doc.id });
    });

    const querySnapshot_saldo = await db.collection("saldos").get();
    querySnapshot_saldo.forEach((doc) => {
      docs_saldo.push({ ...doc.data(), id: doc.id });
    });

    setPosts(docs);
    setPosts_gastos(docs_gasto);
    setPosts_gastos_otros(docs_gasto_otro);
    setPosts_saldo(docs_saldo);
  };

  useEffect(() => {
    //setIngreso_pisos(get_resultado(fecha_boleta.toLowerCase()));
    const suma_pisos = (a, i, f) => {
      const suma = a
        .slice(i, f) // 5, 9, 10, 14, 15, 19, 20, 25
        .reduce((a, b) => parseInt(a) + parseInt(b));
      return suma;
    };
    //
    const get_resultado = (mes = new_mes.toLowerCase()) => {
      const pisos_total = [];
      if (posts[0]) {
        const _my_array = posts.map((e) => e[mes].monto);
        pisos_total.push(suma_pisos(_my_array, 0, 4));
        pisos_total.push(suma_pisos(_my_array, 5, 9));
        pisos_total.push(suma_pisos(_my_array, 10, 14));
        pisos_total.push(suma_pisos(_my_array, 15, 19));
        pisos_total.push(suma_pisos(_my_array, 20, 24));

        //console.log(pisos_total);
        return setIngreso_pisos(pisos_total);
      } else {
        console.log("esperando... ");
      }
    };

    const get_resultado_gasto = (mes = new_mes.toLowerCase()) => {
      if (posts_gastos[0]) {
        const obtener = posts_gastos.map((e) => e[mes]);
        const por_mes = obtener.map((e) => (e === undefined ? 0 : e.monto));
        setIngreso_gasto(por_mes);
        return;
      } else {
        console.log("esperando... ");
      }
    };
    const get_resultado_gasto_otros = (mes = new_mes.toLowerCase()) => {
      if (posts_gastos_otros[0]) {
        const obtener = posts_gastos_otros.filter((e) => e.mes === [mes]);
        setIngreso_gasto_otro(obtener);
        return;
      }
    };

    const get_resultado_saldo = (mes = new_mes.toLowerCase()) => {
      if (posts_saldo[0]) {
        const mes_next =
          _meses[_meses.findIndex((e) => e === new_mes) + 1].toLowerCase();

        const obtener = posts_saldo.filter((a) => a.id === [mes]);
        obtener[0] ? setSaldo_anterior(obtener[0].monto) : setSaldo_anterior(0);

        const obtener_next = posts_saldo.filter((a) => a.id === mes_next);
        obtener_next[0]
          ? setSaldo_next(obtener_next[0].monto)
          : setSaldo_next(0);
        //console.log(mes_next);
        //console.log(saldo_next);

        return;
      }
    };
    get_resultado();
    get_resultado_gasto();
    get_resultado_gasto_otros();
    get_resultado_saldo();
    //console.log(ingreso_gasto);
    //console.log(posts_gastos.map((e) => e.julio));
    //console.log("esto se ejecuta");
    //console.log("esto se ejecuta");
    //console.log(ingresos_por_pisos);
  }, [
    new_mes,
    _meses,
    posts,
    posts_gastos,
    posts_saldo,
    posts_gastos_otros,
    saldo_next,
  ]);

  useEffect(() => {
    //const _new_date = ;
    getdb();
    //getdb_gastos();
    //setNew_mes(_meses[_new_date]);
    //setNew_date(_meses[_new_date]);
    //setNum_mes(new Date().getMonth());
    //console.log(new_mes);
    //console.log(_new_date, num_mes);

    //setNew_mes(_meses[_new_date]);
  }, []);

  useEffect(() => {
    if (posts[0]) {
      //get_resultado();
    }
  }, [posts]);

  useEffect(() => {
    if (posts_gastos[0]) {
      //get_resultado_gasto();
      //console.log(posts_gastos.map((e) => e.julio));
      //console.log(ingreso_gasto);
    }
    //get_resultado();
    //console.log(posts_gastos);
  }, [posts_gastos]);

  useEffect(() => {
    if (posts_gastos_otros[0]) {
      //console.log(posts_gastos_otros.filter((e) => e.mes == "enero"));
      //get_resultado_gasto_otros();
    }
  }, [posts_gastos_otros]);

  useEffect(() => {
    if (posts_saldo[0]) {
      //get_resultado_saldo();
    }
  }, [posts_saldo]);
  return (
    <>
      <BarraPrivada />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="p-0">
          <Card.Body>
            <div className="">
              <h5 className="text-center mb-2">CONDOMINIO TORRE REAL</h5>
              <h6 className="text-center mb-5">
                ESTADO DE CUENTA MES {new_mes.toUpperCase()} 2021
              </h6>

              <div className="form-row align-items-center">
                <div className="col-auto my-1">
                  <label className="mr-sm-2" for="inlineFormCustomSelect">
                    Elegir Mes:
                  </label>
                  <Form.Control
                    as="select"
                    className="me-sm-2"
                    name="mes"
                    onChange={handleInputChange}
                    custom
                  >
                    <option value="">Mes de ...</option>
                    {_meses.slice(0, _new_date + 1).map((e) => (
                      <option value={e}>{e}</option>
                    ))}
                  </Form.Control>
                </div>
              </div>
            </div>

            <div className="row">
              <Card className="col-xl m-3 ">
                <Card.Body>
                  <h6 className="text-center mb-4">INGRESOS</h6>
                  <h6 className="text-left mb-4">
                    COBROS DEL MES DE {new_mes.toUpperCase()}{" "}
                  </h6>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>DEPARTAMENTOS</th>
                        <th className="text-center">FECHA</th>
                        <th className="text-center">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>DPTOS 1ER PISO</td>
                        <td className="text-center">{new_mes}</td>
                        <td>{ingreso_pisos[0]}</td>
                      </tr>
                      <tr>
                        <td>DPTOS 2DO PISO</td>
                        <td className="text-center">{new_mes}</td>
                        <td>{ingreso_pisos[1]}</td>
                      </tr>
                      <tr>
                        <td>DPTOS 3ER PISO</td>
                        <td className="text-center">{new_mes}</td>
                        <td>{ingreso_pisos[2]}</td>
                      </tr>
                      <tr>
                        <td>DPTOS 4TO PISO</td>
                        <td className="text-center">{new_mes}</td>
                        <td>{ingreso_pisos[3]}</td>
                      </tr>
                      <tr>
                        <td>DPTOS 5TO PISO</td>
                        <td className="text-center">{new_mes}</td>
                        <td>{ingreso_pisos[4]}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td className="text-center">TOTAL:</td>
                        <td>
                          {ingreso_pisos[0]
                            ? ingreso_pisos.reduce((a, b) => a + b)
                            : 0}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <Card className="col-xl m-3  ">
                <Card.Body>
                  <h6 className="text-center mb-4">GASTOS</h6>
                  <h6 className="text-left mb-4">
                    GASTOS DEL MES DE {new_mes.toUpperCase()}{" "}
                  </h6>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>CONCEPTO</th>
                        <th className="text-center">FECHA</th>
                        <th className="text-center">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>REC. AGUA</td>
                        <td className="text-center">{new_mes}</td>
                        <td>{ingreso_gasto[0]}</td>
                      </tr>
                      <tr>
                        <td>PAGO SRA LIMPIEZA</td>
                        <td className="text-center">{new_mes}</td>
                        <td>{ingreso_gasto[1]}</td>
                      </tr>
                      <tr>
                        <td>REC. LUZ</td>
                        <td className="text-center">{new_mes}</td>
                        <td>{ingreso_gasto[2]}</td>
                      </tr>
                      {ingreso_gasto_otro !== []
                        ? ingreso_gasto_otro.map((e) => (
                            <tr>
                              <td>{e.razon.toUpperCase()}</td>
                              <td className="text-center">{new_mes}</td>
                              <td>{e.monto}</td>
                            </tr>
                          ))
                        : ""}
                      <tr>
                        <td></td>
                        <td className="text-center">TOTAL:</td>
                        <td>
                          {ingreso_gasto[0] && ingreso_gasto_otro[0]
                            ? ingreso_gasto.reduce((a, b) => a + b) +
                              ingreso_gasto_otro
                                .map((e) => e.monto)
                                .reduce((a, c) => a + c)
                            : 0}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Card className="col-xl-12 m-0 ">
                <Card.Body>
                  <h6 className="text-center mb-4">RESUMEN</h6>
                  <h6 className="text-left mb-4">
                    RESUMEN DEL MES DE {new_mes.toUpperCase()}{" "}
                  </h6>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>CONCEPTO</th>
                        <th className="text-center">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>TOTAL DE INGRESOS</td>
                        <td className="text-center">
                          {ingreso_pisos[0]
                            ? ingreso_pisos.reduce((a, b) => a + b)
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <td>SALDO ANTERIOR</td>

                        <td className="text-center">
                          {saldo_anterior === undefined || saldo_anterior === 0
                            ? "Regresa al mes anterior "
                            : saldo_anterior}
                        </td>
                      </tr>
                      <tr>
                        <td>TOTAL GASTOS</td>
                        <td className="text-center">
                          {ingreso_gasto[0] && ingreso_gasto_otro[0]
                            ? ingreso_gasto.reduce((a, b) => a + b) +
                              ingreso_gasto_otro
                                .map((e) => e.monto)
                                .reduce((a, c) => a + c)
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <td>SALDO PARA PROXIMO MES</td>
                        <td className="text-center">
                          {saldo_next === undefined || saldo_next === 0 ? (
                            <Form onSubmit={handleSubmit}>
                              <Form.Group as={Row} className="mb-3 ">
                                <Col sm={{ span: 5, offset: 1 }}>
                                  <p>
                                    {saldo_anterior + ingreso_pisos[0]
                                      ? ingreso_pisos.reduce((a, b) => a + b)
                                      : 0 - ingreso_gasto[0] &&
                                        ingreso_gasto_otro[0]
                                      ? ingreso_gasto.reduce((a, b) => a + b) +
                                        ingreso_gasto_otro
                                          .map((e) => e.monto)
                                          .reduce((a, c) => a + c)
                                      : 0}
                                  </p>
                                </Col>
                                <Col>
                                  <Button type="submit">Enviar</Button>
                                </Col>
                              </Form.Group>
                            </Form>
                          ) : (
                            saldo_next
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
