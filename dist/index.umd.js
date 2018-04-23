(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global.Amigos = {}),global.React));
}(this, (function (exports,React) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  var key = 0;

  var Cmd = function Cmd(fork) {
    return {
      fork: fork,
      key: key++
    };
  };

  Cmd.none = Cmd(function () {});

  Cmd.fromPromise = function (resFn, rejFn, promise) {
    return Cmd(function (fork) {
      var isCancelled = false;
      promise().then(function (x) {
        return !isCancelled && fork(resFn(x));
      }).catch(function (y) {
        return !isCancelled && fork(rejFn(y));
      });
      return function () {
        return isCancelled = true;
      };
    });
  };

  Cmd.fromTask = function (resFn, rejFn, task) {
    return Cmd(function (fork) {
      var execution = task.fork(function (x) {
        return fork(resFn(x));
      }, function (y) {
        return fork(rejFn(y));
      });
      return function () {
        return execution.cancel();
      };
    });
  };

  Cmd.fromIO = function (resFn, io) {
    return Cmd(function (fork) {
      var isCancelled = false;
      io.fork(function (x) {
        return !isCancelled && fork(resFn(x));
      });
      return function () {
        return isCancelled = true;
      };
    });
  };

  Cmd.fromObservable = function (resFn, rejFn, observable) {
    return Cmd(function (fork) {
      var execution = observable.subscribe(function (x) {
        return fork(resFn(x));
      }, function (y) {
        return fork(rejFn(y));
      });
      return function () {
        return execution.unsubscribe();
      };
    });
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var createProgram = function createProgram(init, Component) {
    return function (_React$Component) {
      inherits(Program, _React$Component);

      function Program() {
        var _ref;

        var _temp, _this, _ret;

        classCallCheck(this, Program);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Program.__proto__ || Object.getPrototypeOf(Program)).call.apply(_ref, [this].concat(args))), _this), _this.state = { model: init(_this.props) }, _this.dispatch = function (fn) {
          _this.setState(function (state) {
            return { model: fn(state.model) };
          });
        }, _temp), possibleConstructorReturn(_this, _ret);
      }

      createClass(Program, [{
        key: "render",
        value: function render() {
          return React.createElement(Component, { model: this.state.model, dispatch: this.dispatch });
        }
      }]);
      return Program;
    }(React.Component);
  };

  var Commander = function (_React$Component2) {
    inherits(Commander, _React$Component2);

    function Commander() {
      classCallCheck(this, Commander);
      return possibleConstructorReturn(this, (Commander.__proto__ || Object.getPrototypeOf(Commander)).apply(this, arguments));
    }

    createClass(Commander, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.fork();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.cancel();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (this.props.command.key !== prevProps.command.key) {
          this.cancel();
          this.fork();
        }
      }
    }, {
      key: "fork",
      value: function fork() {
        this.command = this.props.command.fork(this.props.onFork);
      }
    }, {
      key: "cancel",
      value: function cancel() {
        this.command();
      }
    }, {
      key: "render",
      value: function render() {
        return null;
      }
    }]);
    return Commander;
  }(React.Component);

  exports.Cmd = Cmd;
  exports.createProgram = createProgram;
  exports.Commander = Commander;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
