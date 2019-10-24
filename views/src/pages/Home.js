import React, { Component } from 'react';
import FilmsList from '../features/listfilms'; 

class HomePage extends Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <h1 className="mx-auto pb-4">{this.props.homeSearch}</h1>
          </div>
        <FilmsList />
      </div>
    );
  }
}

export default HomePage;