import React from "react";
import Userfront from "@userfront/react";

// initialize Userfront
Userfront.init("rbvqd5nd");

// initialize password reset form
const PasswordResetForm = Userfront.build({ toolId: "brkmoa" });

function Reset() {
    return (
        <>
            {/* reset form */}
            <PasswordResetForm />
        </>
    );
}

export default Reset;