'use strict'

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
        fetch(`http://localhost:8000${path}?${query}`, {
            credentials: 'include',
            method: 'get',
            headers: {'Content-Type': 'application/json'},
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
module.exports.fetch_get = fetch_get;