import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
//import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import DatePicker from "react-date-picker";
//import BarraPublica from "../components/Barra_pub";
import BarraPrivada from "../components/Barra_pri";
import { Container } from "react-bootstrap";
import { db } from "../firebase";

//import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function DpNumero(props) {
  const [_value, onChange] = useState(new Date());
  const [posicion, setPosicion] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [values, setValues] = useState({
    estado: false,
    fecha: new Date(),
    monto: 0,
    mes: "",
  });

  const requerido = false;
  //const _requerido = false;

  const _meses = [
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
  ];

  //const [meses, setMeses] = useState(_meses);

  const depart = Array(5)
    .fill()
    .map((_, i) => i + 101)
    .concat(
      Array(5)
        .fill()
        .map((_, i) => i + 201)
    )
    .concat(
      Array(5)
        .fill()
        .map((_, i) => i + 301)
    )
    .concat(
      Array(5)
        .fill()
        .map((_, i) => i + 401)
    )
    .concat(
      Array(5)
        .fill()
        .map((_, i) => i + 501)
    );
  //console.log(depart);

  const handleSubmit = (e) => {
    e.preventDefault();

    //console.log(values);
    //console.log(values.mes);
    //console.log(_meses[values.fecha.getMonth()]);

    //console.log(titulo);
    getupdate(titulo, values.mes, values);
  };
  const handle_titulo = (e) => {
    const { value } = e.target;
    //props.match.params.id = value;
    //console.log(value);

    setTitulo(value);
  };

  const handleInputChange = (e) => {
    //console.log(e.target.value);
    const { name, value, id } = e.target;
    //console.log(e.target.id);
    console.log(name, value === "on" ? new Date() : value);

    id === "alerta1" && setPosicion(true);
    id === "alerta2" && setPosicion(false);

    setValues({
      ...values,
      [name]: value === "on" ? new Date() : value,
      estado: true,
    });
  };

  const getupdate = async (numero_dp, mes, valor) => {
    await db
      .collection("departamentos")
      .doc(numero_dp)
      .update({
        [mes]: valor,
      });
  };

  useEffect(() => {
    //setTitulo(props.match.params.id);
    //setMeses(_meses);
  }, []);

  useEffect(() => {
    setValues({
      //...values,
      fecha: _value,
    });
  }, [_value]);

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
              <Form onSubmit={handleSubmit}>
                <div className="form-row align-items-center justify-content-center  mb-4">
                  <h2 className="text-center">
                    Departamento {titulo == null ? "" : titulo}
                  </h2>

                  {titulo == null ? (
                    <div className="col-auto my-1">
                      <Form.Control
                        as="select"
                        className="me-sm-2"
                        name="mes"
                        onChange={handle_titulo}
                        custom
                        required
                      >
                        <option value="">Elige Departamento ...</option>
                        {depart.map((e) => (
                          <option value={e} onChange={handle_titulo}>
                            {e}
                          </option>
                        ))}
                      </Form.Control>
                    </div>
                  ) : (
                    " "
                  )}
                </div>

                <div className="form-row align-items-center  mb-2">
                  <h5 className="text-left">
                    {titulo == null ? " " : "Otro Departamento:"}
                    {titulo != null ? "" : titulo}
                  </h5>
                  {titulo != null ? (
                    <div className="col-auto my-1">
                      <Form.Control
                        as="select"
                        className="me-sm-2"
                        name="mes"
                        onChange={handle_titulo}
                        custom
                      >
                        <option value="">Elige Departamento ...</option>
                        {depart.map((e) => (
                          <option value={e} onChange={handle_titulo}>
                            {e}
                          </option>
                        ))}
                      </Form.Control>
                    </div>
                  ) : (
                    " "
                  )}
                </div>
                <h3 className="text-left mb-4">Datos del pago:</h3>

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
                            onChange={onChange}
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

                <fieldset>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label as="legend" column sm={2}>
                      Mes
                    </Form.Label>

                    <Col sm={10}>
                      <Form.Control
                        as="select"
                        className="my-1 mr-sm-2"
                        name="mes"
                        custom
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Mes de ...</option>
                        {_meses.map((e) => (
                          <option value={e.toLowerCase()}>{e}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </fieldset>

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
