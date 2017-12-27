'use strict';

(function () {
  var ENTER_KEY_CODE = 13;
  var OBJECT_AMOUNT = 25;
  var overlay = document.querySelector('.gallery-overlay');
  var uploadForm = document.querySelector('#upload-select-image');
  var pickFile = uploadForm.querySelector('#upload-file');
  var framingWindow = uploadForm.querySelector('.upload-overlay');
  var picturesDOMElements = document.querySelector('.pictures');
  window.data.setPicturesObjArray(OBJECT_AMOUNT);
  var fragment = window.picture.appendPicturesToFragment(window.data.pictures);
  picturesDOMElements.appendChild(fragment);

  /* ------ Закрытие окна по кнопке -------------------------------------*/

  function setCloseBtnListener(btnElem, elemToClose) {
    btnElem.addEventListener('click', function () {
      window.utils.closePopup(elemToClose);
    });
    btnElem.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEY_CODE) {
        window.utils.closePopup(elemToClose);
      }
    });
  }

  /* ------ Назначение обработчиков событий для фото ------------------*/
  function setPictureListeners(obj, index) {
    obj.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview.showPictureSample(window.data.pictures[index]);
      window.utils.showPopup(overlay);
    });
  }

  /* ------ Назначение обработчиков событий для галереи ---------------*/
  function setGalleryListeners() {
    var arrayElements = picturesDOMElements.querySelectorAll('.picture');
    var arrayLength = arrayElements.length;
    for (var i = 0; i < arrayLength; i++) {
      setPictureListeners(arrayElements[i], i);
    }
    var closeButton = overlay.querySelector('.gallery-overlay-close');
    setCloseBtnListener(closeButton, overlay);
  }

  function setFramingListeners() {
    pickFile.addEventListener('change', function () {
      window.form.resetImage();
      window.form.resetEffect(window.form.effect);
      window.utils.showPopup(framingWindow);
    });
    var closeButton = uploadForm.querySelector('.upload-form-cancel');
    setCloseBtnListener(closeButton, framingWindow);
  }

  setGalleryListeners();
  setFramingListeners();
})();
