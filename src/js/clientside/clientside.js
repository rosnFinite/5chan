
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
  const retrieve = document.getElementById('retrieve');
  const newPost = document.getElementById('newPost');
  const nextSite = document.getElementById('nextSite');
  const prevSite = document.getElementById('prevSite');
  console.log(createPost);
  const toReadyStateDescription = function (state) {
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
    const XMLHttpRequest = require('xhr2');
    const oReq = new XMLHttpRequest();
    //  var imageSource;
    oReq.onload = function (e) {
      const xhr = e.target;
      console.log('Inside the onload event');
      if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        console.log('success!', xhr);
        // Manipulation der Seitenzahlanzeige
        let postCounterThisSite = 0;
        let postCounter = xhr.response.data.length - 1;
        maxSites = Math.floor(postCounter / 10) + 1;
        if (postCounter === -1) maxSites = 1;
        let aktSite = (siteCounter / 10) + 1;

        // Falls letzer BlogPost auf Seite gelöscht wird, eine Seite zurückspringen
        if (aktSite > maxSites) {
          siteCounter -= 10;
          aktSite = maxSites;
        }
        document.getElementById('siteNumber').innerHTML = '' + maxSites;
        document.getElementById('siteNumberAkt').innerHTML = '' + aktSite;
        // cleanup
        createPost.removeAllPosts();
        postCounter -= siteCounter;
        // Erstellung von max 10 Posts
        while (postCounter >= 0) {
          // SeitenManipulation
          const postData = xhr.response.data[postCounter];
          if (postCounterThisSite < 10) {
            createPost.createOnePost(postCounter, postData.id);
            document.getElementById('post_title' + postCounter).innerHTML = postData.title;
            document.getElementById('post_text' + postCounter).innerHTML = postData.content;
            document.getElementById('post_timestamp' + postCounter).innerHTML = postData.timestamp;

            const classImageCounter = document.getElementById('image_container' + postCounter);
            if (postData.filePath !== null) {
              // Falls Bild
              if (extension(postData.filePath) === 'image/jpeg') {
                document.getElementById('image_container' + postCounter).className += ' image-size';
                const url = '/api/article/thumbnail/'.concat(postData.id);
                const random = '?'.concat(Date.now());
                console.log(url.concat(random));
                document.getElementById('post_image' + postCounter).src = url.concat(random);
              }
              // Falls Karte
              if (extension(postData.filePath) === 'application/json') {
                const dataReq = new XMLHttpRequest();
                classImageCounter.style = 'height: 250px; position: relative;';
                classImageCounter.className = 'pure-u-1 pure-g';
                // Verbindung zur API für Kartendaten
                dataReq.open('GET', '/api/article/thumbnail/'.concat(postData.id));
                dataReq.setRequestHeader('Content-Type', 'application/json');
                dataReq.send();
                // Init der Map
                // Parameter entsprechen umschließenden Container
                const m = map.createMap('image_container' + postCounter);
                // Laden der Kartendaten
                dataReq.onreadystatechange = function () {
                  if (this.readyState === 4 && this.status === 200) {
                    const obj = JSON.parse(this.response);
                    // GeoJSON der Map hinzufügen
                    map.addData(m, obj);
                  }
                };
              }
            } else {
              // Image Container wird versteckt, falls kein Image und keine Karte
              classImageCounter.style = 'height: 0;';
            }
            postCounterThisSite++;
          }
          // Post Id wird runtergezählt, nächster Post wird betrachtet
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
  // ButtonHandler für alle Buttons
  newPost.addEventListener('click', function (e) {
    console.log('newPost');
    createForm.openNewPostForm();
  });
  nextSite.addEventListener('click', function (e) {
    if ((siteCounter / 10 + 1) < maxSites) {
      siteCounter += 10;
      update();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // for other browsers
    }
  });
  prevSite.addEventListener('click', function (e) {
    if (siteCounter > 0) {
      siteCounter -= 10;
      update();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // for other browsers
    }
  });
  document.addEventListener('DomLoaded', function () {
    console.log('loaded');
  });
}());
