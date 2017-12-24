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
  window.data.setPicturesObjArray(OBJECT_AMOUNT);
  window.picture.appendPicturesToDOM(window.data.picturesArray);
  // ````````
  /* ---- Закрытие окна по нажатию ESC --------------------------------*/
  function addListenerToElem(elem) {
    return function onPopupEscPress(evt) {
      if ((evt.keyCode === ESC_KEY_CODE) && (evt.target.nodeName !== 'TEXTAREA')) {
        closePopup(elem);
      }
    };
  }
  /* ------ Показ окна с  фото ----------------------------------------*/
  function showPopup(elem) {
    // showPictureSample(picturesArray[index]);
    elem.classList.remove('hidden');
    listener = addListenerToElem(elem);
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
      window.preview.showPictureSample(window.data.picturesArray[index]);
      showPopup(overlay);
    });
    obj.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEY_CODE) {
        evt.preventDefault();
        window.preview.showPictureSample(window.data.picturesArray[index]);
        showPopup(overlay);
      }
    });
  }

  /* ------ Назначение обработчиков событий для галереи ---------------*/
  function setGalleryListeners() {
    var elementArray = window.picture.pictures.querySelectorAll('.picture');
    for (var i = 0; i < OBJECT_AMOUNT; i++) {
      setPictureListeners(elementArray[i], i);
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
