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
    }
}