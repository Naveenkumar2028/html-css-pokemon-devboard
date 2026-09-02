// Stable runtime loader. The working dashboard controller lives in app.js.
(function(){
  var script=document.createElement('script');
  script.src='app.js';
  script.defer=true;
  document.head.appendChild(script);
})();
