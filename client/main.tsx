/// <reference path="../node_modules/@types/meteor/index.d.ts"/>

import "es6-shim";
import * as React from 'react';
import { render } from 'react-dom';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider } from "material-ui/styles";

import * as injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import { App } from './ui/App';

Meteor.startup(() => {
    let app = <MuiThemeProvider><App/></MuiThemeProvider>;
    render(app, document.getElementById('render-target'));
});