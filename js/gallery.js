'use strict';

(function () {
  var ENTER_KEY_CODE = 13;
  var overlay = document.querySelector('.gallery-overlay');
  var uploadForm = document.querySelector('#upload-select-image');
  var pickFile = uploadForm.querySelector('#upload-file');
  var framingWindow = uploadForm.querySelector('.upload-overlay');
  var picturesContainerElement = document.querySelector('.pictures');
  var filtersElement = document.querySelector('.filters');


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
  function setPictureListeners(obj, data) {
    obj.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview.showPictureSample(data);
      window.utils.showPopup(overlay);
    });
  }

  /* ------ Назначение обработчиков событий для галереи ---------------*/
  function setGalleryListeners(picteresData) {
    var arrayElements = picturesContainerElement.querySelectorAll('.picture');
    var arrayLength = arrayElements.length;
    for (var i = 0; i < arrayLength; i++) {
      setPictureListeners(arrayElements[i], picteresData[i]);
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

  var filterClick = function (attribute, picturesArray) {
    return picturesArray.slice().sort(function (a, b) {
      if (attribute === 'comments') {
        return b[attribute].length - a[attribute].length;
      } else if (attribute === 'random') {
        return Math.random() - 0.5;
      } else {
        return b[attribute] - a[attribute];
      }
    });
  };

  var successXHRExecution = function (response) {
    var galleryFilter = document.querySelector('.filters');
    galleryFilter.addEventListener('change', function (evt) {
      var evtTarget = evt.target;
      var attributeFilterNames = {'popular': 'likes', 'discussed': 'comments', 'random': 'random'};
      var picturesData = response.slice();
      if (evtTarget.type === 'radio') {
        picturesData = filterClick(attributeFilterNames[evtTarget.value], response);
        var fragment = window.picture.fillFragment(picturesData);
        while (picturesContainerElement.firstChild) {
          picturesContainerElement.removeChild(picturesContainerElement.firstChild);
        }
        picturesContainerElement.appendChild(fragment);
        setGalleryListeners(picturesData);
      }
    });
    var fragment = window.picture.fillFragment(response);
    picturesContainerElement.appendChild(fragment);
    setGalleryListeners(response);
    filtersElement.classList.remove('filters-inactive');
  };

  /* -----запрос загрузки данных-------------------------------------------------------------*/
  window.backend.load(successXHRExecution, window.backend.serverError);

  setFramingListeners();
})();
