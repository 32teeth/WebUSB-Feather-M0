# WebUSB-Feather-M0
This is an example of connecting a Feather M0 board through the WebUSB API



### Chrome

###### Preface

The [WebUSB API](https://wicg.github.io/webusb/) is currently a draft which means that it is far enough along to be real and usable, but there is still time to make fixes that developers need. That's why the Chrome Team is actively looking for eager developers to try it and give [feedback on the spec](https://github.com/wicg/webusb/issues) and [feedback on the implementation](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EUSB).

In the very near future we plan for you to be able to enable WebUSB on your origin via [Origin Trials](https://developers.google.com/web/updates/2016/03/access-usb-devices-on-the-web#available_for_origin_trials). Until then you can enable it on your local computer for development purposes by flipping an experimental flag. The implementation is partially complete and currently available on Chrome OS, Linux, Mac, and Windows. Go to `chrome://flags/#enable-experimental-web-platform-features`, enable the highlighted flag, restart Chrome and you should be good to go.

Additionally you will want to enable the WebUSB `chrome://flags/#enable-webusb`



###### Install and run *Serve*

```bash
sudo npm install -g serve
serve
```