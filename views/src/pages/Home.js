import React, { Component } from 'react';
import FilmsList from '../components/listfilms/index.js'; 

class HomePage extends Component {

  setSearch = (event) => {
    this.props.resetFilmsBeforeSearch();
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <h1 onChange={this.setSearch} className="mx-auto pb-4">{this.props.homeSearch}</h1>
        </div>
        {this.props.advancedSearchState.seen !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4>Seen: {this.props.advancedSearchState.seen}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.watching !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4>Watching: {this.props.advancedSearchState.watching}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.gender !== 'All' ? 
          <div className="row advanced p-2">
            <h4>Gender: {this.props.advancedSearchState.gender}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.public !== 'All movies' ? 
          <div className="row advanced p-2">
            <h4>Public: Family friendly</h4>
          </div> : null
        }
        {this.props.advancedSearchState.rating !== '1' ? 
          <div className="row advanced p-2">
            <h4>Minimum rating: {this.props.advancedSearchState.rating}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.duration !== '' ? 
          <div className="row advanced p-2">
            <h4>Maximum duration: {this.props.advancedSearchState.duration}</h4>
          </div> : null
        }
        {this.props.advancedSearchState.decade !== '' ? 
          <div className="row advanced p-2">
            <h4>Decade: {this.props.advancedSearchState.decade}</h4>
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
          />
      </div>
    );
  }
}

export default HomePage;