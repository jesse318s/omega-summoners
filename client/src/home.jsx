import { useState } from "react";
import Userfront from "@userfront/core";

// initialize Userfront
Userfront.init("rbvqd5nd");

// landing page component
function Home() {

    // sets form value state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    // updates sign up form state on form input change
    const handleInputChangeSignup = (e) => {
        try {
            e.preventDefault();
            if (e.target.name === "email") {
                const email = e.target.value;
                setEmail(email);
            } else if (e.target.name === "password") {
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

    // verifies password input and creates new userfront user
    const handleSubmitSignup = (e) => {
        try {
            if (password !== passwordVerify) {
                alert("Passwords do not match.");
                return;
            } else {
                e.preventDefault();
                Userfront.signup({
                    method: "password",
                    email: email,
                    password: password
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    // updates login form state on form input change
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

    // logs in userfront user
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
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top text-start">
                    {/* Container wrapper */}
                    <div className="container-fluid">
                        {/* Toggle button */}
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-mdb-toggle="collapse"
                            data-mdb-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <i className="fas fa-bars"></i>
                        </button>

                        {/* Collapsible wrapper */}
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {/* Navbar brand */}
                            <a className="navbar-brand" href="/">
                                <img src="favicon.ico" alt="favicon" />
                            </a>
                            {/* Left links */}
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item font-weight-bold">
                                    <a className="nav-link" href="/">Home</a>
                                </li>
                                <li className="nav-item font-weight-bold">
                                    <a className="nav-link" href="#about">About</a>
                                </li>
                            </ul>
                            {/* Left links */}
                        </div>
                        {/* Collapsible wrapper */}

                        {/* Right elements */}
                        <div className="d-flex align-items-center">
                        <a className="mx-2 font-weight-bold" href="#login">Login / Sign up</a>
                        </div>
                        {/* Right elements */}
                    </div>
                    {/* Container wrapper */}
                </nav>
                {/* Navbar */}
            </header>

            <main>
                {/* title and home */}
                <section className="home_section">
                    <h1 className="mx-2 home_title blink">Welcome to Omega Summoners!</h1>
                </section>

                {/* login form */}
                <section id="login" className="d-flex justify-content-center">
                    <div className="card my-2 col-sm-4">
                        <form className="card-body text-start" onSubmit={handleSubmitLogin}>
                            <h3 className="card-title">Login</h3>
                            <label className="my-1 card-text">
                                Email:
                                <input
                                    className="ms-2"
                                    name="email"
                                    type="email"
                                    value={email}
                                    autoComplete="email"
                                    onChange={handleInputChangeLogin}
                                />
                            </label><br />
                            <label className="my-1 card-text">
                                Password:
                                <input
                                    className="ms-2"
                                    name="password"
                                    type="password"
                                    value={password}
                                    autoComplete="new-password"
                                    onChange={handleInputChangeLogin}
                                />
                            </label><br />
                            <button className="btn btn-primary my-1" type="submit button">Login</button><br />
                        </form>
                    </div>
                </section>

                {/* sign up form */}
                <section className="d-flex justify-content-center">
                    <div className="card my-2 col-sm-4">
                        <form className="card-body text-start" onSubmit={handleSubmitSignup}>
                            <h3 className="card-title">Sign up</h3>
                            <label className="my-1 card-text">
                                Email address:
                                <input
                                    className="ms-2"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={handleInputChangeSignup}
                                />
                            </label><br />
                            <label className="my-1 card-text">
                                Password:
                                <input
                                    className="ms-2"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={handleInputChangeSignup}
                                />
                            </label><br />
                            <label className="my-1 card-text">
                                Verify password:
                                <input
                                    className="ms-2"
                                    name="passwordVerify"
                                    type="password"
                                    autoComplete="current-password"
                                    value={passwordVerify}
                                    onChange={handleInputChangeSignup}
                                />
                            </label><br />
                            <button className="btn btn-primary my-1" type="submit button">Sign up</button>
                        </form>
                    </div>
                </section>

                {/* about section */}
                <section className="mx-2" id="about">
                    <h2 className="mt-4 text-light">About</h2>
                    <p className="text-light">
                        Omega Summoners is a simple, online RPG meant for all platforms. It is not recommended for children, or those with photosensitive epilepsy.<br />
                        Greek mythology takes a special place in the game.
                        The player is a mortal, chosen by the gods to summon creatures from the heavens, and must fight the evil that escapes from the depths of the Underworld.
                        The gameplay is simple, and the player can battle enemies, or perform a variety of tasks to gain power and riches.
                    </p>
                </section>

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