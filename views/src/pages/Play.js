import React, { Component } from 'react';

class Play extends Component {

    state = {
        film_infos: ""
    }

    componentDidMount () {
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
            this.setState(prevState => {
                return {film_infos: resData};
            });
        })
        .then(async () => {
            console.log('Torrent');
            console.log('in film torrent ; ' + this.state.film_infos.title);
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
        return (
            <div>
                {parseInt(this.state.film_infos.id) !== parseInt(this.props.location.search.split('movie=')[1].trim()) ? null :
                    <div>
                        <h1>Title : {this.state.film_infos.title}</h1>
                        <h1>Title : {this.state.film_infos.id}</h1>
                    </div>
                }
            </div>
        )
    }
}

export default Play;