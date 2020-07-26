const forms = require('./helper.js');
const autosize = require('autosize');

const element = document.getElementById('formHere');

function openNewPostForm (bearbeiten = false, counter = null, postId = null) {
  // Grundlegende Änderungen des Aufbaus je nach befehl
  let titleString = '';
  let postString = '';
  if (!bearbeiten) {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // for other browsers
    titleString = 'Neuen Post erstellen';
    postString = 'Posten';
  } else {
    titleString = 'Post bearbeiten';
    postString = 'Bearbeiten';
  }
  console.log(document.getElementById('form'));
  if (document.getElementById('form') !== null) {
    document.getElementById('retrieve').click();
  }
  const form = forms.Node.create('form', {
    id: 'form',
    class: 'pure-form pure-form-aligned'
  });
  const fieldset = forms.Node.create('fieldset', {
  });
  // Titel ändern
  const legend = forms.Node.create('legend', {
  }, titleString);

  const title = forms.Node.create('label', {
    id: 'form_title',
    for: 'aligned-title'
  }, 'Titel');
  const titleInput = forms.Node.create('input', {
    id: 'aligned-title',
    placeholder: 'Titel...',
    maxlength: '50',
    class: 'pure-input-1-2'
  });

  const text = forms.Node.create('label', {
    for: 'aligned-text'
  }, 'Text');
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
  const dateiInfo = forms.Node.create('span', {
    class: 'pure-form-message-inline',
    id: 'dateiInfo'
  }, '.JPG / .JSON');

  const file = forms.Node.create('label', {
    for: 'aligned-file'
  }, 'Datei');
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
    value: postString
  });
  const cancel = forms.Node.create('input', {
    id: 'cancel',
    type: 'button',
    class: 'pure-button',
    value: 'Abbrechen'
  });
  // Html childNodes an ParentNode hängen
  forms.Node.append([submit, cancel], pureControls);
  forms.Node.append([title, titleInput], pureControlGroup1);
  forms.Node.append([text, textInput, textCount], pureControlGroup2);
  forms.Node.append([file, fileInput, dateiInfo], pureControlGroup3);
  forms.Node.append([legend, pureControlGroup1, pureControlGroup2, pureControlGroup3, pureControls], fieldset);
  forms.Node.append([fieldset], form);
  // Position der Form, je nach Befehl
  if (bearbeiten === true) {
    console.log(counter);
    document.getElementById('post_text' + (counter - 1)).append(form);
  } else {
    element.insertBefore(form, document.getElementById('posts'));
  }
  // cancel Button Event Handler
  document.getElementById('cancel').addEventListener('click', function (e) {
    deleteForm();
    if (bearbeiten) {
      document.getElementById('changeButton' + (counter - 1)).style.visibility = 'visible';
      document.getElementById('deleteButton' + (counter - 1)).style.visibility = 'visible';
    }
  });
  // Word Counter
  const content = document.getElementById('content');
  content.onkeyup = function () {
    document.getElementById('textCount').innerHTML = 'Zeichen übrig: ' + (1024 - this.value.length);
    // Anpassen der TextArea an EingabeLänge
    autosize(content);
  };
  // Form Submit
  document.getElementById('form').onsubmit = async (e) => {
    e.preventDefault();
    // Je nach Modus, entweder Posten, oder aktuellen Post bearbeiten
    if (bearbeiten === false) {
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
    } else {
      if (document.getElementById('content').value !== '' && document.getElementById('aligned-title').value !== '') {
        const formdata = new window.FormData();
        formdata.append('content', document.getElementById('content').value);
        formdata.append('title', document.getElementById('aligned-title').value);
        formdata.append('articleImage', document.getElementById('aligned-file').files[0]);
        const response = await window.fetch('/api/article/' + postId, {
          method: 'PATCH',
          body: formdata
        });
        const result = await response.json();
        console.log(result);
        deleteForm();
        // Zeige Buttons wieder
        document.getElementById('changeButton' + (counter - 1)).style.visibility = 'visible';
        document.getElementById('deleteButton' + (counter - 1)).style.visibility = 'visible';
        document.getElementById('retrieve').click();
      } else {
        window.alert('Falscheingabe in einem Feld, bitte neu versuchen!');
      }
    }
  };
}
function deleteForm () {
  forms.Node.remove(document.getElementById('form'));
}
module.exports = {
  openNewPostForm: openNewPostForm
};
