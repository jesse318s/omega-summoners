import axios from "axios";
import Userfront from "@userfront/core";

// api url varies between development and production
const apiUrl = "http://localhost:8080/api/connection";

Userfront.init("rbvqd5nd");

// retrieves the lobby connections, and refreshes connections
export function getConnections() {
  return axios.get(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
    },
  });
}

// adds a connection to lobby
export function addConnection(connection) {
  return axios.post(apiUrl, connection, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
    },
  });
}
