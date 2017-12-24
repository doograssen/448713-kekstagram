'use strict';

(function () {
  var MAX_COMMENT_LENGTH = 140;
  var uploadForm = document.querySelector('#upload-select-image');
  var framingWindow = uploadForm.querySelector('.upload-overlay');
  var effectControls = framingWindow.querySelector('.upload-effect-controls');
  var hashTagInput = uploadForm.querySelector('.upload-form-hashtags');
  var frameSize = framingWindow.querySelector('.upload-resize-controls-value');
  var imageSample = uploadForm.querySelector('.effect-image-preview');
  var comment = framingWindow.querySelector('.upload-form-description');
  var hashTagString = {
    tagsStringArray: [],
    tagsCount: 0,
    validateChecks: {
      count: false,
      hash: false,
      length: false,
      dublicate: false
    },
    message: '',
    iniTagsString: function () {
      var string = hashTagInput.value.replace(/\s+/g, ' ');
      string = string.trim();
      this.tagsStringArray = string.split(' ');
      this.tagsCount = this.tagsStringArray.length;
      this.validateChecks.count = this.validateCount();
      this.validateChecks.hash = this.validateHash();
      this.validateChecks.length = this.validateLength();
      this.validateChecks.dublicate = this.validateDublicat(this.tagsStringArray);
      this.setMessage();
      // console.log(this.message);
    },
    validateCount: function () {
      return (this.tagsCount <= 5);
    },
    validateHash: function () {
      var correctHash = true;
      var i = 0;
      var arraylength = this.tagsStringArray.length;

      function checkUnicPos(tag) {
        var position = tag.indexOf('#');
        return ((tag.indexOf('#', position + 1) === -1) && !position);
      }

      while ((i < arraylength) && (correctHash)) {
        correctHash = checkUnicPos(this.tagsStringArray[i]);
        i++;
      }
      return correctHash;
    },
    validateLength: function () {
      var i = 0;
      var hashtagCorrectLength = true;
      while (i < this.tagsCount) {
        var length = this.tagsStringArray[i].length;
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
      if (!this.validateChecks.hash) {
        this.message = 'Проверьте правильность ввода хештегов';
      } else if (!this.validateChecks.count) {
        this.message = 'Максимальное количество хештегов - пять';
      } else if (!this.validateChecks.length) {
        this.message = 'Тег должен быть не длиннее 20-ти символов и не короче одного';
      } else if (this.validateChecks.dublicate) {
        this.message = 'Теги должны быть уникальными';
      }
    }
  };

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

  hashTagInput.addEventListener('change', function (evt) {
    hashTagString.iniTagsString();
    // console.log(hashTagString);
    evt.target.setCustomValidity(hashTagString.message);
  });

  window.form = {
    resetImage: function () {
      imagePreview.resetPreview();
    }
  };
})();
