import * as React from "react";
import { Component } from "react";
 
// Task component - represents a single todo item
export class Task extends Component<{ task: { _id: number, text: string } }, {}> {
  render() {
    return <li>{this.props.task.text}</li>;
  }
}