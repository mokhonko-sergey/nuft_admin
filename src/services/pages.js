import { HttpMethods, createAuthHeader } from "./http-methods";

export default class Pages extends HttpMethods {
  constructor() {
    super();
  }

  getPages = async (startAt, itemsOnPage) => {
    const params = `?startAt=${startAt}&itemsOnPage=${itemsOnPage}`;
    const options = {
      method: "GET"
    };
    return await this._get("pages", { params, options });
  };

  deletePage = async (id, token) => {
    const headers = createAuthHeader(token);
    const options = {
      headers
    };
    const query = await this._del("pages", { options, id });
    if (query.success) return query;

    return {
      success: false,
      message: "Can't delete this item"
    };
  };

  editPage = async (id, newData, token) => {
    const headers = createAuthHeader(token);
    const data = JSON.stringify(newData);
    const options = {
      headers,
      body: data
    };

    return await this._put("pages", { id, options });
  };

  createPage = async (data, token) => {
    const headers = createAuthHeader(token);
    const options = {
      headers,
      body: JSON.stringify(data)
    };

    return await this._post("pages", options);
  };

  search = async (q, startAt, itemsOnPage) => {
    const params = `?startAt=${startAt}&itemsOnPage=${itemsOnPage}&q=${q}`;
    const options = {
      method: "GET"
    };
    return await this._get("pages", { params, options });
  };
}
