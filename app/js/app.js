const feed = (function() {
  'use strict';

  const url = 'https://cex.io/api/tickers/USD';

  const get = function()
  {
    return new Promise(function(resolve, reject){
      var req = new XMLHttpRequest();
      req.open('GET', `${url}`, true);
      req.setRequestHeader('Content-type', 'application/json');

      req.onload = function()
      {
        if(
          req.status == 200
          || req.status == 201
          || req.status == 204
        )
        {
          resolve(req.response);
        }
        else
        {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function()
      {
        reject(Error(`could not connect to ${origin}`));
      }

      req.send();
    });
  }

  return {
    get
  }
})();

const connection = (function() {
  'use strict';
  /*
   *
   */
  var debug = true;
  var auto = true;
  var tick = true;
  var browser = true;

  /*
   *
   */
  var portstring = "/dev/tty.usbmodem";
  var port;

  /*
   *
   */
  var log = function(message) {
    if(debug)
    {
      let pre;
      pre = document.querySelector('pre');
      pre.innerHTML += `${new Date()}: ${message}\n`;
      pre.scrollTop = pre.scrollHeight;
    }
  };

  /*
   *
   */
  var get = function()
  {
    chrome.serial.getDevices(function(ports){
      for(var n = 0; n < ports.length; n++)
      {
        log(`port ${n}:${JSON.stringify(ports[n])}`);

        if(ports[n].path.toString().indexOf(portstring) != -1)
        {
          port = ports[n];
          log(`port ${port}`);
          if(!auto)
          {
            if(browser)
            {
              let button = document.createElement('button');
              button.innerHTML = 'Connect';
              button.addEventListener('click', connect);
              document.querySelector('pre').parentNode.insertBefore(button, document.querySelector('pre'));
            }
          }
          else
          {
            connect();
          }
          break;
        }

      }
    });
  };

  /*
   *
   */
  var info = function(info)
  {
    log(`info: ${JSON.stringify(info)}`);
    port.id = info.connectionId;

    if(tick)
    {
      tick = setInterval(function(){
        ticker();
      },1000);
    }
  }

  /*
   *
   */
  var ticker = function()
  {
    if(port.id)
    {
      time();
      /*
      feed.get().then(
        response => {
          log(`feed: ${JSON.stringify(JSON.parse(response).data)}`);
        },
        error => {
          log(`error: ${JSON.stringify(error)}`);
        }
      )
      */
    }
    else
    {
      clearInterval(tick);
    }
  }

  /*
   *
   */
  var time = function()
  {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    if(h < 10){h = `0${h}`};
    if(m < 10){m = `0${m}`};
    if(s < 10){s = `0${s}`};
    send(`show time ${h}${s % 2 == 1 ? ':' : ' '}${m}${s % 2 == 0 ? ':' : ' '}${s}`);
  }

  /*
   *
   */
  var send = function(command)
  {
    chrome.serial.send(port.id, connection.buffer(`${command}\n`), function(){
      log(`sent command: ${command}`);
    });
  }

  /*
   *
   */
  var buffer = function(command)
  {
    var buffer = new ArrayBuffer(command.length);
    var view = new Uint8Array(buffer);
    for(var n = 0; n < command.length; n++)
    {
      view[n]=command.charCodeAt(n);
    }
    return buffer;
  }

  /*
   *
   */
  var connect = function()
  {
    log(`attempting to connect to ${port.path}`);
    chrome.serial.connect(port.path, {bitrate:115200}, info);
    if(browser)
    {
      if(document.querySelectorAll('button').length > 1){document.querySelectorAll('button')[0].parentNode.removeChild(document.querySelectorAll('button')[0]);}
      let button = document.createElement('button');
      button.innerHTML = 'Disconnect';
      button.addEventListener('click', disconnect);
      document.querySelector('pre').parentNode.insertBefore(button, document.querySelector('pre'));
    }
  }

  /*
   *
   */
  var disconnect = function()
  {
    chrome.serial.disconnect(port.id, function(){
      log(`disconnected from ${port.id}`);
      delete port['id'];
      if(browser)
      {
        document.querySelectorAll('button')[0].parentNode.removeChild(document.querySelectorAll('button')[0]);
        let button = document.createElement('button');
        button.innerHTML = 'Connect';
        button.addEventListener('click', connect);
        document.querySelector('pre').parentNode.insertBefore(button, document.querySelector('pre'));
      }
    });
  }

  return {
    buffer,
    get
  }
})();

/*
 *
 */
window.addEventListener('DOMContentLoaded', connect => {
  let button = document.createElement('button');
  button.innerHTML = 'Reload App';
  button.addEventListener('click', function(){chrome.runtime.reload()});
  document.body.appendChild(button);

  connection.get();
}, true);
