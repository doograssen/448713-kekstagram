'use strict';

(function () {

  window.initializeFilters = function (parameter1, parameter2, applyFilter) {
    if (applyFilter && typeof applyFilter === 'function') {
      applyFilter(parameter1, parameter2);
    }
  };
})();
