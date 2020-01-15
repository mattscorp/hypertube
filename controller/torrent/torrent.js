'use strict'

const https = require("https");
const request = require("request");

// Select functionning API
const selected_source = () => {
    return new Promise((resolve, reject) => {
        const sources = ["https://yst.am/api/v2", "https://yts.lt/api/v2"];
        let selectedSource = sources[1];
        https.get('https://yts.lt/api/v2/list_movies.json', (res) => {
            if (res.statusCode !== 200) {
                selectedSource = sources[0];
                resolve(selectedSource);
            } else {
                resolve(selectedSource)
            }
        });
    });
}

// Search the API to return infos and the magnet
const get_magnet = async (movie_infos) => {
    return new Promise(async (resolve, reject) => {
        let selectedSource = await selected_source();
        request.get({url: `${selectedSource}/list_movies.json?query_term=${movie_infos.imdb_id}&limit=1`}, async (err, results, body) => {
            if (err) {
                console.log('Error 1 : ' + err);
                resolve({ success: false });
            } else if (JSON.parse(body).status == 'ok') {
                const parseBody = JSON.parse(body.replace(/^\ufeff/g,""));
                if (parseBody && parseBody.data && parseBody.data.movies && parseBody.data.movies[0]) {
                    resolve(parseBody.data.movies[0].torrents)
                } else resolve({ success: false })
            } else {
                console.log('Error 2 : ' + err);
                resolve({ success: false });
            }
        })
    });
}
module.exports.get_magnet = get_magnet;