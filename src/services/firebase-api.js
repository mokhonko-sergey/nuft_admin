export default class FirebaseApi {
  _baseUrl = "https://us-central1-nuft-kebop.cloudfunctions.net";

  // Base methods
  _get = async (url, { params, options }) => {
    params = params || "";
    const res = await fetch(`${this._baseUrl}/${url}${params}`, options);
    return await res.json();
  };

  _post = async (url, options) => {
    const reqOptions = {
      method: "POST",
      ...options
    };

    const res = await fetch(`${this._baseUrl}/${url}`, reqOptions);
    return await res.json();
  };

  _del = async (url, { options, id }) => {
    options = {
      method: "DELETE",
      ...options
    };
    const res = await fetch(`${this._baseUrl}/${url}/${id}`, options);
    return await res.json();
  };

  _put = async (url, { id, options }) => {
    const reqOptions = {
      method: "PUT",
      ...options
    };

    const res = await fetch(`${this._baseUrl}/${url}/${id}`, reqOptions);
    return await res.json();
  };

  // =================================================================//

  _createAuthHeader = token => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("content-type", "application/json");
    return myHeaders;
  };

  //Gallery
  getPics = async (itemsOnPage, starAt) => {
    const params = `?itemOnPage=${itemsOnPage}&start=${starAt}`;
    return await this._get("gallery", { params });
  };

  uploadPicture = async (file, desc) => {
    const formdata = new FormData();
    formdata.append("file", file);

    const options = {
      method: "POST",
      body: formdata
    };

    const res = await fetch(
      `${this._baseUrl}/gallery?description=${desc}`,
      options
    );

    return await res.json();
  };

  delPicture = async itemId => {
    return await this._del("gallery", itemId);
  };

  //Auth
  isAuthorized = async token => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const options = {
      headers: myHeaders
    };
    return await this._get("auth/auth", { options });
  };

  //Users
  getAllUsers = async token => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const options = {
      method: "GET",
      headers: myHeaders
    };
    const query = await this._get("auth", { options });
    if (query.success) return query.result;

    return query.message;
  };

  delUser = async (id, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const options = {
      headers: myHeaders
    };

    return await this._del("auth", { options, id });
  };

  createNewUser = async (token, user) => {
    const authHeader = this._createAuthHeader(token);
    const data = JSON.stringify(user);

    const options = {
      headers: authHeader,
      body: data
    };

    return await this._post("auth", options);
  };

  updateUserInfo = async (token, newUserData) => {
    const authHeader = this._createAuthHeader(token);
    const data = JSON.stringify(newUserData);

    const options = {
      headers: authHeader,
      body: data
    };

    const id = newUserData.uid;

    return await this._put("auth", { id, options });
  };

  //News
  getNews = async (startAt, itemsOnPage) => {
    const params = `?startAt=${startAt}&itemsOnPage=${itemsOnPage}`;
    const options = {
      method: "GET"
    };
    return await this._get("news", { params, options });
  };

  deleteNews = async (id, token) => {
    const headers = this._createAuthHeader(token);
    const options = {
      headers
    };
    const query = await this._del("news", { options, id });
    if (query.success) return query;

    return {
      success: false,
      message: "Can't delete this item"
    };
  };

  editNews = async (id, newData, token) => {
    const headers = this._createAuthHeader(token);
    const data = JSON.stringify(newData);
    const options = {
      headers,
      body: data
    };

    return await this._put("news", { id, options });
  };

  createNews = async (data, token) => {
    const headers = this._createAuthHeader(token);
    const options = {
      headers,
      body: JSON.stringify(data)
    };

    return await this._post("news", options);
  };

  search = async (q, startAt, itemsOnPage) => {
    const params = `?startAt=${startAt}&itemsOnPage=${itemsOnPage}&q=${q}`;
    const options = {
      method: "GET"
    };
    return await this._get("news", { params, options });
  };
}
