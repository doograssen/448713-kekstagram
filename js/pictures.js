'use strict';

var OBJECT_AMOUNT = 25;
var ESC_KEY_CODE = 27;
var ENTER_KEY_CODE = 13;

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
var closeButton = overlay.querySelector('.gallery-overlay-close');
/* функция для случайного числа от мин до макс */
function getRandomValue(min, max) {
  return min + Math.round((max - min) * Math.random());
}

// ------------------------------------------------------------------------------------------------------------------
// -------------------------------ФОРМИРОВАНИЕ ДАННЫХ И ВЫВОД НА СТРАНИЦУ--------------------------------------------
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

/* ---- Закрытие окна по нажатию ESC --------------------------------*/
function onPopupEscPress(evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    closePopup();
  }
}

/* ------ Показ окна с  фото ----------------------------------------*/
function showPopup(index) {
  showPictureSample(picturesArray[index]);
  overlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
}

/* ------ Закрытие окна с  фото -------------------------------------*/
function closePopup() {
  overlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
}

/* ------ Назначение обработчиков событий для фото ------------------*/
function setPictureListeners(obj, index) {
  obj.addEventListener('click', function (evt) {
    evt.preventDefault();
    showPopup(index);
  });
  obj.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      evt.preventDefault();
      showPopup(index);
    }
  });
}

/* ------ Назначение обработчиков событий для галереи ---------------*/
function setGalleryListeners() {
  var elementArray = pictures.querySelectorAll('.picture');
  for (var i = 0; i < OBJECT_AMOUNT; i++) {
    setPictureListeners(elementArray[i], i);
  }
  closeButton.addEventListener('click', function () {
    closePopup();
  });
  closeButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      closePopup();
    }
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEY_CODE) {
      closePopup();
    }
  });
}
// --------------------------------------------------------------------------------------------------------------------


/* ------------- Выводим все на страницу ----------------------------*/
function fillPage() {
  setPicturesObjArray();
  appendPicturesToDOM(picturesArray);
  setGalleryListeners();
}

fillPage();

