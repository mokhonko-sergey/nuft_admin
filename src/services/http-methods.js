class HttpMethods {
  constructor() {
    this._baseUrl = "https://us-central1-nuft-kebop.cloudfunctions.net";
  }

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
}

function createAuthHeader(token) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("content-type", "application/json");
  return myHeaders;
}

export { HttpMethods, createAuthHeader };
