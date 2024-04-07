import { memo, useState, useId } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

import { postCreateUser, patchUpdateUser, deleteUser } from "../services/UserService";

function ModalUser({ action, data, listUser = [], callback, addNewUser }) {
  const id = useId();
  console.log("🚀 ~ ModalUser ~ id:", id);
  const [loading, setLoading] = useState(false);
  // action
  const titleAction = action === "add" ? "Add new" : action === "delete" ? "Delete" : "Edit";

  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //   data user
  const [name, setName] = useState(data?.first_name);
  const [job, setJob] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    // submit add a user
    if (action === "add") {
      await postCreateUser(name, job);
      const user = { id, email: `${name}@gmail.com`, first_name: name, last_name: name };
      addNewUser([user, ...listUser]);
      setName("");
      setJob("");
      toast.success("🦄 A user is created successfully");
    } else if (action === "delete") {
      await deleteUser(data.id);
      const listUserId = listUser.map((user) => user.id);
      const indexUserDelete = listUserId.indexOf(data.id);
      listUser.splice(indexUserDelete, 1);
      const newListUser = [...listUser];
      callback(newListUser);
      toast.success(`🦄 Deleted user "${data?.first_name}" successfully`);
    } else if (action === "edit") {
      await patchUpdateUser(name, job, data.id);
      const newListUser = listUser.map((user) => {
        if (user.id === data.id) {
          return {
            id: user.id,
            email: user.email,
            first_name: name,
            last_name: user.last_name,
          };
        }
        return user;
      });
      callback(newListUser);
      toast.success(`🦄 Editted user "${data?.first_name}" successfully`);
      setName("");
      setJob("");
    }
    setLoading(false);
    handleClose();
  };

  return (
    <div>
      <Button variant="btn btn-primary" onClick={handleShow}>
        {action === "add" ? <i className="fa-solid fa-circle-plus"></i> : ""}
        {titleAction}
      </Button>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{titleAction} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {action === "add" && (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicname">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicJob">
                <Form.Label>Job</Form.Label>
                <Form.Control type="text" placeholder="Job" value={job} onChange={(e) => setJob(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
            </Form>
          )}
          {action === "delete" && (
            <>
              <p>{`Do you want to delete this user?`}</p>
              <b>{`email = ${data.email} ?`}</b>
            </>
          )}
          {action === "edit" && (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicname">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicJob">
                <Form.Label>Job</Form.Label>
                <Form.Control type="text" placeholder="Job" value={job} onChange={(e) => setJob(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {loading ? (
            <>
              <Button
                variant="primary"
                className="d-flex align-items-center justify-content-center gap-1"
                onClick={handleSubmit}
                disabled
              >
                Loading...
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <div></div>
    </div>
  );
}

export default memo(ModalUser);
