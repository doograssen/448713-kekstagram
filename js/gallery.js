'use strict';

(function () {
  var ENTER_KEY_CODE = 13;
  var ESC_KEY_CODE = 27;
  var listener;
  var OBJECT_AMOUNT = 25;
  var overlay = document.querySelector('.gallery-overlay');
  var uploadForm = document.querySelector('#upload-select-image');
  var pickFile = uploadForm.querySelector('#upload-file');
  var framingWindow = uploadForm.querySelector('.upload-overlay');
  var picturesDOMElements = document.querySelector('.pictures');
  window.data.setPicturesObjArray(OBJECT_AMOUNT);
  window.picture.appendPicturesToDOM(picturesDOMElements);
  // ````````
  /* ---- Закрытие окна по нажатию ESC --------------------------------*/
  function setListenerToElem(elem) {
    return function onPopupEscPress(evt) {
      if ((evt.keyCode === ESC_KEY_CODE) && (evt.target.nodeName !== 'TEXTAREA')) {
        closePopup(elem);
      }
    };
  }
  /* ------ Показ окна с  фото ----------------------------------------*/
  function showPopup(elem) {
    elem.classList.remove('hidden');
    listener = setListenerToElem(elem);
    document.addEventListener('keydown', listener);
  }

  /* ------ Закрытие окна с  фото -------------------------------------*/
  function closePopup(elem) {
    elem.classList.add('hidden');
    document.removeEventListener('keydown', listener);
    listener = null;
  }

  /* ------ Закрытие окна по кнопке -------------------------------------*/

  function setCloseBtnListener(btnElem, elemToClose) {
    btnElem.addEventListener('click', function () {
      closePopup(elemToClose);
    });
    btnElem.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEY_CODE) {
        closePopup(elemToClose);
      }
    });
  }
  // ````````

  /* ------ Назначение обработчиков событий для фото ------------------*/
  function setPictureListeners(obj, index) {
    obj.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview.showPictureSample(picturesDOMElements[index]);
      showPopup(overlay);
    });
  }

  /* ------ Назначение обработчиков событий для галереи ---------------*/
  function setGalleryListeners() {
    var arrayElements = window.picture.pictures.querySelectorAll('.picture');
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
      showPopup(framingWindow);
    });
    var closeButton = uploadForm.querySelector('.upload-form-cancel');
    setCloseBtnListener(closeButton, framingWindow);
  }

  setGalleryListeners();
  setFramingListeners();
})();
