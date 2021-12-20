import axios from "axios";
import Userfront from "@userfront/core";
const apiUrl = "http://localhost:8080/api/users";
Userfront.init("rbvqd5nd");

export function getUsers() {
    return axios.get(apiUrl, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}

export function addUser(user) {
    return axios.post(apiUrl, user, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}

export function updateUser(id, user) {
    return axios.put(apiUrl + "/" + id, user, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}

export function deleteUser(id) {
    return axios.delete(apiUrl + "/" + id, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}