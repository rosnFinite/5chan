const nodes = require('./helper.js');

var element = document.getElementById('posts');
var counter = 0;
function createOnePost () {
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

  nodes.Node.append([posttitle, posttime], header);
  nodes.Node.append([header, posttext], post);
  element.appendChild(post);
  counter++;
}
module.exports = {
  createOnePost: createOnePost
};

