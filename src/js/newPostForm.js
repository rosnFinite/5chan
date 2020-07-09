const forms = require('./helper.js');

const element = document.getElementById('formHere');

function openNewPostForm () {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // for other browsers
  console.log(document.getElementById('form'));
  if (document.getElementById('form') === null) {
    const form = forms.Node.create('form', {
      id: 'form',
      class: 'pure-form pure-form-aligned'
    });
    const fieldset = forms.Node.create('fieldset', {
    });
    const legend = forms.Node.create('legend', {
    }, 'Neuen Post erstellen');

    const title = forms.Node.create('label', {
      id: 'form_title',
      for: 'aligned-title'
    }, 'Titel eingeben');
    const titleInput = forms.Node.create('input', {
      id: 'aligned-title',
      placeholder: 'title',
      maxlength: '50'
    });

    const text = forms.Node.create('label', {
      for: 'aligned-text'
    }, 'Text eingeben');
    const textInput = forms.Node.create('textarea', {
      id: 'content',
      class: 'pure-input-1-2',
      placeholder: 'Post...',
      maxlength: '1026'
    });
    const textCount = forms.Node.create('span', {
      class: 'pure-form-message-inline',
      id: 'textCount'
    }, 'Zeichen übrig:  1024');

    const file = forms.Node.create('label', {
      for: 'aligned-file'
    }, 'Bild oder Json');
    const fileInput = forms.Node.create('input', {
      id: 'aligned-file',
      class: 'post-file',
      type: 'file'
    });

    const pureControls = forms.Node.create('div', {
      class: 'pure-controls'
    });
    const pureControlGroup1 = forms.Node.create('div', {
      class: 'pure-control-group'
    });
    const pureControlGroup2 = forms.Node.create('div', {
      class: 'pure-control-group'
    });
    const pureControlGroup3 = forms.Node.create('div', {
      class: 'pure-control-group'
    });

    const submit = forms.Node.create('input', {
      id: 'submit',
      type: 'submit',
      class: 'pure-button pure-button-primary',
      value: 'Posten'
    });
    const cancel = forms.Node.create('input', {
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
        const formdata = new window.FormData();
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
