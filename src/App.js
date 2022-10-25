// App.js
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import { Amplify, Auth } from "aws-amplify";
import React, { useState } from "react";

import awsconfig from "./aws-exports";

Amplify.configure(awsconfig)

async function updateUserEmail () {
  const user = await Auth.currentAuthenticatedUser();
  await Auth.updateUserAttributes(user, {
     'email': 'updatedEmail@mydomain.com',
  }).then(() => {
     console.log('a verification code is sent');
  }).catch((e) => {
     console.log('failed with error', e);
  });
}

async function verifyEmailValidationCode (code) {
  await Auth.verifyCurrentUserAttributeSubmit('email', code)
  .then(() => {
     console.log('email verified');
  }).catch((e) => {
     console.log('failed with error', e);
  });
}

function ValidationCodeForm() {
  const [validationCode, setValidationCode] = useState(null)
  return(
    <div>
      <label>
        Verification Code (sent to the new email):
        <input onChange={(e) => { setValidationCode(e.target.value)}} type="text" name="vc" />
      </label>
      <button onClick={() => verifyEmailValidationCode(validationCode)}>Send Code</button>
    </div>
  )
}

export default function App() {
  const [showValidationCodeUI, setShowValidationCodeUI] = useState(false)
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <h2>
            Welcome {user.attributes.email}
          </h2>
          {showValidationCodeUI === false && <button onClick={async () => {
            await updateUserEmail()
            setShowValidationCodeUI(true)
          }}>Update Email</button>}
          {showValidationCodeUI === true && <ValidationCodeForm />}
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}