import { useState } from "react";
import Userfront from "@userfront/core";

// initialize Userfront
Userfront.init("rbvqd5nd");

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
    }

    // resets userfront password
    const handleSubmit = (e) => {
        try {
            if (password !== passwordVerify) {
                alert("Passwords do not match.");
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
    }

    return (
        <>
            {/* password reset form */}
            <div>
                <form className="text-light text-start" onSubmit={handleSubmit}>
                    <label className="mt-5">
                        Password:
                        <input
                            className="mx-1"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleInputChange}
                        />
                    </label><br />
                    <label className="mt-1">
                        Re-type password:
                        <input
                            className="mx-1"
                            name="passwordVerify"
                            type="password"
                            value={passwordVerify}
                            onChange={handleInputChange}
                        />
                    </label><br />
                    <button className="btn btn-primary mt-1" type="submit">Reset password</button>
                </form>
            </div>
        </>
    );
}

export default Reset;