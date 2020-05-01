import { HttpMethods, createAuthHeader } from "./http-methods";

export default class Users {
  constructor() {
    this.httpMethods = new HttpMethods();
  }

  getAllUsers = async token => {
    const authHeader = createAuthHeader(token);
    const options = {
      method: "GET",
      headers: authHeader
    };
    const query = await this.httpMethods._get("auth", { options });
    if (query.success) return query.result;

    return query.message;
  };

  delUser = async (id, token) => {
    const authHeader = createAuthHeader(token);
    const options = {
      headers: authHeader
    };

    return await this.httpMethods._del("auth", { options, id });
  };

  createNewUser = async (token, user) => {
    const authHeader = createAuthHeader(token);
    const data = JSON.stringify(user);

    const options = {
      headers: authHeader,
      body: data
    };

    return await this.httpMethods._post("auth", options);
  };

  updateUserInfo = async (token, newUserData) => {
    const authHeader = createAuthHeader(token);
    const data = JSON.stringify(newUserData);

    const options = {
      headers: authHeader,
      body: data
    };

    const id = newUserData.uid;

    return await this.httpMethods._put("auth", { id, options });
  };
}
