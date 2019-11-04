import React, { Component } from 'react';

class Account extends Component {

    constructor(props) {
        super(props);
        this.loginEl = React.createRef();
        this.firstNameEl = React.createRef();
        this.lastNameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.passwordConfirmEl = React.createRef();
    }

    // LOGOUT
    logout = (event) => {
        event.preventDefault();
        console.log('ICI');
        fetch(`http://localhost:8000/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then(() => { window.location.assign('http://localhost:3000'); })
        .catch((err) => { console.log(err); });
    }

    // SWITCH ON/OFF DARK MODE


    // UPDATE ACCOUNT DATA (login, email, first and last names)
    submitAccountForm = (event) => {
        event.preventDefault();
        if (this.loginEl.current.value.trim().length === 0 || this.emailEl.current.value.trim().length === 0 || this.firstNameEl.current.value.trim().length === 0 || this.lastNameEl.current.value.trim().length === 0) {
            alert("Values can't be empty");
            return;
        } else {
            let URL = 'http://localhost:8000/update_account';
            let requestBody = {
                body: `{login: "${this.loginEl.current.value.trim()}", email: "${this.emailEl.current.value.trim()}", first_name: "${this.firstNameEl.current.value.trim()}", last_name: "${this.lastNameEl.current.value.trim()}"}`
            };
            fetch(URL, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status === 201)
                    alert('Information updated');
            })
            .catch(err => {
                console.log(err);
            })

        }
    }

    // CHANGE PASSWORD

    // CHANGE PHOTO

    render() {
        return (
            <div className="AccountDiv col-md-2">
                <div className="card-body">
                {this.props.userConnectState.uuid ? <div className="nav-item" onClick={this.logout}><button>Logout</button></div> : null}
                    <div className="form-group row">
                        <h1 className="mb-2">Your account</h1>
                    </div>
                    {/* Dark mode toggle */}
                    <div className="form-group row account_input">
                        <label className="col-md-5 col-form-label text-md-right" htmlFor="darkMode">Dark mode</label>
                        <div className="col-md-5">
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    {/* Accout form (always available) */}
                    <form onSubmit={this.submitAccountForm}>
                        <div className="form-group row account_input">
                            <label className="col-md-5 col-form-label text-md-right" htmlFor="firstName">First name</label>
                            <div className="col-md-6">
                                <input required className="form-control" title="Only letters and '-', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="firstName" ref={this.firstNameEl} defaultValue={this.props.userConnectState.first_name}/>
                            </div>
                        </div>
                        <div className="form-group row account_input">
                            <label className="col-md-5 col-form-label text-md-right" htmlFor="lastName">Last name</label>
                            <div className="col-md-6">
                                <input required className="form-control" title="Only letters and '-', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="lastName" ref={this.lastNameEl} defaultValue={this.props.userConnectState.last_name}/>
                            </div>
                        </div>
                        <div className="form-group row account_input">
                            <label className="col-md-5 col-form-label text-md-right" htmlFor="Login">Login</label>
                            <div className="col-md-6">
                                <input required className="form-control" title="Only letters and numbres, minimum 4" type="text" pattern="(?=^.{4,}$)[A-Za-z0-9]+" id="login" ref={this.loginEl} defaultValue={this.props.userConnectState.login}/>
                            </div>
                        </div>
                        <div className="form-group row account_input">
                            <label className="col-md-5 col-form-label text-md-right" htmlFor="email">Email</label>
                            <div className="col-md-6">
                                <input required className="form-control" title="Valid email" type="email" id="email" ref={this.emailEl} defaultValue={this.props.userConnectState.email}/>
                            </div>
                        </div>
                        <div className="form-actions row">
                            <div className="mx-auto">
                                <button className="btn btn-dark" type="submit">Update your information</button>
                            </div>
                        </div>
                    </form>
                    {/* Password section (not available for Oauth2 accounts) */}
                    {(this.props.userConnectState.insta !== 'yes' && this.props.userConnectState.google !== 'yes' && this.props.userConnectState.facebook !== 'yes' && this.props.userConnectState.github !== 'yes' && this.props.userConnectState.ft !== 'yes') ?
                    <form>
                        <div className="form-group row">
                            <label className="col-md-5 col-form-label text-md-right" htmlFor="password_confirm">New password</label>
                            <div className="col-md-6">
                                <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_confirm" ref={this.passwordConfirmEl}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-5 col-form-label text-md-right" htmlFor="password_confirm">Confirm password</label>
                            <div className="col-md-6">
                                <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_confirm" ref={this.passwordConfirmEl}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-5 col-form-label text-md-right" htmlFor="password_confirm">Old password</label>
                            <div className="col-md-6">
                                <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_confirm" ref={this.passwordConfirmEl}/>
                            </div>
                        </div>
                        <div className="form-actions row">
                            <div className="mx-auto">
                                <button className="btn btn-dark" type="submit">Change your password</button>
                            </div>
                        </div>
                    </form> : null}
                </div>
            </div>
        )
    }
}
export default Account;