'use strict';

(function () {
  var PICTURE_TEMPLATE = document.querySelector('#picture-template').content;
  var pictures = document.querySelector('.pictures');
  /* ---------- Функция заполнения шаблона ----------------------------*/
  function fillTemplate(obj) {
    var pictureElement = PICTURE_TEMPLATE.cloneNode(true);
    pictureElement.querySelector('img').src = obj.url;
    pictureElement.querySelector('.picture-likes').textContent = obj.likes;
    pictureElement.querySelector('.picture-comments').textContent = obj.comments.length;
    return pictureElement;
  }

  /* ---------- Функция заполнения страницы фотографиями --------------*/
  window.picture = {
    pictures: pictures,
    appendPicturesToDOM: function (arr) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < arr.length; i++) {
        fragment.appendChild(fillTemplate(arr[i]));
      }
      this.pictures.appendChild(fragment);
    }
  };
})();
