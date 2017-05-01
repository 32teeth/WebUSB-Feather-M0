var WebUSB = {};

(function() {
  'use strict';
  /*
   *
   */
  WebUSB.debug = true;
  /*
   *
   */
  WebUSB.device;
  /*
   *
   */
  WebUSB.log = function(message) {
    if(WebUSB.debug)
    {
      let pre;
      if(!document.querySelector('pre'))
      {
        pre = document.createElement('pre');
        document.body.appendChild(pre);
      }
      pre = document.querySelector('pre');
      pre.innerHTML += `\n${message}`;
    }
  }
  /*
   *
   */
  WebUSB.request = function() {
    const filters = [
      { 'vendorId': 0x2341, 'productId': 0x8037 }, // Arduino
      { 'vendorId': 0x239a }, // Adafruit
    ];
    if(navigator.usb)
    {
      return navigator.usb.requestDevice({ 'filters': filters }).then(
        device => {
          WebUSB.log(`Succsefully paried:\n${device.manufacturerName}\n${device.productName}`);
          WebUSB.port.device = device;
          WebUSB.port.connect();

          let button = document.createElement('button');
          button.innerHTML = 'Send';
          button.addEventListener('click', WebUSB.port.send);
          document.body.appendChild(button);
        },
        error => {
          WebUSB.log(error);
        }
      );
    }
  }
  /*
   *
   */
   WebUSB.port = {
    /*
     *
     */
     device:{},
    /*
     *
     */
     connect:function()
     {
      let loop = () => {
        this.device.transferIn(5, 64).then(result => {
          WebUSB.log(result);
          loop();
        }, error => {
          WebUSB.log(error);
        });
      }
      return this.device.open()
        .then(() => this.device.selectConfiguration(1))
        .then(() => this.device.claimInterface(2))
        .then(() => this.device.controlTransferOut({requestType: 'class', recipient: 'interface', request: 0x22, value: 0x01, index: 0x02}))
        .then(() => {loop})
        .then(
          result => {
            WebUSB.log('successfull');
          }
        )
        .catch(
          error => {
            WebUSB.log(error);
          }
        );
    },
    /*
     *
     */
    send:function()
    {
      let d = new Date();
      let h = d.getHours();
      let m = d.getMinutes();
      let s = d.getSeconds();
      if(h < 10){h = `0${h}`};
      if(m < 10){m = `0${m}`};
      if(s < 10){s = `0${s}`};
      let data = `show time ${h}${s % 2 == 1 ? ':' : ' '}${m}${s % 2 == 0 ? ':' : ' '}${s}`;
      console.log(data);
      let textEncoder = new TextEncoder();
      WebUSB.port.device.transferOut(4, textEncoder.encode(data));
    },
    /*
     *
     */
     disconnect:function()
     {
      console.log(WebUSB.port.device)
      WebUSB.port.device.close()
      .then(
        result => {
          WebUSB.log('closed');
          document.querySelectorAll('button')[1].parentNode.removeChild(document.querySelectorAll('button')[1]);
        }
      )
      .catch(
        error => {
          WebUSB.log(error);
        }
      );;
     }
   }

})();

/*
 *
 */
window.addEventListener('DOMContentLoaded', connect => {
  let button = document.createElement('button');
  button.innerHTML = 'Connect a USB Device';
  button.addEventListener('click', WebUSB.request);
  document.body.appendChild(button);
}, true);
