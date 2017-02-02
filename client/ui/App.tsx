import * as React from 'react';
import { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { Router, Route, Link, browserHistory } from 'react-router';

import { Login } from './Login';
import { Task } from './Task';
 
export class App extends Component<{}, {}> {
 
  render() {
    return <Router history={browserHistory}>
        <Route path="/" component={Login}/>
        <Route path="/login" component={Login}/>
    </Router>;
  }
}