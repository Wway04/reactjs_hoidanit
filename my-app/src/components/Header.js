import { memo, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import logoApp from "../assets/img/logo192.png";
import { UseContext } from "../context/UserContext";
import ModalAuth from "./ModalAuth";
function Header() {
  const { userContext, tokenContext, logoutContext } = useContext(UseContext);
  const handleLogout = () => {
    logoutContext();
    toast.success("Logged out successfully");
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <NavLink to="/" className="navbar-brand">
            <img src={logoApp} width="30" height="30" className="d-inline-block align-top" alt="React Bootstrap logo" />
            <span>Wway17</span>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to={"/"} className="nav-link">
                Home
              </NavLink>
              <NavLink to={"/users"} className="nav-link">
                Manage User
              </NavLink>
            </Nav>
            <Nav title="setting">
              <div className="nav-link">{userContext.email && <span>{`Welcome ${userContext.email}`}</span>}</div>
              <NavDropdown
                title={<span className="h6">{userContext.auth || tokenContext ? "wway" : "Setting"}</span>}
                id="basic-nav-dropdown"
              >
                {userContext.auth || tokenContext ? (
                  <>
                    <button
                      className="dropdown-item"
                      // onClick={handleLogout}
                    >
                      Setting
                    </button>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <ModalAuth />
                  </>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default memo(Header);
