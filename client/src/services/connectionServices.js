import axios from "axios";
import Userfront from "@userfront/core";
const apiUrl = "http://localhost:8080/api/connection";
Userfront.init("rbvqd5nd");

export function getConnection() {
    return axios.get(apiUrl, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}

export function addConnection(connection) {
    return axios.post(apiUrl, connection, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}
