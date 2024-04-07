import { memo, useContext, useRef, useState } from "react";
import { Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/esm/Col";
import "./ModalAuth.scss";

import { toast } from "react-toastify";
import { UseContext } from "../context/UserContext";
import { loginApi, registerApi } from "../services/UserService";
import { emailValidator, passwordValidator } from "./validators";

function ModalAuth() {
  const emailInput = useRef();
  const [type, setType] = useState("Login");
  console.log("🚀 ~ ModalAuth ~ type:", type);
  const { loginContext } = useContext(UseContext);
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  // validate
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // info user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const removeValues = () => {
    setEmail("");
    setPassword("");
    setErrorEmail("");
    setErrorPassword("");
    setErrorMessage("");
    setType("Login");
  };

  const handleClose = () => {
    removeValues();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleSwitchType = (e) => {
    e.preventDefault();
    emailInput.current.focus();
    removeValues();
    setType(() => (type === "Register" ? "Login" : "Register"));
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const errEmail = emailValidator(email);
    const errPass = passwordValidator(password);
    if (errEmail || errPass) {
      if (errEmail) {
        setErrorEmail(errEmail);
      } else {
        setErrorEmail("");
      }
      if (errPass) {
        setErrorPassword(errPass);
      } else {
        setErrorPassword("");
      }
      setLoading(false);
    } else {
      if (type === "Login") {
        try {
          const token = await loginApi(email.trim(), password);
          toast.success(`🦄 Login successfully`);
          loginContext(email, token.token);
          handleClose();
        } catch (e) {
          setErrorMessage("Sai email hoặc mật khẩu. Vui lòng nhập lại!");
        }
      } else {
        const result = await registerApi(email.trim(), password);
        if (result && result.token) {
          toast.success(`🦄 Register successfully`);
          setEmail("");
          setPassword("");
          setType("Login");
        }
      }
    }
    setLoading(false);
  };

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
    setErrorEmail("");
    setErrorMessage("");
  };
  const handleOncchangePassword = (e) => {
    setPassword(e.target.value);
    setErrorPassword("");
    setErrorMessage("");
  };

  return (
    <div className="modal-auth">
      <Button variant="primary" onClick={handleShow} className="dropdown-item">
        {type}
      </Button>
      <div className="modal position-relative">
        <Modal
          show={show}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          keyboard={false}
        >
          <div
            role="button"
            className="btn-close position-absolute"
            style={{ top: "30px", left: "94%", transform: " translate(-50%, -50%)", padding: "8px" }}
            onClick={handleClose}
          ></div>
          <h1 className="text-center my-4">{type}</h1>
          <Modal.Body style={{ height: "400px" }}>
            <Row className="d-flex justify-content-center">
              <Col xs={9}>
                <Form>
                  <p className="mb-2">{`Đăng ${type === "Login" ? "nhập" : "kí"} bằng Email:`}</p>
                  <Form.Control
                    ref={emailInput}
                    autoFocus
                    type="email"
                    placeholder="Email"
                    name="email"
                    className={`my-2 ${errorEmail ? "border-danger" : ""}`}
                    value={email}
                    onChange={handleOnchangeEmail}
                  />
                  {errorEmail && <p className="text-danger">{errorEmail}</p>}
                  <div className="position-relative">
                    <Form.Control
                      type={isShowPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      className={`my-2 ${errorPassword ? "border-danger text-danger" : ""}`}
                      id="password"
                      name="password"
                      autoComplete="on"
                      value={password}
                      onChange={handleOncchangePassword}
                    />
                    <div
                      className="position-absolute"
                      style={{ top: "50%", left: "92%", transform: " translate(-50%, -50%)" }}
                      role="button"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    >
                      <i className={`fa-regular fa-eye${isShowPassword ? "" : "-slash"}`}></i>
                    </div>
                    {errorPassword && (
                      <div
                        className="position-absolute"
                        style={{ top: "50%", left: "82%", transform: " translate(-50%, -50%)" }}
                        role="button"
                      >
                        <i class="fa-solid fa-triangle-exclamation" style={{ color: "#e66565" }}></i>
                      </div>
                    )}
                  </div>
                  {errorPassword && <p className="text-danger mb-3">{errorPassword}</p>}
                  {errorMessage && <p className="text-danger mb-3">{errorMessage}</p>}
                  {type === "Login" && (
                    <div>
                      <span className="link-primary text-primary active" role="button">
                        Quên mật khẩu?
                      </span>
                    </div>
                  )}
                  {loading ? (
                    <button className="btn btn-primary w-100 mt-4" type="submit" onClick={handleSubmit} disabled>
                      Loading...
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary w-100 mt-4"
                      type="submit"
                      onClick={handleSubmit}
                      disabled={email && password ? false : true}
                    >
                      {`Đăng ${type === "Login" ? "nhập" : "kí"}`}
                    </button>
                  )}
                </Form>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <p>{`${type === "Login" ? "Bạn không có tài khoản?" : "Bạn đã có tài khoản?"}`}</p>
            <a
              className="link-danger link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
              href="/"
              onClick={handleSwitchType}
            >
              {`${type === "Login" ? "Đăng kí" : "Đăng nhập"}`}
            </a>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default memo(ModalAuth);
