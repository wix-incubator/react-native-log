import { stringify, parse } from 'jsan';
import socketCluster from 'socketcluster-client';
import { socketOptions } from './constants';

let instanceName;
let socket;
let channel;
let shouldInit = true;

function send(type, payload) {
  setTimeout(() => {
    const message = {
      payload: payload ? stringify(payload) : '',
      type,
      id: socket.id,
      name: instanceName,
      init: shouldInit
    };
    if (shouldInit) shouldInit = false;
    socket.emit(socket.id ? 'log' : 'log-noid', message);
  }, 0);
}

function handleMessages(message) {
}

function init(options) {
  if (channel) channel.unwatch();
  if (socket) socket.disconnect();
  if (options && options.port && !options.hostname) {
    options.hostname = 'localhost';
  }
  socket = socketCluster.connect(options && options.port ? options : socketOptions);

  socket.on('error', function (err) {
    console.warn(err);
  });

  socket.emit('login', 'master', (err, channelName) => {
    if (err) { console.error(err); return; }
    channel = socket.subscribe(channelName);
    channel.watch(handleMessages);
    socket.on(channelName, handleMessages);
  });
  if (options) instanceName = options.name;
}

export default {
  init,
  send
};
