import React from "react";

export const createProgram = (init, Component) => {
  return class Program extends React.Component {
    state = { model: init(this.props) };
    dispatch = fn => {
      this.setState(state => ({ model: fn(state.model) }));
    };
    render() {
      return (
        <Component
          {...this.props}
          model={this.state.model}
          dispatch={this.dispatch}
        />
      );
    }
  };
};

export class Commander extends React.Component {
  componentDidMount() {
    this.fork();
  }
  componentWillUnmount() {
    this.cancel();
  }
  componentDidUpdate(prevProps) {
    if (this.props.command.key !== prevProps.command.key) {
      this.cancel();
      this.fork();
    }
  }
  fork() {
    this.props.onChange();
    this.command = this.props.command.fork(this.props.onFork);
  }
  cancel() {
    this.command();
  }
  render() {
    return null;
  }
}
