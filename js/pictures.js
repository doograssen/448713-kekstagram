'use strict';

var OBJECT_AMOUNT = 25;
var ESC_KEY_CODE = 27;
var ENTER_KEY_CODE = 13;
var MAX_COMMENT_LENGTH = 140;
var picturesArray = [];

var COMMENTS_ARRAY = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var PICTURE_TEMPLATE = document.querySelector('#picture-template').content;

var overlay = document.querySelector('.gallery-overlay');
var pictures = document.querySelector('.pictures');
var uploadForm = document.querySelector('#upload-select-image');
var pickFile = uploadForm.querySelector('#upload-file');
var framingWindow = uploadForm.querySelector('.upload-overlay');
var comment = framingWindow.querySelector('.upload-form-description');
var frameSize = framingWindow.querySelector('.upload-resize-controls-value');
var effectControls = framingWindow.querySelector('.upload-effect-controls');
var imageSample = uploadForm.querySelector('.effect-image-preview');
var imagePreview = {
  currentSize: '100%',
  currentEffect: 'none',
  imageSizes: {'25%': 'image-size-s', '50%': 'image-size-m', '75%': 'image-size-l', '100%': 'image-size-xl'},
  incrementSizeValue: function () {
    var size = parseInt(this.currentSize, 10);
    if (size !== 100) {
      size += 25;
      frameSize.value = size + '%';
      this.setImagePreviewSize();
    }
  },
  decrementSizeValue: function () {
    var size = parseInt(this.currentSize, 10);
    if (size !== 25) {
      size -= 25;
      frameSize.value = size + '%';
      this.setImagePreviewSize();
    }
  },
  setImagePreviewSize: function () {
    var sizeClass = this.getImageSizeClass();
    if (imageSample.classList.contains(sizeClass)) {
      imageSample.classList.remove(sizeClass);
    }
    this.currentSize = frameSize.value;
    imageSample.classList.add(this.getImageSizeClass());
  },
  getImageSizeClass: function () {
    return this.imageSizes[this.currentSize];
  },
  getImageEffectClass: function () {
    return 'effect-' + this.currentEffect;
  },
  setImagePreviewEffect: function (value) {
    var effectClass = this.getImageEffectClass();
    if (imageSample.classList.contains(effectClass)) {
      imageSample.classList.remove(effectClass);
    }
    this.currentEffect = value;
    if (value !== 'none') {
      effectClass = this.getImageEffectClass();
      imageSample.classList.add(effectClass);
    }
  },
  resetPreview: function () {
    var size = this.getImageSizeClass();
    if (imageSample.classList.contains(size)) {
      imageSample.classList.remove(size);
    }
    var effect = this.getImageEffectClass();
    if (imageSample.classList.contains(effect)) {
      imageSample.classList.remove(effect);
    }
    this.currentSize = '100%';
    this.currentEffect = 'none';
    imageSample.classList.add(this.getImageSizeClass());
    frameSize.value = '100%';
  }
};
var listener;
/* функция для случайного числа от мин до макс */
function getRandomValue(min, max) {
  return min + Math.round((max - min) * Math.random());
}

// ------------------------------------------------------------------------------------------------------------------
// ------------------------------ ФОРМИРОВАНИЕ ДАННЫХ И ВЫВОД НА СТРАНИЦУ -------------------------------------------
// ------------------------------------------------------------------------------------------------------------------

/* ------- Функция для получения одного двух случайых комментариев --*/
function getComments() {
  var commentsAmount = getRandomValue(1, 2);
  var arr = [];
  var index;
  for (var i = 0; i < commentsAmount; i++) {
    index = getRandomValue(0, COMMENTS_ARRAY.length - i);
    arr.push(COMMENTS_ARRAY[index]);
  }
  return arr;
}

/* заполняем объект информацией о фото*/
function setPictureObj(index) {
  var obj = {};
  obj.url = 'photos/' + index + '.jpg';
  obj.likes = getRandomValue(15, 200);
  obj.comments = getComments();
  return obj;
}

