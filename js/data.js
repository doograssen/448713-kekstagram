'use strict';

(function () {
  var COMMENTS_ARRAY = ['Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  /* функция для случайного числа от мин до макс */
  function getRandomValue(min, max) {
    return min + Math.round((max - min) * Math.random());
  }
  /* ------- Функция для получения одного двух случайых комментариев --*//* заполнение массива комментариев*/
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

  window.data = {
    picturesArray: [],
    /* -------- Функция заполнения массива с информацией о фотографиях --*/
    setPicturesObjArray: function (amount) {
      for (var i = 0; i < amount; i++) {
        this.picturesArray[i] = setPictureObj(i + 1);
      }
    }
  };
})();
