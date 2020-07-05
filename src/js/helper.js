var Node = (function () {
  'use strict';

  // track loaded files
  var filesLoaded = [];

  return {
    /**
        * Create an element with specified attributes and text
        */
    create: function (elem, attributes, text) {
      var el = document.createElement(elem);

      if (typeof attributes === 'object') {
        for (var attr in attributes) {
          el.setAttribute(attr, attributes[attr]);
        }
      }

      if (text) el.textContent = text;
      return el;
    },

    /**
        * Append all elements to the parent node
        */
    append: function (elemsArray, parent) {
      elemsArray.forEach(function (elem) {
        parent.appendChild(elem);
      });
      return parent;
    },

    /**
        * Remove an element from the DOM
        */
    remove: function (el) {
      el.parentNode.removeChild(el);
    },

    /**
        * Asyncronously load a script file
        */
    loadScript: function (src, callBack) {
      // script already loaded
      if (filesLoaded.indexOf(src) > -1) {
        if (typeof callBack === 'function') callBack();

        return;
      }

      var script = Node.create('script', { src: src, async: '' });

      script.onload = function () {
        filesLoaded.push(src);
        // Execute callBack
        if (typeof callBack === 'function') callBack();
      };

      document.body.appendChild(script);
    },

    /**
        * Load a css file
        */
    loadCss: function (src) {
      // skip if stylesheet already loaded
      if (filesLoaded.indexOf(src) > 0) return;

      var link = this.create('link', { rel: 'stylesheet', href: src });

      link.onload = function () {
        filesLoaded.push(src);
      };

      document.head.appendChild(link);
    }

  };
})();
module.exports = {
  Node: Node
};
