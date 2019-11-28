
var WebTorrent = require('webtorrent')
var client = new WebTorrent()
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp');

console.log("ICI");
client.add('magnet:?xt=urn:btih:6685B0499469CE1780F5CADCC3D7218655E0348A', function (torrent) {
    console.log("ICI");

  console.log('Torrent info hash:', torrent.infoHash)
      
  mkdirp(path.resolve(__dirname, torrent.name), function (err) {

      if (err) console.error(err)

      torrent.files.forEach(function (file) {
        var source = file.createReadStream()
        var destination = fs.createWriteStream(path.resolve(__dirname, torrent.name) + '/' + file.name)
        source.pipe(destination)
      });

  })

  torrent.swarm.on('download', function() {

    var transfer = {
      progress: torrent.progress,
      download_speed: client.downloadSpeed()
    }

    console.log(transfer);

  })

  torrent.on('done', function() {
    console.log(torrent);
    
    // client.destroy(function() {
    //   console.log('destroyed');
    // })
    
  })

})