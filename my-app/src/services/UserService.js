import axios from "./customize-axios";

const fetchAllUser = (page = 1) => {
  return axios.get(`/api/users?page=${page}`);
};

const postCreateUser = (name, job) => {
  return axios.post(`/api/user`, { name, job });
};

const patchUpdateUser = (name, job, id) => {
  return axios.patch(`/api/user/${id}`, { name, job });
};

const deleteUser = (id) => {
  return axios.delete(`/api/user/${id}`);
};

const loginApi = (email, password) => {
  return axios.post(`/api/login`, { email: "eve.holt@reqres.in", password: "cit2yslicka" });
};

const registerApi = (email, password) => {
  return axios.post(`/api/register`, { email: "eve.holt@reqres.in", password: "cit2yslicka" });
};

export { loginApi, registerApi, fetchAllUser, postCreateUser, patchUpdateUser, deleteUser };
