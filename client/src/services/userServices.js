import axios from "axios";
import Userfront from "@userfront/core";
// api url varies between development and production
const apiUrl = "http://localhost:8080/api/user";
Userfront.init("rbvqd5nd");

// gets user player data
export function getUser() {
  return axios.get(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
    },
  });
}

// adds new user player data
export function addUser(user) {
  return axios.post(apiUrl, user, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
    },
  });
}

// updates user player data
export function updateUser(id, user) {
  return axios.put(apiUrl + "/" + id, user, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
      Userkey: Userfront.user.data.userkey,
    },
  });
}
