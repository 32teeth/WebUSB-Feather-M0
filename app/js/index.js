/*
 *
 */
'use strict';

/*
 *
 */
var blacklist = ["none"];

/*
 *
 */
chrome.app.runtime.onLaunched.addListener(function() {
  var w = screen.availWidth;
  var h = screen.availHeight - 22;
  chrome.app.window.create(
    'index.html',
    {
      frame: "none",
      innerBounds: {
        width: 500,
        height: 500,
        top: 0,
        left: 0
      },
      resizable: false
    }
  );
});
