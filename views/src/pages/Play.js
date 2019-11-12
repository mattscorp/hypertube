import React, { Component } from 'react';

class Play extends Component {

    render () {
        return (
            <h1>URL : {this.props.location.search}</h1>
        )
    }
}

export default Play;