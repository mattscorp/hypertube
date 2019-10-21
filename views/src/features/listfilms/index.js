import React, { Component } from 'react';
import Films from './listfilms.js'; 

class FilmsList extends Component{
    state = {
        films: [],
        per: 12,
        page: 1,
        totalPage: null,
    }

    componentWillMount () {
        this.loadFilms();
    }

    loadFilms = () =>{
        const {per, page, films } = this.state;
        const URL = 'http://localhost:8000/moviedb?action=popular';
        const API_KEY = "208ecb5c1ee27eb7b9bc731dc8656bd2";
    fetch(URL, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201)
                        throw new Error('Failed');
                    console.log("okko => " + res);
                    return res.json();
                })
                .then(resData => this.setState({
                   films: [...films, ...resData]
                  //  console.log( "yolo = >" + JSON.stringify(resData[0].title));
                }))
                .catch(err => {
                    console.log(err);
                });


            }







    render (){
        console.log("this. state . film==> " + JSON.stringify(this.state));
        return (
            <ul className="liste_film">
                {
                    this.state.films.map(film => <li>{film.title}</li>)
                }
            </ul>
        );
    }
}

export default FilmsList;