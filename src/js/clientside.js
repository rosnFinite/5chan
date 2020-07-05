
const createPost = require('./createpost.js');
(function () {
  var retrieve = document.getElementById('retrieve');
  //  var results = document.getElementById('results');
  var postTitle = document.getElementById('post_title');
  var postTime = document.getElementById('post_timestamp');
  var postText = document.getElementById('post_text');
  console.log(createPost);
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
    //  var imageSource;
    oReq.onload = function (e) {
      var xhr = e.target;
      console.log('Inside the onload event');
      if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        console.log('success!', xhr);
        postTitle.innerHTML = xhr.response.data.title;
        postText.innerHTML = xhr.response.data.content;
        postTime.innerHTML = xhr.response.data.imagePath;
        //  imageSource = xhr.response.data.imagePath;
      }
    };
    oReq.onreadystatechange = function () {
      console.log('Inside the onreadystatechange event with readyState: ' + toReadyStateDescription(oReq.readyState));
    };
    oReq.open('GET', '/api/article/4', true);
    oReq.responseType = 'json';
    oReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    oReq.setRequestHeader('x-retrievetest', '1.0');
    oReq.send();
  });
  document.addEventListener('DomLoaded', function () {
    console.log('loaded');
  });
}());
