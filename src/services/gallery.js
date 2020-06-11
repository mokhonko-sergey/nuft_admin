import { HttpMethods, createAuthHeader } from "./http-methods";

export default class Gallery extends HttpMethods {
  constructor() {
    super();
  }

  getPics = async (itemsOnPage, starAt) => {
    const params = `?itemOnPage=${itemsOnPage}&start=${starAt}`;
    return await this._get("gallery", { params });
  };

  uploadPicture = async ({ file, desc, category }) => {
    const formdata = new FormData();
    formdata.append("file", file);

    return await this._post(
      `gallery/?description=${desc}&category=${category}`,
      {
        body: formdata
      }
    );
  };

  delPicture = async id => {
    return await this._del("gallery", { id });
  };
}
