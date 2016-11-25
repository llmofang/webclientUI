
var PubSub = require('pubsub-js');

var resize=(function(){

  var init=function(e) {
    window.onresize = function () {
      var xx = document.getElementById("zz_1").offsetHeight
      PubSub.publish('resizeHandler', xx);
    }
  };
   return{
    init:init
   };
})();

module.exports = resize;
