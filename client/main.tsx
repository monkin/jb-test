
/// <reference types="@types/meteor" />

import "es6-shim";
import * as React from 'react';
import { render } from 'react-dom';

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import * as injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import { App } from './ui/App';

Meteor.startup(() => {
    render(<MuiThemeProvider><App/></MuiThemeProvider>, document.getElementById('render-target'));
});
