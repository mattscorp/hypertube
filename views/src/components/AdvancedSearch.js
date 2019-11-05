import React, { Component } from 'react';
import './navigation/MainNavigation.css';

class AdvancedSearch extends Component {
    render () {
        return (
            <div className="card-body">
                <h2>Advanced search</h2>
                <form>
                    <div>
                        <label>Seen</label>
                        <select onChange={this.props.advanceSearchFunction} ref={this.props.seen} name="seen">
                            <option defaultValue>All movies</option>
                            <option>Seen</option>
                            <option>Not seen yet</option>
                        </select>
                    </div>
                    <div>
                        <label>Watching</label>
                        <select onChange={this.props.advanceSearchFunction} type="checkbox" name="watching" ref={this.props.watching}>
                            <option defaultValue>All movies</option>
                            <option>Watching</option>
                        </select>
                    </div>
                    <div>
                        <label>Gender</label>
                        <select onChange={this.props.advanceSearchFunction} ref={this.props.gender}>
                            <option defaultValue value="All">All</option>
                            <option value="Action">Action</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Animation">Animation</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Crime">Crime</option>
                            <option value="Documentary">Documentary</option>
                            <option value="Drama">Drama</option>
                            <option value="Family">Family</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="History">History</option>
                            <option value="Horror">Horror</option>
                            <option value="Music">Music</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Romance">Romance</option>
                            <option value="Science Fiction">Science Fiction</option>
                            <option value="TV Movie">TV Movie</option>
                            <option value="Thriller">Thriller</option>
                            <option value="War">War</option>
                            <option value="Western">Western</option>
                        </select>
                    </div>
                    <div>
                        <label>Public</label>
                        <select onChange={this.props.advanceSearchFunction} ref={this.props.public} name="public">
                            <option defaultValue value="All movies">All movies</option>
                            <option value="G">Family friendly</option>
                        </select>
                    </div>
                    <div>
                        <label>Minimun rating</label>
                        <input onChange={this.props.advanceSearchFunction} ref={this.props.rating} type="range" defaultValue="1" name="rating" min="1" max="10"/>
                    </div>
                    <div>
                        <label>Maximum duration</label>
                        <select onChange={this.props.advanceSearchFunction} ref={this.props.duration} name="duration">
                            <option defaultValue></option>
                            <option value="60">Less than 1 hour</option>
                            <option value="120">Less than 2 hours</option>
                            <option value="180">More than 2 hours</option>
                        </select>
                    </div>
                    <div>
                        <label>Awards</label>
                        <select onChange={this.props.advanceSearchFunction} ref={this.props.awards} name="awards">
                            <option defaultValue></option>
                            <option>Only awarded movies</option>
                        </select>
                    </div>
                    <div>
                        <label>Decade</label>
                        <select onChange={this.props.advanceSearchFunction} ref={this.props.decade} name="decade">
                            <option></option>
                            <option>2010</option>
                            <option>2000</option>
                            <option>1990</option>
                            <option>1980</option>
                            <option>1970</option>
                            <option>1960</option>
                            <option>1950</option>
                            <option>1940</option>
                            <option>1930</option>
                        </select>
                    </div>
                    <div>
                        <label>Actor</label>
                        <input onChange={this.props.advanceSearchFunction} ref={this.props.actor} type="text" name="actor"/>
                    </div>
                    <div>
                        <label>Director</label>
                        <input onChange={this.props.advanceSearchFunction} ref={this.props.director} type="text" name="director"/>
                    </div>
                    <button onClick={this.props.clearAdvancedSearch}>Clear search</button>
                </form>
            </div>
        )
    }
}
export default AdvancedSearch;