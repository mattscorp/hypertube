import React, { Component } from 'react';
import FilmsList from '../components/listfilms/index.js'; 
import translations from '../translations.js';

class HomePage extends Component {

  componentDidMount = async () => {
    this.props.resetFilmsBeforeSearch();
  }
  setSearch = (event) => {
    this.props.resetFilmsBeforeSearch();
  }

  render () {
    return (
      <div className={this.props.darkModeState ? "container bg-dark list-films-all" : "container bg-white list-films-all"}>
        
        <div className="row">
          <h1 onChange={this.setSearch} className={this.props.darkModeState ? "text-white mx-auto pb-4" : "text-dark mx-auto pb-4"}>
            {this.props.translationState && this.props.translationState !== "en" ? this.props.homeSearch.replace("Trending movies", "Films populaires").replace("Research:", "Recherche :") : this.props.homeSearch}
          </h1>
        </div>
        {this.props.advancedSearchState.seen !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>{translations[this.props.translationState].advanced_search.seen} : {this.props.advancedSearchState.seen}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.watching !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>{translations[this.props.translationState].advanced_search.watching} : {this.props.advancedSearchState.watching}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.gender !== 'All' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>{translations[this.props.translationState].advanced_search.gender} : {this.props.advancedSearchState.gender}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.public !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>{translations[this.props.translationState].advanced_search.public}  : Family friendly</h4>
          </div> : null
        }
        {this.props.advancedSearchState.rating !== '1' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>{translations[this.props.translationState].advanced_search.minimum_rating}  : {this.props.advancedSearchState.rating}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.duration !== '' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>{translations[this.props.translationState].advanced_search.maximum_duration} : {this.props.advancedSearchState.duration} min</h4>
          </div> : null
        }
        {this.props.advancedSearchState.decade !== '' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>{translations[this.props.translationState].advanced_search.decade} : {this.props.advancedSearchState.decade}</h4>
          </div> : null
        }
        <FilmsList 
          homeSearch={this.props.homeSearch}
          films={this.props.films}
          page={this.props.page}
          scrolling={this.props.scrolling}
          totalPage={this.props.totalPage}
          mode={this.props.mode}
          loadFilms={(resData) => {this.props.loadFilms(resData)}}
          resetFilmsBeforeSearch={() => {this.props.resetFilmsBeforeSearch()}}
          firstPageSearch={(resData) => {this.props.firstPageSearch(resData)}}
          nextPageSearch={(resData) => {this.props.nextPageSearch(resData)}}
          loadMore={(prevState) => {this.props.loadMore(prevState)}}
          advancedSearchState={this.props.advancedSearchState}
          darkModeState={this.props.darkModeState}
          />
      </div>
    );
  }
}

export default HomePage;