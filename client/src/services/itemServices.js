import axios from "axios";
import Userfront from "@userfront/core";

// api url varies between development and production
const apiUrl = "http://localhost:8080/api/item";

Userfront.init("rbvqd5nd");

// retrieves player items
export function getItems() {
  return axios.get(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
    },
  });
}

// adds player item
export function addItem(item) {
  return axios.post(apiUrl, item, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
      Userkey: Userfront.user.data.userkey,
      Userid: Userfront.user.userId,
    },
  });
}
