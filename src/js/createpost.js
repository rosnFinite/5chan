const nodes = require('./helper.js');

var element = document.getElementById('posts');

var counter;
for (counter = 0; counter < 10; counter++) {
  var post = nodes.Node.create('section', {
    id: 'post' + counter,
    class: 'post'
  }, counter);
  var header = nodes.Node.create('header', {
    class: 'post_header'
  });

  var posttext = nodes.Node.create('div', {
    id: 'post_text' + counter,
    class: 'post_text'
  }, 'test');

  var posttitle = nodes.Node.create('h2', {
    id: 'post_title' + counter,
    class: 'post_title'
  }, 'title');

  var posttime = nodes.Node.create('p', {
    id: 'post_timestamp' + counter,
    class: 'post_timestamp'
  }, 'testtime');

  nodes.Node.append([posttitle, posttime], header);
  nodes.Node.append([header, posttext], post);
  element.appendChild(post);
  nodes.Node.loadCss('./style.min.css');
}
