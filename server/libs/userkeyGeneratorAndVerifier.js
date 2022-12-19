const axios = require("axios");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const options = {
  headers: {
    Accept: "*/*",
    Authorization: `Bearer ${process.env.USERFRONT_KEY}`,
  },
};

module.exports = {
  // updates userkey data for user
  putUserkey(userId, payload) {
    return axios
      .put("https://api.userfront.com/v0/users/" + userId, payload, options)
      .catch((err) => console.error(err));
  },

  // generates new userkey
  generateUserkey(userId) {
    crypto.randomBytes(127, (err, buf) => {
      if (err) {
        console.log(err);
        return;
      }
      const payload = {
        data: {
          userkey: buf.toString("hex"),
        },
      };
      module.exports.putUserkey(userId, payload);
    });
  },

  // generates new userkey with additional secure values included
  generateFortifiedUserkey(userId) {
    crypto.randomBytes(127, (err, buf) => {
      if (err) {
        console.log(err);
        return;
      }
      const payload = {
        data: {
          userkey: uuidv4() + buf.toString("hex"),
        },
      };
      module.exports.putUserkey(userId, payload);
    });
  },

  // checks if userkey from sender matches userkey from stored user data
  async verifyUserkey(decodedUser, receivedUserkey) {
    try {
      const user = await axios
        .get(
          "https://api.userfront.com/v0/users/" + decodedUser.userId,
          options
        )
        .then((response) => {
          return response.data;
        })
        .catch((err) => console.error(err));

      if (decodedUser && receivedUserkey === user.data.userkey) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};
