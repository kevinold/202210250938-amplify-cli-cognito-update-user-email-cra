// App.js
import { Button, Flex, Heading, TextField, View, withAuthenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import { Amplify, Auth } from "aws-amplify";
import React, { useState } from "react";

import awsconfig from "./aws-exports";

Amplify.configure(awsconfig)

async function updateUserEmail () {
  const user = await Auth.currentAuthenticatedUser();
  await Auth.updateUserAttributes(user, {
     'email': 'kevold+updated@amazon.com',
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
    <Flex>
      <View>
        <TextField
          descriptiveText="Enter the validation code sent to the new email address"
          label="Verification Code"
          onChange={(e) => setValidationCode(e.currentTarget.value)}
        />
        <Button onClick={() => verifyEmailValidationCode(validationCode)}>Submit Validation Code</Button>
      </View>
    </Flex>
  )
}

function App({ signOut, user }) {
  const [showValidationCodeUI, setShowValidationCodeUI] = useState(false)

  async function triggerUpdateUserEmail () {
    await updateUserEmail()
    setShowValidationCodeUI(true)
  }

  return (
      <View margin={50}>
        <Flex marginBottom={50}>
          <Heading level={2}>
            Welcome {user.attributes.email}
          </Heading>
          <Button onClick={signOut}>Sign out</Button>
        </Flex>

        <View>
          {!showValidationCodeUI && <Button onClick={triggerUpdateUserEmail}>Update Email</Button>}
          {showValidationCodeUI && <ValidationCodeForm />}
        </View>
      </View>
  );
}

export default withAuthenticator(App)