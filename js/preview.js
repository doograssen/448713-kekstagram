'use strict';

(function () {
  var overlay = document.querySelector('.gallery-overlay');
  window.preview = {
    showPictureSample: function (obj) { /* функция показа окна с одним из фото */
      overlay.querySelector('.gallery-overlay-image').src = obj.url;
      overlay.querySelector('.likes-count').textContent = obj.likes;
      overlay.querySelector('.comments-count').textContent = obj.comments.length;
    }
  };
})();
