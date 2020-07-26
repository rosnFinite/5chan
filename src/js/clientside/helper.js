var Node = (function () {
  'use strict';

  return {
    // Generiert Element mit speziellen Attributen und Text
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

    // appendet alle Elemte an ParentNode
    append: function (elemsArray, parent) {
      elemsArray.forEach(function (elem) {
        parent.appendChild(elem);
      });
      return parent;
    },

    // entfernt element aus der DOM
    remove: function (el) {
      el.parentNode.removeChild(el);
    }
  };
})();
module.exports = {
  Node: Node
};
