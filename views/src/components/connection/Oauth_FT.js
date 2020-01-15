import React, { Component } from 'react';
import spinner from '../../resources/spinner.svg';

class AccountPage extends Component {
    componentDidMount() {
        if (!window.location.href.split('=')[1]) {
            window.location.assign('http://localhost:3000');
        } else {
            const ft_code = this.props.location.search.split('=')[1];
            fetch('http://localhost:8000/oauth_ft', {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify({code: ft_code}),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status === 401)
                    alert('Error connecting to 42');
                window.location.assign('http://localhost:3000');
            })
            .catch (err => { console.log(err) })
        }
    }
    render () {
        return (
            <React.Fragment>
                <div className="container mx-auto">
                    <h4 className="text-center">Waiting for 42...</h4>
                    <div className="mx-auto">
                        <img className="mx-auto preloader d-block" src={spinner} alt="spinner"/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AccountPage;