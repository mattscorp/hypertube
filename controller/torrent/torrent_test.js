// const TorrentSearchApi = require('torrent-search-api');
 
// TorrentSearchApi.enableProvider('Torrent9');
 
// const ft = async () => {
//     // Search '1080' in 'Movies' category and limit to 20 results
//     // const torrents = await TorrentSearchApi.search('1080', 'Movies', 20);

//     const torrents = await TorrentSearchApi.search(['Torrent9'], '1080', 'Movies', 20);
//     console.log(torrents);
// }

const PopCorn = require('popcorn-api');
 
// * Search for movies using query 'kill'
PopCorn.movies.search({query: 'Joker'})
    .then(async ([movie]) => {
        await movie.fetch();
 
        console.log(movie); // -> movie
    });
 

