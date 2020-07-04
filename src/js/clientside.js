
(function () {
  var retrieve = document.getElementById('retrieve');
  var results = document.getElementById('results');
  var toReadyStateDescription = function (state) {
    switch (state) {
      case 0:
        return 'UNSENT';
      case 1:
        return 'OPENED';
      case 2:
        return 'HEADERS_RECEIVED';
      case 3:
        return 'LOADING';
      case 4:
        return 'DONE';
      default:
        return '';
    }
  };
  retrieve.addEventListener('click', function (e) {
    //  var bustCache = '?' + new Date().getTime();
    var XMLHttpRequest = require('xhr2');
    var oReq = new XMLHttpRequest();
    oReq.onload = function (e) {
      var xhr = e.target;
      console.log('Inside the onload event');
      /*  if (xhr.responseType === 'json') {
        results.innerHTML = xhr.response.message;
      } else {
        results.innerHTML = JSON.parse(xhr.responseText).message;
      } */
      if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        console.log('success!', xhr);
        results.innerHTML = xhr.response.data.content;
      }
    };
    oReq.onreadystatechange = function () {
      console.log('Inside the onreadystatechange event with readyState: ' + toReadyStateDescription(oReq.readyState));
    };
    oReq.open('GET', 'http://localhost:8080/api/article/1', true);
    oReq.responseType = 'json';
    oReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    oReq.setRequestHeader('x-vanillaAjaxWithoutjQuery-version', '1.0');
    oReq.send();
  });
}());
