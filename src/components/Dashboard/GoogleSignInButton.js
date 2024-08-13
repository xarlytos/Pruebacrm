import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = '356258335141-35o76g0dv4mlkc84akbfdsh5pfaapg6g.apps.googleusercontent.com';

function GoogleSignInButton({ onSuccess, googleUser }) {
  const onFailure = (res) => {
    console.log('[Login Failed] res:', res);
  };

  return googleUser ? (
    <div>{googleUser.email}</div>
  ) : (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      style={{ marginTop: '100px' }}
      isSignedIn={true}
    />
  );
}

export default GoogleSignInButton;