/* -------- Функция заполнения массива с информацией о фотографиях --*/
function setPicturesObjArray() {
  for (var i = 0; i < OBJECT_AMOUNT; i++) {
    picturesArray[i] = setPictureObj(i + 1);
  }
}

/* ---------- Функция заполнения шаблона ----------------------------*/
function fillTemplate(obj) {
  var pictureElement = PICTURE_TEMPLATE.cloneNode(true);
  pictureElement.querySelector('img').src = obj.url;
  pictureElement.querySelector('.picture-likes').textContent = obj.likes;
  pictureElement.querySelector('.picture-comments').textContent = obj.comments.length;
  return pictureElement;
}

/* ---------- Функция заполнения страницы фотографиями --------------*/
function appendPicturesToDOM(arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(fillTemplate(arr[i]));
  }
  pictures.appendChild(fragment);
}

// ------------------------------------------------------------------------------------------------------------------
// ------------------------------------------- ОПИСАНИЕ СОБЫТИЙ ----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------

/* функция показа окна с одним из фото */
function showPictureSample(obj) {
  overlay.querySelector('.gallery-overlay-image').src = obj.url;
  overlay.querySelector('.likes-count').textContent = obj.likes;
  overlay.querySelector('.comments-count').textContent = obj.comments.length;
}

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
    showPictureSample(picturesArray[index]);
    showPopup(overlay);
  });
  obj.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      evt.preventDefault();
      showPictureSample(picturesArray[index]);
      showPopup(overlay);
    }
  });
}

/* ------ Назначение обработчиков событий для галереи ---------------*/
function setGalleryListeners() {
  var elementArray = pictures.querySelectorAll('.picture');
  for (var i = 0; i < OBJECT_AMOUNT; i++) {
    setPictureListeners(elementArray[i], i);
  }
  var closeButton = overlay.querySelector('.gallery-overlay-close');
  setCloseBtnListener(closeButton, overlay);
}

function setFramingListeners() {
  pickFile.addEventListener('change', function () {
    imagePreview.resetPreview();
    showPopup(framingWindow);
  });
  var closeButton = uploadForm.querySelector('.upload-form-cancel');
  setCloseBtnListener(closeButton, framingWindow);
}
// ==================================================================================================================

// ------------------------------------------------------------------------------------------------------------------
// ------------------------------ СОБЫТИЯ ФОРМЫ -------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------
comment.addEventListener('input', function (evt) {
  var messageText = '';
  var evtTarget = evt.target;
  if (evtTarget.value.length > MAX_COMMENT_LENGTH) {
    messageText = 'Максимальная длина содержимого поля' + MAX_COMMENT_LENGTH;
  }
  evtTarget.setCustomValidity(messageText);
});

frameSize.addEventListener('change', function (evt) {
  var value = parseInt(evt.target.value, 10);
  if (value % 25 !== 0) {
    evt.target.value = Math.ceil(value / 25) * 25 + '%';
  }
});

framingWindow.querySelector('.upload-resize-controls').addEventListener('click', function (evt) {
  var evtTarget = evt.target;
  if (evtTarget.classList.contains('upload-resize-controls-button-dec')) {
    imagePreview.decrementSizeValue();
  } else if (evt.target.classList.contains('upload-resize-controls-button-inc')) {
    imagePreview.incrementSizeValue();
  }
});

effectControls.addEventListener('click', function (evt) {
  var evtTarget = evt.target;
  if (evtTarget.type === 'radio') {
    imagePreview.setImagePreviewEffect(evtTarget.value);
  }
});

// ==================================================================================================================

/* ------------- Выводим все на страницу ----------------------------*/
function fillPage() {
  setPicturesObjArray();
  appendPicturesToDOM(picturesArray);
  setGalleryListeners();
  setFramingListeners();
}

fillPage();

