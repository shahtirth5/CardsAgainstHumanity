import React from "react";
import * as A from "../../shared/actions";
import { ContainerBase } from "../../lib/component";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField, Button, Dialog } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert/Alert";

class LoginDialog extends ContainerBase {
    constructor(props) {
        super(props);
        this._close = (e) => {
            e.preventDefault();
            this.dispatch(A.dialogSet(A.DIALOG_LOGIN, false));
        };

        this._login = (e) => {
            e.preventDefault();
            this.request(A.userLogin(this._username.value))
        };

        // this.state = {
        //     opLogin: {can: true, inProgress: false}
        // }
    }

    componentWillMount() {
        const { stores: { user } } = this.context;
        this.subscribe(user.opLogin$, opLogin => this.setState({ opLogin }));
        this.subscribe(user.details$, details => {
            if (details.isLoggedIn) {
                this.dispatch(A.dialogSet(A.DIALOG_LOGIN, false));
            }
        });
    }

    render() {
        const { opLogin } = this.state;
        const disabled = opLogin.inProgress;
        return (
            <section id="login-dialog-section">
                <Dialog
                    open={true}
                    fullWidth
                    maxWidth="md"
                    onClose={this._close}
                >
                    <DialogTitle>Login</DialogTitle>
                    <form onSubmit={this._login} disabled={disabled}>
                        <DialogContent>
                            <TextField
                                placeholder="Username"
                                fullWidth
                                inputRef={c => this._username = c}
                                disabled={disabled || !opLogin.can}
                                autoFocus
                            />
                            {!opLogin.error ? null : <Alert severity="error"> {opLogin.error}</Alert>}
                        </DialogContent>
                        <DialogActions>
                            <Button type="submit" variant="contained" color="primary" className="m-2">Login</Button>
                            <Button variant="outlined" className="m-2" onClick={this._close}>Close</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </section>
        );
    }
}

export default {
    id: A.DIALOG_LOGIN,
    component: LoginDialog
};