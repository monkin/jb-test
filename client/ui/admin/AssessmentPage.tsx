import * as React from "react";
import { Component, ComponentClass, CSSProperties } from "react";
import { browserHistory } from "react-router";
import { FloatingActionButton, Snackbar, Paper, CardTitle, FlatButton, Table, TableHeader, TableRow, TableBody, TableHeaderColumn, TableRowColumn } from "material-ui";
import ContentAdd from "material-ui/svg-icons/content/add";
import ActionDelete from "material-ui/svg-icons/action/delete";
import { createContainer } from "react-meteor-data";
import { Criteria } from "../../lib/Criteria";
import { Marks, Summary } from "../../lib/Marks";
import { Page, AdminMenuItem } from "./Page"
import { MuiTheme } from "material-ui/styles";
import muiThemeable from 'material-ui/styles/muiThemeable';

interface MarkByCriterion {
    [criterion: string]: { count: number, sum: number };
}

class AssessmentPage extends Component<{ criteria: Criteria[], users: Meteor.User[], summary: Summary[], muiTheme: MuiTheme }, { activeUser?: string }> {
    state = {
        activeUser: undefined as (string | undefined)
    }

    render() {
        let s = this.state,
            p = this.props,
            marksByUser = p.summary.reduce((r, v) => {
                if (!r[v.user]) {
                    r[v.user] = {};
                }
                r[v.user][v.criterion] = v;
                return r;
            }, {} as { [userId: string]: MarkByCriterion }),
            palette = p.muiTheme.palette,
            spacing = p.muiTheme.spacing;

        if (palette && spacing) {
            const cellStyle: CSSProperties = {
                    padding: "16px",
                    borderWidth: "0 0 1px 0",
                    borderColor: palette.borderColor,
                    borderStyle: "solid",
                    textAlign: "left",
                    fontWeight: "normal",
                    fontSize: "13px"
                },
                headerColor = palette["secondaryTextColor"],
                borderColor = palette.borderColor;
            return <Page value={AdminMenuItem.ASSESSMENT} title="Assessment">
                <Paper style={{ margin: "8px 32px" }} zDepth={ 0 }>
                    <CardTitle title="Assessment"/>
                    <table style={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={ Object.assign({ color: headerColor }, cellStyle) }>User</th>
                                {p.criteria.map(criterion => {
                                    return <th key={ "head_" + criterion._id } style={ Object.assign({ color: headerColor }, cellStyle) }>{criterion.name}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody onMouseLeave={ () => this.setState({ activeUser: undefined }) }
                                onMouseUp={ () => this.setState({ activeUser: undefined }) }>
                            {p.users.map(user => {
                                let marks = marksByUser[user._id as string] || {};
                                return <tr key={ "u_" + user._id }
                                        style={ user._id === s.activeUser ? { background: borderColor, cursor: "pointer" } : { cursor: "pointer" }}
                                        onClick={ () => browserHistory.push("/admin/assessment/" + encodeURIComponent(user._id as string)) }
                                        onMouseDown={ () => this.setState({ activeUser: user._id }) }>
                                    <td style={ cellStyle }>{user.profile.name} {user.profile.surname}</td>
                                    {p.criteria.map(criterion => {
                                        let m = marks[criterion._id];
                                        return <td style={ cellStyle } key={"c_" + criterion._id}>{ (m && m.count) ? (m.sum / m.count).toFixed(1) + " (" + m.count + ")" : "n/a" }</td>
                                    })}
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </Paper>
            </Page>;
        } else {
            throw new Error("Palette or spacing not defined");
        }
    }
}

export default muiThemeable()(createContainer(() => {

    Criteria.subscribe();
    Meteor.subscribe("allUsers");
    Summary.subscribe();
    
    return {
        criteria: Criteria.collection.find({}, { sort: { name: 1 } }).fetch(),
        users: Meteor.users.find({ "profile.isAdmin": { $ne: true } }).fetch(),
        summary: Summary.collection.find().fetch()
    };
}, AssessmentPage)) as ComponentClass<{}>;