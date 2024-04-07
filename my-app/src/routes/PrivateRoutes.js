import { useContext } from "react";

import { Container } from "react-bootstrap";
import Header from "../components/Header";
import NotPermission from "../components/NotPermission";
import { UseContext } from "../context/UserContext";

function PrivateRoutes({ children }) {
  const { userContext } = useContext(UseContext);

  return userContext.auth ? (
    children
  ) : (
    <>
      <Header />
      <Container>
        <NotPermission />
      </Container>
    </>
  );
}

export default PrivateRoutes;
