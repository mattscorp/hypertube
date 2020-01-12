import React, { Component } from 'react';
import NoPhoto from '../resources/no_image.jpeg'


class UserProfile extends Component {
    render () {
        return (
            <div className="border border-light user_popup_div">
                <h3>{this.props.elem.login ? this.props.elem.login : this.props.elem.first_name}</h3>
                <h4>Number of films views: {this.props.user_infos.nb_views && this.props.user_infos.nb_views >= 0 ? this.props.user_infos.nb_views : 0}</h4>
                <h4>Number comments: {this.props.user_infos.nb_comments && this.props.user_infos.nb_comments >= 0 ? this.props.user_infos.nb_comments : 0}</h4>
                <h4>Number of films rated: {this.props.user_infos.nb_ratings && this.props.user_infos.nb_ratings >= 0 ? this.props.user_infos.nb_ratings : 0}</h4>
                <div >
                    {!this.props.user_infos.profile_picture || this.props.user_infos.profile_picture === undefined ? 
                        <img alt="profile 1" className="profile_picture" src={NoPhoto}/>
                        : <img alt="profile 2" className="profile_public_picture" src={this.props.user_infos.profile_picture.replace('views/public', '.')}/>
                    }
                </div>
                <div className="close_user_popup" >
                    <button className="btn btn-success btn-style " onClick={this.props.hide_user}>X</button>
                </div>
            </div>
        )
    }
}
export default UserProfile;