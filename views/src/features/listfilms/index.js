import React, { Component } from 'react';
import Films from './listfilms.js'; 

class FilmsList extends Component{

    componentDidMount () {
        this.loadFilms();
        this.scrollListener = window.addEventListener('scroll', (e) => {
            this.handleScroll(e)
        })
    }

    handleScroll = (e) => {
        if(this.props.scrolling) {
            return
        }
        else if(this.props.totalPage <= this.props.page) {
            return
        }
        const lastdiv = document.querySelector('div.row > div:last-child');
        if (lastdiv) {
            const lastdivOffset = lastdiv.offsetTop + lastdiv.clientHeight;
            const pageOffset = window.pageYOffset + window.innerHeight;  
            var bottomOffset = 20;
            if ((pageOffset > lastdivOffset - bottomOffset)) {
                this.loadMore(this.props);
            }
        }
    }

    loadFilms = () => {
        let genderSearch = "";
        let public_category = "";
        let rating = "";
        let duration = "";
        let decade = "";
        if (this.props.advancedSearchState.gender !== 'All') {
            genderSearch = `&category=${this.props.advancedSearchState.gender}`;
        }
        if (this.props.advancedSearchState.public !== 'All movies') {
            public_category = `&public=G`;
        }
        if (this.props.advancedSearchState.rating !== '1') {
            rating = `&rating=${this.props.advancedSearchState.rating}`;
        }
        if (this.props.advancedSearchState.duration !== '') {
            duration = `&duration=${this.props.advancedSearchState.duration}`;
        }
        if (this.props.advancedSearchState.decade !== '') {
            decade = `&decade=${this.props.advancedSearchState.decade}`;
        }
        let research = this.props.homeSearch;
        let URL = '';
        let parseResarch = research.split(" ");
        // Utilisation de parseResearch pour definir si la recherche se fait via un titre ou via une recherche affinnee
        // si parseResearch[0] === "Categories" => action en fonction
        // si 
        if (research === "Trending movies") {
            // const {this.props.page, this.props.films, this.props.scrolling} = this.state;
            URL = `http://localhost:8000/moviedb?action=popular&page=${this.props.page}${decade}${genderSearch}${public_category}${rating}${duration}`;
            fetch(URL, {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status !== 200 && res.status !== 201)
                    throw new Error('Failed');
                return res.json();
            })
            // CASE LOAD_FILMS
            .then((resData => {this.props.loadFilms(resData)}))
            .catch(err => {
                console.log(err);
            });
            // this.setState({ state: this.state });
        }

        // else if (this.props.homeSearch === "Gender :") {

        // }
        else {
            // const {page, films, mode} = this.state;
            if (this.props.mode === null)
            {
                // CASE RESET_FILMS_BEFORE_SEARCH
                this.setState(this.props.resetFilmsBeforeSearch()).then(() => {
                    let search_query = this.props.homeSearch.split(':')[1].trim();
                    URL = `http://localhost:8000/moviedb?action=search&page=1&movie_name=${search_query}${decade}${genderSearch}${public_category}${rating}${duration}`;
                    fetch(URL, {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'}
                    })
                    .then(res => {
                        if (res.status !== 200 && res.status !== 201)
                            throw new Error('Failed');
                        return res.json();
                    })
                    // CASE FIRST_PAGE_SEARCH
                    .then(resData => {
                        this.setState(this.props.firstPageSearch(resData))
                    })
                    .catch(err => {
                        console.log(err);
                    });
                })
                // this.setState({ state: this.state });
            }
            else if (this.props.mode === 1)
            {
                let search_query = this.props.homeSearch.split(':')[1].trim();
                URL = `http://localhost:8000/moviedb?action=search&page=${this.props.page}&movie_name=${decade}${genderSearch}${public_category}${rating}${duration}`;
                fetch(URL, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201)
                        throw new Error('Failed');
                    return res.json();
                })
                // CASE NEXT_PAGE_SEARCH
                .then(resData => {this.props.nextPageSearch(resData)})
                .catch(err => {
                    console.log(err);
                });
                // this.setState({ state: this.state });
            }
        }
    }

    loadMore = (props) => {
        // CASE LOAD_MORE
        this.setState(prevState => (
            this.props.loadMore(props)
        ))
        this.loadFilms();
    }

    render (){
        return (
            <div className="container">
                <div id="result_list" ref="result_list" className="row">
                    {   
                        this.props.films.map((film, index) => <div onLoad={this.increment_id} key={index} id={index} className="col-sm-3 key" >
                                <Films {...film}/>
                            </div>)
                    }
                </div>
            </div>
        );
    }
}

export default FilmsList;