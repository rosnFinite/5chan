
const createPost = require('./createpost.js');
const createForm = require('./newPostForm.js');
const map = require('./map.js');
const mime = require('mime-types');
var siteCounter = 0;
var maxSites = 0;

function extension (filePath) {
  return mime.lookup(filePath);
}
(function () {
  var retrieve = document.getElementById('retrieve');
  var newPost = document.getElementById('newPost');
  var nextSite = document.getElementById('nextSite');
  var prevSite = document.getElementById('prevSite');
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
  retrieve.addEventListener('click', update);
  window.onload = update();

  function update (e = null) {
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

        var postCounterThisSite = 0;
        var postCounter = xhr.response.data.length - 1;
        maxSites = Math.ceil(postCounter / 10);
        var aktSite = (siteCounter / 10) + 1;
        console.log(aktSite);
        document.getElementById('siteNumber').innerHTML = 'Seiten: ' + maxSites;
        document.getElementById('siteNumberAkt').innerHTML = 'Akt Seite: ' + aktSite;

        createPost.removeAllPosts();
        postCounter -= siteCounter;
        while (postCounter >= 0) {
          // SeitenManipulation
          if (postCounterThisSite < 10) {
            createPost.createOnePost(postCounter, xhr.response.data[postCounter].id);
            document.getElementById('post_title' + postCounter).innerHTML = xhr.response.data[postCounter].title;
            document.getElementById('post_text' + postCounter).innerHTML = xhr.response.data[postCounter].content;
            document.getElementById('post_timestamp' + postCounter).innerHTML = xhr.response.data[postCounter].timestamp;
            if (xhr.response.data[postCounter].filePath !== null) {
              if (extension(xhr.response.data[postCounter].filePath) === 'image/jpeg') {
                console.log('Post mit ID ' + postCounter + ' hat BILDDATEN');
                document.getElementById('image_container' + postCounter).style = 'height: ';
                console.log('IDIDIDIDIDIDIDIDIDIDI:' + xhr.response.data[postCounter].id);
                document.getElementById('post_image' + postCounter).src = '/api/article/thumbnail/'.concat(xhr.response.data[postCounter].id);
              }
              if (extension(xhr.response.data[postCounter].filePath) === 'application/json') {
                const dataReq = new XMLHttpRequest();
                console.log('Post mit ID ' + postCounter + ' hat KARTENDATEN');
                document.getElementById('image_container' + postCounter).style = 'height: 250px; position: relative;';
                // Verbindung zur API für Kartendaten
                dataReq.open('GET', '/api/article/thumbnail/'.concat(xhr.response.data[postCounter].id));
                dataReq.setRequestHeader('Content-Type', 'application/json');
                dataReq.send();
                // Init der Map
                const m = map.createMap('image_container' + postCounter);
                // Laden der Kartendaten
                dataReq.onreadystatechange = function () {
                  if (this.readyState === 4 && this.status === 200) {
                    const obj = JSON.parse(this.response);
                    // Kartendaten der Map hinzufügen
                    map.addData(m, obj);
                  }
                };
              }
            } else {
              document.getElementById('image_container' + postCounter).style = 'height: 0;';
              console.log('Post mit ID ' + postCounter + ' hat KEIN Thumbnail');
            }
            postCounterThisSite++;
          }

          postCounter--;
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
  }
  newPost.addEventListener('click', function (e) {
    console.log('newPost');
    createForm.openNewPostForm();
  });
  nextSite.addEventListener('click', function (e) {
    // muss noch gecaped werden
    if (siteCounter / 10 + 1 < maxSites) {
      siteCounter += 10;
      update();
    }
  });
  prevSite.addEventListener('click', function (e) {
    if (siteCounter > 0) {
      siteCounter -= 10;
      update();
    }
  });
  document.addEventListener('DomLoaded', function () {
    console.log('loaded');
  });
}());
