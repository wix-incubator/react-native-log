import websocket from './src/websocket';

websocket.init();

const ReactComponent = require('react/lib/ReactComponent');

const parseErrorStack = require('react-native/Libraries/JavaScriptAppEngine/Initialization/parseErrorStack');
const sourceMapsCache = require('react-native/Libraries/JavaScriptAppEngine/Initialization/SourceMapsCache');

const REDUCE_STACK_BY = {
  error_warning: 5,
  error: 3,
  warn: 3,
  log: 2
};

const MESSAGE_TYPES = {
  error_warning: 'LOG_ERROR',
  error: 'LOG_ERROR',
  warn: 'LOG_WARN',
  log: 'LOG_LOG'
}

const originalSetState = ReactComponent.prototype.setState;
ReactComponent.prototype.setState = function() {
  //console.log(this.constructor.name);
  //console.log(arguments);
  originalSetState.apply(this, arguments);
}

function getTimestamp() {
  return (new Date).getTime();
}

function reportConsole(type, timestamp, args) {
  reportConsoleAsync(type, timestamp, args, new Error('dummy'));
}

async function reportConsoleAsync(type, timestamp, args, e) {
  let line;
  let stack;
  if (args[0] && args[0].toString().startsWith('Warning: ')) {
    type = 'error_warning';
  }
  if (e) {
    const sourceMaps = await sourceMapsCache.getSourceMaps();
    const prettyStack = parseErrorStack(e, sourceMaps);
    const reducedStack = prettyStack.slice(REDUCE_STACK_BY[type]);
    line = reducedStack[0].file + ':' + reducedStack[0].lineNumber;
    stack = reducedStack;
  }
  const payload = {
    args: args,
    ts: timestamp,
    stack: stack,
    line: line
  };
  websocket.send(MESSAGE_TYPES[type], payload);
}

if (__DEV__) {
  const {
    error,
    warn,
    log
  } = console;
  console.error = function() {
    const timestamp = getTimestamp();
    error.apply(console, arguments);
    reportConsole('error', timestamp, arguments);
  };
  console.warn = function() {
    const timestamp = getTimestamp();
    warn.apply(console, arguments);
    reportConsole('warn', timestamp, arguments);
  };
  console.log = function() {
    const timestamp = getTimestamp();
    log.apply(console, arguments);
    reportConsole('log', timestamp, arguments);
  }
}
