const nodes = require('./helper.js');

var element = document.getElementById('posts');
function createOnePost (counter, postId) {
  var post = nodes.Node.create('section', {
    id: 'post' + counter,
    class: 'post'
  });
  var header = nodes.Node.create('header', {
    class: 'post-header'
  });

  var posttext = nodes.Node.create('div', {
    id: 'post_text' + counter,
    class: 'post-description'
  });

  var posttitle = nodes.Node.create('h2', {
    id: 'post_title' + counter,
    class: 'post-title'
  });

  var posttime = nodes.Node.create('p', {
    id: 'post_timestamp' + counter,
    class: 'post-meta'
  });

  var imagecontainer = nodes.Node.create('div', {
    id: 'image_container' + counter,
    class: 'pure-u-1-2 pure-g'
  });
  var postimage = nodes.Node.create('img', {
    id: 'post_image' + counter,
    class: 'pure-img',
    src: ''
  });
  var deleteButton = nodes.Node.create('button', {
    id: 'deleteButton' + counter,
    class: 'pure-button',
    type: 'button'
  }, 'Löschen');

  nodes.Node.append([posttitle, posttime], header);
  nodes.Node.append([postimage], imagecontainer);
  nodes.Node.append([header, imagecontainer, posttext, deleteButton], post);
  try {
    element.insertBefore(post, document.getElementById('post' + (counter - 1)));
  } catch (error) {
    element.appendChild(post);
  }
  // Delete Button Event Handler
  document.getElementById('deleteButton' + counter).addEventListener('click', function (e) {
    var XMLHttpRequest = require('xhr2');
    const delReq = new XMLHttpRequest();
    console.log('button id: ' + counter);
    delReq.open('DELETE', '/api/article/' + (postId));
    delReq.send();
    delReq.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log('success button');
        document.getElementById('retrieve').click();
      }
    };
  });
  //  counter++;
}
function removeAllPosts () {
  document.getElementById('posts').innerHTML = '';
}
module.exports = {
  createOnePost: createOnePost,
  removeAllPosts: removeAllPosts
};
