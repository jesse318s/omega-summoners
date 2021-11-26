import React from "react";
import Userfront from "@userfront/react";

Userfront.init("rbvqd5nd");

const PasswordResetForm = Userfront.build({ toolId: "brkmoa" });

function Reset() {
    return (
        <>
            <PasswordResetForm />
        </>
    );
}

export default Reset;