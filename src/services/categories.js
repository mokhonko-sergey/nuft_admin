import { HttpMethods, createAuthHeader } from "./http-methods";

export default class Categories extends HttpMethods {
  constructor() {
    super();
  }

  getCategories = async table => {
    return await this._get(`categories/${table}`);
  };

  addCategory = async ({ table, title }, token) => {
    const headers = createAuthHeader(token);
    const options = { headers, body: JSON.stringify({ title, table }) };
    return await this._post("categories", options);
  };

  updateCategory = async ({ table, id }, { title, count }, token) => {
    const headers = createAuthHeader(token);
    const options = {
      headers,
      body: JSON.stringify({ title, count: new String(count) })
    };
    return await this._put(`categories/${table}`, { id, options });
  };

  delCategory = async ({ table, id }, token) => {
    const headers = createAuthHeader(token);
    const options = { headers };
    return await this._del(`categories/${table}`, { id, options });
  };
}
