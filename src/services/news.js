import { HttpMethods, createAuthHeader } from "./http-methods";

export default class News {
  constructor() {
    this.httpMethods = new HttpMethods();
  }

  getNews = async (startAt, itemsOnPage) => {
    const params = `?startAt=${startAt}&itemsOnPage=${itemsOnPage}`;
    const options = {
      method: "GET"
    };
    return await this.httpMethods._get("news", { params, options });
  };

  deleteNews = async (id, token) => {
    const headers = createAuthHeader(token);
    const options = {
      headers
    };
    const query = await this.httpMethods._del("news", { options, id });
    if (query.success) return query;

    return {
      success: false,
      message: "Can't delete this item"
    };
  };

  editNews = async (id, newData, token) => {
    const headers = createAuthHeader(token);
    const data = JSON.stringify(newData);
    const options = {
      headers,
      body: data
    };

    return await this.httpMethods._put("news", { id, options });
  };

  createNews = async (data, token) => {
    const headers = createAuthHeader(token);
    const options = {
      headers,
      body: JSON.stringify(data)
    };

    return await this.httpMethods._post("news", options);
  };

  search = async (q, startAt, itemsOnPage) => {
    const params = `?startAt=${startAt}&itemsOnPage=${itemsOnPage}&q=${q}`;
    const options = {
      method: "GET"
    };
    return await this.httpMethods._get("news", { params, options });
  };
}
