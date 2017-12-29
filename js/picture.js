'use strict';

(function () {
  var templateElement = document.querySelector('#picture-template').content;
  /* ---------- Функция заполнения шаблона ----------------------------*/
  function fillTemplate(obj) {
    var pictureElement = templateElement.cloneNode(true);
    pictureElement.querySelector('img').src = obj.url;
    pictureElement.querySelector('.picture-likes').textContent = obj.likes;
    pictureElement.querySelector('.picture-comments').textContent = obj.comments.length;
    return pictureElement;
  }

  /* ---------- Функция заполнения страницы фотографиями --------------*/
  window.picture = {
    fillFragment: function (arr) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < arr.length; i++) {
        fragment.appendChild(fillTemplate(arr[i]));
      }
      return fragment;
    }
  };
})();
