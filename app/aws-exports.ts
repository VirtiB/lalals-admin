const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID ?? "",
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_APP_CLIENT_ID ?? "",
      identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID ?? "",
      mfa: { status: "on", totpEnabled: true, smsEnabled: true },
      loginWith: { email: false, username: true },
    },
  },
};

export default awsconfig;
