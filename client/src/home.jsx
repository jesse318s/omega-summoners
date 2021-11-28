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
            {/* title */}
            <h1>Welcome to Omega Summoners!</h1>

            {/* signup and login form */}
            <SignupForm />
            <LoginForm />
        </>
    );
}

export default Home;