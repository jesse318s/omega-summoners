import Userfront from "@userfront/react";

// initialize Userfront
Userfront.init("rbvqd5nd");

// initialize signup and login form
const SignupForm = Userfront.build({ toolId: "odnabd" });
const LoginForm = Userfront.build({ toolId: "knblro" });

// landing page component
function Home() {
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
                {/* signup and login form */}
                <SignupForm />
                <div id="login">
                    <LoginForm />
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
                        &copy; 2021 Omega Summoners by Jesse Sites
                    </p>
                </footer>
            </main>
        </>
    );
}

export default Home;