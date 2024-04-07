import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import { Container } from "react-bootstrap";
import Home from "../components/Home";
import TableUsers from "../components/TableUsers";
import PrivateRoutes from "./PrivateRoutes";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <Container>
              <Home />
            </Container>
          </>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoutes>
            <Header />
            <Container>
              <TableUsers />
            </Container>
          </PrivateRoutes>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
