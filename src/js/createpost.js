const nodes = require('./helper.js');

var element = document.getElementById('posts');
function createOnePost (counter) {
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

  nodes.Node.append([posttitle, posttime], header);
  nodes.Node.append([postimage], imagecontainer);
  nodes.Node.append([header, imagecontainer, posttext], post);
  try {
    console.log('posting before');
    element.insertBefore(post, document.getElementById('post' + (counter - 1)));
  } catch (error) {
    console.log('posting after');
    element.appendChild(post);
  }
  //  counter++;
}
function removeAllPosts () {
  /*
  var removeCounter = 0;
  while (document.getElementById('post' + removeCounter) !== null) {
    nodes.Node.remove(document.getElementById('post' + removeCounter));
    removeCounter++;
  } */
  document.getElementById('posts').innerHTML = '';
}
module.exports = {
  createOnePost: createOnePost,
  removeAllPosts: removeAllPosts
};
