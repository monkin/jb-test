import * as React from "react";
import { Component, ComponentClass, CSSProperties } from "react";
import { browserHistory, Link } from "react-router";
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
    [criterion: string]: number;
}

class MarksTable extends Component<{ criteria: Criteria[], users: Meteor.User[], groupBy: "to" | "from", marks: Marks[], muiTheme: MuiTheme }, {}> {
    render() {
        let s = this.state,
            p = this.props,
            palette = p.muiTheme.palette,
            spacing = p.muiTheme.spacing,
            marksByUser = p.marks.reduce((r, v) => {
                if (!r[v[p.groupBy]]) {
                    r[v[p.groupBy]] = {};
                }
                r[v[p.groupBy]][v.criterion] = v.mark;
                return r;
            }, {} as { [userId: string]: MarkByCriterion });
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
            return <table style={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={ Object.assign({ color: headerColor }, cellStyle) }>User</th>
                            {p.criteria.map(criterion => {
                                return <th key={ "head_" + criterion._id } style={ Object.assign({ color: headerColor }, cellStyle) }>{criterion.name}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {p.users.filter(user => marksByUser[user._id as string]).map(user => {
                            let marks = marksByUser[user._id as string];
                            return <tr key={ "u_" + user._id }>
                                <td style={ cellStyle }><Link to={ "/admin/assessment/" + user._id }>{user.profile.name} {user.profile.surname}</Link></td>
                                {p.criteria.map(criterion => {
                                    let m = marks[criterion._id];
                                    return <td style={ cellStyle } key={"c_" + criterion._id}>{ m ? m.toFixed(1) : "n/a" }</td>
                                })}
                            </tr>;
                        })}
                    </tbody>
                </table>;
        } else {
            throw new Error("Palette or spacing not defined");
        }
    }
}

const MarksTableWrapped = muiThemeable()(MarksTable) as ComponentClass<{ criteria: Criteria[], users: Meteor.User[], groupBy: "to" | "from", marks: Marks[] }>;

class UserMarksPage extends Component<{ user: Meteor.User, criteria: Criteria[], users: Meteor.User[], receivedMarks: Marks[], sentMarks: Marks[] }, {}> {
    render() {
        let s = this.state,
            p = this.props,
            userName = p.user ? `${p.user.profile.name} ${p.user.profile.surname}` : "User";

        return <Page value={AdminMenuItem.ASSESSMENT} title="Assessment">
            <Paper style={{ margin: "8px 32px" }} zDepth={ 0 }>
                <CardTitle title={ "Marks received by " + userName }/>
                <MarksTableWrapped criteria={ p.criteria } users={ p.users } groupBy="from" marks={p.receivedMarks}/>

                <CardTitle style={{ marginTop: "32px" }} title={ "Marks sent by " + userName }/>
                <MarksTableWrapped criteria={ p.criteria } users={ p.users } groupBy="to" marks={p.sentMarks}/>
            </Paper>
        </Page>;
    }
}

export default createContainer((props: { params: { userId: string } }) => {
    let userId = props.params.userId;

    Marks.subscribe({ to: userId });
    Marks.subscribe({ from: userId });
    
    return {
        user: Meteor.users.findOne(userId),
        criteria: Criteria.collection.find({}, { sort: { name: 1 } }).fetch(),
        users: Meteor.users.find({ "profile.isAdmin": { $ne: true } }).fetch(),
        receivedMarks: Marks.collection.find({ to: userId }).fetch(),
        sentMarks: Marks.collection.find({ from: userId }).fetch()
    };
}, UserMarksPage) as ComponentClass<{ userId: string }>;