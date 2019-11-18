import React, { Component } from 'react';

class Play extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount () {
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
            console.log('ICI ; ' + resData);
            //info_film = resData;
            // this.setState(prevState => {
            //     return {film_infos: resData, cast_infos: ""};
            // });
            this.props.setFilmInfos(resData);
        })
        // Call the API to get the cast
        .then (() => {
            let URL2 = `http://localhost:8000/movie_cast?movie_id=${this.props.location.search.split('movie=')[1]}`;
           
            fetch(URL2, {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            })     
            .then((res2) => {
                console.log("reeeeeeeees = " + res2);
                if (res2.status !== 200)
                    console.log('Failed getting information about the movie, themoviedb.org is not res2ponding');
                else
                    return res2.json();
            })
            .then(resData2 => {
                console.log("reeeeeeeeesData = " + resData2.cast[0].character);
                this.props.setCastInfos(resData2);
            })
        })
        // Torrent
        .then(async () => {
            console.log('Torrent');
            // console.log('in film torrent ; ' + this.props.filmInfosState.film_infos[0].title);
            //  console.log('film_cast TAA MER; ' + this.state.info[1].id);
            // 1. Verifier si le film est dejq en BDD
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
                    return res.json();
                }
                else {
                    console.log('Downloading the movie');
                    // 3. Si non : 
                    //      a. get active providers
                    //      b. chercher le film et verifier que les infos sont coherentes
                    //      c. telecharger jsp comment
                    
                    // 4. Envoyer le film pendant le telechargement
                    // 5. Si on trouve pas le bon film, mettre en liste d'attente par email
                }
            })
        })
    }

    render () {
        // alert(this.state.film_cast.cast);
        return (
            <React.Fragment>
                <div>
                    {this.props.filmInfosState.film_infos.id !== parseInt(this.props.location.search.split('movie=')[1].trim()) ? null :
                        <div className = "row">
                            <h1>{this.props.filmInfosState.film_infos.title}</h1>
                            {/* Infos about {this.props.filmInfosState.film_infos.title} : */}
                            {this.props.filmInfosState.film_infos.release_date ?
                                <div className = 'col-1'>
                                    <h3>Original release date : </h3>
                                    <p>{this.props.filmInfosState.film_infos.release_date}</p>
                                </div> 
                            : null}

                            {this.props.filmInfosState.film_infos.overview ?
                                <div className = 'col-1'>
                                    <h3>Overview : </h3>
                                    <p>{this.props.filmInfosState.film_infos.overview}</p>
                                </div> 
                            : null}

                            {this.props.filmInfosState.film_infos.vote_average ?
                                <div className = 'col-1'>
                                    <h3>Vote Average : </h3> 
                                    <p>{this.props.filmInfosState.film_infos.vote_average}</p>
                                </div> 
                            : null}
                            {this.props.filmInfosState.film_infos.runtime ?
                                <div className = 'col-1'>
                                    <h3>Runtime in minutes: </h3> 
                                    <p>{this.props.filmInfosState.film_infos.runtime} min</p>
                                </div> 
                            : null}
                            {this.props.filmInfosState.film_infos.revenue ?
                                <div className = 'col-1'>
                                    <h3>Revenue in Dollars: </h3> 
                                    <p>{this.props.filmInfosState.film_infos.revenue} $</p>
                                </div> 
                            : null}
                            {this.props.filmInfosState.film_infos.production_countries ?
                                <div className = 'col-1'>
                                    <h3>Production Countries: </h3> 
                                    <p>{this.props.filmInfosState.film_infos.production_countries[0].name}</p>
                                </div> 
                            : null}
                            {this.props.filmInfosState.film_infos.imdb_id ?
                                <div className = 'col-1'>
                                    <h3>IMDB ID: </h3> 
                                    <p>{this.props.filmInfosState.film_infos.imdb_id}</p>
                                </div> 
                            : null}
                            {this.props.filmInfosState.cast_infos.id ?
                            <div className = 'col-1'>
                                <h3>CAST TEST : {this.props.filmInfosState.cast_infos.id}</h3>
                            </div>
                            : null
                            }
                            {this.props.filmInfosState.cast_infos.cast ?
                                this.props.filmInfosState.cast_infos.cast.map((elem, index) => 
                                <div className = 'col-1'>
                                    <h3>{elem.name} as {elem.character}</h3>
                                </div>)
                            : null
                            }
                            <div className = 'col-1'>
                                <img src= {this.props.filmInfosState.film_infos.poster_path ? 'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + this.props.filmInfosState.film_infos.poster_path : "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"} alt={"Poster of " + this.props.filmInfosState.film_infos.title} />
                            </div>
                        </div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default Play;