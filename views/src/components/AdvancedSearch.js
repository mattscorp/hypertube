import React, { Component } from 'react';
import './navigation/MainNavigation.css';
import translations from '../translations.js';

class AdvancedSearch extends Component {
    render () {
        return (
          <div className="ARcontainer-fluid">
                <form>
                        <label class="text-muted">{translations[this.props.translationState].advanced_search.seen}</label><br />
                        <select class="btn btn-outline-secondary" onChange={this.props.advanceSearchFunction} ref={this.props.seen} name="seen">
                            <option defaultValue>{translations[this.props.translationState].advanced_search.all_movies}</option>
                            <option>{translations[this.props.translationState].advanced_search.seen}</option>
                            {/* <option>{translations[this.props.translationState].advanced_search.not_seen_yet}</option> */}
                        </select>
                    {/* <div>
                        <label>{translations[this.props.translationState].advanced_search.watching}</label>
                        <select onChange={this.props.advanceSearchFunction} type="checkbox" name="watching" ref={this.props.watching}>
                            <option defaultValue>{translations[this.props.translationState].advanced_search.all_movies}</option>
                            <option>{translations[this.props.translationState].advanced_search.watching}</option>
                        </select>
                    </div> */}
                       <br /><label class="text-muted">{translations[this.props.translationState].advanced_search.gender}</label><br />
                        <select  class="btn btn-outline-secondary" onChange={this.props.advanceSearchFunction} ref={this.props.gender}>
                            <option defaultValue value="All">{translations[this.props.translationState].advanced_search.all}</option>
                            <option value="Action">{translations[this.props.translationState].advanced_search.action}</option>
                            <option value="Adventure">{translations[this.props.translationState].advanced_search.adventure}</option>
                            <option value="Animation">{translations[this.props.translationState].advanced_search.animation}</option>
                            <option value="Comedy">{translations[this.props.translationState].advanced_search.comedy}</option>
                            <option value="Crime">{translations[this.props.translationState].advanced_search.crime}</option>
                            <option value="Documentary">{translations[this.props.translationState].advanced_search.documentary}</option>
                            <option value="Drama">{translations[this.props.translationState].advanced_search.drama}</option>
                            <option value="Family">{translations[this.props.translationState].advanced_search.family}</option>
                            <option value="Fantasy">{translations[this.props.translationState].advanced_search.fantasy}</option>
                            <option value="History">{translations[this.props.translationState].advanced_search.history}</option>
                            <option value="Horror">{translations[this.props.translationState].advanced_search.horror}</option>
                            <option value="Music">{translations[this.props.translationState].advanced_search.music}</option>
                            <option value="Mystery">{translations[this.props.translationState].advanced_search.mystery}</option>
                            <option value="Romance">{translations[this.props.translationState].advanced_search.romance}</option>
                            <option value="Science Fiction">{translations[this.props.translationState].advanced_search.science_fiction}</option>
                            <option value="TV Movie">{translations[this.props.translationState].advanced_search.TV_movie}</option>
                            <option value="Thriller">{translations[this.props.translationState].advanced_search.thriller}</option>
                            <option value="War">{translations[this.props.translationState].advanced_search.war}</option>
                            <option value="Western">{translations[this.props.translationState].advanced_search.western}</option>
                        </select>
                        <br /><label class="text-muted">{translations[this.props.translationState].advanced_search.public}</label><br />
                        <select class="btn btn-outline-secondary" onChange={this.props.advanceSearchFunction} ref={this.props.public} name="public">
                            <option defaultValue value="All movies">{translations[this.props.translationState].advanced_search.all_movies}</option>
                            <option value="G">{translations[this.props.translationState].advanced_search.family_friendly}</option>
                        </select>
                        <br /><label class="text-muted">{translations[this.props.translationState].advanced_search.minimum_rating}</label><br />
                        <input onChange={this.props.advanceSearchFunction} ref={this.props.rating} type="range" defaultValue="1" name="rating" min="1" max="10"/>
                        <label class="text-muted">{translations[this.props.translationState].advanced_search.maximum_duration}</label><br />
                        <select class="btn btn-outline-secondary" onChange={this.props.advanceSearchFunction} ref={this.props.duration} name="duration">
                            <option defaultValue></option>
                            <option value="60">{translations[this.props.translationState].advanced_search.less_than_1_hour}</option>
                            <option value="120">{translations[this.props.translationState].advanced_search.less_than_2_hour}</option>
                            <option value="180">{translations[this.props.translationState].advanced_search.less_than_3_hour}</option>
                        </select>
                        <br /><label class="text-muted">{translations[this.props.translationState].advanced_search.decade}</label>
                        <br /><select class="btn btn-outline-secondary" onChange={this.props.advanceSearchFunction} ref={this.props.decade} name="decade"><br />
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
                        </select><br />
                    <br /><button class="btn btn-outline-secondary" onClick={this.props.clearAdvancedSearch}>{translations[this.props.translationState].advanced_search.clear_search}</button>
                </form>
            </div>
        )
    }
}
export default AdvancedSearch;