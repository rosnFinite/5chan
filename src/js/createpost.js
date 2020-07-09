const nodes = require('./helper.js');

const element = document.getElementById('posts');
function createOnePost (counter, postId) {
  const post = nodes.Node.create('section', {
    id: 'post' + counter,
    class: 'post'
  });
  const header = nodes.Node.create('header', {
    class: 'post-header'
  });

  const posttext = nodes.Node.create('div', {
    id: 'post_text' + counter,
    class: 'post-description'
  });

  const posttitle = nodes.Node.create('h2', {
    id: 'post_title' + counter,
    class: 'post-title'
  });

  const posttime = nodes.Node.create('p', {
    id: 'post_timestamp' + counter,
    class: 'post-meta'
  });

  const imagecontainer = nodes.Node.create('div', {
    id: 'image_container' + counter,
    class: 'pure-u-1-2 pure-g'
  });
  const postimage = nodes.Node.create('img', {
    id: 'post_image' + counter,
    class: 'pure-img',
    src: ''
  });
  const deleteButton = nodes.Node.create('button', {
    id: 'deleteButton' + counter,
    class: 'pure-button',
    type: 'button'
  }, 'Löschen');
  const changeButton = nodes.Node.create('button', {
    id: 'bearbeitenButton' + counter,
    class: 'pure-button',
    type: 'button'
  }, 'Bearbeiten');
  nodes.Node.append([posttitle, posttime], header);
  nodes.Node.append([postimage], imagecontainer);
  nodes.Node.append([header, imagecontainer, posttext, changeButton, deleteButton], post);
  try {
    element.insertBefore(post, document.getElementById('post' + (counter - 1)));
  } catch (error) {
    element.appendChild(post);
  }
  // Delete Button Event Handler
  document.getElementById('deleteButton' + counter).addEventListener('click', function (e) {
    const XMLHttpRequest = require('xhr2');
    const delReq = new XMLHttpRequest();
    console.log('button id: ' + counter);
    delReq.open('DELETE', '/api/article/' + (postId));
    delReq.send();
    delReq.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log('success button post' + counter);
        document.getElementById('retrieve').click();
        // element.removeChild(document.getElementById('post' + counter));
      }
    };
  });
  /* Bearbeiten Button Event Handler
  document.getElementById('changeButton' + counter).addEventListener('click', function (e) {
    var XMLHttpRequest = require('xhr2');
    const delReq = new XMLHttpRequest();
    console.log('button id: ' + counter);
    delReq.open('Patch', '/api/article/' + (postId));
    delReq.send();
    delReq.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log('success button');
        document.getElementById('retrieve').click();
      }
    };
  }); */
  //  counter++;
}
function removeAllPosts () {
  document.getElementById('posts').innerHTML = '';
}
module.exports = {
  createOnePost: createOnePost,
  removeAllPosts: removeAllPosts
};
