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

  //action: new, remove, update;
  updateCount = async ({ id, table, action, token, oldId, itemsCount = 1 }) => {
    if (!id || !table) return;

    //download data
    const arr = await this.getCategories(table);
    const elNew = arr.data.find(el => el.id === id);

    if (action === "new" || action === "update") {
      await this.updateCategory(
        { table, id },
        { count: parseInt(elNew.count) + itemsCount },
        token
      );
    }

    let oldEl;
    if (oldId) oldEl = arr.data.find(el => el.id === oldId);
    if (oldId && !oldEl) return;

    if (action === "remove" || action === "update") {
      const computedId = oldId ? oldId : id;
      const el = oldEl ? oldEl : elNew;
      let count = parseInt(el.count) - itemsCount;
      count = count < 0 ? 0 : count;
      await this.updateCategory({ table, id: computedId }, { count }, token);
    }

    return;
  };
}
