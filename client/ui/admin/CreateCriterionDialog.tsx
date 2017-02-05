import * as React from "react";
import { Component, ReactElement } from "react";
import { Dialog, FlatButton, TextField } from "material-ui";
import { Criteria } from "../../lib/Criteria"

interface DialogState {
    name: string;
    message?: string;
}

export default class CreateCriterionDialog extends Component<{ open: boolean, onClose?: () => void, onCreateCriterion?: () => void }, DialogState> {
    state = {
        name: "",
        message: ""
    }

    render() {
        let actions = [
                <FlatButton label="Cancel" primary={ true } onClick={ this.props.onClose }/>,
                <FlatButton label="Create criterion" primary={ true } onClick={ () => this.createCriterion() }/>
            ] as ReactElement<any>[],
            s = this.state;
        return <Dialog open={ this.props.open } title="Create criterion" actions={ actions }>
            <TextField
                hintText="Name"
                floatingLabelText="Name"
                onChange={(e, name) => this.setState({ name: name.trim() })}
                errorText={ s.message }
                fullWidth={true}/>
        </Dialog>;
    }
    private async createCriterion() {
        let s = this.state;
                
        if (!s.name) {
            this.setState({ message: "Criterion name is required" });
        } else {
            try {
                await Criteria.create(s.name);
                if (this.props.onCreateCriterion) { this.props.onCreateCriterion(); }
                if (this.props.onClose) { this.props.onClose(); }
            } catch (e) {
                console.log(e);
                this.setState({ message: "Criterion with this name already exists" });
            }
        }
    }
}