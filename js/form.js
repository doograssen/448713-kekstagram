'use strict';

(function () {
  var MAX_COMMENT_LENGTH = 140;
  var MIN_PERCENTAGE_SIZE = 25;
  var MAX_PERCENTAGE_SIZE = 100;
  var INITIAL_PERCENTAGE_SIZE = 100;
  var PERCENTAGE_SIZE_INDENT = 25;
  var INITIAL_PICTURE_EFFECT = 'none';
  var INITIAL_EFFECT_VALUE = 100;
  var effectLineLevelLenght = 455;
  var uploadForm = document.querySelector('#upload-select-image');
  var framingWindow = uploadForm.querySelector('.upload-overlay');
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
    effectRangeElement: framingWindow.querySelector('.upload-effect-level'),
    handleElement: framingWindow.querySelector('.upload-effect-level-pin'),
    effectValueLine: framingWindow.querySelector('.upload-effect-level-val'),
    effectNumberInput: framingWindow.querySelector('.upload-effect-level-value'),
    currentValue: null,
    iniHandle: function () {
      this.currentValue = INITIAL_EFFECT_VALUE;
      this.setHandlePosition(this.currentValue);
      this.effectNumberInput.value = INITIAL_EFFECT_VALUE;
    },
    displayEffectRangeElement: function (effect) {
      if (effect !== 'none') {
        this.effectRangeElement.style.display = 'block';
        this.iniHandle();
      } else {
        this.effectRangeElement.style.display = 'none';
      }
    },
    setHandlePosition: function (value) {
      this.handleElement.style.left = value + '%';
      this.effectValueLine.style.width = value + '%';
    }
  };

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
    resetImage: function () {
      imagePreview.resetPreview();
    },
    resetEffect: function () {
      effectLevelHandle.displayEffectRangeElement(INITIAL_PICTURE_EFFECT);
    }
  };
})();
