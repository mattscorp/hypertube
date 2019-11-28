import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Player } from 'video-react';
const WebTorrent = require('webtorrent')


class Play extends Component {

    state = {
        background: "",
        repeat: "no-repeat",
    }

    constructor(props) {
        super(props);
    }

    componentDidMount () {

        // Call the API to get the movie details
        let URL = `http://localhost:8000/movie_infos?movie_id=${this.props.location.search.split('movie=')[1]}`;
        fetch(URL, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then((res) => {
            if (res.status !== 200)
                console.log('Failed getting information about the movie, themoviedb.org is not responding');
            else
                return res.json();
        })
        .then(resData => {
            this.props.setFilmInfos(resData);
            this.setState(()  => {
                console.log("yaaal " +  this.props.filmInfosState.film_infos.poster_path);
                return {background: 'url(https://image.tmdb.org/t/p/w185_and_h278_bestv2' + this.props.filmInfosState.film_infos.poster_path + ')'};
            })
        })
        
        // Torrent
        .then(() => {
            console.log('Torrent');
            // 1. Verifier si le film est deja en BDD, sinon le telecharge en backend
            fetch(`http://localhost:8000/movie_in_db?movie_id=${this.props.location.search.split('movie=')[1]}`, {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            })
            .then(async (res) => {
                if (res.status === 200)
                {
                    // 2. Si oui et fini de telecharger, l'envoyer, si oui mais pas fini passer a l'etape 4
                    console.log(res);
                    this.props.setMovieInDb(await res.json());
                }
                else if (res.status === 206 || res.status === 201) // 206 Si le film est en train de telecharger mais le dl n'est pas fini || 204 si on vient de commencer le dl
                {
                    var client = new WebTorrent()
                    // Sintel, a free, Creative Commons movie
                    // alert((await res.json())[0].magnet);
                    // let torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent';
                    let torrentId = (await res.json())[0].magnet;
                    alert(torrentId);
                    // torrentId.appendTo('body')
                    client.add(torrentId, function (torrent) {
                        // Torrents can contain many files. Let's use the .mp4 file
                        let file = torrent.files.find(function (file) {
                            return (file.name.endsWith('.mp4') || file.name.endsWith('.mvk') || file.name.endsWith('.avi') || file.name.endsWith('.webm'));
                        });
                        // Display the file by adding it to the DOM.
                        // Supports video, audio, image files, and more!
                        file.appendTo('body')
                    })
                }
                    // 3. Si non : 
                    //      a. get active providers
                    //      b. chercher le film et verifier que les infos sont coherentes
                    //      c. telecharger jsp comment
                    
                    // 4. Envoyer le film pendant le telechargement
                    // 5. Si on trouve pas le bon film, mettre en liste d'attente par email
            })
        })
        // Call the API to get the cast
        let URL2 = `http://localhost:8000/movie_cast?movie_id=${this.props.location.search.split('movie=')[1]}`;
        fetch(URL2, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })     
        .then((res2) => {
            if (res2.status !== 200)
                console.log('Failed getting information about the movie, themoviedb.org is not res2ponding');
            else
                return res2.json();
        })
        .then(resData2 => {
            this.props.setCastInfos(resData2);
        })
        // GET similar movies
        let URL3 = `http://localhost:8000/moviedb?action=similar&movie_id=${this.props.location.search.split('movie=')[1]}`;
        fetch(URL3, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then((res3) => {
            if (res3.status !== 200)
                console.log('Failed getting similar movies, themoviedb.org is not res2ponding');
            else
                return res3.json();
        })
        .then(resData3 => {
            this.props.setSimilarMovies(resData3);
        })
        
        
        
    }

    render () {
        // alert(this.state.film_cast.cast);
        return (
            <React.Fragment>
                <div className="film-container" style={{background:this.state.background}}>
                    <div className="container under">
                        {this.props.filmInfosState.film_infos.id !== parseInt(this.props.location.search.split('movie=')[1].trim()) ? null :
                            <div>
                                <div className = "row">
                                    {/* Movie infos */}

                                    <div className="col-md-12">
                                        <h1 className="text-center">
                                            {this.props.filmInfosState.film_infos.title}
                                        </h1>
                                    </div>
                                {/* MOVIE PLAYER */}
                                    {/* {this.props.filmInfosState.movie_in_db[0] && this.props.filmInfosState.movie_in_db[0].download_complete === 1 ? */}
                                {this.props.filmInfosState.movie_in_db[0] ?
                                    <div className = 'col-md-10 col-xl-12'>
                                        <Player
                                            playsInline
                                            poster={this.props.filmInfosState.film_infos.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + this.props.filmInfosState.film_infos.poster_path : "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"} alt={"Poster of " + this.props.filmInfosState.film_infos.title}
                                            src={"./torrents/" + this.props.filmInfosState.movie_in_db[0].path}
                                        />
                                    </div>
                                    : <div>
                                        <h1>This movie is not the database --> TO BE DONE</h1>
                                    </div>
                                }


                                 {/* TRAILER */}
                                 {this.props.filmInfosState.film_infos.videos.results[0] ?
                                    <div className = 'col-md-10 col-xl-12 text-center'>
                                        <br></br>
                                        <h4>TRAILER</h4>
                                        <iframe
                                            width="80%"
                                            height="80%"
                                            src={"https://www.youtube.com/embed/" + this.props.filmInfosState.film_infos.videos.results[0].key}
                                            frameborder="0"
                                            allow="accelerometer; autoplay; full-screen; encrypted-media; gyroscope; picture-in-picture"
                                            mozallowfullscreen="mozallowfullscreen" 
                                            msallowfullscreen="msallowfullscreen" 
                                            oallowfullscreen="oallowfullscreen" 
                                            webkitallowfullscreen="webkitallowfullscreen"
                                            allowfullscreen="allowfullscreen">
                                        </iframe>
                                        
                                    </div>
                                    : null
                                }



                                    {this.props.filmInfosState.film_infos.release_date ?
                                        <div className = 'col-md-10'>
                                            <h3>Original release date : </h3>
                                            <p>{this.props.filmInfosState.film_infos.release_date}</p>
                                        </div> 
                                    : null}
                                    {this.props.filmInfosState.film_infos.overview ?
                                        <div className = 'col-md-10'>
                                            <h3>Overview : </h3>
                                            <p>{this.props.filmInfosState.film_infos.overview}</p>
                                        </div> 
                                    : null}
                                    {this.props.filmInfosState.film_infos.vote_average ?
                                        <div className = 'col-md-10'>
                                            <h3>Vote Average : </h3> 
                                            <p>{this.props.filmInfosState.film_infos.vote_average}</p>
                                        </div> 
                                    : null}
                                    {this.props.filmInfosState.film_infos.runtime ?
                                        <div className = 'col-md-10'>
                                            <h3>Runtime in minutes: </h3> 
                                            <p>{this.props.filmInfosState.film_infos.runtime} min</p>
                                        </div> 
                                    : null}
                                    {this.props.filmInfosState.film_infos.revenue ?
                                        <div className = 'col-md-10'>
                                            <h3>Revenue in Dollars: </h3> 
                                            <p>{this.props.filmInfosState.film_infos.revenue} $</p>
                                        </div> 
                                    : null}
                                    {this.props.filmInfosState.film_infos.production_countries ?
                                        <div className = 'col-md-10'>
                                            <h3>Production Countries: </h3> 
                                            <p>{this.props.filmInfosState.film_infos.production_countries[0].name}</p>
                                        </div> 
                                    : null}
                                    {this.props.filmInfosState.film_infos.imdb_id ?
                                        <div className = 'col-md-10'>
                                            <h3>IMDB ID: </h3> 
                                            <p>{this.props.filmInfosState.film_infos.imdb_id}</p>
                                        </div> 
                                    : null}
                                    {/* Movie cast and director */}
                                    {this.props.filmInfosState.cast_infos.cast ?
                                    <div className = 'col-md-10'>
                                        <h3>Cast:</h3>
                                        {this.props.filmInfosState.cast_infos.cast.slice(0, 5).map((elem, index) => 
                                            <p key={index} >{elem.name} as {elem.character}</p>
                                        )}
                                    </div>
                                    : null
                                    }
                                    {this.props.filmInfosState.cast_infos.crew ?
                                    <div className = 'col-md-10'>
                                        <h3>Director:</h3>
                                        {this.props.filmInfosState.cast_infos.crew.map((elem, index) => 
                                        elem.job === "Director" ? (
                                            <p key={index} >{elem.name}</p>
                                        ): null )}
                                        </div>
                                    : null
                                    }
                                    
                                </div>
                               
                                
                                {/* Similar movies */}
                                {this.props.filmInfosState.similar_movies !== "" ?
                                <div>
                                    <div className="row">
                                        <h3>Similar movies</h3>
                                    </div>
                                    <div id="result_list" ref="result_list" className="row">
                                        {
                                            this.props.filmInfosState.similar_movies.map((elem, index) =>
                                                (<div id={elem.id} >
                                                    <div className="image">
                                                        <img src= {elem.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + elem.poster_path : "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"} alt={"Poster of " + elem.title} />
                                                        <div className="overlay">
                                                            <div className="topright">
                                                                <p>
                                                                <span className="glyphicon glyphicon-star">{elem.vote_average}</span>
                                                                </p> 
                                                            </div>
                                                            <div>
                                                                {
                                                                    elem.overview.split(' ').map((elem_child, index_child) => 
                                                                        (<span key={index_child}>
                                                                            {index_child < 25 ? elem_child : null}
                                                                            {index_child < 24 ? ' ' : null}
                                                                            {index_child  === 25 ? '...' : null}
                                                                            {index_child === 0 ? (!elem_child ? 'No resume available' : null) : null}
                                                                        </span>)
                                                                    )
                                                                }
                                                                <div className="play_hover">
                                                                    <a href={"play?movie=" + elem.id}>
                                                                        <p className="btn btn-info btn-lg">
                                                                            <span className="glyphicon glyphicon-play"></span> Play
                                                                        </p>
                                                                    </a>
                                                                </div>         
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h5 className={this.props.darkModeState ? "text-white" : "text-dark"}>{elem.title}</h5>
                                                </div>)
                                            )
                                        }
                                    </div>
                                </div>
                                : null}
                            </div>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Play;