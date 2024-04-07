import "./NotPermission.scss";
import { Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
function NotPermission() {
  return (
    <Row className="not-permission d-flex align-items-center justify-content-center">
      <Col sm={12} md={10} lg={9} className="d-flex flex-column align-items-center justify-content-center">
        <h2 className="title">&nbsp;</h2>
        <h1 className="description text-center">Bạn không có quyền truy cập vào trang này! 😓</h1>
        <ul className="content text-center">
          <li>
            URL của nội dung này đã <strong>bị thay đổi</strong> hoặc <strong>không còn tồn tại</strong>.
          </li>
          <li>
            Nếu bạn <strong>đang lưu URL này</strong>, hãy thử <strong>truy cập lại từ trang chủ</strong> thay vì dùng
            URL đã lưu.
          </li>
        </ul>
        <p className="link-home">
          <NavLink to="/" role="button">
            Truy cập trang chủ
          </NavLink>
        </p>
        <p className="link-login">👉 hoặc đi tới Đăng nhập</p>
      </Col>
    </Row>
  );
}

export default NotPermission;
