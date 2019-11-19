import React, { Component } from 'react';
import {google_recaptcha_public} from '../../config_views';
import ReCAPTCHA from 'react-google-recaptcha'

class ResetPassword extends Component {

    state = {
        recaptchaResponse: 0,
    }

    constructor(props) {
        super(props);
        this.passwordEl = React.createRef();
        this.passwordConfirmEl = React.createRef();
        this.recaptchaEl = React.createRef();
        this.handleCaptchaResponseChange = this.handleCaptchaResponseChange.bind(this);
    }

    changePassword = (event) => {
        event.preventDefault();
        if (this.passwordEl.current.value.trim() !== this.passwordConfirmEl.current.value.trim()) {
            alert('Passwords don\'t match');
            return;
        } else if (this.state.recaptchaResponse === 0) {
            alert('Please tick the Google Recaptcha to prove you are not a robot');
            return ;
        } else {
            const requestBody = {
                body: `{password: ${this.passwordEl.current.value.trim()}, uuid: ${this.props.location.search.split('uuid=')[1]}}`
            };
            fetch('http://localhost:8000/reset_password', {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status === 200) {
                    alert('Password has been successfully updated');
                    window.location.assign('http://localhost:3000');
                } else
                    alert('An error has occured');
            })
        }
    }

    handleCaptchaResponseChange(response) {
        this.setState({
          recaptchaResponse: response,
        });
        alert(this.state.recaptchaResponse);
    }

    render() {
        return (
            <React.Fragment>
                <div className="container mx-auto">
                    <form onSubmit={this.changePassword}>
                        <div className="form-actions row">
                            <div className="mx-auto">
                                <div className="form-group row">
                                    <label className="col-md-6 col-form-label text-md-right" htmlFor="password">New password</label>
                                    <div className="col-md-6">
                                        <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password" ref={this.passwordEl}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-6 col-form-label text-md-right" htmlFor="password">Confirm new password</label>
                                    <div className="col-md-6">
                                        <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password" ref={this.passwordConfirmEl}/>
                                    </div>
                                </div>
                                {/* GOOGLE RECAPTCHA V2 */}
                                <div className="mx-auto">
                                    <ReCAPTCHA
                                        ref={this.recaptchaEl}
                                        sitekey={google_recaptcha_public}
                                        onChange={this.handleCaptchaResponseChange}
                                    />
                                </div>
                                <div className="form-group row">
                                    <div className="mx-auto">
                                        <button className="btn btn-dark m-2" type="submit">Validate</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}
export default ResetPassword