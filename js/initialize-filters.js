'use strict';

(function () {

  window.initializeFilters = function (sourseClass, targetClass, applyFilter) {
    if (applyFilter && typeof applyFilter === 'function') {
      applyFilter(sourseClass, targetClass);
    }
  };
})();
