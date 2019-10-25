import React, { Component } from 'react';
import Films from './listfilms.js'; 

class FilmsList extends Component{
    state = {
        films: [],
        page: 1,
        totalPage: null,
        scrolling: false,
        mode: null,
    }

    componentDidMount () {
        this.loadFilms();
        this.scrollListener = window.addEventListener('scroll', (e) => {
            this.handleScroll(e)
        })
    }

    handleScroll = (e) => {
        const{ scrolling, totalPage, page, mode} = this.state;
        const last_id = (this.state.page * 20) - 1;
        if(scrolling) return
        if(totalPage <= page) return
        const lastdiv = document.querySelector('div.row > div:last-child');
        const lastdivOffset = lastdiv.offsetTop + lastdiv.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;  
        var bottomOffset = 20;
        if ((pageOffset > lastdivOffset - bottomOffset) && mode === null) this.loadMore();
        if ((pageOffset > lastdivOffset - bottomOffset) && mode === 1) this.loadMoreSearch();
    }

    loadFilms = () => {
        const {page, films} = this.state;
        let URL = ''
        if (this.props.homeSearch == "Trending movies") {
            URL = `http://localhost:8000/moviedb?action=popular&page=${page}`;
        }
        else {
            let search_query = this.props.homeSearch.split(':')[1].trim();
            URL = `http://localhost:8000/moviedb?action=search&page=${page}&movie_name=${search_query}`;
        }

        fetch(URL, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201)
                    throw new Error('Failed');
                return res.json();
        })
            .then(resData => {
                this.setState({
            films: [...films, ...resData],
            scrolling: false,
            totalPage: resData.totalPage,
        })}
        )
            .catch(err => {
                console.log(err);
        });
    }

    loadMore = () =>{
        this.setState(prevState => ({
            page : prevState.page + 1,
            scrolling: true,
        }), this.loadFilms)
    }

    // loadFilmsSearch = () =>{

    //     const {page, films } = this.state;
    //     const URL = `http://localhost:8000/moviedb?action=popular&page=${page}`;

    //     fetch(URL, {
    //             method: 'GET',
    //             headers: {'Content-Type': 'application/json'}
    //     })
    //         .then(res => {
    //             if (res.status !== 200 && res.status !== 201)
    //                 throw new Error('Failed');
    //             return res.json();
    //         })
    //         .then(resData => this.setState({
    //             films: [...films, ...resData],
    //             scrolling: false,
    //             totalPage: resData.totalPage,
    //         }))
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }

    // loadMoreSearch = () => {
    //     this.setState(prevState => ({
    //         page : prevState.page + 1,
    //         scrolling: true,
    //     }), this.loadFilms)
    // }

    render (){
        return (
            <div className="container">
                <div homeSearch={this.props.homeSearch} id="result_list" ref="result_list" className="row">
                    {   
                        this.state.films.map((film, index) => <div onLoad={this.increment_id} key={index} id={index} className="col-sm-3 key" >
                                <Films {...film}/>
                            </div>)
                    }
                </div>
            </div>
        );
    }
}

export default FilmsList;