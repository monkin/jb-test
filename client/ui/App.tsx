import * as React from 'react';
import { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { Router, Route, browserHistory } from 'react-router';

import { Login } from './Login';
import { Page } from './admin/Page';
 
export class App extends Component<{}, {}> {
 
  render() {
    return <Router history={browserHistory}>
        <Route path="/" component={Login}/>
        <Route path="/login" component={Login}/>
        <Route path="/admin" component={Page}/>
    </Router>;
  }
}