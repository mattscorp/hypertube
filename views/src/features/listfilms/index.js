import React, { Component } from 'react';
import Films from './listfilms.js'; 

class FilmsList extends Component{
    state = {
        films: [],
        page: 1,
        totalPage: null,
    }

    componentWillMount () {
        this.loadFilms();
    }

    loadFilms = () =>{

        const {page, films } = this.state;
        const API_KEY = "208ecb5c1ee27eb7b9bc731dc8656bd2";

//  const URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`;
    const URL = `http://localhost:8000/moviedb?action=popular&page=${page}`;


    fetch(URL, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201)
                        throw new Error('Failed');
                    //console.log("okko => " + res);
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

    loadMore = () =>{
        this.setState(prevState => ({
            page : prevState.page + 1,
        }), this.loadFilms)
    }

    render (){
        console.log("this. state . film==> " + JSON.stringify(this.state));
        console.log("this. state . state.films==> " + JSON.stringify(this.state.films));
        return (
            <div className="container">
                <div className="row">
                    {
                        this.state.films.map(film => <div key={film.id} className="col-sm-3" >
                            <Films {...film}/>
                            </div>)
                    }
            </div>
                    <a onClick={this.loadMore}>Load More</a>
            </div>
            
        );
    }
}

export default FilmsList;