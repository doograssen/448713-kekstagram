'use strict';

(function () {
  var MAX_COMMENT_LENGTH = 140;
  var MIN_PERCENTAGE_SIZE = 25;
  var MAX_PERCENTAGE_SIZE = 100;
  var INITIAL_PERCENTAGE_SIZE = 100;
  var PERCENTAGE_SIZE_INDENT = 25;
  var INITIAL_PICTURE_EFFECT = 'none';
  var EFFECT_INPUT_MIN_VALUE = '0';
  var START_RANGE_COORDINATE = 0;
  var END_RANGE_COORDINATE = 455;
  var uploadForm = document.querySelector('#upload-select-image');
  var framingWindow = uploadForm.querySelector('.upload-overlay');
  var effectNumberInput = framingWindow.querySelector('.upload-effect-level-value');
  var effectValueLine = framingWindow.querySelector('.upload-effect-level-val');
  var effectLevelLine = framingWindow.querySelector('.upload-effect-level-line');
  var effectRangeElement = framingWindow.querySelector('.upload-effect-level');
  var handleElement = framingWindow.querySelector('.upload-effect-level-pin');
  var effectControls = framingWindow.querySelector('.upload-effect-controls');
  var hashTagInput = uploadForm.querySelector('.upload-form-hashtags');
  var frameSize = framingWindow.querySelector('.upload-resize-controls-value');
  var imageSample = uploadForm.querySelector('.effect-image-preview');
  var comment = framingWindow.querySelector('.upload-form-description');
  var hashTagString = {
    pistureHashtags: [],
    tagsCount: 0,
    tagChecks: {
      count: false,
      hash: false,
      length: false,
      dublicate: false
    },
    message: '',
    iniTagsString: function () {
      var string = hashTagInput.value.replace(/\s+/g, ' ');
      string = string.trim();
      this.pistureHashtags = string.split(' ');
      this.tagsCount = this.pistureHashtags.length;
      this.tagChecks.count = this.validateCount();
      this.tagChecks.hash = this.validateHash();
      this.tagChecks.length = this.validateLength();
      this.tagChecks.dublicate = this.validateDublicat(this.pistureHashtags);
      this.setMessage();
    },
    validateCount: function () {
      return (this.tagsCount <= 5);
    },
    validateHash: function () {
      var correctHash = true;
      var i = 0;
      var arraylength = this.pistureHashtags.length;

      while ((i < arraylength) && (correctHash)) {
        correctHash = (this.pistureHashtags[i].lastIndexOf('#') === 0);
        i++;
      }
      return correctHash;
    },
    validateLength: function () {
      var i = 0;
      var hashtagCorrectLength = true;
      while (i < this.tagsCount) {
        var length = this.pistureHashtags[i].length;
        if ((length === 1) || (length > 20)) {
          hashtagCorrectLength = false;
          break;
        }
        i++;
      }
      return hashtagCorrectLength;
    },
    validateDublicat: function (arr) {
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        var str = arr[i].toLowerCase();
        if (str in obj) {
          return true;
        } else {
          obj[str] = true; // запомнить строку в виде свойства объекта
        }
      }
      return false;
    },
    setMessage: function () {
      this.message = '';
      if (!this.tagChecks.hash) {
        this.message = 'Проверьте правильность ввода хештегов';
      } else if (!this.tagChecks.count) {
        this.message = 'Максимальное количество хештегов - пять';
      } else if (!this.tagChecks.length) {
        this.message = 'Тег должен быть не длиннее 20-ти символов и не короче одного';
      } else if (this.tagChecks.dublicate) {
        this.message = 'Теги должны быть уникальными';
      }
    }
  };

  var imagePreview = {
    currentSize: INITIAL_PERCENTAGE_SIZE + '%',
    currentEffect: INITIAL_PICTURE_EFFECT,
    imageSizes: {'25%': 'image-size-s', '50%': 'image-size-m', '75%': 'image-size-l', '100%': 'image-size-xl'},
    incrementSizeValue: function () {
      var size = parseInt(this.currentSize, 10);
      if (size !== MAX_PERCENTAGE_SIZE) {
        size += PERCENTAGE_SIZE_INDENT;
        frameSize.value = size + '%';
        this.setImageSizeClass();
      }
    },
    decrementSizeValue: function () {
      var size = parseInt(this.currentSize, 10);
      if (size !== MIN_PERCENTAGE_SIZE) {
        size -= PERCENTAGE_SIZE_INDENT;
        frameSize.value = size + '%';
        this.setImageSizeClass();
      }
    },
    setImageSizeClass: function () {
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
      this.currentSize = INITIAL_PERCENTAGE_SIZE;
      this.currentEffect = INITIAL_PICTURE_EFFECT;
      imageSample.classList.add(this.getImageSizeClass());
      frameSize.value = '100%';
    }
  };

  var effectLevelHandle = {
    effectInputMaxValues: {'none': 0, 'chrome': 100, 'sepia': 100, 'marvin': 100, 'phobos': 3, 'heat': 300},
    currentValue: 0,
    currentXCoordinate: 0,
    leftLineBorder: 0,
    rightLineBorder: 0,

    displayEffectRangeElement: function (effect) {
      if (effect !== 'none') {
        effectRangeElement.style.display = 'block';
        this.currentValue = this.effectInputMaxValues[effect];
        effectNumberInput.value = this.currentValue;
        effectNumberInput.setAttribute('max', String(this.currentValue));
        effectNumberInput.setAttribute('min', EFFECT_INPUT_MIN_VALUE);
        this.setHandlePosition(this.currentValue);
        this.setBorders();
      } else {
        effectRangeElement.style.display = 'none';
      }
    },
    setHandlePosition: function (value) {
      var position = Math.floor((value / effectNumberInput.getAttribute('max')) * 100) + '%';
      handleElement.style.left = position;
      effectValueLine.style.width = position;
    },
    setBorders: function () {
      this.leftLineBorder = effectLevelLine.getBoundingClientRect().left;
      this.rightLineBorder = effectLevelLine.getBoundingClientRect().right;
      this.currentXCoordinate = END_RANGE_COORDINATE;
    },
    setNextStepCoordinate: function (x) {
      return Math.round((x / END_RANGE_COORDINATE) * 100);
    }
  };

  handleElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startXCoordinate = evt.clientX; // координата Х указателя относительно окна

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      if ((moveEvt.clientX >= effectLevelHandle.leftLineBorder) && (moveEvt.clientX <= effectLevelHandle.rightLineBorder)) {
        var shiftX = startXCoordinate - moveEvt.clientX;
        var nextXCoordinate = effectLevelHandle.currentXCoordinate - shiftX;
        startXCoordinate = moveEvt.clientX;
        if ((nextXCoordinate >= START_RANGE_COORDINATE) && (nextXCoordinate <= END_RANGE_COORDINATE)) {
          effectLevelHandle.currentXCoordinate = nextXCoordinate;
          evt.target.style.left = effectLevelHandle.setNextStepCoordinate(nextXCoordinate) + '%';
          effectNumberInput.value = effectLevelHandle.setNextStepCoordinate(nextXCoordinate);
        }
      } else if (moveEvt.clientX < effectLevelHandle.leftLineBorder) {
        evt.target.style.left = START_RANGE_COORDINATE + 'px';
      } else {
        evt.target.style.left = END_RANGE_COORDINATE + 'px';
      }
    }

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.addEventListener('resize', function () {
    effectLevelHandle.setBorders();
  });

  effectNumberInput.addEventListener('input', function (evt) {
    effectLevelHandle.setHandlePosition(evt.target.value);
  });

  comment.addEventListener('input', function (evt) {
    var messageText = '';
    var evtTarget = evt.target;
    if (evtTarget.value.length > MAX_COMMENT_LENGTH) {
      messageText = 'Максимальная длина содержимого поля' + MAX_COMMENT_LENGTH;
    }
    evtTarget.setCustomValidity(messageText);
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
      effectLevelHandle.displayEffectRangeElement(evtTarget.value);
    }
  });

  hashTagInput.addEventListener('change', function (evt) {
    hashTagString.iniTagsString();
    evt.target.setCustomValidity(hashTagString.message);
  });

  window.form = {
    effect: imagePreview.currentEffect,
    resetImage: function () {
      imagePreview.resetPreview();
    },
    resetEffect: function (effect) {
      effectLevelHandle.displayEffectRangeElement(effect);
    }
  };
})();
