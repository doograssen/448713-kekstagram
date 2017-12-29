'use strict';

(function () {
  var MAX_COMMENT_LENGTH = 140;
  var MIN_HASHTAG_LENGTH = 2;
  var MAX_HASHTAG_LENGTH = 20;
  var MIN_PERCENTAGE_SIZE = 25;
  var MAX_PERCENTAGE_SIZE = 100;
  var PERCENTAGE_SIZE_INDENT = 25;
  var INITIAL_PICTURE_EFFECT = 'none';
  var EFFECT_INPUT_MIN_VALUE = '0';
  var START_RANGE_COORDINATE = 0;
  var END_RANGE_COORDINATE = 455;
  var INITIAL_RANGE_COORDINATE = 91;
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
    initTagsString: function () {
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
        if ((length < MIN_HASHTAG_LENGTH) || (length > MAX_HASHTAG_LENGTH)) {
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
    currentSize: MAX_PERCENTAGE_SIZE,
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
    setImageEffect: function (effectName) {
      var effectClass = this.getImageEffectClass();
      if (imageSample.classList.contains(effectClass)) {
        imageSample.classList.remove(effectClass);
        if (imageSample.style.filter) {
          imageSample.style.filter = '';
        }
      }
      this.currentEffect = effectName;
      if (effectName !== 'none') {
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
        if (imageSample.style.filter) {
          imageSample.style.filter = '';
        }
      }
      this.currentSize = MAX_PERCENTAGE_SIZE;
      this.currentEffect = INITIAL_PICTURE_EFFECT;
      imageSample.classList.add(this.getImageSizeClass());
      frameSize.value = MAX_PERCENTAGE_SIZE + '%';
    }
  };

  var effectLevelHandle = {
    EFFECT_INPUT_MAX_VALUES: {'none': 0, 'chrome': 100, 'sepia': 100, 'marvin': 100, 'phobos': 5, 'heat': 300},
    EFFECT_NAMES: {'none': 0, 'chrome': 'grayscale', 'sepia': 'sepia', 'marvin': 'invert', 'phobos': 'blur', 'heat': 'brightness'},
    currentInputMax: 0,
    currentEffectValue: 0,
    currentXCoordinate: 0,
    leftLineBorder: 0,
    rightLineBorder: 0,

    initEffectRangeElement: function (effect) {
      var max = this.EFFECT_INPUT_MAX_VALUES[effect];
      this.currentEffectValue = max * 0.2;
      this.currentInputMax = max;
      effectNumberInput.value = this.currentEffectValue;
      effectNumberInput.setAttribute('max', String(max));
      effectNumberInput.setAttribute('min', EFFECT_INPUT_MIN_VALUE);
      this.setHandlePosition(this.currentEffectValue);
      this.applyImageEffect(effect);
      this.setBorders();
    },

    displayEffectRangeElement: function (effect) {
      if (effect !== INITIAL_PICTURE_EFFECT) {
        effectRangeElement.style.display = 'block';
        this.initEffectRangeElement(effect);
      } else {
        effectRangeElement.style.display = 'none';
      }
    },

    setHandlePosition: function (value) {
      var position = ((value / effectNumberInput.getAttribute('max')) * 100).toFixed(1) + '%';
      handleElement.style.left = position;
      effectValueLine.style.width = position;
    },

    setBorders: function () {
      this.leftLineBorder = effectLevelLine.getBoundingClientRect().left;
      this.rightLineBorder = effectLevelLine.getBoundingClientRect().right;
      this.currentXCoordinate = INITIAL_RANGE_COORDINATE;
    },

    setNextStep: function (x, elem) {
      var value = Math.round(x * this.currentInputMax / END_RANGE_COORDINATE);
      this.currentXCoordinate = x;
      if (this.currentEffectValue !== value) {
        this.currentEffectValue = value;
        effectNumberInput.value = value;
        var posInPercent = (effectNumberInput.value * 100 / effectLevelHandle.currentInputMax).toFixed(1) + '%';
        elem.style.left = posInPercent;
        effectValueLine.style.width = posInPercent;
      }
    },

    applyImageEffect: function (effect) {
      switch (effect) {
        case 'chrome':
        case 'sepia':
        case 'heat':
          imageSample.style.filter = this.EFFECT_NAMES[effect] + '(' + this.currentEffectValue / 100 + ')';
          break;
        case 'marvin':
          imageSample.style.filter = this.EFFECT_NAMES[effect] + '(' + this.currentEffectValue + '%)';
          break;
        case 'phobos':
          imageSample.style.filter = this.EFFECT_NAMES[effect] + '(' + this.currentEffectValue + 'px)';
          break;
      }
    }
  };

  handleElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startXCoordinate = evt.clientX; // координата Х указателя относительно окна

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var cursorX = moveEvt.clientX;
      var nextXCoordinate;
      if (cursorX < effectLevelHandle.leftLineBorder) {
        nextXCoordinate = START_RANGE_COORDINATE;
      } else if (cursorX > effectLevelHandle.rightLineBorder) {
        nextXCoordinate = END_RANGE_COORDINATE;
      } else {
        var shiftX = startXCoordinate - cursorX;
        startXCoordinate = cursorX;
        nextXCoordinate = effectLevelHandle.currentXCoordinate - shiftX;
      }
      if ((nextXCoordinate >= START_RANGE_COORDINATE) && (nextXCoordinate <= END_RANGE_COORDINATE)) {
        effectLevelHandle.setNextStep(nextXCoordinate, evt.target);
        effectLevelHandle.applyImageEffect(imagePreview.currentEffect);
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
      imagePreview.setImageEffect(evtTarget.value);
      effectLevelHandle.displayEffectRangeElement(evtTarget.value);
    }
  });

  hashTagInput.addEventListener('change', function (evt) {
    hashTagString.initTagsString();
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
