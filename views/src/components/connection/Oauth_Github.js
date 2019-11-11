import React, { Component } from 'react';
import spinner from '../../resources/spinner.svg';

class AccountPage extends Component {
    componentWillMount() {
        const code = this.props.location.search.split('=')[1];
        fetch('http://localhost:8000/oauth_github', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({code: code}),
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
            if (res.status === 401) {
                alert('Error connecting to Github');
            } else if (res.status === 201) {
                alert('Connection successful');
            } else if (res.status === 200) {
                alert('Connection successful');
            }
            window.location.assign('http://localhost:3000');
        })
        .catch (err => { console.log(err) })
    }
    render () {
        return (
            <React.Fragment>
                <div className="container mx-auto">
                    <h4 className="text-center">Waiting for Github...</h4>
                    <div className="mx-auto">
                        <img className="mx-auto preloader d-block" src={spinner} alt="spinner"/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AccountPage;