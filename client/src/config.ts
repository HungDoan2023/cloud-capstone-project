// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = "bkpgrwaoea";
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`;

export const authConfig = {
  domain: "dev-24rmhuqbivfbg1bo.us.auth0.com", // Auth0 domain
  clientId: "EKefCMG0l2uAzPdLXguYGJLVH1f6Y1yY", // Auth0 client id
  callbackUrl: "http://localhost:3000/callback",
};
