import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Player } from 'video-react';



class Play extends Component {

    state = {
        background: "",
        repeat: "no-repeat",
        comment: [],
        offset: 0,
        loadMoreButton : 0,
        average_rating: -1,
        user_rating: -1
    }

    constructor(props) {
        super(props);
         this.com = React.createRef();
         this.rating = React.createRef();

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
            if (res.status === 401)
                window.location.assign('/');
            else if (res.status !== 200)
                console.log('Failed getting information about the movie, themoviedb.org is not responding');
            else
                return res.json();
        })
        .then(resData => {
            this.props.setFilmInfos(resData);
            this.setState(()  => {
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
                if (res.status === 401)
                    window.location.assign('/');
                else if (res.status === 200)
                {
                    // 2. Si oui et fini de telecharger, l'envoyer, si oui mais pas fini passer a l'etape 4
                    console.log(res);
                    this.props.setMovieInDb(await res.json());
                }
                else if (res.status === 206 || res.status === 201) // 206 Si le film est en train de telecharger mais le dl n'est pas fini || 204 si on vient de commencer le dl
                {
                    // alert((await res.json())[0].magnet);
                    // test Parasite
                    // let torrentId = 'magnet:?xt=urn:btih:a39e4232842fd09608162521df562b34e61bb22a&dn=Parasite.2019.KOREAN.1080p.WEBRip.x264.AAC2.0-NOGRP&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fparasite.2019.korean.1080p.webrip.x264.aac2.0-nogrp.torrent';
                    // TEST lady and the tramp
                    // let torrentId = 'magnet:?xt=urn:btih:23aafdf7027db833bb68e0fe29e81e806a430395&dn=Lady.and.the.Tramp.2019.iNTERNAL.720p.WEB.H264-AMRAP&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce';
                    // demo webtorrent
                    // let torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent';
                    // let torrentId = (await res.json())[0].magnet;
                    // alert(torrentId);
                    // console.log('TorrentId : ' + torrentId);
                    // On va chercher le stream du torrent
                    fetch(`http://localhost:8000/stream_dl?id=${this.props.filmInfosState.film_infos.id}&range=bytes0to0on0`, {
                        method: 'GET',
                        credentials: 'include',
                        'range': '',
                        headers: {'Content-Type': 'application/json'}
                    })
                    .then(res => {
                        if (res.status === 401)
                            window.location.assign('/');
                        else if (res.status === 204)
                            alert("Pas de magnet");
                        else if (res.status === 416)
                            alert("Pas de range");
                    });


                    // torrentId.appendTo('body')
                            // client.add(torrentId, {transports: ['websocket']}, function (torrent) {
                            // alert(torrentId);
                            // console.log('Torrent tpusu : ' + torrent);
                            //     console.log('yolo  : ' + torrentId);
                            //     // Torrents can contain many files. Let's use the .mp4 file
                            //     let file = torrent.files.find(function (file) {
                            //         console.log(file);
                            //         alert(file);
                            //         return (file.name.endsWith('.mp4') || file.name.endsWith('.mvk') || file.name.endsWith('.avi') || file.name.endsWith('.webm'));
                            //     });
                            //     // Display the file by adding it to the DOM.
                            //     // Supports video, audio, image files, and more!
                            //     file.appendTo('#torrent_live');
                            // });
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
            if (res2.status === 401)
                window.location.assign('/');
            else if (res2.status !== 200)
                console.log('Failed getting information about the movie, themoviedb.org is not responding');
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
            if (res3.status === 401)
                window.location.assign('/');
            else if (res3.status !== 200)
                console.log('Failed getting similar movies, themoviedb.org is not res2ponding');
            else
                return res3.json();
        })
        .then(resData3 => {
            this.props.setSimilarMovies(resData3);
        })
        // Get the 5 first comments
        this.get_comment();
        // Get the average rating of the movie
        this.average_rating();
        // Get the rating from this user (if any)
        this.user_rating();
    }
     // DISPLAY COMMENT
    get_comment = () => {
        fetch(`http://localhost:8000/get_comment?offset=${this.state.offset}&moviedb_id=${this.props.location.search.split('movie=')[1]}`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
        })
        .then((res) => {
            if (res.status === 401)
                window.location.assign('/');
            else if (res.status !== 200)
                console.log('Fail to fetch comment on the select movie');
            else
                return res.json();
        })
        
        .then(resData => {
            if (resData !== undefined){
                resData.map((elem , index) => {
                    this.setState(prevState => (
                        index === 4 ? this.state.loadMoreButton = 0 : this.state.loadMoreButton = 1,
                        this.state.offset += 1,
                        this.state.comment.push(elem)
                    ))
                })
            }
            else
            {
                this.setState(prevState => (
                    this.state.loadMoreButton = 1
                ))
            }
            // console.log(resData);
            // this.props.setSimilarMovies(resData);
        })
    }
    // MAKE A COMM FONCTION
    make_comm = (event) => {
        event.preventDefault();
        if (this.com.current.value && this.com.current.value.trim() !== '')
        {
            if (this.state.comment.length === 0
                || (this.state.comment[0].date
                    && (!((this.props.userConnectState.first_name || this.props.userConnectState.login) === (this.state.comment[0].name || this.state.comment[0].first_name))
                        || (new Date().toISOString().slice(0, 16).replace('T', ' ') !== this.state.comment[0].date.slice(0, 16).replace('T', ' '))
                        || ((parseInt(new Date().toISOString().slice(17, 19).replace('T', ' ')) - parseInt(this.state.comment[0].date.slice(17, 19).replace('T', ' ')) > 5) || (parseInt((new Date().toISOString().slice(17, 19).replace('T', ' '))) - parseInt(this.state.comment[0].date.slice(17, 19).replace('T', ' '))) < -5))))
            {
                this.setState(prevState => (
                    this.state.offset += 1,
                    this.state.comment.unshift({comment : this.com.current.value, name : this.props.userConnectState.first_name || this.props.userConnectState.login , date : new Date().toISOString().slice(0, 19).replace('T', ' ')}) 
                ))
                fetch(`http://localhost:8000/add_comment`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ moviedb_ID: this.props.location.search.split('movie=')[1], comment : this.com.current.value}),
                })
                .then((res) => {
                    if (res.status === 401)
                        window.location.assign('/');
                    else 
                        this.com.current.value = '';
                })
                .catch((err) => { console.log(err); });
            } else {
                alert("You must wait at least 5 seconds to post another comment");
            }
        }
    }

    delete_com = (elem) => {
        alert('DELETE TO BE DONE : ' + elem.comment);
    }
    // LOAD MORE COMM
    loadMoreComment = (event) => {
        event.preventDefault();
        this.get_comment();   
    }

    // GET AVERAGE RATING
    average_rating = () => {
        fetch(`http://localhost:8000/get_rate_average?moviedb_ID=${this.props.location.search.split('movie=')[1]}`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then((res) => {
            if (res.status === 401)
                window.location.assign('/');
            else if (res.status !== 400) {
                return (res.json());
            }
        })
        .then((resData) => {
            if (resData !== undefined) {
                this.setState(prevState => (this.state.average_rating = resData[0].average_rating))
            }
        })
    }

    // RATING FUNCTION
    rate_movie = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/rate_movie`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ moviedb_ID: this.props.location.search.split('movie=')[1], rating : event.target.value}),
        })
        .then((res) => {
            if (res.status === 401)
                window.location.assign('/');
            else {
                this.average_rating();
                this.user_rating();
            }
        })
        .catch((err) => { console.log(err); });
    }

    // GET THE USER PREVIOUS RATING AND PUT IT IN THE STATE TO HAVE THE PROPER NUMBER OF STARS WHEN LOADING THE PAGE
    user_rating = () => {
        fetch(`http://localhost:8000/user_rating?moviedb_ID=${this.props.location.search.split('movie=')[1]}`, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then((res) => {
            if (res.status === 401)
                window.location.assign('/');
            else if (res.status === 200) {
                return (res.json());
            }
        })
        .then((resData) => {
            if (resData[0].rating !== undefined) {
                this.setState(prevState => (this.state.user_rating = resData[0].rating))
            }
        })
        .catch((err) => { console.log(err); });
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
                                    <div className="rate_and_comment container-fluid row">
                                        <div className="col-md-12 text-center rating_section">
                                            <h1>Hypertube Ratings</h1>
                                            <h2>Average rating : {this.state.average_rating ? this.state.average_rating : "Not rated yet"} </h2>
                                            <div className="col-md-5 offset-4">
                                                <form class="rating" onChange={this.rate_movie} > 
                                                    <input type="radio" id="star10" name="rating" value="10" ref={this.rating} checked={this.state.user_rating > 9.5 && this.state.user_rating <= 10}/><label class = "full" for="star10" title="10 stars" ></label>
                                                    <input type="radio" id="star9half" name="rating" value="9.5" ref={this.rating} checked={this.state.user_rating > 9 && this.state.user_rating <= 9.5} /><label class="half" for="star9half" title="9.5 stars" ></label>
                                                    <input type="radio" id="star9" name="rating" value="9" ref={this.rating} checked={this.state.user_rating > 8.5 && this.state.user_rating <= 9} /><label class = "full" for="star9" title="9 stars" ></label>
                                                    <input type="radio" id="star8half" name="rating" value="8.5" ref={this.rating} checked={this.state.user_rating > 8 && this.state.user_rating <= 8.5} /><label class="half" for="star8half" title="8.5 stars" ></label>
                                                    <input type="radio" id="star8" name="rating" value="8" ref={this.rating} checked={this.state.user_rating > 7.5 && this.state.user_rating <= 8} /><label class = "full" for="star8" title="8 stars" ></label>
                                                    <input type="radio" id="star7half" name="rating" value="7.5" ref={this.rating} checked={this.state.user_rating > 7 && this.state.user_rating <= 7.5} /><label class="half" for="star7half" title="7.5 stars" ></label>
                                                    <input type="radio" id="star7" name="rating" value="7" ref={this.rating} checked={this.state.user_rating > 6.5 && this.state.user_rating <= 7} /><label class = "full" for="star7" title="7 stars" ></label>
                                                    <input type="radio" id="star6half" name="rating" value="6.5" ref={this.rating} checked={this.state.user_rating > 6 && this.state.user_rating <= 6.5} /><label class="half" for="star6half" title="6.5 stars" ></label>
                                                    <input type="radio" id="star6" name="rating" value="6" ref={this.rating} checked={this.state.user_rating > 5.5 && this.state.user_rating <= 6} /><label class = "full" for="star6" title="6 stars" ></label>
                                                    <input type="radio" id="star5half" name="rating" value="5.5" ref={this.rating} checked={this.state.user_rating > 5 && this.state.user_rating <= 5.5} /><label class="half" for="star5half" title="Pretty good - 5.5 stars" ></label>
                                                    <input type="radio" id="star5" name="rating" value="5" ref={this.rating} checked={this.state.user_rating > 4.5 && this.state.user_rating <= 5} /><label class = "full" for="star5" title="Awesome - 5 stars" ></label>
                                                    <input type="radio" id="star4half" name="rating" value="4.5" ref={this.rating} checked={this.state.user_rating > 4 && this.state.user_rating <= 4.5} /><label class="half" for="star4half" title="Pretty good - 4.5 stars" ></label>
                                                    <input type="radio" id="star4" name="rating" value="4" ref={this.rating} checked={this.state.user_rating > 3.5 && this.state.user_rating <= 4} /><label class = "full" for="star4" title="Pretty good - 4 stars" ></label>
                                                    <input type="radio" id="star3half" name="rating" value="3.5" ref={this.rating} checked={this.state.user_rating > 3 && this.state.user_rating <= 3.5} /><label class="half" for="star3half" title="Meh - 3.5 stars" ></label>
                                                    <input type="radio" id="star3" name="rating" value="3" ref={this.rating} checked={this.state.user_rating > 2.5 && this.state.user_rating <= 3} /><label class = "full" for="star3" title="Meh - 3 stars" ></label>
                                                    <input type="radio" id="star2half" name="rating" value="2.5" ref={this.rating} checked={this.state.user_rating > 2 && this.state.user_rating <= 2.5} /><label class="half" for="star2half" title="Kinda bad - 2.5 stars" ></label>
                                                    <input type="radio" id="star2" name="rating" value="2" ref={this.rating} checked={this.state.user_rating > 1.5 && this.state.user_rating <= 2} /><label class = "full" for="star2" title="Kinda bad - 2 stars" ></label>
                                                    <input type="radio" id="star1half" name="rating" value="1.5" ref={this.rating} checked={this.state.user_rating > 1 && this.state.user_rating <= 1.5} /><label class="half" for="star1half" title="Meh - 1.5 stars" ></label>
                                                    <input type="radio" id="star1" name="rating" value="1" ref={this.rating} checked={this.state.user_rating > 0.5 && this.state.user_rating <= 1} /><label class = "full" for="star1" title="Sucks big time - 1 star" ></label>
                                                    <input type="radio" id="starhalf" name="rating" value="0.5" ref={this.rating} checked={this.state.user_rating > 0 && this.state.user_rating <= 0.5} /><label class="half" for="starhalf" title="Sucks big time - 0.5 stars" ></label>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="comment_section col-md-12 text-center">
                                    
                                            <div className="all_comment">
                                                <ul>
                                                    {
                                                        this.state.comment.map((elem, index) => (
                                                            <li className="col-md-12 text-center">
                                                                Posted on: {elem.date.slice(0, 19).replace('T', ' ')}
                                                                <br></br>
                                                                Comment BY {elem.first_name || elem.name} :
                                                                <div className="comment"> {elem.comment} </div>
                                                                <button onClick={() => this.delete_com(elem)}>X</button>
                                                            </li>
                                                        ))

                                                    }
                                                </ul>
                                            </div>
                                            {this.state.loadMoreButton === 0 ? 
                                            <button value="Load more comments" onClick={this.loadMoreComment}>
                                                LoadMore
                                            </button>
                                            : null 
                                            }
                                            
                                            <h1 className="text-center">
                                                Make a comment
                                            </h1>
                                            <form onSubmit={this.make_comm}>
                                                <input ref={this.com}>
                                                
                                                </input>
                                                <input type="submit" value="ok"></input>
                                                
                                            </form>
                                            
                                        </div>
                                    </div>
                                    
                                {/* MOVIE PLAYER */}
                                    {this.props.filmInfosState.movie_in_db[0] && this.props.filmInfosState.movie_in_db[0].download_complete === 1 ?
                                // {this.props.filmInfosState.movie_in_db[0] ?
                                    <div className = 'col-md-10 col-xl-12'>
                                        <Player
                                            playsInline
                                            poster={this.props.filmInfosState.film_infos.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + this.props.filmInfosState.film_infos.poster_path : "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"} alt={"Poster of " + this.props.filmInfosState.film_infos.title}
                                            src={"./torrents/" + this.props.filmInfosState.movie_in_db[0].path}
                                        />
                                    </div>
                                    : <div>
                                        <h1>This movie is not the database --> TO BE DONE</h1>
                                        <div id="torrent_live"></div>
                                    </div>
                                }

                                {this.props.filmInfosState.film_infos.overview ?
                                        <div className = 'col-md-12 text-center'>
                                            <h3>Overview : </h3>
                                            <p>{this.props.filmInfosState.film_infos.overview}</p>
                                        </div> 
                                    : null}

                                    {/* Movie cast and director */}
                                    {this.props.filmInfosState.cast_infos.cast ?
                                    <div className = 'col-md-12 text-center'>
                                        <h3>Cast:</h3>
                                        {this.props.filmInfosState.cast_infos.cast.slice(0, 5).map((elem, index) => 
                                            <p key={index} >{elem.name} as {elem.character}</p>
                                        )}
                                    </div>
                                    : null
                                    }
                                    {this.props.filmInfosState.cast_infos.crew ?
                                    <div className = 'col-md-12 text-center'>
                                        <h3>Director:</h3>
                                        {this.props.filmInfosState.cast_infos.crew.map((elem, index) => 
                                        elem.job === "Director" ? (
                                            <p key={index} >{elem.name}</p>
                                        ): null )}
                                        </div>
                                    : null
                                    }     

                                 {/* TRAILER */}
                                 {this.props.filmInfosState.film_infos.videos.results[0] ?
                                    <div className = 'col-md-10 col-xl-12 text-center trailer-div'>
                                        <br></br>
                                        <h4>TRAILER</h4>
                                        <iframe
                                            width="80%"
                                            height="80%"
                                            src={"https://www.youtube.com/embed/" + this.props.filmInfosState.film_infos.videos.results[0].key}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; full-screen; encrypted-media; gyroscope; picture-in-picture"
                                            mozallowfullscreen="mozallowfullscreen" 
                                            msallowfullscreen="msallowfullscreen" 
                                            oallowfullscreen="oallowfullscreen" 
                                            webkitallowfullscreen="webkitallowfullscreen"
                                            allowFullScreen="allowFullScreen">
                                        </iframe>
                                        
                                    </div>
                                    : null
                                }
                                <ul className="container-fluid text-center list-films">
                                        
                                        <li>
                                                {this.props.filmInfosState.film_infos.release_date ?
                                                <div className = 'col-md-6'>
                                                    <h3>Original release date : </h3>
                                                    <p>{this.props.filmInfosState.film_infos.release_date}</p>
                                                </div> 
                                            : null}
                                        </li>
                                        <li>
                                                {this.props.filmInfosState.film_infos.vote_average ?
                                                <div className = 'col-md-6'>
                                                    <h3>Vote Average : </h3> 
                                                    <p>{this.props.filmInfosState.film_infos.vote_average}</p>
                                                </div> 
                                            : null}
                                        </li>
                                        <li>
                                                {this.props.filmInfosState.film_infos.runtime ?
                                                <div className = 'col-md-6'>
                                                    <h3>Runtime in minutes: </h3> 
                                                    <p>{this.props.filmInfosState.film_infos.runtime} min</p>
                                                </div> 
                                           : null}
                                        </li>
                                        <li>
                                                {this.props.filmInfosState.film_infos.revenue ?
                                                <div className = 'col-md-6'>
                                                    <h3>Revenue in Dollars: </h3> 
                                                    <p>{this.props.filmInfosState.film_infos.revenue} $</p>
                                                </div> 
                                            : null}
                                        </li>
                                        <li>
                                                {this.props.filmInfosState.film_infos.production_countries ?
                                                <div className = 'col-md-6'>
                                                    <h3>Production Countries: </h3> 
                                                    <p>{this.props.filmInfosState.film_infos.production_countries[0].name}</p>
                                                </div> 
                                            : null}
                                        </li>
                                        <li>
                                                {this.props.filmInfosState.film_infos.imdb_id ?
                                                <div className = 'col-md-6'>
                                                    <h3>IMDB ID: </h3> 
                                                    <p>{this.props.filmInfosState.film_infos.imdb_id}</p>
                                                </div> 
                                            : null}
                                        </li>
                                    </ul>

                                </div>
                               
                              
                              
                                {this.props.filmInfosState.similar_movies !== "" ?
                                <div className="container mt-3">
                                    <div className="col-md-12 text-center">
                                        <h3>Similar movies</h3>
                                    </div>
                                        {/* <div id="result_list" ref="result_list" className="row "> */}
                                        <div id="myCarousel" class="carousel slide" data-ride="carousel">
                                        {/* <!-- Indicators --> */}
                                            {/* <ul class="carousel-indicators">
                                            {
                                                 this.props.filmInfosState.similar_movies.map((elem, index) =>

                                                    <li data-target={"#" + elem.id} data-slide-to={index} className={index === 0 ? "active" : null}></li>
                                                )
                                            }
                                            </ul> */}
                                            <div className="carousel-inner">
                                                {
                                                    
                                                    this.props.filmInfosState.similar_movies.map((elem, index) =>
                                                    
                                                    (<div id={elem.id}  className={index === 0 ? "active carousel-item text-center" : "carousel-item text-center"}>
                                                            <div className="image ">
                                                                <img src= {elem.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + elem.poster_path : "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"} alt={"Poster of " + elem.title} />
                                                                <div className="overlay_car">
                                                                    <div className="topright">
                                                                        <p>
                                                                        <span className="glyphicon glyphicon-star">{elem.vote_average}</span>
                                                                        </p> 
                                                                    </div>
                                                                    <div  className="text-center col-sm-12">
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
                                            {/* <!-- Left and right controls --> */}
                                            <a class="carousel-control-prev" href="#myCarousel" data-slide="prev">
                                                <span class="carousel-control-prev-icon"></span>
                                            </a>
                                            <a class="carousel-control-next" href="#myCarousel" data-slide="next">
                                                <span class="carousel-control-next-icon"></span>
                                            </a>
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