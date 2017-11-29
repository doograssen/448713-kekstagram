'use strict';

var OBJECTAMOUNT = 25;

var picturesArray = {};

var commentsArray = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

function shuffle(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}

function createArray(amount) {
  var arr = [];
  for (var i = 0; i < amount; i++) {
    arr[i] = i + 1;
  }
  return shuffle(arr);
}

function getRandomValue(min, max) {
  return min + Math.round((max - min) * Math.random());
}

function setPicturesArray() {
  var pictureNumbers = createArray(OBJECTAMOUNT);
  for (var i = 0; i < OBJECTAMOUNT; i++) {
    picturesArray[i].url = 'photos/' + pictureNumbers[i] + '.jpg';
    picturesArray[i].likes = getRandomValue(15, 200);
  }
}
