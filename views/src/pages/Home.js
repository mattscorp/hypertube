import React, { Component } from 'react';
import FilmsList from '../components/listfilms/index.js'; 

class HomePage extends Component {

  setSearch = (event) => {
    this.props.resetFilmsBeforeSearch();
  }

  render () {
    return (
      <div className={this.props.darkModeState ? "container bg-dark list-films-all" : "container bg-white list-films-all"}>
        <div className="row">
          <h1 onChange={this.setSearch} className={this.props.darkModeState ? "text-white mx-auto pb-4" : "text-dark mx-auto pb-4"}>{this.props.homeSearch}</h1>
        </div>
        {this.props.advancedSearchState.seen !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>Seen: {this.props.advancedSearchState.seen}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.watching !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>Watching: {this.props.advancedSearchState.watching}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.gender !== 'All' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>Gender: {this.props.advancedSearchState.gender}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.public !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>Public: Family friendly</h4>
          </div> : null
        }
        {this.props.advancedSearchState.rating !== '1' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>Minimum rating: {this.props.advancedSearchState.rating}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.duration !== '' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>Maximum duration: {this.props.advancedSearchState.duration}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.decade !== '' ? 
          <div className="row advanced p-2">
            <h4 className={this.props.darkModeState ? "text-white" : "text-dark"}>Decade: {this.props.advancedSearchState.decade}</h4>
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