// const TorrentSearchApi = require('torrent-search-api');
 
// TorrentSearchApi.enableProvider('Torrent9');
 
// const ft = async () => {
//     // Search '1080' in 'Movies' category and limit to 20 results
//     // const torrents = await TorrentSearchApi.search('1080', 'Movies', 20);

//     const torrents = await TorrentSearchApi.search(['Torrent9'], '1080', 'Movies', 20);
//     console.log(torrents);
// }

// const PopCorn = require('popcorn-api');
 
// // * Search for movies using query 'kill'
// PopCorn.movies.search({query: 'Joker'})
//     .then(async ([movie]) => {
//         await movie.fetch();
 
//         console.log(movie); // -> movie
//     });
 

const TorrentSearchApi = require('torrent-search-api');
 
// TorrentSearchApi.enableProvider('ThePirateBay');
// TorrentSearchApi.enableProvider('KickassTorrents');
// TorrentSearchApi.enableProvider('Torrent9');
TorrentSearchApi.enableProvider('Rarbg');


const ft_0 = async () => {
    return new Promise(async (resolve, reject) => {
        const providers = await TorrentSearchApi.getActiveProviders();
        console.log(providers);
        resolve(providers);
    });
}


// Search '1080' in 'Movies' category and limit to 20 results
const ft_1 = async () => {
    return new Promise(async (resolve, reject) => {
        const torrents = await TorrentSearchApi.search('joker', 'Movies', 20)
        console.log(torrents);
        resolve(torrents);
        // const details = await TorrentSearchApi.getMagnet(torrents);
        // console.log("*********************");
        // console.log(details);
    });
}

const ft_2 = async (torrents) => {
    console.log('IN FT_2 : ' + torrents[0].title);
    const magnet = await TorrentSearchApi.getMagnet(torrents[0]);
    console.log('MAGNET ****' + magnet);
}

const ft = async () => {
    const providers = await ft_0();
    // console.log('return de providers : ' + providers);
    const torrents = await ft_1();
    ft_2(torrents);
}

ft();