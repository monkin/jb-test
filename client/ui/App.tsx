import * as React from 'react';
import { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { Login } from './Login';
import { Page } from './admin/Page';

import UsersPage from './admin/UsersPage';
import CriteriaPage from "./admin/CriteriaPage";
import AdminAssessmentPage from "./admin/AssessmentPage";
import UserMarksPage from "./admin/UserMarksPage";

import UserListPage from "./user/SelectUserPage";
import AssessmentPage from "./user/AssessmentPage";
 
export class App extends Component<{}, {}> {
 
  render() {
    let user = Meteor.user();
    return <Router history={browserHistory}>
        <Route path="/" component={Login}/>
        <Route path="/login" component={Login}/>
        <Route path="/admin" component={UsersPage}/>
        <Route path="/admin/users" component={UsersPage}/>
        <Route path="/admin/criteria" component={CriteriaPage}/>
        <Route path="/admin/assessment" component={AdminAssessmentPage}/>
        <Route path="/admin/assessment/:userId" component={UserMarksPage}/>
        <Route path="/assessment" component={UserListPage}/>
        <Route path="/assessment/:username" component={AssessmentPage}/>
    </Router>;
  }
}