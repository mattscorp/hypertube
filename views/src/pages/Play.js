import React, { Component } from 'react';
import { Twitter } from 'react-sharingbuttons';
import 'react-sharingbuttons/dist/main.css';
import UserProfile from './UserProfile.js';
import {fetch_post} from '../fetch.js';
import {fetch_get} from '../fetch.js';
import translations from '../translations.js';
import unavailable from '../resources/unavailable.gif';

class Play extends Component {

    state = {
        background: "",
        repeat: "no-repeat",
        comment: [],
        offset: 0,
        loadMoreButton : 0,
        average_rating: -1,
        user_rating: -1,
        show_user: "",
        user_infos: "",
        fake_add: 3,
        url_movie: '',
        movie_not_found: false
    }

    constructor(props) {
        super(props);
        this.com = React.createRef();
        this.rating = React.createRef();
        this.video_player = React.createRef();
        // this.player = React.createRef();

    }

    componentDidMount () {
        // Starts a countdown to play the fake add before playing the movie
        this.setState({
            url_movie: parseInt(this.props.location.search.split('movie=')[1].trim())
        });
        this.handle_video_advancement();
        this.fake_ad_countdown();
        // Call the API to get the movie details
        let URL = `http://localhost:8000/movie_infos?movie_id=${this.props.location.search.split('movie=')[1]}&language=${this.props.translationState}`;
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
        .then(() => {
            // GET THE SUBTITLES FOR THE MOVIE
            this.get_subtitles();
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
        let URL3 = `http://localhost:8000/moviedb?action=similar&movie_id=${this.props.location.search.split('movie=')[1]}&language=${this.props.translationState}`;
        fetch(URL3, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then((res3) => {
            if (res3.status === 401)
                window.location.assign('/');
            else if (res3.status === 204)
                window.location.assign('/unknown_movie');
            else if (res3.status !== 200)
                console.log('Failed getting similar movies, themoviedb.org is not responding');
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
                this.setState({
                    loadMoreButton: 1
                })
            }
        })
    }

    // GET THE SUBTITLES FOR THE MOVIE
    get_subtitles = async () => {
        let subtitles = await fetch_get('/subtitles', `imdb_id=${this.props.filmInfosState.film_infos.imdb_id}`);
        if (subtitles !== undefined && (subtitles.subtitles['en'] || subtitles.subtitles['fre'])) {
            // Adding the subtitles to the props
            this.props.setSubtitles(subtitles.subtitles);
        } else {
            console.log('No subtitles available');
        }
    }

    get_comment_after_new = () => {
        fetch(`http://localhost:8000/get_comment?moviedb_id=${this.props.location.search.split('movie=')[1]}`, {
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
                    this.setState(prevState => (
                        this.state.offset += 1,
                        this.state.comment.unshift(resData[0])
                    ))
            }
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
                    {
                        this.get_comment_after_new();
                        this.com.current.value = '';
                    }
                })
                .catch((err) => { console.log(err); });
            } else {
                alert("You must wait at least 5 seconds to post another comment");
            }
        }
    }
    // DELETE A COM
    delete_com = (elem) => {
        if (elem.comment && elem.comment !== undefined && elem.comment_ID && elem.comment_ID !== undefined && elem.uuid && elem.uuid !== undefined && this.props.userConnectState.uuid && this.props.userConnectState.uuid !== undefined && this.props.userConnectState.uuid === elem.uuid)
        {
            fetch(`http://localhost:8000/delete_comment`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ comment: elem.comment, comment_ID : elem.comment_ID, uuid: elem.uuid}),
            })
            .then((res) => {
                if (res.status === 401)
                    window.location.assign('/');
                else
                {
                    let i = -1;
                    this.state.comment.map ((e, index ) => {
                        if(elem.comment === e.comment && ((elem.first_name || elem.name) === (e.first_name || e.name)) && elem.date.slice(0, 19).replace('T', ' ') === e.date.slice(0, 19).replace('T', ' ')){
                            i = index;
                        }
                   })
                    this.setState(prevState => (
                        this.state.comment.splice(i, 1) 
                    ))
                }
             })
            .catch((err) => { console.log(err); });
            }
        
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
                this.setState({average_rating: resData[0].average_rating})
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
                this.setState({user_rating: resData[0].rating})
            }
        })
        .catch((err) => { console.log(err); });
    }

    show_user = async (elem) => {
        let user_infos = await fetch_post('/user_public_profile', {uuid: elem.uuid});
        if (user_infos !== undefined && user_infos !== '' && user_infos !== '403') {
            this.setState({
                show_user: elem.uuid,
                user_infos: user_infos
            })
        }
    }
    
    fake_ad_countdown = () => {
        setInterval(() => {
            this.setState({
                fake_add: this.state.fake_add - 1
            });
            if (this.video_player && this.video_player.current && this.state.fake_add && this.state.fake_add === -1)
                this.video_player.current.play();
        }, 1000)
    }

    handle_video_advancement = () => {
        setInterval(() => {
            if (this.video_player && this.video_player !== undefined && this.props.filmInfosState.film_infos.imdb_id && this.video_player.current && this.video_player.current.duration && this.video_player.current.duration !== undefined && this.video_player.current.currentTime && this.video_player.current.currentTime !== undefined)
            {
                fetch_post('/movie_advancement', {'imdb_ID': this.props.filmInfosState.film_infos.id, 'duration': this.video_player.current.duration, 'current_time': this.video_player.current.currentTime});
            }
            // CHECK IF THE VIDEO EXISTS OR NOT
            else if (this.video_player && this.video_player.current && this.video_player.current.onclick === null) {
                console.log('This video is not available');
                this.setState({
                    movie_not_found: true
                })
            }
        }, 5000)
    }

    hide_user = () => {
        this.setState({
            show_user: "",
            user_infos: ""
        })
    }

    render () {
        return (
            <React.Fragment>
                <div className="film-container" style={{background:this.state.background}} onClick={this.state.show_user !== "" ? this.hide_user : null}>
                    <div className="container under">
                        {this.props.filmInfosState.film_infos.id !== this.state.url_movie ? null :
                            <div>
                                <div className = "row">
                                    {/* Movie infos */}
                                    <div className="col-md-12">
                                        <h1 className="text-center">
                                            {this.props.filmInfosState.film_infos.title}
                                        </h1>
                                    </div>
                                    {/* Twitter share */}
                                    <div className="col-md-12 text-center rating_section">
                                        <Twitter url={this.props.location} text={translations[this.props.translationState].movie_page.share_on_twitter} shareText={'I\'m watching ' + this.props.filmInfosState.film_infos.title + ' with Hypertube! Watch movies with Hypertube: http://localhost:3000'  + this.props.location.search} />
                                    </div>
                                    {/* Ratings */}
                                    <div className="rate_and_comment container-fluid row">
                                        <div className="col-md-12 text-center rating_section">
                                            <h4>{translations[this.props.translationState].movie_page.average_rating} {this.state.average_rating ? this.state.average_rating : translations[this.props.translationState].movie_page.not_rated_yet} </h4>
                                            <div className="col-md-5 offset-4">
                                                <form className="rating" onChange={this.rate_movie} > 
                                                    <input type="radio" id="star10" name="rating" value="10" ref={this.rating} checked={this.state.user_rating > 9.5 && this.state.user_rating <= 10}/><label className="full" htmlFor="star10" title="10 stars" ></label>
                                                    <input type="radio" id="star9half" name="rating" value="9.5" ref={this.rating} checked={this.state.user_rating > 9 && this.state.user_rating <= 9.5} /><label className="half" htmlFor="star9half" title="9.5 stars" ></label>
                                                    <input type="radio" id="star9" name="rating" value="9" ref={this.rating} checked={this.state.user_rating > 8.5 && this.state.user_rating <= 9} /><label className="full" htmlFor="star9" title="9 stars" ></label>
                                                    <input type="radio" id="star8half" name="rating" value="8.5" ref={this.rating} checked={this.state.user_rating > 8 && this.state.user_rating <= 8.5} /><label className="half" htmlFor="star8half" title="8.5 stars" ></label>
                                                    <input type="radio" id="star8" name="rating" value="8" ref={this.rating} checked={this.state.user_rating > 7.5 && this.state.user_rating <= 8} /><label className="full" htmlFor="star8" title="8 stars" ></label>
                                                    <input type="radio" id="star7half" name="rating" value="7.5" ref={this.rating} checked={this.state.user_rating > 7 && this.state.user_rating <= 7.5} /><label className="half" htmlFor="star7half" title="7.5 stars" ></label>
                                                    <input type="radio" id="star7" name="rating" value="7" ref={this.rating} checked={this.state.user_rating > 6.5 && this.state.user_rating <= 7} /><label className="full" htmlFor="star7" title="7 stars" ></label>
                                                    <input type="radio" id="star6half" name="rating" value="6.5" ref={this.rating} checked={this.state.user_rating > 6 && this.state.user_rating <= 6.5} /><label className="half" htmlFor="star6half" title="6.5 stars" ></label>
                                                    <input type="radio" id="star6" name="rating" value="6" ref={this.rating} checked={this.state.user_rating > 5.5 && this.state.user_rating <= 6} /><label className="full" htmlFor="star6" title="6 stars" ></label>
                                                    <input type="radio" id="star5half" name="rating" value="5.5" ref={this.rating} checked={this.state.user_rating > 5 && this.state.user_rating <= 5.5} /><label className="half" htmlFor="star5half" title="Pretty good - 5.5 stars" ></label>
                                                    <input type="radio" id="star5" name="rating" value="5" ref={this.rating} checked={this.state.user_rating > 4.5 && this.state.user_rating <= 5} /><label className="full" htmlFor="star5" title="Awesome - 5 stars" ></label>
                                                    <input type="radio" id="star4half" name="rating" value="4.5" ref={this.rating} checked={this.state.user_rating > 4 && this.state.user_rating <= 4.5} /><label className="half" htmlFor="star4half" title="Pretty good - 4.5 stars" ></label>
                                                    <input type="radio" id="star4" name="rating" value="4" ref={this.rating} checked={this.state.user_rating > 3.5 && this.state.user_rating <= 4} /><label className="full" htmlFor="star4" title="Pretty good - 4 stars" ></label>
                                                    <input type="radio" id="star3half" name="rating" value="3.5" ref={this.rating} checked={this.state.user_rating > 3 && this.state.user_rating <= 3.5} /><label className="half" htmlFor="star3half" title="Meh - 3.5 stars" ></label>
                                                    <input type="radio" id="star3" name="rating" value="3" ref={this.rating} checked={this.state.user_rating > 2.5 && this.state.user_rating <= 3} /><label className="full" htmlFor="star3" title="Meh - 3 stars" ></label>
                                                    <input type="radio" id="star2half" name="rating" value="2.5" ref={this.rating} checked={this.state.user_rating > 2 && this.state.user_rating <= 2.5} /><label className="half" htmlFor="star2half" title="Kinda bad - 2.5 stars" ></label>
                                                    <input type="radio" id="star2" name="rating" value="2" ref={this.rating} checked={this.state.user_rating > 1.5 && this.state.user_rating <= 2} /><label className="full" htmlFor="star2" title="Kinda bad - 2 stars" ></label>
                                                    <input type="radio" id="star1half" name="rating" value="1.5" ref={this.rating} checked={this.state.user_rating > 1 && this.state.user_rating <= 1.5} /><label className="half" htmlFor="star1half" title="Meh - 1.5 stars" ></label>
                                                    <input type="radio" id="star1" name="rating" value="1" ref={this.rating} checked={this.state.user_rating > 0.5 && this.state.user_rating <= 1} /><label className="full" htmlFor="star1" title="Sucks big time - 1 star" ></label>
                                                    <input type="radio" id="starhalf" name="rating" value="0.5" ref={this.rating} checked={this.state.user_rating > 0 && this.state.user_rating <= 0.5} /><label className="half" htmlFor="starhalf" title="Sucks big time - 0.5 stars" ></label>
                                                </form>
                                            </div>
                                        </div>
                                        {/* Fake add */}
                                        {this.state.fake_add >= 0 ?
                                            <div className = 'col-md-10 col-xl-12 text-center trailer-div'>
                                                <iframe
                                                    title="fake_add"
                                                    width="100%" height="100%"
                                                    src="https://www.youtube.com/embed/sODZLSHJm6Q?autoplay=1"
                                                    frameborder="0"
                                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen>
                                                </iframe>
                                                <p>{translations[this.props.translationState].movie_page.your_video_will_be_played}{this.state.fake_add}{translations[this.props.translationState].movie_page.seconds}</p>
                                            </div>  
                                            : null
                                        }
                                        {/* Film */}
                                        {this.state.movie_not_found === false ?
                                            <div className = 'videoPlayer col-md-10 col-xl-12' style={this.state.fake_add > -1 ? {display:'none'} : null}>
                                                <video width="100%" height="auto"
                                                    ref={this.video_player}
                                                    controls
                                                    crossOrigin="anonymous"
                                                    htmlFor='video_player'
                                                    preload="auto" controlsList="nodownload">
                                                    <source src={'http://localhost:8000/movie_player?moviedb_id=' + this.props.location.search.split('movie=')[1]}></source>
                                                    {/* Subtitles */}
                                                    {this.props.subtitles.subtitles['en'] ? 
                                                        <track label='en' language='en' kind="subtitles" srcLang='en' default='true'
                                                        src={`data:text/vtt;base64, ${this.props.subtitles.subtitles['en']}`}/>
                                                    :null } */}
                                                    {this.props.subtitles.subtitles['fr'] ? 
                                                        <track label='fr' language='fr' kind="subtitles" srcLang='fr'
                                                        src={`data:text/vtt;base64, ${this.props.subtitles.subtitles['fr']}`}/>
                                                    :null }
                                                </video>
                                            </div>
                                            : <div className="movie_not_found col-md-10 col-xl-12">
                                                <h3>{translations[this.props.translationState].movie_page.unavailable}</h3>
                                                <img src={unavailable} title="movie not found" alt="movie not found"/>
                                            </div>
                                        }
                                        {/* Commentaires */}
                                        <div className="comment_section col-md-12 text-center">
                                            <div className="all_comment">
                                                <ul>
                                                    {
                                                        this.state.comment.map((elem, index) => (
                                                            <li className="col-md-12 text-center">
                                                                {translations[this.props.translationState].movie_page.posted_on}{elem.date.slice(0, 19).replace('T', ' ')}
                                                                <br></br>
                                                                {translations[this.props.translationState].movie_page.comment_by}<b className="user_popup" onClick={() => this.show_user(elem)}>{elem.first_name || elem.name}</b> :
                                                                <div className="comment"> {elem.comment} </div>
                                                                {elem.uuid === this.props.userConnectState.uuid ?
                                                                    <button onClick={() => this.delete_com(elem)}>X</button> : null
                                                                }
                                                                {this.state.show_user === elem.uuid ?
                                                                    <UserProfile
                                                                        elem={elem}
                                                                        hide_user={this.hide_user}
                                                                        user_infos={this.state.user_infos}
                                                                    >
                                                                    </UserProfile>
                                                                    : null
                                                                }
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                            {this.state.loadMoreButton === 0 ? 
                                            <button value="Load more comments" onClick={this.loadMoreComment}>
                                                {translations[this.props.translationState].movie_page.load_more}
                                            </button>
                                            : null 
                                            }
                                            <h1 className="text-center">
                                                {translations[this.props.translationState].movie_page.make_a_comment}
                                            </h1>
                                            <form onSubmit={this.make_comm}>
                                                <input ref={this.com}>
                                                </input>
                                                <input type="submit" value={translations[this.props.translationState].movie_page.ok}></input>
                                            </form>
                                        </div>
                                    </div>
                                {this.props.filmInfosState.film_infos.overview ?
                                    <div className = 'col-md-12 text-center'>
                                        <h3>{translations[this.props.translationState].movie_page.overview}</h3>
                                        <p>{this.props.filmInfosState.film_infos.overview}</p>
                                    </div> 
                                : null}
                                {/* Movie cast and director */}
                                {this.props.filmInfosState.cast_infos.cast ?
                                <div className = 'col-md-12 text-center'>
                                    <h3>{translations[this.props.translationState].movie_page.cast}</h3>
                                    {this.props.filmInfosState.cast_infos.cast.slice(0, 5).map((elem, index) => 
                                        <p key={index} >{elem.name}{translations[this.props.translationState].movie_page.as}{elem.character}</p>
                                    )}
                                </div>
                                : null
                                }
                                {this.props.filmInfosState.cast_infos.crew ?
                                <div className = 'col-md-12 text-center'>
                                    <h3>{translations[this.props.translationState].movie_page.director}</h3>
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
                                        <h3>{translations[this.props.translationState].movie_page.movie_trailer}</h3>
                                        <iframe
                                            title="trailer"
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
                                                <h3>{translations[this.props.translationState].movie_page.original_release_date}</h3>
                                                <p>{this.props.filmInfosState.film_infos.release_date}</p>
                                            </div> 
                                            : null}
                                        </li>
                                        <li>
                                            {this.props.filmInfosState.film_infos.vote_average ?
                                            <div className = 'col-md-6'>
                                                <h3>{translations[this.props.translationState].movie_page.vote_average}</h3> 
                                                <p>{this.props.filmInfosState.film_infos.vote_average}</p>
                                            </div> 
                                            : null}
                                        </li>
                                        <li>
                                            {this.props.filmInfosState.film_infos.runtime ?
                                            <div className = 'col-md-6'>
                                                <h3>{translations[this.props.translationState].movie_page.runtime}</h3> 
                                                <p>{this.props.filmInfosState.film_infos.runtime} min</p>
                                            </div> 
                                           : null}
                                        </li>
                                        <li>
                                            {this.props.filmInfosState.film_infos.revenue ?
                                            <div className = 'col-md-6'>
                                                <h3>{translations[this.props.translationState].movie_page.revenue}</h3> 
                                                <p>{this.props.filmInfosState.film_infos.revenue} $</p>
                                            </div> 
                                            : null}
                                        </li>
                                        <li>
                                            {this.props.filmInfosState.film_infos.production_countries && this.props.filmInfosState.film_infos.production_countries[0] ?
                                            <div className = 'col-md-6'>
                                                <h3>{translations[this.props.translationState].movie_page.production_countries}</h3> 
                                                <p>{this.props.filmInfosState.film_infos.production_countries[0].name}</p>
                                            </div> 
                                            : null}
                                        </li>
                                    </ul>
                                </div>
                                {this.props.filmInfosState.similar_movies !== "" && this.props.filmInfosState.similar_movies[0] && this.props.filmInfosState.similar_movies[0] !== undefined ?
                                <div className="container mt-3 similar_movies">
                                    <div className="col-md-12 text-center">
                                        <h3>{translations[this.props.translationState].movie_page.similar_movies}</h3>
                                    </div>
                                        <div id="myCarousel" className="carousel slide" data-ride="carousel">
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
                                            <a className="carousel-control-prev" href="#myCarousel" data-slide="prev">
                                                <span className="carousel-control-prev-icon"></span>
                                            </a>
                                            <a className="carousel-control-next" href="#myCarousel" data-slide="next">
                                                <span className="carousel-control-next-icon"></span>
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