import React, { Component } from 'react';
import spinner from '../../resources/spinner.svg';

class AccountPage extends Component {
    componentWillMount() {
        if (!window.location.href.split('code=')[1]) {
            window.location.assign('http://localhost:3000');
        } else {
            const facebook_code = window.location.href.split('code=')[1].split('&')[0];
            fetch('http://localhost:8000/oauth_facebook', {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify({code: facebook_code}),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status === 401)
                    alert('Error connecting to Facebook');
                window.location.assign('http://localhost:3000');
            })
            .catch (err => { console.log(err) });
        }
    }

    render () {
        return (
            <React.Fragment>
                <div className="container mx-auto">
                    <h4 className="text-center">Waiting for Facebook...</h4>
                    <div className="mx-auto">
                        <img className="mx-auto preloader d-block" src={spinner} alt="spinner"/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AccountPage;