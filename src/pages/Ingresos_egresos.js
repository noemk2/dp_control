import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
//import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
//import BarraPublica from "../components/Barra_pub";
import BarraPrivada from "../components/Barra_pri";
import { Container } from "react-bootstrap";
import DatePicker from "react-date-picker";
import { db } from "../firebase";

export default function Ingresos_egresos() {
  const [posicion, setPosicion] = useState(true);
  const [_posicion, set_Posicion] = useState(true);
  const [_value, onChange] = useState(new Date());

  //const [requerido, setRequerido] = useState(false);
  //const [_requerido, set_Requerido] = useState(false);

  const requerido = false;
  const _requerido = false;
  //const [hora, setHora] = useState("");
  //const [my_mes, setMy_mes] = useState("");
  //const [concepto, setConcepto] = useState("");
  //const [titulo, setTitulo] = useState("");
  //const [meses, setMeses] = useState([]);
  const [values, setValues] = useState({
    fecha: new Date(),
    monto: 0,
    razon: "",
  });
  const [_meses] = useState([
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]);

  //const _meses = ;

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(_meses[values.fecha.getMonth()]);
    const my_mes = _meses[values.fecha.getMonth()];
    //console.log(_value);
    //console.log(values);
    getupdate(values.razon, my_mes, values);
  };

  const handleInputChange = (e) => {
    //console.log(e.target.value);
    const { name, value, id } = e.target;
    //console.log(name);
    //console.log(value);
    id === "alerta1" && setPosicion(true);
    id === "alerta2" && setPosicion(false);

    //console.log(value);

    setValues({
      ...values,
      //fecha: hora,
      [name]: value === "on" ? new Date() : value,
      //razon: concepto,
    });
  };

  const handle_razon = (e) => {
    const { name, id } = e.target;
    id === "pago_agua" && set_Posicion(true);
    id === "pago_luz" && set_Posicion(true);

    setValues({
      ...values,
      //razon: id == "pago_agua" ? "pago_agua" : "pago_luz",
      [name]: id === "pago_agua" ? "pago_agua" : "pago_luz",
    });
  };

  const hadle_otro_gasto = (e) => {
    const { name, value, id } = e.target;

    id === "pago_limpieza" && set_Posicion(true);
    id === "alerta4" && set_Posicion(false);

    setValues({
      ...values,
      [name]: id === "pago_limpieza" ? "pago_limpieza" : value,
    });
  };

  //const handleInputChange = 0;
  const getupdate = async (tipo_pago, mes, valor) => {
    // si el tipo_pago no tiene

    // si tipo_pago es pago_agua || pago_luz || pago_limpieza
    if (
      tipo_pago === "pago_agua" ||
      tipo_pago === "pago_luz" ||
      tipo_pago === "pago_limpieza"
    ) {
      await db
        .collection("gastos")
        .doc(tipo_pago)
        .update({
          [mes]: {
            fecha: valor.fecha,
            monto: parseInt(valor.monto),
          },
        });
    } else {
      await db.collection("gastos").add({
        fecha: valor.fecha,
        mes: mes,
        monto: parseInt(valor.monto),
        razon: valor.razon,
        obligatorio: false,
      });
    }
  };

  useEffect(() => {
    //setTitulo(props.match.params.id);
    //setMeses(_meses);
  }, []);

  return (
    <>
      <BarraPrivada />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "800px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-5">Agregar Gastos</h2>
              <h3 className="text-left mb-5">Datos del gasto:</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Razon
                  </Form.Label>

                  <Col sm={10}>
                    <Form.Check
                      label="Servicio Luz"
                      name="razon"
                      id="pago_luz"
                      type="radio"
                      onChange={handle_razon}
                      required={!_requerido}
                    />
                    <Form.Check
                      label="Servicio Agua"
                      name="razon"
                      id="pago_agua"
                      type="radio"
                      onChange={handle_razon}
                      required={!_requerido}
                    />

                    <Form.Check
                      label="Servicio Limpieza"
                      name="razon"
                      id="pago_limpieza"
                      type="radio"
                      onChange={hadle_otro_gasto}
                      required={!_requerido}
                    />

                    <Form.Check type="radio" id="check-api-radio">
                      <Form.Check.Input
                        type="radio"
                        isValid
                        name="razon"
                        onClick={hadle_otro_gasto}
                        id="alerta4"
                      />
                      <Form.Check.Label>
                        Otro Gasto
                        {_posicion === false ? (
                          <Form.Control
                            type="text"
                            name="razon"
                            required={!_requerido}
                            onChange={hadle_otro_gasto}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Monto
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="number"
                      placeholder="Monto"
                      name="monto"
                      onChange={handleInputChange}
                      required
                    />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Fecha
                  </Form.Label>

                  <Col sm={10}>
                    <Form.Check
                      label="Hora Actual"
                      name="fecha"
                      id="alerta1"
                      type="radio"
                      onChange={handleInputChange}
                      required={!requerido}
                    />

                    <Form.Check type="radio" id="check-api-radio">
                      <Form.Check.Input
                        type="radio"
                        isValid
                        name="fecha"
                        onClick={handleInputChange}
                        id="alerta2"
                      />
                      <Form.Check.Label>
                        Elegir Fecha
                        {posicion === false ? (
                          <DatePicker
                            name="fecha"
                            required={!requerido}
                            onChange={(value) => {
                              onChange(value);
                              setValues({
                                ...values,
                                fecha: value,
                              });
                            }}
                            value={_value}
                            locale={"es-ES"}
                            className="d-flex mt-1"
                          />
                        ) : (
                          ""
                        )}
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit">Enviar</Button>
                  </Col>
                </Form.Group>
              </Form>
              <div className="w-100 text-center mt-2">
                <Link to="/">regresar</Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
