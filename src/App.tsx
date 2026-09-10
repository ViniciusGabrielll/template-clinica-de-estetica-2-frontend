import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Agendamento from "./pages/Agendamento/Agendamento";

import Admin from "./pages/Admin/Admin";
import Login from "./pages/Admin/Login/Login";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Tratamentos from "./pages/Tratamentos/Tratamentos";
import Contato from "./pages/Contato/Contato";
import PedidoRealizado from "./pages/PedidoRealizado/PedidoRealizado";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/agendamento"
            element={<Agendamento />}
          />

          <Route
            path="/tratamentos"
            element={<Tratamentos />}
          />

          <Route
            path="/contato"
            element={<Contato />}
          />

          <Route
            path="/admin/login"
            element={<Login />}
          />

          <Route
            path="/pedido-realizado"
            element={<PedidoRealizado />}
          />

          <Route element={<ProtectedRoute />}>

            <Route
              path="/admin"
              element={<Admin />}
            />

          </Route>
        </Route>


      </Routes>

    </BrowserRouter>
  );
}

export default App;