import React, { Component } from 'react';
import NoPhoto from '../resources/no_image.jpeg'


class UserProfile extends Component {
    render () {
        return (
            <div className="user_popup_div">
                <p>{this.props.elem.login ? this.props.elem.login : this.props.elem.first_name}</p>
                <p>Number of films views: {this.props.user_infos.nb_views ? this.props.user_infos.nb_views : 0}</p>
                <p>Number comments: {this.props.user_infos.nb_comments ? this.props.user_infos.nb_comments : 0}</p>
                <p>Number of films rated: {this.props.user_infos.nb_ratings ? this.props.user_infos.nb_ratings : 0}</p>
                <div >
                    {!this.props.user_infos.profile_picture || this.props.user_infos.profile_picture === undefined ? 
                        <img className="profile_picture" src={NoPhoto}/>
                        : <img className="profile_public_picture" src={this.props.user_infos.profile_picture.replace('views/public', '.')}/>
                    }
                </div>
                <button onClick={this.props.hide_user}>X</button>
            </div>
        )
    }
}
export default UserProfile;