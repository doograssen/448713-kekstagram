'use strict';

var OBJECT_AMOUNT = 25;
var ESCKEYCODE = 27;
var ENTERKEYCODE = 13;

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

/* функция для получения одного двух случайых комментариев */
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

/* функция заполнения массива с информацией о фотографиях */
function setPicturesObjArray() {
  for (var i = 0; i < OBJECT_AMOUNT; i++) {
    picturesArray[i] = setPictureObj(i + 1);
  }
}

/* функция зфполнения шаблона */
function fillTemplate(obj) {
  var pictureElement = PICTURE_TEMPLATE.cloneNode(true);
  pictureElement.querySelector('img').src = obj.url;
  pictureElement.querySelector('.picture-likes').textContent = obj.likes;
  pictureElement.querySelector('.picture-comments').textContent = obj.comments.length;
  return pictureElement;
}

/* функция заполнения страницы фотографиями*/
function appendPicturesToDOM(arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(fillTemplate(arr[i]));
  }
  pictures.appendChild(fragment);
}

/* функция показа окна с одним из фото */
function showPictureSample(obj) {
  overlay.querySelector('.gallery-overlay-image').src = obj.url;
  overlay.querySelector('.likes-count').textContent = obj.likes;
  overlay.querySelector('.comments-count').textContent = obj.comments.length;
}

function pictureClick(index) {
  return function () {
    showPictureSample(picturesArray[index]);
    overlay.classList.remove('hidden');
  };
}

function setPictureListener() {
  var elementArray = pictures.querySelectorAll('.picture');
  for (var i = 0; i < OBJECT_AMOUNT; i++) {
    elementArray[i].addEventListener('click', pictureClick(i));
    closeButton.addEventListener('click', function () {
      overlay.classList.add('hidden');
    });
    closeButton.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTERKEYCODE) {
        overlay.classList.add('hidden');
      }
    });
    document.addEventListener('keydown', function(evt) {
      if (evt.keyCode === ESCKEYCODE) {
        overlay.classList.add('hidden');
      }
    });
  }
}

/* выводим все на страницу */
function fillPage() {
  setPicturesObjArray();
  appendPicturesToDOM(picturesArray);
  setPictureListener();
}

fillPage();

