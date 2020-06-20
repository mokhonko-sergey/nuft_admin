import { HttpMethods } from "./http-methods";

export default class Auth extends HttpMethods {
  constructor() {
    super();
    this.API = "AIzaSyDPVe9o2n2NxVSKQdg7-zNjLNWyxHwCTQc";
  }

  signIn = async (email, password) => {
    const params = `?api=${this.API}`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options = {
      headers,
      body: JSON.stringify({
        email,
        password
      })
    };

    return await this._post(`auth/sign-in${params}`, options);
  };

  refreshToken = async refreshToken => {
    const params = `?api=${this.API}`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options = {
      headers,
      body: JSON.stringify({
        refreshToken
      })
    };

    return await this._post(`auth/refresh-token${params}`, options);
  };
}
