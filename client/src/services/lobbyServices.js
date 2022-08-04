import axios from "axios";
import Userfront from "@userfront/core";
const apiUrl = "http://localhost:8080/api/lobby";
Userfront.init("rbvqd5nd");

// retrieves lobby by id, and refreshes the lobby
export function getLobby(id) {
  return axios.get(apiUrl + "/" + id, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
    },
  });
}

// updates lobby by id
export function updateLobby(id, Lobby) {
  return axios.put(apiUrl + "/" + id, Lobby, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
      Userkey: Userfront.user.data.userkey,
      Userid: Userfront.user.userId,
    },
  });
}
