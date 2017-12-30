'use strict';

(function () {
  var sendURL = 'https://js.dump.academy/kekstagram';
  var dataURL = 'https://js.dump.academy/kekstagram/data';
  /* --------------функция  с общими данными для создания запроса --------------*/
  var setupXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s
    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) { // Загрузка данных
      var xhr = setupXHR(onLoad, onError);
      xhr.open('GET', dataURL);
      xhr.send();
    },
    save: function (data, onLoad, onError) { // отпрвка данных
      var xhr = setupXHR(onLoad, onError);

      xhr.open('POST', sendURL);
      xhr.send(data);
    },
    serverError: function (errorMessage) { // функция обратного вызова возникновения ошибки  при выполнении запроса
      var errorMessageBlock = document.createElement('div');
      var errorText = document.createElement('p');
      errorMessageBlock.appendChild(errorText);
      errorMessageBlock.classList.add('error-message-block');
      errorText.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorMessageBlock);
    }
  };
})();
