import { HttpMethods, createAuthHeader } from "./http-methods";

export default class Auth extends HttpMethods {
  constructor() {
    super();
  }

  isAuthorized = async token => {
    const headers = createAuthHeader(token);
    const options = { headers };

    return await this._get("auth/auth", { options });
  };
}
