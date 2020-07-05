const forms = require('./helper.js');

var element = document.getElementById('posts');

function openNewPostForm () {
  console.log(document.getElementById('form'));
  if (document.getElementById('form') === null) {
    var form = forms.Node.create('form', {
      id: 'form',
      class: 'pure-form pure-form-aligned'
    });
    var fieldset = forms.Node.create('fieldset', {
    });
    var legend = forms.Node.create('legend', {
    }, 'Neuen Post erstellen');

    var title = forms.Node.create('label', {
      id: 'form_title',
      for: 'aligned-title'
    }, 'Titel eingeben');
    var titleInput = forms.Node.create('input', {
      id: 'aligned-title',
      placeholder: 'title'
    });

    var text = forms.Node.create('label', {
      for: 'aligned-text'
    }, 'Text eingeben');
    var textInput = forms.Node.create('input', {
      id: 'content',
      class: 'post-description',
      type: 'text',
      placeholder: 'Post...'
    });

    var file = forms.Node.create('label', {
      for: 'aligned-file'
    }, 'Bild oder Json');
    var fileInput = forms.Node.create('input', {
      id: 'aligned-file',
      class: 'post-file',
      type: 'file'
    });

    var pureControls = forms.Node.create('div', {
      class: 'pure-controls'
    });
    var pureControlGroup1 = forms.Node.create('div', {
      class: 'pure-control-group'
    });
    var pureControlGroup2 = forms.Node.create('div', {
      class: 'pure-control-group'
    });
    var pureControlGroup3 = forms.Node.create('div', {
      class: 'pure-control-group'
    });

    var submit = forms.Node.create('input', {
      id: 'submit',
      type: 'submit',
      class: 'pure-button pure-button-primary',
      value: 'Posten'
    });
    var cancel = forms.Node.create('input', {
      id: 'cancel',
      type: 'button',
      class: 'pure-button',
      value: 'Abbrechen'
    });

    forms.Node.append([submit, cancel], pureControls);
    forms.Node.append([title, titleInput], pureControlGroup1);
    forms.Node.append([text, textInput], pureControlGroup2);
    forms.Node.append([file, fileInput], pureControlGroup3);
    forms.Node.append([legend, pureControlGroup1, pureControlGroup2, pureControlGroup3, pureControls], fieldset);
    forms.Node.append([fieldset], form);

    element.insertBefore(form, document.getElementById('post0'));

    document.getElementById('cancel').addEventListener('click', function (e) {
      deleteForm();
    });
    document.getElementById('form').onsubmit = async (e) => {
      e.preventDefault();
      if (document.getElementById('content').value !== '' && document.getElementById('aligned-title').value !== '') {
        var formdata = new FormData();
        formdata.append('content', document.getElementById('content').value);
        formdata.append('title', document.getElementById('aligned-title').value);
        formdata.append('articleImage', document.getElementById('aligned-file').files[0]);
        const response = await fetch('/api/article', {
          method: 'POST',
          body: formdata
        });

        const result = await response.json();

        deleteForm();
      } else {
          alert('Falscheingabe in einem Feld, bitte neu versuchen!');
      }
    };
  }
}
function deleteForm () {
  forms.Node.remove(document.getElementById('form'));
}
module.exports = {
  openNewPostForm: openNewPostForm
};