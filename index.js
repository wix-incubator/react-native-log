import websocket from './src/websocket';

websocket.init();

const ReactComponent = require('react/lib/ReactComponent');

const parseErrorStack = require('react-native/Libraries/JavaScriptAppEngine/Initialization/parseErrorStack');
const sourceMapsCache = require('react-native/Libraries/JavaScriptAppEngine/Initialization/SourceMapsCache');

const ReduceStackBy = {
  error: 5,
  warn: 3
};

function printStackTrace(consoleEvent) {
  const e = new Error('dummy');
  sourceMapsCache.getSourceMaps().then(sourceMaps => {
    const prettyStack = parseErrorStack(e, sourceMaps);
    const reducedStack = prettyStack.slice(ReduceStackBy[consoleEvent]);
    console.log(reducedStack);
  });
}

const originalSetState = ReactComponent.prototype.setState;
ReactComponent.prototype.setState = function() {
  console.log(this.constructor.name);
  console.log(arguments);
  originalSetState.apply(this, arguments);
}

if (__DEV__) {
  const {
    error,
    warn,
    log
  } = console;
  console.error = function() {
    error.apply(console, arguments);
    printStackTrace('error');
    setTimeout(() => {
      websocket.send('LOG_ERROR', arguments);
    }, 1000);
  };
  console.warn = function() {
    warn.apply(console, arguments);
    printStackTrace('warn');
    setTimeout(() => {
      websocket.send('LOG_WARN', arguments);
    }, 1000);
  };
  console.log = function() {
    log.apply(console, arguments);
    setTimeout(() => {
      websocket.send('LOG_LOG', arguments);
    }, 1000);

  }
}