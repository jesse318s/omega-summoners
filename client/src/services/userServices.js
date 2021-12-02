import axios from "axios";
const apiUrl = "http://localhost:8080/api/users";

export function getUsers() {
    return axios.get(apiUrl);
}

export function addUser(user) {
    return axios.post(apiUrl, user);
}

export function updateUser(id, user) {
    return axios.put(apiUrl + "/" + id, user);
}

export function deleteUser(id) {
    return axios.delete(apiUrl + "/" + id);
}