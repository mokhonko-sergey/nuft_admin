export default class FirebaseApi {
    _baseUrl = 'https://us-central1-nuft-kebop.cloudfunctions.net';

    // Base methods
    _get = async (url, { params, options }) => {
        params = params || '';
        const res = await fetch (`${this._baseUrl}/${url}${params}`, options);
        if(!res.ok){
            throw new Error(`Could not fetch ${this._baseUrl}/${url}, received ${res.status}`);
        };   
        return await res.json();
    };

    _del = async (url, itemId) => {
        const options = {
            method: "DELETE"
        }
        const res = await fetch(`${this._baseUrl}/${url}/${itemId}`, options);
        return await res.json();
    } 

    //Gallery
    getPics = async (itemsOnPage, starAt) => {
        const params = `?itemOnPage=${itemsOnPage}&start=${starAt}`
        return await this._get('gallery', { params });
    };

    uploadPicture = async (file, desc) => {
        const formdata = new FormData();
        formdata.append("file", file);
        
        const options = {
            method: "POST",
            body: formdata
          };

        const res = await fetch(`${this._baseUrl}/gallery?description=${desc}`, options);

        return await res.json();
    }

    delPicture = async (itemId) => {
        return await this._del('gallery', itemId);
    }

    //Auth
    isAuthorized = async (token) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const options = {
            headers: myHeaders
        }
        return await this._get('auth/auth', { options });
    };
};