// App.js
import { Button, Flex, Heading, Text, TextField, View, withAuthenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import { Auth } from "aws-amplify";
import React, { useState } from "react";

async function updateUserEmail (newEmail) {
  const user = await Auth.currentAuthenticatedUser();
  await Auth.updateUserAttributes(user, {
    'email': newEmail
  }).then(() => {
     console.log('a verification code is sent');
  }).catch((e) => {
     console.log('failed with error', e);
  });
}

async function verifyEmailValidationCode ({ validationCode, setShowValidationCodeUI, setEmailVerified} ) {
  await Auth.verifyCurrentUserAttributeSubmit('email', validationCode)
  .then(() => {
     console.log('email verified');
     setShowValidationCodeUI(false)
     setEmailVerified(true)
  }).catch((e) => {
     console.log('failed with error', e);
  });
}

function ValidationCodeForm({ setShowValidationCodeUI, setEmailVerified }) {
  const [validationCode, setValidationCode] = useState(null)

  return(
    <Flex>
      <View>
        <TextField
          descriptiveText="Enter the validation code sent to the new email address"
          label="Verification Code"
          onChange={(e) => setValidationCode(e.currentTarget.value)}
        />
        <Button onClick={() => verifyEmailValidationCode({validationCode, setShowValidationCodeUI, setEmailVerified})}>Submit Validation Code</Button>
      </View>
    </Flex>
  )
}

function UpdateEmailForm({ setShowValidationCodeUI }) {
  const [email, setEmail] = useState(null)

  async function triggerUpdateUserEmail () {
    await updateUserEmail(email)
    setShowValidationCodeUI(true)
  }

  return(
    <Flex>
      <View>
        <TextField
          descriptiveText="Enter the new email address"
          label="Email Address"
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <Button onClick={triggerUpdateUserEmail}>Update Email</Button>
      </View>
    </Flex>
  )
}

function App({ signOut, user }) {
  const [showValidationCodeUI, setShowValidationCodeUI] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  return (
      <View margin={50}>
        <Flex marginBottom={50}>
          <Heading level={2}>
            Welcome {user.attributes.email}
          </Heading>
          <Button onClick={signOut}>Sign out</Button>
        </Flex>

        <View>
          {emailVerified && <View margin={50}><Text>Email Verified!</Text></View>}
          {!showValidationCodeUI && <UpdateEmailForm setShowValidationCodeUI={setShowValidationCodeUI} />}
          {showValidationCodeUI && <ValidationCodeForm setShowValidationCodeUI={setShowValidationCodeUI} setEmailVerified={setEmailVerified} />}
        </View>
      </View>
  );
}

export default withAuthenticator(App)