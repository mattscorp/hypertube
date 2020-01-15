import React, { Component } from 'react';

class ResetPassword extends Component {

    componentDidMount() {
        if (this.props.location.search.split('uuid=')[1]) {
            const requestBody = {
                body: `{uuid: ${this.props.location.search.split('uuid=')[1]}}`
            };
            fetch('http://localhost:8000/confirm_email', {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {'Content-Type': 'application/json'}
            })
            .then(() => {window.location.assign('http://localhost:3000');});
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="container mx-auto check_email">
                    <h3>Please check your email to confirm your account</h3>
                </div>
            </React.Fragment>
        )
    }
}
export default ResetPassword