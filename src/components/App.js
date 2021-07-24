import React from "react";
import Signup from "./../pages/Signup";
//import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//import Dashboard from "./../pages/Dashboard";
import Login from "./../pages/Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "../pages/ForgotPassword";
//import UpdateProfile from "../pages/UpdateProfile";
import Departamentos from "../pages/Departamentos";
import Departamentos_admin from "../pages/Departamentos_admin";
import Ingresos from "../pages/Ingresos";
import DpNumero from "../pages/DpNumero";
import Ingresos_egresos from "../pages/Ingresos_egresos";
import Ingresos_op from "../pages/Ingresos_op";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Departamentos_admin} />
            <PrivateRoute
              path="/ingresos_egresos"
              component={Ingresos_egresos}
            />
            <Route path="/signup" component={Signup} />
            <Route path="/dp" component={Departamentos} />
            <Route path="/ingresos" component={Ingresos} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <PrivateRoute
              exact
              path="/agregar_ingreso/:id"
              component={DpNumero}
            />
            <PrivateRoute path="/agregar_ingreso" component={DpNumero} />
            <PrivateRoute path="/resumen_op" component={Ingresos_op} />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
