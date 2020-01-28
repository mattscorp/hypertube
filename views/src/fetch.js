const axios = require('axios').default;

const fetch_post = async (path, body) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8000${path}`, {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        .then((res) => {
            if (res.status === 401)
                window.location.assign('/');
            else if (res.status === 403)
                resolve('403');
            else
                resolve(res.json());
        })
        .catch((err) => { throw err });
    });
}
module.exports.fetch_post = fetch_post;

const fetch_get = async (path, query) => {
    
    return new Promise((resolve, reject) => {
        const URL = `http://localhost:8000${path}?${query}`;
        const config = {
            withCredentials: true,
            headers: {'Content-Type': 'application/json'},
        };
        axios.get(URL, config)
        .then((res) => {
            console.log(res)
            alert(res)
            if (res.status && res.status === 401)
                window.location.assign('/');
            else if (res.status && res.status === 403)
                resolve('403');
            else
                resolve(res.json());
        })
        .catch((err) => { throw err });
    });
}
module.exports.fetch_get = fetch_get;