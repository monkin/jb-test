import * as React from "react";
import { Component } from "react";
import { Dialog, FlatButton, TextField } from "material-ui";

export class Login extends Component<{}, { email: string, password: string, emailMessage: string, passwordMessage: string }> {

    state = {
        email: "",
        password: "",
        emailMessage: "",
        passwordMessage: ""
    };

    public render() {
        let emailInput = <TextField
                hintText="Name or Email"
                floatingLabelText="Name or Email"
                fullWidth={true}
                onChange={(e) => this.setState({ email: e.target["value"] })}
                errorText={this.state.emailMessage}/>,
            passwordInput = <TextField
                hintText="Password"
                floatingLabelText="Password"
                fullWidth={true}
                onChange={(e) => this.setState({ password: e.target["value"] })}
                type="password"
                errorText={this.state.passwordMessage}/>,
            actions = [
                <div style={{ padding: "0 16px 8px 16px" }}>
                    <FlatButton
                        style={{ textAlign: "center", display: "block", width: "100%" }}
                        label="Log in"
                        primary={true}
                        onClick={() => this.login(this.state.email, this.state.password)}/>
                </div>
            ] as React.ReactElement<any>[];
        return <Dialog open={true} title="Login" actions={actions}>
            {emailInput}
            <br/>
            {passwordInput}
        </Dialog>;
    }

    private login(email: string, password: string) {
        if (!email) {
            this.setState({ emailMessage: "User name is required", passwordMessage: "" });
        } else if (!password) {
            this.setState({ emailMessage: "", passwordMessage: "Password is required" });
        } else {
            Meteor.loginWithPassword(email, password, (error, data) => {
                if (error) {
                    console.error(error);
                    this.setState({ emailMessage: "Invalid password or user name", passwordMessage: "" })
                } else {
                    this.setState({ emailMessage: "", passwordMessage: "" });
                }
                console.info(Accounts.user());
            });
        }
    }

}