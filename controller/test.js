const ffmpeg = require('ffmpeg');

const path = '/sgoinfre/goinfre/Perso/pvictor/hypertube3/views/public/torrents/The.Irishman.2019.WEBRip.X264-MEGABOX[rarbg]/The.Irishman.2019.WEBRip.X264-MEGABOX.mkv';
const process = new ffmpeg(path);
const path_split = path.split('.')

console.log(path_split[path_split.length - 1]);
if (path_split[path_split.length - 1] != 'mp4') {
    let new_path = path.replace(path_split[path_split.length - 1], 'mp4');
    console.log(new_path);
    try {
        process.then(function (video) {
            video.setVideoFormat('mp4')
            .save(new_path, function (error, file) {
                if (!error)
                    console.log('Video file: ' + file);
            });
            console.log('The video is ready to be processed');
            // Video metadata
            console.log(video.metadata);
            // FFmpeg configuration
            console.log(video.info_configuration);
            
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }
}