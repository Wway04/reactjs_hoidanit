import { useCallback, useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import Form from "react-bootstrap/Form";
import { debounce } from "lodash";
import * as _ from "lodash";
import { CSVLink, CSVDownload } from "react-csv";
import { toast } from "react-toastify";
import Papa from "papaparse";

import { fetchAllUser } from "../services/UserService";
import { Button, Col, Row } from "react-bootstrap";
import ModalUser from "./ModalUser";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";

import "./TableUsers.scss";
const CSV_USERS = [
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"],
];

function TableUsers() {
  const [csvUsersDataExport, setCsvUsersDataExport] = useState([]);
  const [csvUsersImport, setCsvUsersImport] = useState([]);
  const [show, setShow] = useState(true);
  // sort
  const [sortBy, setSortBy] = useState();
  const [sortField, setSortField] = useState();
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const getUsersExport = (event, done) => {
    let result = [["first_name", "last_name", "email"]];
    console.log(CSV_USERS);
    CSV_USERS.forEach((item, index) => {
      console.log("🚀 ~ CSV_USERS.forEach ~ item:", item);
      console.log(item[0], item[1], item[2]);
      let arr = [`${item[0] ? item[0] : " "}`, `${item[1] ? item[1] : " "}`, `${item[2] ? item[2] : ""}`];
      result.push(arr);
    });
    setCsvUsersDataExport(result);
    done(true);
  };
  const handleImportCSV = (e) => {
    if (!(e.target.files && e.target.files[0] && e.target.files[0].type === "text/csv")) {
      toast.success(`🦄 Only accept CSV file...`);
      return;
    }
    setCsvUsersImport([1, 2, 3]);
    Papa.parse(e.target.files[0], {
      complete: function (results) {
        const rawCSV = results.data;
        if (rawCSV.length <= 0) {
          toast.success(`🦄 Not found data on CSV file...`);
          return;
        }
        if (!rawCSV[0].lenght === 3) {
          toast.success(`🦄 Wrong format CSV file...`);
          return;
        }
        if (!(rawCSV[0][0] === "first_name" && rawCSV[0][1] === "last_name" && rawCSV[0][2] === "email")) {
          toast.success(`🦄 Wrong format CSV file...`);
          return;
        }
      },
    });
    Papa.parse(e.target.files[0], {
      header: true,
      complete: function (results) {
        const rawCSV = results.data;
        setUsers(rawCSV);
      },
    });
  };
  const handleClose = () => setShow(false);
  const handleSubmitCsvImport = () => {
    setUsers([...csvUsersImport, ...users]);
    setShow(false);
  };
  useEffect(() => {
    // call api
    getUsers();
  }, []);
  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setTotalUsers(res.total);
      setTotalPage(res.total_pages);
      setUsers(res.data);
    }
  };
  const handleAddNewUser = (users) => {
    setUsers(users);
  };
  const handlePageClick = (e) => {
    getUsers(e.selected + 1);
  };
  const handleEditUser = useCallback((users) => {
    setUsers(users);
  }, []);
  const handleDeleteUser = useCallback((users) => {
    setUsers(users);
  }, []);
  const handleSortUsers = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    var newUsers = _.orderBy(users, sortField, sortBy);
    setUsers(newUsers);
  };
  // search
  const handleSearchUser = debounce((value) => {
    let newUsers;
    if (value) {
      newUsers = users.filter((user) => user.email.includes(value));
      setUsers(newUsers);
    } else {
      getUsers(1);
    }
  }, 300);

  return (
    <div className="table-users">
      <Row className="no-gutters">
        <Col xs={12} sm={4} md={4} lg={4} className="my-4">
          <h4>List user:</h4>
          <Form.Control
            placeholder="Search user by email..."
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={(e) => handleSearchUser(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={8} md={8} lg={8} className="d-flex justify-content-end align-items-center gap-1 actions">
          <label htmlFor="import-file-csv" role="button" className="btn btn-primary">
            Import
          </label>
          <input type="file" name="" id="import-file-csv" hidden onChange={(e) => handleImportCSV(e)} />
          <CSVLink
            data={csvUsersDataExport}
            filename={"my-file.csv"}
            className="btn btn-primary"
            asyncOnClick={true}
            onClick={getUsersExport}
          >
            Download me
          </CSVLink>
          <ModalUser addNewUser={handleAddNewUser} action="add" listUser={users} />
        </Col>
      </Row>
      <Row>
        <Col xs={4} sm={12} md={12} lg={12}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <div className="d-flex justify-content-between align-items-center">
                    Id
                    <div>
                      <i
                        role="button"
                        className="fa-solid fa-arrow-down-a-z"
                        onClick={() => handleSortUsers("asc", "id")}
                      ></i>
                      <i
                        role="button"
                        className="fa-solid fa-arrow-up-a-z"
                        onClick={() => handleSortUsers("desc", "id")}
                      ></i>
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex justify-content-between align-items-center">
                    Email
                    <div>
                      <i
                        role="button"
                        className="fa-solid fa-arrow-down-a-z"
                        onClick={() => handleSortUsers("asc", "email")}
                      ></i>
                      <i
                        role="button"
                        className="fa-solid fa-arrow-up-a-z"
                        onClick={() => handleSortUsers("desc", "email")}
                      ></i>
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex justify-content-between align-items-center">
                    First Name
                    <div>
                      <i
                        role="button"
                        className="fa-solid fa-arrow-down-a-z"
                        onClick={() => handleSortUsers("asc", "first_name")}
                      ></i>
                      <i
                        role="button"
                        className="fa-solid fa-arrow-up-a-z"
                        onClick={() => handleSortUsers("desc", "first_name")}
                      ></i>
                    </div>
                  </div>
                </th>
                <th>
                  <div className="d-flex justify-content-between align-items-center">
                    Last Name
                    <div>
                      <i
                        role="button"
                        className="fa-solid fa-arrow-down-a-z"
                        onClick={() => handleSortUsers("asc", "last_name")}
                      ></i>
                      <i
                        role="button"
                        className="fa-solid fa-arrow-up-a-z"
                        onClick={() => handleSortUsers("desc", "last_name")}
                      ></i>
                    </div>
                  </div>
                </th>
                <th>Actions </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td className="d-flex gap-3">
                    <ModalUser
                      onAddNewUser={handleAddNewUser}
                      action={"edit"}
                      listUser={users}
                      data={user}
                      callback={handleEditUser}
                    />
                    <ModalUser
                      onAddNewUser={handleAddNewUser}
                      action={"delete"}
                      listUser={users}
                      data={user}
                      callback={handleDeleteUser}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ReactPaginate
        pageCount={totalPage}
        initialPage={page - 1}
        pageRangeDisplayed={4}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        previousLabel="previous"
        nextLabel="next"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
      />
    </div>
  );
}

export default TableUsers;
