const forms = require('./helper.js');

var element = document.getElementById('formHere');

function openNewPostForm () {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // for other browsers
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
      placeholder: 'title',
      maxlength: '50'
    });

    var text = forms.Node.create('label', {
      for: 'aligned-text'
    }, 'Text eingeben');
    var textInput = forms.Node.create('textarea', {
      id: 'content',
      class: 'pure-input-1-2',
      placeholder: 'Post...',
      maxlength: '1026'
    });
    var textCount = forms.Node.create('span', {
      class: 'pure-form-message-inline',
      id: 'textCount'
    }, 'Zeichen übrig:  1024');

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
    forms.Node.append([text, textInput, textCount], pureControlGroup2);
    forms.Node.append([file, fileInput], pureControlGroup3);
    forms.Node.append([legend, pureControlGroup1, pureControlGroup2, pureControlGroup3, pureControls], fieldset);
    forms.Node.append([fieldset], form);

    element.insertBefore(form, document.getElementById('posts'));

    document.getElementById('cancel').addEventListener('click', function (e) {
      deleteForm();
    });
    // Word Counter
    document.getElementById('content').onkeyup = function () {
      document.getElementById('textCount').innerHTML = 'Zeichen übrig: ' + (1024 - this.value.length);
    };
    // Form Submit
    document.getElementById('form').onsubmit = async (e) => {
      e.preventDefault();
      if (document.getElementById('content').value !== '' && document.getElementById('aligned-title').value !== '') {
        var formdata = new window.FormData();
        formdata.append('content', document.getElementById('content').value);
        formdata.append('title', document.getElementById('aligned-title').value);
        formdata.append('articleImage', document.getElementById('aligned-file').files[0]);
        const response = await window.fetch('/api/article', {
          method: 'POST',
          body: formdata
        });

        const result = await response.json();
        console.log(result);
        deleteForm();
        document.getElementById('retrieve').click();
      } else {
        window.alert('Falscheingabe in einem Feld, bitte neu versuchen!');
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
