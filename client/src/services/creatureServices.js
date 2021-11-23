import axios from "axios";
const apiUrl = "http://localhost:8080/api/creatures";

export function getCreatures() {
    return axios.get(apiUrl);
}

export function addCreature(creature) {
    return axios.post(apiUrl, creature);
}

export function updateCreature(id, creature) {
    return axios.put(apiUrl + "/" + id, creature);
}

export function deleteCreature(id) {
    return axios.delete(apiUrl + "/" + id);
}