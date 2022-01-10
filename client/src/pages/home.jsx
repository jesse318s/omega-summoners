import { useState } from "react";
import "./home.scss";
import Userfront from "@userfront/core";

// initialize Userfront
Userfront.init("rbvqd5nd");

// landing page component
function Home() {

    // sets form value state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

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
            }).catch((error) => {
                alert(error.message);
            });
        } catch (error) {
            console.log(error);
        }
    }

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
            } else {
                e.preventDefault();
                Userfront.signup({
                    method: "password",
                    email: email,
                    password: password
                }).catch((error) => {
                    alert(error.message);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    // sends email to reset userfront password for current user email
    const resetPassword = () => {
        try {
            Userfront.sendResetLink(email).catch((error) => {
                alert(error.message);
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
                            <i className="text-light">{"\u2630"}</i>
                        </button>

                        {/* Collapsible wrapper */}
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {/* Navbar brand */}
                            <a className="navbar-brand" href="/">
                                <img src="favicon.ico" alt="favicon" width="48px" height="48px" />
                            </a>
                            {/* Left links */}
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item font-weight-bold">
                                    <a className="nav-link" href="/">Home</a>
                                </li>
                                <li className="nav-item font-weight-bold">
                                    <a className="nav-link" href="#gameplay">Gameplay</a>
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
                            <ul className="navbar-nav">
                                <li className="nav-item font-weight-bold">
                                    <a className="mx-2 nav-link" href="#login_signup">Login / Sign up</a>
                                </li>
                            </ul>
                        </div>
                        {/* Right elements */}
                    </div>
                    {/* Container wrapper */}
                </nav>
                {/* Navbar */}
            </header>

            <main>
                {/* shooting star background */}
                <div className="stars">
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                </div>
                {/* title and home */}
                <section className="home_section">
                    <h1 className="mx-2 home_title blink">Welcome to Omega Summoners!</h1>
                </section>

                {/* login form */}
                <section id="login_signup" className="d-flex justify-content-center">
                    <div className="card my-2 col-sm-5">
                        <form className="card-body" onSubmit={handleSubmitLogin}>
                            <h2 className="card-title">Login</h2>
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
                            <button className="btn btn-primary my-1" type="submit">Login</button>
                            <button className="btn btn-primary my-1 ms-1" onClick={resetPassword}>Reset Password</button><br />
                        </form>
                    </div>
                </section>

                {/* sign up form */}
                <section className="d-flex justify-content-center">
                    <div className="card my-2 col-sm-5">
                        <form className="card-body" onSubmit={handleSubmitSignup}>
                            <h2 className="card-title">Sign up</h2>
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
                            <button className="btn btn-primary my-1" type="submit">Sign up</button>
                        </form>
                    </div>
                </section>

                {/* gameplay section */}
                <section className="mx-2" id="gameplay">
                    <h2 className="mt-4 mb-3 text-light">Gameplay</h2>
                    {/* Carousel wrapper */}
                    <div
                        id="carouselBasicExample"
                        className="carousel slide carousel-fade"
                        data-mdb-ride="carousel"
                    >
                        {/* Indicators */}
                        <div className="carousel-indicators">
                            <button
                                type="button"
                                data-mdb-target="#carouselBasicExample"
                                data-mdb-slide-to="0"
                                className="active"
                                aria-current="true"
                                aria-label="Slide 1"
                            ></button>
                            <button
                                type="button"
                                data-mdb-target="#carouselBasicExample"
                                data-mdb-slide-to="1"
                                aria-label="Slide 2"
                            ></button>
                            <button
                                type="button"
                                data-mdb-target="#carouselBasicExample"
                                data-mdb-slide-to="2"
                                aria-label="Slide 3"
                            ></button>
                        </div>

                        {/* Inner */}
                        <div className="carousel-inner">
                            {/* Single item */}
                            <div className="carousel-item active">
                                <img
                                    src="img/screenshot/screenshot1.webp"
                                    className="d-block w-100"
                                    alt="Gameplay screenshot desktop"
                                />
                                <div className="carousel-caption d-none d-md-block">
                                    <h2>A Traditional, Turn-Based RPG Experience</h2>
                                    <p>
                                        Utilize your skills and stats to defeat enemies and gain loot.
                                    </p>
                                </div>
                            </div>

                            {/* Single item */}
                            <div className="carousel-item">
                                <img
                                    src="img/screenshot/screenshot2.webp"
                                    className="d-block w-100"
                                    alt="Gameplay screenshot mobile"
                                />
                                <div className="carousel-caption d-none d-md-block">
                                    <h2>Multi-Platform</h2>
                                    <p>
                                        Desktop, mobile, and tablet versions. Play anywhere!
                                    </p>
                                </div>
                            </div>

                            {/* Single item */}
                            <div className="carousel-item">
                                <img
                                    src="img/screenshot/screenshot3.webp"
                                    className="d-block w-100"
                                    alt="Gameplay screenshot other"
                                />
                                <div className="carousel-caption d-none d-md-block">
                                    <h2>Signature Moves</h2>
                                    <p>
                                        Summons have a unique set of skills that can be used to defeat enemies.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Inner */}

                        {/* Controls */}
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-mdb-target="#carouselBasicExample"
                            data-mdb-slide="prev"
                        >
                            <span className="font_large" aria-hidden="true">{"\u276E"}</span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-mdb-target="#carouselBasicExample"
                            data-mdb-slide="next"
                        >
                            <span className="font_large" aria-hidden="true">{"\u276F"}</span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    {/* Carousel wrapper */}
                </section>

                {/* about section */}
                <section className="mx-2" id="about">
                    <h2 className="mt-4 text-light">About</h2>
                    <p className="text-light">
                        Omega Summoners is a simple, online RPG meant for all platforms. Greek mythology takes a special place in the game.
                        The player is a mortal, chosen by the gods to summon creatures from the heavens, and must fight the evil that escapes from the depths of the Underworld.
                        The gameplay is simple, and the player can battle enemies, or perform a variety of tasks to gain power and riches.<br />
                        Omega Summoners is not recommended for children under the age of 13, or those with photosensitive epilepsy.
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