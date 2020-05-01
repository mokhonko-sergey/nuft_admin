import { HttpMethods, createAuthHeader } from "./http-methods";

export default class Gallery {
  constructor() {
    this.httpMethods = new HttpMethods();
  }

  getPics = async (itemsOnPage, starAt) => {
    const params = `?itemOnPage=${itemsOnPage}&start=${starAt}`;
    return await this.httpMethods._get("gallery", { params });
  };

  uploadPicture = async (file, desc) => {
    const formdata = new FormData();
    formdata.append("file", file);

    return await this.httpMethods._post(`gallery/?description=${desc}`, {
      body: formdata
    });
  };

  delPicture = async id => {
    return await this.httpMethods._del("gallery", { id });
  };
}
