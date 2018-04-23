import React from "react";
import { ConsumerToHoc } from "./helpers";

const { Provider, Consumer } = React.createContext(() => {});

export const createProgram = (init, Component) => {
  return class Program extends React.Component {
    state = init(this.props);
    dispatch = fn => {
      this.setState(state => ({ model: fn(state.model) }));
    };
    render() {
      return (
        <Provider value={this.dispatch}>
          <Component model={this.state.model} dispatch={this.dispatch} />;
        </Provider>
      );
    }
  };
};

class Command extends React.Component {
  componentDidMount() {
    this.fork();
  }
  componentWillUnmount() {
    this.cancel();
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.command.key !== nextProps.command) {
      this.cancel();
      this.fork();
    }
  }
  fork() {
    this.command = this.props.command.fork(this.dispatch);
  }
  cancel() {
    this.command();
  }
  render() {
    return null;
  }
}

export const Commander = ConsumerToHoc(Consumer, "dispatch", Command);
