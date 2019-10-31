import React, { Component } from 'react';
import FilmsList from '../features/listfilms'; 

class HomePage extends Component {

  setSearch = (event) => {
    alert('SALUT toi');
    this.props.resetFilmsBeforeSearch();
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <h1 onChange={this.setSearch} className="mx-auto pb-4">{this.props.homeSearch}</h1>
          </div>
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
          />
      </div>
    );
  }
}

export default HomePage;