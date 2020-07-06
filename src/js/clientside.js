
const createPost = require('./createpost.js');
const createForm = require('./newPostForm.js');
const mime = require('mime-types');

function extension (filePath) {
  return mime.lookup(filePath);
}
(function () {
  var retrieve = document.getElementById('retrieve');
  var newPost = document.getElementById('newPost');
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
  window.onload = function () {
    //  var bustCache = '?' + new Date().getTime();
    // lololo
    var XMLHttpRequest = require('xhr2');
    var oReq = new XMLHttpRequest();
    //  var imageSource;
    oReq.onload = function (e) {
      var xhr = e.target;
      console.log('Inside the onload event');
      if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        console.log('success!', xhr);

        var postCounter = 0;
        while (xhr.response.data[postCounter].title !== undefined) {
          createPost.createOnePost(postCounter);
          document.getElementById('post_title' + postCounter).innerHTML = xhr.response.data[postCounter].title;
          document.getElementById('post_text' + postCounter).innerHTML = xhr.response.data[postCounter].content;
          document.getElementById('post_timestamp' + postCounter).innerHTML = xhr.response.data[postCounter].timestamp;
          if (xhr.response.data[postCounter].filePath !== null) {
            if (extension(xhr.response.data[postCounter].filePath) === 'image/jpeg') {
              console.log('Post mit ID ' + postCounter + ' hat BILDDATEN');
              document.getElementById('post_image' + postCounter).src = '/api/article/thumbnail/'.concat(postCounter + 1);
            }
            if (extension(xhr.response.data[postCounter].filePath) === 'application/json') {
              console.log('Post mit ID ' + postCounter + ' hat KARTENDATEN');
            }
          } else {
            console.log('Post mit ID ' + postCounter + ' hat KEIN Thumbnail');
          }
          postCounter++;
        }
      }
    };
    oReq.onreadystatechange = function () {
      console.log('Inside the onreadystatechange event with readyState: ' + toReadyStateDescription(oReq.readyState));
    };
    oReq.open('GET', '/api/articles', true);
    oReq.responseType = 'json';
    oReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    oReq.setRequestHeader('x-retrievetest', '1.0');
    oReq.send();
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

        var postCounter = 0;
        createPost.removeAllPosts();
        while (xhr.response.data[postCounter].title !== undefined) {
          createPost.createOnePost(postCounter);
          document.getElementById('post_title' + postCounter).innerHTML = xhr.response.data[postCounter].title;
          document.getElementById('post_text' + postCounter).innerHTML = xhr.response.data[postCounter].content;
          document.getElementById('post_timestamp' + postCounter).innerHTML = xhr.response.data[postCounter].timestamp;
          if (xhr.response.data[postCounter].filePath !== null) {
            if (extension(xhr.response.data[postCounter].filePath) === 'image/jpeg') {
              console.log('Post mit ID ' + postCounter + ' hat BILDDATEN');
              document.getElementById('post_image' + postCounter).src = '/api/article/thumbnail/'.concat(postCounter + 1);
            }
            if (extension(xhr.response.data[postCounter].filePath) === 'application/json') {
              console.log('Post mit ID ' + postCounter + ' hat KARTENDATEN');
            }
          } else {
            console.log('Post mit ID ' + postCounter + ' hat KEIN Thumbnail');
          }
          postCounter++;
        }
      }
    };
    oReq.onreadystatechange = function () {
      console.log('Inside the onreadystatechange event with readyState: ' + toReadyStateDescription(oReq.readyState));
    };
    oReq.open('GET', '/api/articles', true);
    oReq.responseType = 'json';
    oReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    oReq.setRequestHeader('x-retrievetest', '1.0');
    oReq.send();
  });
  newPost.addEventListener('click', function (e) {
    console.log('newPost');
    createForm.openNewPostForm();
  });
  document.addEventListener('DomLoaded', function () {
    console.log('loaded');
  });
}());
