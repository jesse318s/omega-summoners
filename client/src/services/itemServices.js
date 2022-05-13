import axios from "axios";
import Userfront from "@userfront/core";
const apiUrl = "http://localhost:8080/api/item";
Userfront.init("rbvqd5nd");

export function getItem() {
    return axios.get(apiUrl, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}

export function addItem(item) {
    return axios.post(apiUrl, item, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}