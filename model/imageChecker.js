let fs = require('fs');

module.exports = {
    checkPNG: function checkPNG(bin_data) {
        let data = Buffer.from(bin_data).slice(0, 8);
        if (data.toString('hex') != '89504e470d0a1a0a') {
            return (false);
        } else {
            return (true);
        }
    },
    checkJPG: function checkJPG(bin_data) {
        let data = Buffer.from(bin_data).slice(0, 2);
        if (data.toString('hex') != 'ffd8') {
            return (false);
        } else {
            return (true);
        }
    },
    checkImg: function checkImg(path, mimetype) {
        return (new Promise((resolve, reject) => {
            if (!fs.existsSync(path)) {
                reject('No file');
            }
            fs.readFile(path, (err, data) => {
                if (err) {
                    console.log(err);
                    reject('Failed to read file');
                } else if (mimetype === 'image/png' && this.checkPNG(data)) {
                    resolve(true);
                } else if ((mimetype === 'image/jpg' || mimetype === 'image/jpeg') && this.checkJPG(data)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        }))
    }
}