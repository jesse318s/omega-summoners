import { useState } from "react";
import Userfront from "@userfront/core";

// initialize Userfront
Userfront.init("rbvqd5nd");

// landing page component
function Home() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountName, setAccountName] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    const handleInputChangeSignup = (e) => {
        try {
            e.preventDefault();
            if (e.target.name === "email") {
                const email = e.target.value;
                setEmail(email);
            } else if (e.target.name === "password") {
                const password = e.target.value;
                setPassword(password);
            } else if (e.target.name === "accountName") {
                const accountName = e.target.value;
                setAccountName(accountName);
            } else {
                const passwordVerify = e.target.value;
                setPasswordVerify(passwordVerify);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitSignup = (e) => {
        try {
            e.preventDefault();
            Userfront.signup({
                method: "password",
                email: email,
                password: password,
                data: {
                    accountName: accountName,
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChangeLogin = (e) => {
        try {
            e.preventDefault();
            if (e.target.name === "email") {
                const email = e.target.value;
                setEmail(email);
            } else {
                const password = e.target.value;
                setPassword(password);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitLogin = (e) => {
        try {
            e.preventDefault();
            Userfront.login({
                method: "password",
                email: email,
                password: password
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <header>
                {/* title and nav */}
                <h1>Welcome to Omega Summoners!</h1>
                <nav>
                    <ul>
                        <li><a href="#login">Login</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </nav>
            </header>

            <main>
                {/* sign up form */}
                <h3>Sign up</h3>
                <form onSubmit={handleSubmitSignup}>
                    <label>
                        Email address:
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleInputChangeSignup}
                        />
                    </label><br />
                    <label>
                        Account name (custom field):
                        <input
                            name="accountName"
                            type="text"
                            value={accountName}
                            onChange={handleInputChangeSignup}
                        />
                    </label><br />
                    <label>
                        Password:
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleInputChangeSignup}
                        />
                    </label><br />
                    <label>
                        Verify password:
                        <input
                            name="passwordVerify"
                            type="password"
                            value={passwordVerify}
                            onChange={handleInputChangeSignup}
                        />
                    </label><br />
                    <button type="submit">Sign up</button>
                </form>
                
                {/* login form */}
                <div id="login">
                    <h3>Login</h3>
                    <form onSubmit={handleSubmitLogin}>
                        <label>
                            Email:
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleInputChangeLogin}
                            />
                        </label><br />
                        <label>
                            Password:
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={handleInputChangeLogin}
                            />
                        </label><br />
                        <button type="submit">Login</button><br />
                    </form>
                </div>

                {/* about section */}
                <div id="about">
                    <h2>About</h2>
                    <p>
                        Omega Summoners is a pet sim MMORPG meant for all platforms.
                    </p>
                </div>

                {/* footer */}
                <footer>
                    <p>
                        &copy; 2021 Jesse Sites. All Rights Reserved.
                    </p>
                </footer>
            </main>
        </>
    );
}

export default Home;