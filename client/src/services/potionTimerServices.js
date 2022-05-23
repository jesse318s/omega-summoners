import axios from "axios";
import Userfront from "@userfront/core";
const apiUrl = "http://localhost:8080/api/potionTimer";
Userfront.init("rbvqd5nd");

export function getPotionTimer() {
    return axios.get(apiUrl, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}

export function addPotionTimer(potionTimer) {
    return axios.post(apiUrl, potionTimer, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Userfront.accessToken()}`,
        }
    });
}