'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var listener;
  /* ---- Закрытие окна по нажатию ESC --------------------------------*/
  function setListenerToElem(elem, func) {
    return function onPopupEscPress(evt) {
      if ((evt.keyCode === ESC_KEY_CODE) && (evt.target.nodeName !== 'TEXTAREA')) {
        func(elem);
      }
    };
  }

  window.utils = {
    /* ------ Показ окна с  фото ----------------------------------------*/
    showPopup: function (elem) {
      elem.classList.remove('hidden');
      listener = setListenerToElem(elem, this.closePopup);
      document.addEventListener('keydown', listener);
    },
    /* ------ Закрытие окна с  фото -------------------------------------*/
    closePopup: function (elem) {
      elem.classList.add('hidden');
      document.removeEventListener('keydown', listener);
      listener = null;
    }
  };
})();
