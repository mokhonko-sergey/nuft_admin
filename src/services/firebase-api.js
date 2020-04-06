export default class FirebaseApi {
    _baseUrl = 'https://us-central1-nuft-kebop.cloudfunctions.net';

    // Base methods
    get = async (url, params) => {
        const options = {
            method: 'GET'
        };
        const res = await fetch (`${this._baseUrl}/${url}${params}`, options);
        if(!res.ok){
            throw new Error(`Could not fetch ${this._baseUrl}/${url}, received ${res.status}`);
        };   
        return await res.json();
    };

    del = async (url, item) => {
        const options = {
            method: "DELETE"
        }
        const res = await fetch(`${this._baseUrl}/${url}/${item}`, options);
        return await res.json();
    } 

    //Gallery
    getPics = async (itemsOnPage, starAt) => {
        const params = `?itemOnPage=${itemsOnPage}&start=${starAt}`
        return await this.get('gallery', params);
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


    delPicture = async (itemName) => {
        return await this.del('gallery', itemName);
    }
};