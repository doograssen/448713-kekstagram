'use strict';

(function () {

  window.initializeScale = function (controlElement, resizeFunction) {
    if (resizeFunction && typeof resizeFunction === 'function') {
      controlElement.addEventListener('click', function () {
        resizeFunction();
      });
    }
  };
})();
