import React, { Component } from 'react';

class NotFound extends Component {

    return_home = () => {
        window.location.assign('/');
    }

    render () {
        return (
            <div className="page_not_found">
                <h1>Error 404: Page not found</h1>
                <button onClick={this.return_home}>Return Home</button>
            </div>
        )
    }
};
export default NotFound;