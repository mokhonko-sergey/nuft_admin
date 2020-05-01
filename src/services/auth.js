import { HttpMethods, createAuthHeader } from "./http-methods";

export default class Auth {
  constructor() {
    this.httpMethods = new HttpMethods();
  }

  isAuthorized = async token => {
    const headers = createAuthHeader(token);
    const options = { headers };

    return await this.httpMethods._get("auth/auth", { options });
  };
}
