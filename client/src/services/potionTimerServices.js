import axios from "axios";
import Userfront from "@userfront/core";

// api url varies between development and production
const apiUrl = "http://localhost:8080/api/potionTimer";

Userfront.init("rbvqd5nd");

// gets player potion timer, and refreshes potion timers
export function getPotionTimer() {
  return axios.get(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
    },
  });
}

// adds player potion timer
export function addPotionTimer(potionTimer) {
  return axios.post(apiUrl, potionTimer, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Userfront.accessToken()}`,
      Userkey: Userfront.user.data.userkey,
      Userid: Userfront.user.userId,
    },
  });
}
