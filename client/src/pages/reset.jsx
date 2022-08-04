import { useState } from "react";
import Userfront from "@userfront/core";

// initialize Userfront
Userfront.init("rbvqd5nd");

// reset page component
function Reset() {
  // sets form value state
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  // updates reset form state on form input change
  const handleInputChange = (e) => {
    try {
      e.preventDefault();
      if (e.target.name === "password") {
        const password = e.target.value;
        setPassword(password);
      } else {
        const passwordVerify = e.target.value;
        setPasswordVerify(passwordVerify);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // verifies and resets userfront password
  const handleSubmit = (e) => {
    try {
      if (password !== passwordVerify) {
        alert(
          "Passwords do not match. Please request another password reset at the login page."
        );
      } else {
        e.preventDefault();
        Userfront.resetPassword({
          password: password,
        }).catch((error) => {
          alert(error.message);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className="mt-2 text-light">Password Reset</h2>

      {/* password reset form */}
      <form
        className="text-light justify-content-center mt-1"
        onSubmit={handleSubmit}
      >
        <label>
          Password:
          <input
            className="ms-2 mb-1 text-dark bg-light"
            name="password"
            type="password"
            value={password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Re-type password:
          <input
            className="ms-2 my-1 text-dark bg-light"
            name="passwordVerify"
            type="password"
            value={passwordVerify}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button className="btn btn-primary mt-1 mb-2" type="submit">
          Reset password
        </button>
      </form>
    </>
  );
}

export default Reset;
