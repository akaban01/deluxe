//code.js
$('.js-show-code-snippet').on('click', function() {
    $(this).parent().next().removeClass('hidden');
    $(this).addClass('hidden').next().removeClass('hidden');
});

$('.js-hide-code-snippet').on('click', function() {
    $(this).parent().next().addClass('hidden');
    $(this).addClass('hidden').prev().removeClass('hidden');
});

$('.rendered-component').each(function() {
  var a = $(this).html();
  var b = $(this).siblings('.js-code-snippet').find('code');
  $(b).text(a);
});

new Clipboard('.btn-clipboard', {
  target: function(trigger) {
    return trigger.parentElement.nextElementSibling;
  }
});

//prism normalize whitespace plugin
(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

var assign = Object.assign || function (obj1, obj2) {
	for (var name in obj2) {
		if (obj2.hasOwnProperty(name))
			obj1[name] = obj2[name];
	}
	return obj1;
}

function NormalizeWhitespace(defaults) {
	this.defaults = assign({}, defaults);
}

function toCamelCase(value) {
	return value.replace(/-(\w)/g, function(match, firstChar) {
		return firstChar.toUpperCase();
	});
}

function tabLen(str) {
	var res = 0;
	for (var i = 0; i < str.length; ++i) {
		if (str.charCodeAt(i) == '\t'.charCodeAt(0))
			res += 3;
	}
	return str.length + res;
}

NormalizeWhitespace.prototype = {
	setDefaults: function (defaults) {
		this.defaults = assign(this.defaults, defaults);
	},
	normalize: function (input, settings) {
		settings = assign(this.defaults, settings);

		for (var name in settings) {
			var methodName = toCamelCase(name);
			if (name !== "normalize" && methodName !== 'setDefaults' &&
					settings[name] && this[methodName]) {
				input = this[methodName].call(this, input, settings[name]);
			}
		}

		return input;
	},

	/*
	 * Normalization methods
	 */
	leftTrim: function (input) {
		return input.replace(/^\s+/, '');
	},
	rightTrim: function (input) {
		return input.replace(/\s+$/, '');
	},
	tabsToSpaces: function (input, spaces) {
		spaces = spaces|0 || 4;
		return input.replace(/\t/g, new Array(++spaces).join(' '));
	},
	spacesToTabs: function (input, spaces) {
		spaces = spaces|0 || 4;
		return input.replace(new RegExp(' {' + spaces + '}', 'g'), '\t');
	},
	removeTrailing: function (input) {
		return input.replace(/\s*?$/gm, '');
	},
	// Support for deprecated plugin remove-initial-line-feed
	removeInitialLineFeed: function (input) {
		return input.replace(/^(?:\r?\n|\r)/, '');
	},
	removeIndent: function (input) {
		var indents = input.match(/^[^\S\n\r]*(?=\S)/gm);

		if (!indents || !indents[0].length)
			return input;

		indents.sort(function(a, b){return a.length - b.length; });

		if (!indents[0].length)
			return input;

		return input.replace(new RegExp('^' + indents[0], 'gm'), '');
	},
	indent: function (input, tabs) {
		return input.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++tabs).join('\t') + '$&');
	},
	breakLines: function (input, characters) {
		characters = (characters === true) ? 80 : characters|0 || 80;

		var lines = input.split('\n');
		for (var i = 0; i < lines.length; ++i) {
			if (tabLen(lines[i]) <= characters)
				continue;

			var line = lines[i].split(/(\s+)/g),
			    len = 0;

			for (var j = 0; j < line.length; ++j) {
				var tl = tabLen(line[j]);
				len += tl;
				if (len > characters) {
					line[j] = '\n' + line[j];
					len = tl;
				}
			}
			lines[i] = line.join('');
		}
		return lines.join('\n');
	}
};

Prism.plugins.NormalizeWhitespace = new NormalizeWhitespace({
	'remove-trailing': true,
	'remove-indent': true,
	'left-trim': true,
	'right-trim': true,
	/*'break-lines': 80,
	'indent': 2,
	'remove-initial-line-feed': false,
	'tabs-to-spaces': 4,
	'spaces-to-tabs': 4*/
});

Prism.hooks.add('before-highlight', function (env) {
	var pre = env.element.parentNode;
	if (!env.code || !pre || pre.nodeName.toLowerCase() !== 'pre' ||
			(env.settings && env.settings['whitespace-normalization'] === false))
		return;

	var children = pre.childNodes,
	    before = '',
	    after = '',
	    codeFound = false,
	    Normalizer = Prism.plugins.NormalizeWhitespace;

	// Move surrounding whitespace from the <pre> tag into the <code> tag
	for (var i = 0; i < children.length; ++i) {
		var node = children[i];

		if (node == env.element) {
			codeFound = true;
		} else if (node.nodeName === "#text") {
			if (codeFound) {
				after += node.nodeValue;
			} else {
				before += node.nodeValue;
			}

			pre.removeChild(node);
			--i;
		}
	}

	if (!env.element.children.length || !Prism.plugins.KeepMarkup) {
		env.code = before + env.code + after;
		env.code = Normalizer.normalize(env.code, env.settings);
	} else {
		// Preserve markup for keep-markup plugin
		var html = before + env.element.innerHTML + after;
		env.element.innerHTML = Normalizer.normalize(html, env.settings);
		env.code = env.element.textContent;
	}
});

}());

//prism normalize whitespace config
Prism.plugins.NormalizeWhitespace.setDefaults({
	'remove-trailing': true,
	'remove-indent': true,
	'left-trim': true,
	'right-trim': true,
  'break-lines': 0,
	'indent': 0,
	'remove-initial-line-feed': true,
	'tabs-to-spaces': 0,
	'spaces-to-tabs': 0
})


 // needed for copy/paste component code

//test.js
console.log('things');




(function() {
  $(".banner").each(function() {
    var parent = $(this);
    var imgFirst = $(this).find(".img_box_first");
    var contentBox = $(this).find(".content_box");
    var height = $(contentBox).outerHeight(true);
    var screenWidth = $(window).innerWidth();
    updateHeight(screenWidth, height);

    function updateHeight(screenWidth, height) {
      if (screenWidth > 768) {
        $(parent).outerHeight(height);
        $(imgFirst).outerHeight(height);
        if ($(parent).hasClass("content_bottom")|| $(parent).hasClass("content_top")) {
          $(imgFirst).outerHeight(height);
          $(parent).outerHeight(height * 2);
        }
      } else {
        if ($(parent).hasClass("content_anchored") && $(parent).hasClass("content_half") || $(parent).hasClass("content_bottom") || $(parent).hasClass("content_top")) {
          var parentHeight = height * 2;
          $(parent).outerHeight(parentHeight);
          $(imgFirst).outerHeight(height);
        } else if ($(parent).hasClass("content_anchored") && $(parent).hasClass("content_two_thirds")) {
          var parentHeight = height * 3/2;
          var imgFirstHeight = height * 0.5;
          $(parent).outerHeight(parentHeight);
          $(imgFirst).outerHeight(imgFirstHeight);
        } else if ($(parent).hasClass("content_floating") || $(parent).hasClass("content_vertically_center")) {
          $(parent).outerHeight(height);
          $(imgFirst).outerHeight(height);
        }
      }
    }

    function updateBg(attrName) {
      var bgFirst = $(imgFirst).attr(attrName);
      var bgSecond = $(contentBox).attr(attrName);
      $(imgFirst).css("background-image","url(" + bgFirst + ")");
      if ($(parent).hasClass("banner_with_secondary")) {
        $(contentBox).css("background-image","url(" + bgSecond + ")");
      }
    }

    if (screenWidth < 768) {
      updateBg("data-mobile-bg");
    } else {
      updateBg("data-desktop-bg");
    }

    $(window).resize(function() {
      var screenWidth = $(window).innerWidth();
      var height = $(contentBox).outerHeight(true);
      updateHeight(screenWidth, height);
      if (screenWidth < 768) {
        updateBg("data-mobile-bg");
      } else {
        updateBg("data-desktop-bg");
      }
    });
  });
})();




(function() {
  $(".ttac").each(function() {
    var parent = $(this);
    var img = $(this).find(".img_box img");
    var textContainer = $(this).find(".text_container");
    var height = $(textContainer).outerHeight(true);
    var screenWidth = $(window).innerWidth();
    updateHeight(screenWidth, height);

    function updateHeight(screenWidth, height) {
      if (screenWidth > 768 && $(parent).hasClass("half")) {
        var imgWidth = $(img).width();
        var imgHeight = $(img).height();
        var ratio = imgWidth / imgHeight;
        var width = height * ratio;
        $(img).width(width + "px");
        $(img).height(height + "px");
      } else {
        $(img).width("100%");
        $(img).height("auto");
      }
    }

    $(window).resize(function() {
      var screenWidth = $(window).innerWidth();
      var height = $(textContainer).outerHeight(true);
      updateHeight(screenWidth, height);
    });
  });
})();




//carousel.js
(function() {
  function Carousel(element, options) {
    this.element = element;
    this.options = {
      dShow: options.dShow,
      dScroll: options.dScroll,
      mShow: options.mShow,
      mScroll: options.mScroll,
      wrap: options.wrap,
      responsive: options.responsive,
      breakpoint: options.breakpoint
    }
    this.init();
  }

  Carousel.prototype = {
    constructor: Carousel,
    init: function() {
      this.createCarousel();
    },
    createCarousel: function() {
      var dShow = this.options.dShow;
      var dScroll = this.options.dScroll;
      var mShow = this.options.mShow;
      var mScroll = this.options.mScroll;
      var wrap = this.options.wrap;
      var responsive = this.options.responsive;
      var breakpoint = this.options.breakpoint;
      var element = this.element;
      var prevBtn = $(element).prev();
      var nextBtn = $(element).next();
      var slidesCount = $(element).find("ul").children().length;
      if (slidesCount <= 0) {
        prevBtn.addClass("hide");
        nextBtn.addClass("hide");
        $(element).addClass("flex_auto");
        return;
      }
      $(element).on('jcarousel:reload jcarousel:create', function () {
        var screenWidth = $(window).innerWidth();
        var carouselWidth = $(element).innerWidth();
        var itemWidth = 0;
        var marginLeft = 0;
        var marginRight = 0;

        slidesCount = $(element).find("ul").children().length;
        if (slidesCount <= dShow) {
          prevBtn.addClass("hide");
          nextBtn.addClass("hide");
          $(element).addClass("flex_auto");
        } else {
          nextBtn.removeClass("hide");
          $(element).removeClass("flex_auto");
        }

        if (responsive && screenWidth < breakpoint) {
          itemWidth = carouselWidth / mShow;
          prevBtn.jcarouselControl({
            target: '-=' + mScroll
          });

          nextBtn.jcarouselControl({
            target: '+=' + mScroll
          });
        } else {
          itemWidth = carouselWidth / dShow;
          prevBtn.jcarouselControl({
            target: '-=' + dScroll
          });

          nextBtn.jcarouselControl({
            target: '+=' + dScroll
          });
        }

        marginLeft = $(element).jcarousel('items').css('marginLeft').replace('px', '');
        marginRight = $(element).jcarousel('items').css('marginRight').replace('px', '');
        itemWidth = itemWidth - marginLeft - marginRight;
        $(element).jcarousel('items').css('width', itemWidth + 'px');

        $(element).hammer().bind("swipeleft", function() {
          nextBtn.click();
        });

        $(element).hammer().bind("swiperight", function() {
          prevBtn.click();
        });

      })
      .jcarousel({
          wrap: wrap
      });
    }
  }

  $.fn.carousel = function(options) {
    if ($(this).length > 0) {
      return new Carousel($(this), options);
    }
	}

  $(".recommended_products .slide").each(function() {
    $(this).carousel({
      dShow: 5,
      dScroll: 5,
      mShow: 1.5,
      mScroll: 1.5,
      wrap: 'circular',
      responsive: true,
      breakpoint: 992
    });
  });
})();




"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// The Emitter class provides the ability to call `.on()` on Dropzone to listen
// to events.
// It is strongly based on component's emitter class, and I removed the
// functionality because of the dependency hell with different frameworks.
var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);
  }

  _createClass(Emitter, [{
    key: "on",

    // Add an event listener for given event
    value: function on(event, fn) {
      this._callbacks = this._callbacks || {};
      // Create namespace for this event
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      this._callbacks = this._callbacks || {};
      var callbacks = this._callbacks[event];

      if (callbacks) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        for (var _iterator = callbacks, _isArray = true, _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var callback = _ref;

          callback.apply(this, args);
        }
      }

      return this;
    }

    // Remove event listener for given event. If fn is not provided, all event
    // listeners for that event will be removed. If neither is provided, all
    // event listeners will be removed.

  }, {
    key: "off",
    value: function off(event, fn) {
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }

      // remove all handlers
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }

      // remove specific handler
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      return this;
    }
  }]);

  return Emitter;
}();

var Dropzone = function (_Emitter) {
  _inherits(Dropzone, _Emitter);

  _createClass(Dropzone, null, [{
    key: "initClass",
    value: function initClass() {

      // Exposing the emitter class, mainly for tests
      this.prototype.Emitter = Emitter;

      /*
       This is a list of all available events you can register on a dropzone object.
        You can register an event handler like this:
        dropzone.on("dragEnter", function() { });
        */
      this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

      this.prototype.defaultOptions = {
        /**
         * Has to be specified on elements other than form (or when the form
         * doesn't have an `action` attribute). You can also
         * provide a function that will be called with `files` and
         * must return the url (since `v3.12.0`)
         */
        url: null,

        /**
         * Can be changed to `"put"` if necessary. You can also provide a function
         * that will be called with `files` and must return the method (since `v3.12.0`).
         */
        method: "post",

        /**
         * Will be set on the XHRequest.
         */
        withCredentials: false,

        /**
         * The timeout for the XHR requests in milliseconds (since `v4.4.0`).
         */
        timeout: 30000,

        /**
         * How many file uploads to process in parallel (See the
         * Enqueuing file uploads* documentation section for more info)
         */
        parallelUploads: 2,

        /**
         * Whether to send multiple files in one request. If
         * this it set to true, then the fallback file input element will
         * have the `multiple` attribute as well. This option will
         * also trigger additional events (like `processingmultiple`). See the events
         * documentation section for more information.
         */
        uploadMultiple: false,

        /**
         * Whether you want files to be uploaded in chunks to your server. This can't be
         * used in combination with `uploadMultiple`.
         *
         * See [chunksUploaded](#config-chunksUploaded) for the callback to finalise an upload.
         */
        chunking: false,

        /**
         * If `chunking` is enabled, this defines whether **every** file should be chunked,
         * even if the file size is below chunkSize. This means, that the additional chunk
         * form data will be submitted and the `chunksUploaded` callback will be invoked.
         */
        forceChunking: false,

        /**
         * If `chunking` is `true`, then this defines the chunk size in bytes.
         */
        chunkSize: 2000000,

        /**
         * If `true`, the individual chunks of a file are being uploaded simultaneously.
         */
        parallelChunkUploads: false,

        /**
         * Whether a chunk should be retried if it fails.
         */
        retryChunks: false,

        /**
         * If `retryChunks` is true, how many times should it be retried.
         */
        retryChunksLimit: 3,

        /**
         * If not `null` defines how many files this Dropzone handles. If it exceeds,
         * the event `maxfilesexceeded` will be called. The dropzone element gets the
         * class `dz-max-files-reached` accordingly so you can provide visual feedback.
         */
        maxFilesize: 256,

        /**
         * The name of the file param that gets transferred.
         * **NOTE**: If you have the option  `uploadMultiple` set to `true`, then
         * Dropzone will append `[]` to the name.
         */
        paramName: "file",

        /**
         * Whether thumbnails for images should be generated
         */
        createImageThumbnails: true,

        /**
         * In MB. When the filename exceeds this limit, the thumbnail will not be generated.
         */
        maxThumbnailFilesize: 10,

        /**
         * If `null`, the ratio of the image will be used to calculate it.
         */
        thumbnailWidth: 120,

        /**
         * The same as `thumbnailWidth`. If both are null, images will not be resized.
         */
        thumbnailHeight: 120,

        /**
         * How the images should be scaled down in case both, `thumbnailWidth` and `thumbnailHeight` are provided.
         * Can be either `contain` or `crop`.
         */
        thumbnailMethod: 'crop',

        /**
         * If set, images will be resized to these dimensions before being **uploaded**.
         * If only one, `resizeWidth` **or** `resizeHeight` is provided, the original aspect
         * ratio of the file will be preserved.
         *
         * The `options.transformFile` function uses these options, so if the `transformFile` function
         * is overridden, these options don't do anything.
         */
        resizeWidth: null,

        /**
         * See `resizeWidth`.
         */
        resizeHeight: null,

        /**
         * The mime type of the resized image (before it gets uploaded to the server).
         * If `null` the original mime type will be used. To force jpeg, for example, use `image/jpeg`.
         * See `resizeWidth` for more information.
         */
        resizeMimeType: null,

        /**
         * The quality of the resized images. See `resizeWidth`.
         */
        resizeQuality: 0.8,

        /**
         * How the images should be scaled down in case both, `resizeWidth` and `resizeHeight` are provided.
         * Can be either `contain` or `crop`.
         */
        resizeMethod: 'contain',

        /**
         * The base that is used to calculate the filesize. You can change this to
         * 1024 if you would rather display kibibytes, mebibytes, etc...
         * 1024 is technically incorrect, because `1024 bytes` are `1 kibibyte` not `1 kilobyte`.
         * You can change this to `1024` if you don't care about validity.
         */
        filesizeBase: 1000,

        /**
         * Can be used to limit the maximum number of files that will be handled by this Dropzone
         */
        maxFiles: null,

        /**
         * An optional object to send additional headers to the server. Eg:
         * `{ "My-Awesome-Header": "header value" }`
         */
        headers: null,

        /**
         * If `true`, the dropzone element itself will be clickable, if `false`
         * nothing will be clickable.
         *
         * You can also pass an HTML element, a CSS selector (for multiple elements)
         * or an array of those. In that case, all of those elements will trigger an
         * upload when clicked.
         */
        clickable: true,

        /**
         * Whether hidden files in directories should be ignored.
         */
        ignoreHiddenFiles: true,

        /**
         * The default implementation of `accept` checks the file's mime type or
         * extension against this list. This is a comma separated list of mime
         * types or file extensions.
         *
         * Eg.: `image/*,application/pdf,.psd`
         *
         * If the Dropzone is `clickable` this option will also be used as
         * [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept)
         * parameter on the hidden file input as well.
         */
        acceptedFiles: null,

        /**
         * **Deprecated!**
         * Use acceptedFiles instead.
         */
        acceptedMimeTypes: null,

        /**
         * If false, files will be added to the queue but the queue will not be
         * processed automatically.
         * This can be useful if you need some additional user input before sending
         * files (or if you want want all files sent at once).
         * If you're ready to send the file simply call `myDropzone.processQueue()`.
         *
         * See the [enqueuing file uploads](#enqueuing-file-uploads) documentation
         * section for more information.
         */
        autoProcessQueue: true,

        /**
         * If false, files added to the dropzone will not be queued by default.
         * You'll have to call `enqueueFile(file)` manually.
         */
        autoQueue: true,

        /**
         * If `true`, this will add a link to every file preview to remove or cancel (if
         * already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation`
         * and `dictRemoveFile` options are used for the wording.
         */
        addRemoveLinks: false,

        /**
         * Defines where to display the file previews – if `null` the
         * Dropzone element itself is used. Can be a plain `HTMLElement` or a CSS
         * selector. The element should have the `dropzone-previews` class so
         * the previews are displayed properly.
         */
        previewsContainer: null,

        /**
         * This is the element the hidden input field (which is used when clicking on the
         * dropzone to trigger file selection) will be appended to. This might
         * be important in case you use frameworks to switch the content of your page.
         */
        hiddenInputContainer: "body",

        /**
         * If null, no capture type will be specified
         * If camera, mobile devices will skip the file selection and choose camera
         * If microphone, mobile devices will skip the file selection and choose the microphone
         * If camcorder, mobile devices will skip the file selection and choose the camera in video mode
         * On apple devices multiple must be set to false.  AcceptedFiles may need to
         * be set to an appropriate mime type (e.g. "image/*", "audio/*", or "video/*").
         */
        capture: null,

        /**
         * **Deprecated**. Use `renameFile` instead.
         */
        renameFilename: null,

        /**
         * A function that is invoked before the file is uploaded to the server and renames the file.
         * This function gets the `File` as argument and can use the `file.name`. The actual name of the
         * file that gets used during the upload can be accessed through `file.upload.filename`.
         */
        renameFile: null,

        /**
         * If `true` the fallback will be forced. This is very useful to test your server
         * implementations first and make sure that everything works as
         * expected without dropzone if you experience problems, and to test
         * how your fallbacks will look.
         */
        forceFallback: false,

        /**
         * The text used before any files are dropped.
         */
        dictDefaultMessage: "Drop files here to upload",

        /**
         * The text that replaces the default message text it the browser is not supported.
         */
        dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",

        /**
         * The text that will be added before the fallback form.
         * If you provide a  fallback element yourself, or if this option is `null` this will
         * be ignored.
         */
        dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",

        /**
         * If the filesize is too big.
         * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
         */
        dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",

        /**
         * If the file doesn't match the file type.
         */
        dictInvalidFileType: "You can't upload files of this type.",

        /**
         * If the server response was invalid.
         * `{{statusCode}}` will be replaced with the servers status code.
         */
        dictResponseError: "Server responded with {{statusCode}} code.",

        /**
         * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
         */
        dictCancelUpload: "Cancel upload",

        /**
         * The text that is displayed if an upload was manually canceled
         */
        dictUploadCanceled: "Upload canceled.",

        /**
         * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
         */
        dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",

        /**
         * If `addRemoveLinks` is true, the text to be used to remove a file.
         */
        dictRemoveFile: "Remove file",

        /**
         * If this is not null, then the user will be prompted before removing a file.
         */
        dictRemoveFileConfirmation: null,

        /**
         * Displayed if `maxFiles` is st and exceeded.
         * The string `{{maxFiles}}` will be replaced by the configuration value.
         */
        dictMaxFilesExceeded: "You can not upload any more files.",

        /**
         * Allows you to translate the different units. Starting with `tb` for terabytes and going down to
         * `b` for bytes.
         */
        dictFileSizeUnits: { tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b" },
        /**
         * Called when dropzone initialized
         * You can add event listeners here
         */
        init: function init() {},


        /**
         * Can be an **object** of additional parameters to transfer to the server, **or** a `Function`
         * that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case
         * of a function, this needs to return a map.
         *
         * The default implementation does nothing for normal uploads, but adds relevant information for
         * chunked uploads.
         *
         * This is the same as adding hidden input fields in the form element.
         */
        params: function params(files, xhr, chunk) {
          if (chunk) {
            return {
              dzuuid: chunk.file.upload.uuid,
              dzchunkindex: chunk.index,
              dztotalfilesize: chunk.file.size,
              dzchunksize: this.options.chunkSize,
              dztotalchunkcount: chunk.file.upload.totalChunkCount,
              dzchunkbyteoffset: chunk.index * this.options.chunkSize
            };
          }
        },


        /**
         * A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)
         * and a `done` function as parameters.
         *
         * If the done function is invoked without arguments, the file is "accepted" and will
         * be processed. If you pass an error message, the file is rejected, and the error
         * message will be displayed.
         * This function will not be called if the file is too big or doesn't match the mime types.
         */
        accept: function accept(file, done) {
          return done();
        },


        /**
         * The callback that will be invoked when all chunks have been uploaded for a file.
         * It gets the file for which the chunks have been uploaded as the first parameter,
         * and the `done` function as second. `done()` needs to be invoked when everything
         * needed to finish the upload process is done.
         */
        chunksUploaded: function chunksUploaded(file, done) {
          done();
        },

        /**
         * Gets called when the browser is not supported.
         * The default implementation shows the fallback input field and adds
         * a text.
         */
        fallback: function fallback() {
          // This code should pass in IE7... :(
          var messageElement = void 0;
          this.element.className = this.element.className + " dz-browser-not-supported";

          for (var _iterator2 = this.element.getElementsByTagName("div"), _isArray2 = true, _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref2 = _i2.value;
            }

            var child = _ref2;

            if (/(^| )dz-message($| )/.test(child.className)) {
              messageElement = child;
              child.className = "dz-message"; // Removes the 'dz-default' class
              break;
            }
          }
          if (!messageElement) {
            messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
            this.element.appendChild(messageElement);
          }

          var span = messageElement.getElementsByTagName("span")[0];
          if (span) {
            if (span.textContent != null) {
              span.textContent = this.options.dictFallbackMessage;
            } else if (span.innerText != null) {
              span.innerText = this.options.dictFallbackMessage;
            }
          }

          return this.element.appendChild(this.getFallbackForm());
        },


        /**
         * Gets called to calculate the thumbnail dimensions.
         *
         * It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:
         *
         *  - `srcWidth` & `srcHeight` (required)
         *  - `trgWidth` & `trgHeight` (required)
         *  - `srcX` & `srcY` (optional, default `0`)
         *  - `trgX` & `trgY` (optional, default `0`)
         *
         * Those values are going to be used by `ctx.drawImage()`.
         */
        resize: function resize(file, width, height, resizeMethod) {
          var info = {
            srcX: 0,
            srcY: 0,
            srcWidth: file.width,
            srcHeight: file.height
          };

          var srcRatio = file.width / file.height;

          // Automatically calculate dimensions if not specified
          if (width == null && height == null) {
            width = info.srcWidth;
            height = info.srcHeight;
          } else if (width == null) {
            width = height * srcRatio;
          } else if (height == null) {
            height = width / srcRatio;
          }

          // Make sure images aren't upscaled
          width = Math.min(width, info.srcWidth);
          height = Math.min(height, info.srcHeight);

          var trgRatio = width / height;

          if (info.srcWidth > width || info.srcHeight > height) {
            // Image is bigger and needs rescaling
            if (resizeMethod === 'crop') {
              if (srcRatio > trgRatio) {
                info.srcHeight = file.height;
                info.srcWidth = info.srcHeight * trgRatio;
              } else {
                info.srcWidth = file.width;
                info.srcHeight = info.srcWidth / trgRatio;
              }
            } else if (resizeMethod === 'contain') {
              // Method 'contain'
              if (srcRatio > trgRatio) {
                height = width / srcRatio;
              } else {
                width = height * srcRatio;
              }
            } else {
              throw new Error("Unknown resizeMethod '" + resizeMethod + "'");
            }
          }

          info.srcX = (file.width - info.srcWidth) / 2;
          info.srcY = (file.height - info.srcHeight) / 2;

          info.trgWidth = width;
          info.trgHeight = height;

          return info;
        },


        /**
         * Can be used to transform the file (for example, resize an image if necessary).
         *
         * The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes
         * images according to those dimensions.
         *
         * Gets the `file` as the first parameter, and a `done()` function as the second, that needs
         * to be invoked with the file when the transformation is done.
         */
        transformFile: function transformFile(file, done) {
          if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) {
            return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);
          } else {
            return done(file);
          }
        },


        /**
         * A string that contains the template used for each dropped
         * file. Change it to fulfill your needs but make sure to properly
         * provide all elements.
         *
         * If you want to use an actual HTML element instead of providing a String
         * as a config option, you could create a div with the id `tpl`,
         * put the template inside it and provide the element like this:
         *
         *     document
         *       .querySelector('#tpl')
         *       .innerHTML
         *
         */
        previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>",

        // END OPTIONS
        // (Required by the dropzone documentation parser)


        /*
         Those functions register themselves to the events on init and handle all
         the user interface specific stuff. Overwriting them won't break the upload
         but can break the way it's displayed.
         You can overwrite them if you don't like the default behavior. If you just
         want to add an additional event handler, register it on the dropzone object
         and don't overwrite those options.
         */

        // Those are self explanatory and simply concern the DragnDrop.
        drop: function drop(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        dragstart: function dragstart(e) {},
        dragend: function dragend(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        dragenter: function dragenter(e) {
          return this.element.classList.add("dz-drag-hover");
        },
        dragover: function dragover(e) {
          return this.element.classList.add("dz-drag-hover");
        },
        dragleave: function dragleave(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        paste: function paste(e) {},


        // Called whenever there are no files left in the dropzone anymore, and the
        // dropzone should be displayed as if in the initial state.
        reset: function reset() {
          return this.element.classList.remove("dz-started");
        },


        // Called when a file is added to the queue
        // Receives `file`
        addedfile: function addedfile(file) {
          var _this2 = this;

          if (this.element === this.previewsContainer) {
            this.element.classList.add("dz-started");
          }

          if (this.previewsContainer) {
            file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
            file.previewTemplate = file.previewElement; // Backwards compatibility

            this.previewsContainer.appendChild(file.previewElement);
            for (var _iterator3 = file.previewElement.querySelectorAll("[data-dz-name]"), _isArray3 = true, _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
              var _ref3;

              if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
              } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
              }

              var node = _ref3;

              node.textContent = file.name;
            }
            for (var _iterator4 = file.previewElement.querySelectorAll("[data-dz-size]"), _isArray4 = true, _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
              if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                node = _iterator4[_i4++];
              } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                node = _i4.value;
              }

              node.innerHTML = this.filesize(file.size);
            }

            if (this.options.addRemoveLinks) {
              file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
              file.previewElement.appendChild(file._removeLink);
            }

            var removeFileEvent = function removeFileEvent(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this2.options.dictCancelUploadConfirmation, function () {
                  return _this2.removeFile(file);
                });
              } else {
                if (_this2.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this2.options.dictRemoveFileConfirmation, function () {
                    return _this2.removeFile(file);
                  });
                } else {
                  return _this2.removeFile(file);
                }
              }
            };

            for (var _iterator5 = file.previewElement.querySelectorAll("[data-dz-remove]"), _isArray5 = true, _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
              var _ref4;

              if (_isArray5) {
                if (_i5 >= _iterator5.length) break;
                _ref4 = _iterator5[_i5++];
              } else {
                _i5 = _iterator5.next();
                if (_i5.done) break;
                _ref4 = _i5.value;
              }

              var removeLink = _ref4;

              removeLink.addEventListener("click", removeFileEvent);
            }
          }
        },


        // Called whenever a file is removed.
        removedfile: function removedfile(file) {
          if (file.previewElement != null && file.previewElement.parentNode != null) {
            file.previewElement.parentNode.removeChild(file.previewElement);
          }
          return this._updateMaxFilesReachedClass();
        },


        // Called when a thumbnail has been generated
        // Receives `file` and `dataUrl`
        thumbnail: function thumbnail(file, dataUrl) {
          if (file.previewElement) {
            file.previewElement.classList.remove("dz-file-preview");
            for (var _iterator6 = file.previewElement.querySelectorAll("[data-dz-thumbnail]"), _isArray6 = true, _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
              var _ref5;

              if (_isArray6) {
                if (_i6 >= _iterator6.length) break;
                _ref5 = _iterator6[_i6++];
              } else {
                _i6 = _iterator6.next();
                if (_i6.done) break;
                _ref5 = _i6.value;
              }

              var thumbnailElement = _ref5;

              thumbnailElement.alt = file.name;
              thumbnailElement.src = dataUrl;
            }

            return setTimeout(function () {
              return file.previewElement.classList.add("dz-image-preview");
            }, 1);
          }
        },


        // Called whenever an error occurs
        // Receives `file` and `message`
        error: function error(file, message) {
          if (file.previewElement) {
            file.previewElement.classList.add("dz-error");
            if (typeof message !== "String" && message.error) {
              message = message.error;
            }
            for (var _iterator7 = file.previewElement.querySelectorAll("[data-dz-errormessage]"), _isArray7 = true, _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
              var _ref6;

              if (_isArray7) {
                if (_i7 >= _iterator7.length) break;
                _ref6 = _iterator7[_i7++];
              } else {
                _i7 = _iterator7.next();
                if (_i7.done) break;
                _ref6 = _i7.value;
              }

              var node = _ref6;

              node.textContent = message;
            }
          }
        },
        errormultiple: function errormultiple() {},


        // Called when a file gets processed. Since there is a cue, not all added
        // files are processed immediately.
        // Receives `file`
        processing: function processing(file) {
          if (file.previewElement) {
            file.previewElement.classList.add("dz-processing");
            if (file._removeLink) {
              return file._removeLink.textContent = this.options.dictCancelUpload;
            }
          }
        },
        processingmultiple: function processingmultiple() {},


        // Called whenever the upload progress gets updated.
        // Receives `file`, `progress` (percentage 0-100) and `bytesSent`.
        // To get the total number of bytes of the file, use `file.size`
        uploadprogress: function uploadprogress(file, progress, bytesSent) {
          if (file.previewElement) {
            for (var _iterator8 = file.previewElement.querySelectorAll("[data-dz-uploadprogress]"), _isArray8 = true, _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
              var _ref7;

              if (_isArray8) {
                if (_i8 >= _iterator8.length) break;
                _ref7 = _iterator8[_i8++];
              } else {
                _i8 = _iterator8.next();
                if (_i8.done) break;
                _ref7 = _i8.value;
              }

              var node = _ref7;

              node.nodeName === 'PROGRESS' ? node.value = progress : node.style.width = progress + "%";
            }
          }
        },


        // Called whenever the total upload progress gets updated.
        // Called with totalUploadProgress (0-100), totalBytes and totalBytesSent
        totaluploadprogress: function totaluploadprogress() {},


        // Called just before the file is sent. Gets the `xhr` object as second
        // parameter, so you can modify it (for example to add a CSRF token) and a
        // `formData` object to add additional information.
        sending: function sending() {},
        sendingmultiple: function sendingmultiple() {},


        // When the complete upload is finished and successful
        // Receives `file`
        success: function success(file) {
          if (file.previewElement) {
            return file.previewElement.classList.add("dz-success");
          }
        },
        successmultiple: function successmultiple() {},


        // When the upload is canceled.
        canceled: function canceled(file) {
          return this.emit("error", file, this.options.dictUploadCanceled);
        },
        canceledmultiple: function canceledmultiple() {},


        // When the upload is finished, either with success or an error.
        // Receives `file`
        complete: function complete(file) {
          if (file._removeLink) {
            file._removeLink.textContent = this.options.dictRemoveFile;
          }
          if (file.previewElement) {
            return file.previewElement.classList.add("dz-complete");
          }
        },
        completemultiple: function completemultiple() {},
        maxfilesexceeded: function maxfilesexceeded() {},
        maxfilesreached: function maxfilesreached() {},
        queuecomplete: function queuecomplete() {},
        addedfiles: function addedfiles() {}
      };

      this.prototype._thumbnailQueue = [];
      this.prototype._processingThumbnail = false;
    }

    // global utility

  }, {
    key: "extend",
    value: function extend(target) {
      for (var _len2 = arguments.length, objects = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        objects[_key2 - 1] = arguments[_key2];
      }

      for (var _iterator9 = objects, _isArray9 = true, _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
        var _ref8;

        if (_isArray9) {
          if (_i9 >= _iterator9.length) break;
          _ref8 = _iterator9[_i9++];
        } else {
          _i9 = _iterator9.next();
          if (_i9.done) break;
          _ref8 = _i9.value;
        }

        var object = _ref8;

        for (var key in object) {
          var val = object[key];
          target[key] = val;
        }
      }
      return target;
    }
  }]);

  function Dropzone(el, options) {
    _classCallCheck(this, Dropzone);

    var _this = _possibleConstructorReturn(this, (Dropzone.__proto__ || Object.getPrototypeOf(Dropzone)).call(this));

    var fallback = void 0,
        left = void 0;
    _this.element = el;
    // For backwards compatibility since the version was in the prototype previously
    _this.version = Dropzone.version;

    _this.defaultOptions.previewTemplate = _this.defaultOptions.previewTemplate.replace(/\n*/g, "");

    _this.clickableElements = [];
    _this.listeners = [];
    _this.files = []; // All files

    if (typeof _this.element === "string") {
      _this.element = document.querySelector(_this.element);
    }

    // Not checking if instance of HTMLElement or Element since IE9 is extremely weird.
    if (!_this.element || _this.element.nodeType == null) {
      throw new Error("Invalid dropzone element.");
    }

    if (_this.element.dropzone) {
      throw new Error("Dropzone already attached.");
    }

    // Now add this dropzone to the instances.
    Dropzone.instances.push(_this);

    // Put the dropzone inside the element itself.
    _this.element.dropzone = _this;

    var elementOptions = (left = Dropzone.optionsForElement(_this.element)) != null ? left : {};

    _this.options = Dropzone.extend({}, _this.defaultOptions, elementOptions, options != null ? options : {});

    // If the browser failed, just call the fallback and leave
    if (_this.options.forceFallback || !Dropzone.isBrowserSupported()) {
      var _ret;

      return _ret = _this.options.fallback.call(_this), _possibleConstructorReturn(_this, _ret);
    }

    // @options.url = @element.getAttribute "action" unless @options.url?
    if (_this.options.url == null) {
      _this.options.url = _this.element.getAttribute("action");
    }

    if (!_this.options.url) {
      throw new Error("No URL provided.");
    }

    if (_this.options.acceptedFiles && _this.options.acceptedMimeTypes) {
      throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
    }

    if (_this.options.uploadMultiple && _this.options.chunking) {
      throw new Error('You cannot set both: uploadMultiple and chunking.');
    }

    // Backwards compatibility
    if (_this.options.acceptedMimeTypes) {
      _this.options.acceptedFiles = _this.options.acceptedMimeTypes;
      delete _this.options.acceptedMimeTypes;
    }

    // Backwards compatibility
    if (_this.options.renameFilename != null) {
      _this.options.renameFile = function (file) {
        return _this.options.renameFilename.call(_this, file.name, file);
      };
    }

    _this.options.method = _this.options.method.toUpperCase();

    if ((fallback = _this.getExistingFallback()) && fallback.parentNode) {
      // Remove the fallback
      fallback.parentNode.removeChild(fallback);
    }

    // Display previews in the previewsContainer element or the Dropzone element unless explicitly set to false
    if (_this.options.previewsContainer !== false) {
      if (_this.options.previewsContainer) {
        _this.previewsContainer = Dropzone.getElement(_this.options.previewsContainer, "previewsContainer");
      } else {
        _this.previewsContainer = _this.element;
      }
    }

    if (_this.options.clickable) {
      if (_this.options.clickable === true) {
        _this.clickableElements = [_this.element];
      } else {
        _this.clickableElements = Dropzone.getElements(_this.options.clickable, "clickable");
      }
    }

    _this.init();
    return _this;
  }

  // Returns all files that have been accepted


  _createClass(Dropzone, [{
    key: "getAcceptedFiles",
    value: function getAcceptedFiles() {
      return this.files.filter(function (file) {
        return file.accepted;
      }).map(function (file) {
        return file;
      });
    }

    // Returns all files that have been rejected
    // Not sure when that's going to be useful, but added for completeness.

  }, {
    key: "getRejectedFiles",
    value: function getRejectedFiles() {
      return this.files.filter(function (file) {
        return !file.accepted;
      }).map(function (file) {
        return file;
      });
    }
  }, {
    key: "getFilesWithStatus",
    value: function getFilesWithStatus(status) {
      return this.files.filter(function (file) {
        return file.status === status;
      }).map(function (file) {
        return file;
      });
    }

    // Returns all files that are in the queue

  }, {
    key: "getQueuedFiles",
    value: function getQueuedFiles() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    }
  }, {
    key: "getUploadingFiles",
    value: function getUploadingFiles() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    }
  }, {
    key: "getAddedFiles",
    value: function getAddedFiles() {
      return this.getFilesWithStatus(Dropzone.ADDED);
    }

    // Files that are either queued or uploading

  }, {
    key: "getActiveFiles",
    value: function getActiveFiles() {
      return this.files.filter(function (file) {
        return file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED;
      }).map(function (file) {
        return file;
      });
    }

    // The function that gets called when Dropzone is initialized. You
    // can (and should) setup event listeners inside this function.

  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      // In case it isn't set already
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }

      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }

      if (this.clickableElements.length) {
        var setupHiddenFileInput = function setupHiddenFileInput() {
          if (_this3.hiddenFileInput) {
            _this3.hiddenFileInput.parentNode.removeChild(_this3.hiddenFileInput);
          }
          _this3.hiddenFileInput = document.createElement("input");
          _this3.hiddenFileInput.setAttribute("type", "file");
          if (_this3.options.maxFiles === null || _this3.options.maxFiles > 1) {
            _this3.hiddenFileInput.setAttribute("multiple", "multiple");
          }
          _this3.hiddenFileInput.className = "dz-hidden-input";

          if (_this3.options.acceptedFiles !== null) {
            _this3.hiddenFileInput.setAttribute("accept", _this3.options.acceptedFiles);
          }
          if (_this3.options.capture !== null) {
            _this3.hiddenFileInput.setAttribute("capture", _this3.options.capture);
          }

          // Not setting `display="none"` because some browsers don't accept clicks
          // on elements that aren't displayed.
          _this3.hiddenFileInput.style.visibility = "hidden";
          _this3.hiddenFileInput.style.position = "absolute";
          _this3.hiddenFileInput.style.top = "0";
          _this3.hiddenFileInput.style.left = "0";
          _this3.hiddenFileInput.style.height = "0";
          _this3.hiddenFileInput.style.width = "0";
          document.querySelector(_this3.options.hiddenInputContainer).appendChild(_this3.hiddenFileInput);
          return _this3.hiddenFileInput.addEventListener("change", function () {
            var files = _this3.hiddenFileInput.files;

            if (files.length) {
              for (var _iterator10 = files, _isArray10 = true, _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
                var _ref9;

                if (_isArray10) {
                  if (_i10 >= _iterator10.length) break;
                  _ref9 = _iterator10[_i10++];
                } else {
                  _i10 = _iterator10.next();
                  if (_i10.done) break;
                  _ref9 = _i10.value;
                }

                var file = _ref9;

                _this3.addFile(file);
              }
            }
            _this3.emit("addedfiles", files);
            return setupHiddenFileInput();
          });
        };
        setupHiddenFileInput();
      }

      this.URL = window.URL !== null ? window.URL : window.webkitURL;

      // Setup all event listeners on the Dropzone object itself.
      // They're not in @setupEventListeners() because they shouldn't be removed
      // again when the dropzone gets disabled.
      for (var _iterator11 = this.events, _isArray11 = true, _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
        var _ref10;

        if (_isArray11) {
          if (_i11 >= _iterator11.length) break;
          _ref10 = _iterator11[_i11++];
        } else {
          _i11 = _iterator11.next();
          if (_i11.done) break;
          _ref10 = _i11.value;
        }

        var eventName = _ref10;

        this.on(eventName, this.options[eventName]);
      }

      this.on("uploadprogress", function () {
        return _this3.updateTotalUploadProgress();
      });

      this.on("removedfile", function () {
        return _this3.updateTotalUploadProgress();
      });

      this.on("canceled", function (file) {
        return _this3.emit("complete", file);
      });

      // Emit a `queuecomplete` event if all files finished uploading.
      this.on("complete", function (file) {
        if (_this3.getAddedFiles().length === 0 && _this3.getUploadingFiles().length === 0 && _this3.getQueuedFiles().length === 0) {
          // This needs to be deferred so that `queuecomplete` really triggers after `complete`
          return setTimeout(function () {
            return _this3.emit("queuecomplete");
          }, 0);
        }
      });

      var noPropagation = function noPropagation(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };

      // Create the listeners
      this.listeners = [{
        element: this.element,
        events: {
          "dragstart": function dragstart(e) {
            return _this3.emit("dragstart", e);
          },
          "dragenter": function dragenter(e) {
            noPropagation(e);
            return _this3.emit("dragenter", e);
          },
          "dragover": function dragover(e) {
            // Makes it possible to drag files from chrome's download bar
            // http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
            // Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
            var efct = void 0;
            try {
              efct = e.dataTransfer.effectAllowed;
            } catch (error) {}
            e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';

            noPropagation(e);
            return _this3.emit("dragover", e);
          },
          "dragleave": function dragleave(e) {
            return _this3.emit("dragleave", e);
          },
          "drop": function drop(e) {
            noPropagation(e);
            return _this3.drop(e);
          },
          "dragend": function dragend(e) {
            return _this3.emit("dragend", e);
          }

          // This is disabled right now, because the browsers don't implement it properly.
          // "paste": (e) =>
          //   noPropagation e
          //   @paste e
        } }];

      this.clickableElements.forEach(function (clickableElement) {
        return _this3.listeners.push({
          element: clickableElement,
          events: {
            "click": function click(evt) {
              // Only the actual dropzone or the message element should trigger file selection
              if (clickableElement !== _this3.element || evt.target === _this3.element || Dropzone.elementInside(evt.target, _this3.element.querySelector(".dz-message"))) {
                _this3.hiddenFileInput.click(); // Forward the click
              }
              return true;
            }
          }
        });
      });

      this.enable();

      return this.options.init.call(this);
    }

    // Not fully tested yet

  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.removeAllFiles(true);
      if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : undefined) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    }
  }, {
    key: "updateTotalUploadProgress",
    value: function updateTotalUploadProgress() {
      var totalUploadProgress = void 0;
      var totalBytesSent = 0;
      var totalBytes = 0;

      var activeFiles = this.getActiveFiles();

      if (activeFiles.length) {
        for (var _iterator12 = this.getActiveFiles(), _isArray12 = true, _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
          var _ref11;

          if (_isArray12) {
            if (_i12 >= _iterator12.length) break;
            _ref11 = _iterator12[_i12++];
          } else {
            _i12 = _iterator12.next();
            if (_i12.done) break;
            _ref11 = _i12.value;
          }

          var file = _ref11;

          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }

      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    }

    // @options.paramName can be a function taking one parameter rather than a string.
    // A parameter name for a file is obtained simply by calling this with an index number.

  }, {
    key: "_getParamName",
    value: function _getParamName(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    }

    // If @options.renameFile is a function,
    // the function will be used to rename the file.name before appending it to the formData

  }, {
    key: "_renameFile",
    value: function _renameFile(file) {
      if (typeof this.options.renameFile !== "function") {
        return file.name;
      }
      return this.options.renameFile(file);
    }

    // Returns a form that can be used as fallback if the browser does not support DragnDrop
    //
    // If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
    // This code has to pass in IE7 :(

  }, {
    key: "getFallbackForm",
    value: function getFallbackForm() {
      var existingFallback = void 0,
          form = void 0;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }

      var fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + this._getParamName(0) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : undefined) + " /><input type=\"submit\" value=\"Upload!\"></div>";

      var fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        // Make sure that the enctype and method attributes are set properly
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    }

    // Returns the fallback elements if they exist already
    //
    // This code has to pass in IE7 :(

  }, {
    key: "getExistingFallback",
    value: function getExistingFallback() {
      var getFallback = function getFallback(elements) {
        for (var _iterator13 = elements, _isArray13 = true, _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
          var _ref12;

          if (_isArray13) {
            if (_i13 >= _iterator13.length) break;
            _ref12 = _iterator13[_i13++];
          } else {
            _i13 = _iterator13.next();
            if (_i13.done) break;
            _ref12 = _i13.value;
          }

          var el = _ref12;

          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };

      var _arr = ["div", "form"];
      for (var _i14 = 0; _i14 < _arr.length; _i14++) {
        var tagName = _arr[_i14];
        var fallback;
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    }

    // Activates all listeners stored in @listeners

  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];
          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return result;
        }();
      });
    }

    // Deactivates all listeners stored in @listeners

  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];
          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return result;
        }();
      });
    }

    // Removes all event listeners and cancels all files in the queue or being processed.

  }, {
    key: "disable",
    value: function disable() {
      var _this4 = this;

      this.clickableElements.forEach(function (element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      this.disabled = true;

      return this.files.map(function (file) {
        return _this4.cancelUpload(file);
      });
    }
  }, {
    key: "enable",
    value: function enable() {
      delete this.disabled;
      this.clickableElements.forEach(function (element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    }

    // Returns a nicely formatted filesize

  }, {
    key: "filesize",
    value: function filesize(size) {
      var selectedSize = 0;
      var selectedUnit = "b";

      if (size > 0) {
        var units = ['tb', 'gb', 'mb', 'kb', 'b'];

        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;

          if (size >= cutoff) {
            selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }

        selectedSize = Math.round(10 * selectedSize) / 10; // Cutting of digits
      }

      return "<strong>" + selectedSize + "</strong> " + this.options.dictFileSizeUnits[selectedUnit];
    }

    // Adds or removes the `dz-max-files-reached` class from the form.

  }, {
    key: "_updateMaxFilesReachedClass",
    value: function _updateMaxFilesReachedClass() {
      if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    }
  }, {
    key: "drop",
    value: function drop(e) {
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);

      var files = e.dataTransfer.files;

      this.emit("addedfiles", files);

      // Even if it's a folder, files.length will contain the folders.
      if (files.length) {
        var items = e.dataTransfer.items;

        if (items && items.length && items[0].webkitGetAsEntry != null) {
          // The browser supports dropping of folders, so handle items instead of files
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    }
  }, {
    key: "paste",
    value: function paste(e) {
      if (__guard__(e != null ? e.clipboardData : undefined, function (x) {
        return x.items;
      }) == null) {
        return;
      }

      this.emit("paste", e);
      var items = e.clipboardData.items;


      if (items.length) {
        return this._addFilesFromItems(items);
      }
    }
  }, {
    key: "handleFiles",
    value: function handleFiles(files) {
      for (var _iterator14 = files, _isArray14 = true, _i15 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
        var _ref13;

        if (_isArray14) {
          if (_i15 >= _iterator14.length) break;
          _ref13 = _iterator14[_i15++];
        } else {
          _i15 = _iterator14.next();
          if (_i15.done) break;
          _ref13 = _i15.value;
        }

        var file = _ref13;

        this.addFile(file);
      }
    }

    // When a folder is dropped (or files are pasted), items must be handled
    // instead of files.

  }, {
    key: "_addFilesFromItems",
    value: function _addFilesFromItems(items) {
      var _this5 = this;

      return function () {
        var result = [];
        for (var _iterator15 = items, _isArray15 = true, _i16 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
          var _ref14;

          if (_isArray15) {
            if (_i16 >= _iterator15.length) break;
            _ref14 = _iterator15[_i16++];
          } else {
            _i16 = _iterator15.next();
            if (_i16.done) break;
            _ref14 = _i16.value;
          }

          var item = _ref14;

          var entry;
          if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
            if (entry.isFile) {
              result.push(_this5.addFile(item.getAsFile()));
            } else if (entry.isDirectory) {
              // Append all files from that directory to files
              result.push(_this5._addFilesFromDirectory(entry, entry.name));
            } else {
              result.push(undefined);
            }
          } else if (item.getAsFile != null) {
            if (item.kind == null || item.kind === "file") {
              result.push(_this5.addFile(item.getAsFile()));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      }();
    }

    // Goes through the directory, and adds each file it finds recursively

  }, {
    key: "_addFilesFromDirectory",
    value: function _addFilesFromDirectory(directory, path) {
      var _this6 = this;

      var dirReader = directory.createReader();

      var errorHandler = function errorHandler(error) {
        return __guardMethod__(console, 'log', function (o) {
          return o.log(error);
        });
      };

      var readEntries = function readEntries() {
        return dirReader.readEntries(function (entries) {
          if (entries.length > 0) {
            for (var _iterator16 = entries, _isArray16 = true, _i17 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
              var _ref15;

              if (_isArray16) {
                if (_i17 >= _iterator16.length) break;
                _ref15 = _iterator16[_i17++];
              } else {
                _i17 = _iterator16.next();
                if (_i17.done) break;
                _ref15 = _i17.value;
              }

              var entry = _ref15;

              if (entry.isFile) {
                entry.file(function (file) {
                  if (_this6.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                    return;
                  }
                  file.fullPath = path + "/" + file.name;
                  return _this6.addFile(file);
                });
              } else if (entry.isDirectory) {
                _this6._addFilesFromDirectory(entry, path + "/" + entry.name);
              }
            }

            // Recursively call readEntries() again, since browser only handle
            // the first 100 entries.
            // See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
            readEntries();
          }
          return null;
        }, errorHandler);
      };

      return readEntries();
    }

    // If `done()` is called without argument the file is accepted
    // If you call it with an error message, the file is rejected
    // (This allows for asynchronous validation)
    //
    // This function checks the filesize, and if the file.type passes the
    // `acceptedFiles` check.

  }, {
    key: "accept",
    value: function accept(file, done) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    }
  }, {
    key: "addFile",
    value: function addFile(file) {
      var _this7 = this;

      file.upload = {
        uuid: Dropzone.uuidv4(),
        progress: 0,
        // Setting the total upload size to file.size for the beginning
        // It's actual different than the size to be transmitted.
        total: file.size,
        bytesSent: 0,
        filename: this._renameFile(file),
        chunked: this.options.chunking && (this.options.forceChunking || file.size > this.options.chunkSize),
        totalChunkCount: Math.ceil(file.size / this.options.chunkSize)
      };
      this.files.push(file);

      file.status = Dropzone.ADDED;

      this.emit("addedfile", file);

      this._enqueueThumbnail(file);

      return this.accept(file, function (error) {
        if (error) {
          file.accepted = false;
          _this7._errorProcessing([file], error); // Will set the file.status
        } else {
          file.accepted = true;
          if (_this7.options.autoQueue) {
            _this7.enqueueFile(file);
          } // Will set .accepted = true
        }
        return _this7._updateMaxFilesReachedClass();
      });
    }

    // Wrapper for enqueueFile

  }, {
    key: "enqueueFiles",
    value: function enqueueFiles(files) {
      for (var _iterator17 = files, _isArray17 = true, _i18 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator]();;) {
        var _ref16;

        if (_isArray17) {
          if (_i18 >= _iterator17.length) break;
          _ref16 = _iterator17[_i18++];
        } else {
          _i18 = _iterator17.next();
          if (_i18.done) break;
          _ref16 = _i18.value;
        }

        var file = _ref16;

        this.enqueueFile(file);
      }
      return null;
    }
  }, {
    key: "enqueueFile",
    value: function enqueueFile(file) {
      var _this8 = this;

      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(function () {
            return _this8.processQueue();
          }, 0); // Deferring the call
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    }
  }, {
    key: "_enqueueThumbnail",
    value: function _enqueueThumbnail(file) {
      var _this9 = this;

      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(function () {
          return _this9._processThumbnailQueue();
        }, 0); // Deferring the call
      }
    }
  }, {
    key: "_processThumbnailQueue",
    value: function _processThumbnailQueue() {
      var _this10 = this;

      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }

      this._processingThumbnail = true;
      var file = this._thumbnailQueue.shift();
      return this.createThumbnail(file, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, true, function (dataUrl) {
        _this10.emit("thumbnail", file, dataUrl);
        _this10._processingThumbnail = false;
        return _this10._processThumbnailQueue();
      });
    }

    // Can be called by the user to remove a file

  }, {
    key: "removeFile",
    value: function removeFile(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);

      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    }

    // Removes all files that aren't currently processed from the list

  }, {
    key: "removeAllFiles",
    value: function removeAllFiles(cancelIfNecessary) {
      // Create a copy of files since removeFile() changes the @files array.
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      for (var _iterator18 = this.files.slice(), _isArray18 = true, _i19 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator]();;) {
        var _ref17;

        if (_isArray18) {
          if (_i19 >= _iterator18.length) break;
          _ref17 = _iterator18[_i19++];
        } else {
          _i19 = _iterator18.next();
          if (_i19.done) break;
          _ref17 = _i19.value;
        }

        var file = _ref17;

        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    }

    // Resizes an image before it gets sent to the server. This function is the default behavior of
    // `options.transformFile` if `resizeWidth` or `resizeHeight` are set. The callback is invoked with
    // the resized blob.

  }, {
    key: "resizeImage",
    value: function resizeImage(file, width, height, resizeMethod, callback) {
      var _this11 = this;

      return this.createThumbnail(file, width, height, resizeMethod, false, function (dataUrl, canvas) {
        if (canvas == null) {
          // The image has not been resized
          return callback(file);
        } else {
          var resizeMimeType = _this11.options.resizeMimeType;

          if (resizeMimeType == null) {
            resizeMimeType = file.type;
          }
          var resizedDataURL = canvas.toDataURL(resizeMimeType, _this11.options.resizeQuality);
          if (resizeMimeType === 'image/jpeg' || resizeMimeType === 'image/jpg') {
            // Now add the original EXIF information
            resizedDataURL = ExifRestore.restore(file.dataURL, resizedDataURL);
          }
          return callback(Dropzone.dataURItoBlob(resizedDataURL));
        }
      });
    }
  }, {
    key: "createThumbnail",
    value: function createThumbnail(file, width, height, resizeMethod, fixOrientation, callback) {
      var _this12 = this;

      var fileReader = new FileReader();

      fileReader.onload = function () {

        file.dataURL = fileReader.result;

        // Don't bother creating a thumbnail for SVG images since they're vector
        if (file.type === "image/svg+xml") {
          if (callback != null) {
            callback(fileReader.result);
          }
          return;
        }

        return _this12.createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback);
      };

      return fileReader.readAsDataURL(file);
    }
  }, {
    key: "createThumbnailFromUrl",
    value: function createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback, crossOrigin) {
      var _this13 = this;

      // Not using `new Image` here because of a bug in latest Chrome versions.
      // See https://github.com/enyo/dropzone/pull/226
      var img = document.createElement("img");

      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      img.onload = function () {
        var loadExif = function loadExif(callback) {
          return callback(1);
        };
        if (typeof EXIF !== 'undefined' && EXIF !== null && fixOrientation) {
          loadExif = function loadExif(callback) {
            return EXIF.getData(img, function () {
              return callback(EXIF.getTag(this, 'Orientation'));
            });
          };
        }

        return loadExif(function (orientation) {
          file.width = img.width;
          file.height = img.height;

          var resizeInfo = _this13.options.resize.call(_this13, file, width, height, resizeMethod);

          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");

          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;

          if (orientation > 4) {
            canvas.width = resizeInfo.trgHeight;
            canvas.height = resizeInfo.trgWidth;
          }

          switch (orientation) {
            case 2:
              // horizontal flip
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              break;
            case 3:
              // 180° rotate left
              ctx.translate(canvas.width, canvas.height);
              ctx.rotate(Math.PI);
              break;
            case 4:
              // vertical flip
              ctx.translate(0, canvas.height);
              ctx.scale(1, -1);
              break;
            case 5:
              // vertical flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.scale(1, -1);
              break;
            case 6:
              // 90° rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(0, -canvas.height);
              break;
            case 7:
              // horizontal flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(canvas.width, -canvas.height);
              ctx.scale(-1, 1);
              break;
            case 8:
              // 90° rotate left
              ctx.rotate(-0.5 * Math.PI);
              ctx.translate(-canvas.width, 0);
              break;
          }

          // This is a bugfix for iOS' scaling bug.
          drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);

          var thumbnail = canvas.toDataURL("image/png");

          if (callback != null) {
            return callback(thumbnail, canvas);
          }
        });
      };

      if (callback != null) {
        img.onerror = callback;
      }

      return img.src = file.dataURL;
    }

    // Goes through the queue and processes files if there aren't too many already.

  }, {
    key: "processQueue",
    value: function processQueue() {
      var parallelUploads = this.options.parallelUploads;

      var processingLength = this.getUploadingFiles().length;
      var i = processingLength;

      // There are already at least as many files uploading than should be
      if (processingLength >= parallelUploads) {
        return;
      }

      var queuedFiles = this.getQueuedFiles();

      if (!(queuedFiles.length > 0)) {
        return;
      }

      if (this.options.uploadMultiple) {
        // The files should be uploaded in one request
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          } // Nothing left to process
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    }

    // Wrapper for `processFiles`

  }, {
    key: "processFile",
    value: function processFile(file) {
      return this.processFiles([file]);
    }

    // Loads the file, then calls finishedLoading()

  }, {
    key: "processFiles",
    value: function processFiles(files) {
      for (var _iterator19 = files, _isArray19 = true, _i20 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator]();;) {
        var _ref18;

        if (_isArray19) {
          if (_i20 >= _iterator19.length) break;
          _ref18 = _iterator19[_i20++];
        } else {
          _i20 = _iterator19.next();
          if (_i20.done) break;
          _ref18 = _i20.value;
        }

        var file = _ref18;

        file.processing = true; // Backwards compatibility
        file.status = Dropzone.UPLOADING;

        this.emit("processing", file);
      }

      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }

      return this.uploadFiles(files);
    }
  }, {
    key: "_getFilesWithXhr",
    value: function _getFilesWithXhr(xhr) {
      var files = void 0;
      return files = this.files.filter(function (file) {
        return file.xhr === xhr;
      }).map(function (file) {
        return file;
      });
    }

    // Cancels the file upload and sets the status to CANCELED
    // **if** the file is actually being uploaded.
    // If it's still in the queue, the file is being removed from it and the status
    // set to CANCELED.

  }, {
    key: "cancelUpload",
    value: function cancelUpload(file) {
      if (file.status === Dropzone.UPLOADING) {
        var groupedFiles = this._getFilesWithXhr(file.xhr);
        for (var _iterator20 = groupedFiles, _isArray20 = true, _i21 = 0, _iterator20 = _isArray20 ? _iterator20 : _iterator20[Symbol.iterator]();;) {
          var _ref19;

          if (_isArray20) {
            if (_i21 >= _iterator20.length) break;
            _ref19 = _iterator20[_i21++];
          } else {
            _i21 = _iterator20.next();
            if (_i21.done) break;
            _ref19 = _i21.value;
          }

          var groupedFile = _ref19;

          groupedFile.status = Dropzone.CANCELED;
        }
        if (typeof file.xhr !== 'undefined') {
          file.xhr.abort();
        }
        for (var _iterator21 = groupedFiles, _isArray21 = true, _i22 = 0, _iterator21 = _isArray21 ? _iterator21 : _iterator21[Symbol.iterator]();;) {
          var _ref20;

          if (_isArray21) {
            if (_i22 >= _iterator21.length) break;
            _ref20 = _iterator21[_i22++];
          } else {
            _i22 = _iterator21.next();
            if (_i22.done) break;
            _ref20 = _i22.value;
          }

          var _groupedFile = _ref20;

          this.emit("canceled", _groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }, {
    key: "resolveOption",
    value: function resolveOption(option) {
      if (typeof option === 'function') {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        return option.apply(this, args);
      }
      return option;
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(file) {
      return this.uploadFiles([file]);
    }
  }, {
    key: "uploadFiles",
    value: function uploadFiles(files) {
      var _this14 = this;

      this._transformFiles(files, function (transformedFiles) {
        if (files[0].upload.chunked) {
          // This file should be sent in chunks!

          // If the chunking option is set, we **know** that there can only be **one** file, since
          // uploadMultiple is not allowed with this option.
          var file = files[0];
          var transformedFile = transformedFiles[0];
          var startedChunkCount = 0;

          file.upload.chunks = [];

          var handleNextChunk = function handleNextChunk() {
            var chunkIndex = 0;

            // Find the next item in file.upload.chunks that is not defined yet.
            while (file.upload.chunks[chunkIndex] !== undefined) {
              chunkIndex++;
            }

            // This means, that all chunks have already been started.
            if (chunkIndex >= file.upload.totalChunkCount) return;

            startedChunkCount++;

            var start = chunkIndex * _this14.options.chunkSize;
            var end = Math.min(start + _this14.options.chunkSize, file.size);

            var dataBlock = {
              name: _this14._getParamName(0),
              data: transformedFile.webkitSlice ? transformedFile.webkitSlice(start, end) : transformedFile.slice(start, end),
              filename: file.upload.filename,
              chunkIndex: chunkIndex
            };

            file.upload.chunks[chunkIndex] = {
              file: file,
              index: chunkIndex,
              dataBlock: dataBlock, // In case we want to retry.
              status: Dropzone.UPLOADING,
              progress: 0,
              retries: 0 // The number of times this block has been retried.
            };

            _this14._uploadData(files, [dataBlock]);
          };

          file.upload.finishedChunkUpload = function (chunk) {
            var allFinished = true;
            chunk.status = Dropzone.SUCCESS;

            // Clear the data from the chunk
            chunk.dataBlock = null;

            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              if (file.upload.chunks[i] === undefined) {
                return handleNextChunk();
              }
              if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
                allFinished = false;
              }
            }

            if (allFinished) {
              _this14.options.chunksUploaded(file, function () {
                _this14._finished(files, '', null);
              });
            }
          };

          if (_this14.options.parallelChunkUploads) {
            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              handleNextChunk();
            }
          } else {
            handleNextChunk();
          }
        } else {
          var dataBlocks = [];
          for (var _i23 = 0; _i23 < files.length; _i23++) {
            dataBlocks[_i23] = {
              name: _this14._getParamName(_i23),
              data: transformedFiles[_i23],
              filename: files[_i23].upload.filename
            };
          }
          _this14._uploadData(files, dataBlocks);
        }
      });
    }

    /// Returns the right chunk for given file and xhr

  }, {
    key: "_getChunk",
    value: function _getChunk(file, xhr) {
      for (var i = 0; i < file.upload.totalChunkCount; i++) {
        if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].xhr === xhr) {
          return file.upload.chunks[i];
        }
      }
    }

    // This function actually uploads the file(s) to the server.
    // If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
    // files, or individual chunks for chunked upload).

  }, {
    key: "_uploadData",
    value: function _uploadData(files, dataBlocks) {
      var _this15 = this;

      var xhr = new XMLHttpRequest();

      // Put the xhr object in the file objects to be able to reference it later.
      for (var _iterator22 = files, _isArray22 = true, _i24 = 0, _iterator22 = _isArray22 ? _iterator22 : _iterator22[Symbol.iterator]();;) {
        var _ref21;

        if (_isArray22) {
          if (_i24 >= _iterator22.length) break;
          _ref21 = _iterator22[_i24++];
        } else {
          _i24 = _iterator22.next();
          if (_i24.done) break;
          _ref21 = _i24.value;
        }

        var file = _ref21;

        file.xhr = xhr;
      }
      if (files[0].upload.chunked) {
        // Put the xhr object in the right chunk object, so it can be associated later, and found with _getChunk
        files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
      }

      var method = this.resolveOption(this.options.method, files);
      var url = this.resolveOption(this.options.url, files);
      xhr.open(method, url, true);

      // Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8
      xhr.timeout = this.resolveOption(this.options.timeout, files);

      // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
      xhr.withCredentials = !!this.options.withCredentials;

      xhr.onload = function (e) {
        _this15._finishedUploading(files, xhr, e);
      };

      xhr.onerror = function () {
        _this15._handleUploadError(files, xhr);
      };

      // Some browsers do not have the .upload property
      var progressObj = xhr.upload != null ? xhr.upload : xhr;
      progressObj.onprogress = function (e) {
        return _this15._updateFilesUploadProgress(files, xhr, e);
      };

      var headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };

      if (this.options.headers) {
        Dropzone.extend(headers, this.options.headers);
      }

      for (var headerName in headers) {
        var headerValue = headers[headerName];
        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }

      var formData = new FormData();

      // Adding all @options parameters
      if (this.options.params) {
        var additionalParams = this.options.params;
        if (typeof additionalParams === 'function') {
          additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
        }

        for (var key in additionalParams) {
          var value = additionalParams[key];
          formData.append(key, value);
        }
      }

      // Let the user add additional data if necessary
      for (var _iterator23 = files, _isArray23 = true, _i25 = 0, _iterator23 = _isArray23 ? _iterator23 : _iterator23[Symbol.iterator]();;) {
        var _ref22;

        if (_isArray23) {
          if (_i25 >= _iterator23.length) break;
          _ref22 = _iterator23[_i25++];
        } else {
          _i25 = _iterator23.next();
          if (_i25.done) break;
          _ref22 = _i25.value;
        }

        var _file = _ref22;

        this.emit("sending", _file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }

      this._addFormElementData(formData);

      // Finally add the files
      // Has to be last because some servers (eg: S3) expect the file to be the last parameter
      for (var i = 0; i < dataBlocks.length; i++) {
        var dataBlock = dataBlocks[i];
        formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
      }

      this.submitRequest(xhr, formData, files);
    }

    // Transforms all files with this.options.transformFile and invokes done with the transformed files when done.

  }, {
    key: "_transformFiles",
    value: function _transformFiles(files, done) {
      var _this16 = this;

      var transformedFiles = [];
      // Clumsy way of handling asynchronous calls, until I get to add a proper Future library.
      var doneCounter = 0;

      var _loop = function _loop(i) {
        _this16.options.transformFile.call(_this16, files[i], function (transformedFile) {
          transformedFiles[i] = transformedFile;
          if (++doneCounter === files.length) {
            done(transformedFiles);
          }
        });
      };

      for (var i = 0; i < files.length; i++) {
        _loop(i);
      }
    }

    // Takes care of adding other input elements of the form to the AJAX request

  }, {
    key: "_addFormElementData",
    value: function _addFormElementData(formData) {
      // Take care of other input elements
      if (this.element.tagName === "FORM") {
        for (var _iterator24 = this.element.querySelectorAll("input, textarea, select, button"), _isArray24 = true, _i26 = 0, _iterator24 = _isArray24 ? _iterator24 : _iterator24[Symbol.iterator]();;) {
          var _ref23;

          if (_isArray24) {
            if (_i26 >= _iterator24.length) break;
            _ref23 = _iterator24[_i26++];
          } else {
            _i26 = _iterator24.next();
            if (_i26.done) break;
            _ref23 = _i26.value;
          }

          var input = _ref23;

          var inputName = input.getAttribute("name");
          var inputType = input.getAttribute("type");
          if (inputType) inputType = inputType.toLowerCase();

          // If the input doesn't have a name, we can't use it.
          if (typeof inputName === 'undefined' || inputName === null) continue;

          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            // Possibly multiple values
            for (var _iterator25 = input.options, _isArray25 = true, _i27 = 0, _iterator25 = _isArray25 ? _iterator25 : _iterator25[Symbol.iterator]();;) {
              var _ref24;

              if (_isArray25) {
                if (_i27 >= _iterator25.length) break;
                _ref24 = _iterator25[_i27++];
              } else {
                _i27 = _iterator25.next();
                if (_i27.done) break;
                _ref24 = _i27.value;
              }

              var option = _ref24;

              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || inputType !== "checkbox" && inputType !== "radio" || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
    }

    // Invoked when there is new progress information about given files.
    // If e is not provided, it is assumed that the upload is finished.

  }, {
    key: "_updateFilesUploadProgress",
    value: function _updateFilesUploadProgress(files, xhr, e) {
      var progress = void 0;
      if (typeof e !== 'undefined') {
        progress = 100 * e.loaded / e.total;

        if (files[0].upload.chunked) {
          var file = files[0];
          // Since this is a chunked upload, we need to update the appropriate chunk progress.
          var chunk = this._getChunk(file, xhr);
          chunk.progress = progress;
          chunk.total = e.total;
          chunk.bytesSent = e.loaded;
          var fileProgress = 0,
              fileTotal = void 0,
              fileBytesSent = void 0;
          file.upload.progress = 0;
          file.upload.total = 0;
          file.upload.bytesSent = 0;
          for (var i = 0; i < file.upload.totalChunkCount; i++) {
            if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].progress !== undefined) {
              file.upload.progress += file.upload.chunks[i].progress;
              file.upload.total += file.upload.chunks[i].total;
              file.upload.bytesSent += file.upload.chunks[i].bytesSent;
            }
          }
          file.upload.progress = file.upload.progress / file.upload.totalChunkCount;
        } else {
          for (var _iterator26 = files, _isArray26 = true, _i28 = 0, _iterator26 = _isArray26 ? _iterator26 : _iterator26[Symbol.iterator]();;) {
            var _ref25;

            if (_isArray26) {
              if (_i28 >= _iterator26.length) break;
              _ref25 = _iterator26[_i28++];
            } else {
              _i28 = _iterator26.next();
              if (_i28.done) break;
              _ref25 = _i28.value;
            }

            var _file2 = _ref25;

            _file2.upload.progress = progress;
            _file2.upload.total = e.total;
            _file2.upload.bytesSent = e.loaded;
          }
        }
        for (var _iterator27 = files, _isArray27 = true, _i29 = 0, _iterator27 = _isArray27 ? _iterator27 : _iterator27[Symbol.iterator]();;) {
          var _ref26;

          if (_isArray27) {
            if (_i29 >= _iterator27.length) break;
            _ref26 = _iterator27[_i29++];
          } else {
            _i29 = _iterator27.next();
            if (_i29.done) break;
            _ref26 = _i29.value;
          }

          var _file3 = _ref26;

          this.emit("uploadprogress", _file3, _file3.upload.progress, _file3.upload.bytesSent);
        }
      } else {
        // Called when the file finished uploading

        var allFilesFinished = true;

        progress = 100;

        for (var _iterator28 = files, _isArray28 = true, _i30 = 0, _iterator28 = _isArray28 ? _iterator28 : _iterator28[Symbol.iterator]();;) {
          var _ref27;

          if (_isArray28) {
            if (_i30 >= _iterator28.length) break;
            _ref27 = _iterator28[_i30++];
          } else {
            _i30 = _iterator28.next();
            if (_i30.done) break;
            _ref27 = _i30.value;
          }

          var _file4 = _ref27;

          if (_file4.upload.progress !== 100 || _file4.upload.bytesSent !== _file4.upload.total) {
            allFilesFinished = false;
          }
          _file4.upload.progress = progress;
          _file4.upload.bytesSent = _file4.upload.total;
        }

        // Nothing to do, all files already at 100%
        if (allFilesFinished) {
          return;
        }

        for (var _iterator29 = files, _isArray29 = true, _i31 = 0, _iterator29 = _isArray29 ? _iterator29 : _iterator29[Symbol.iterator]();;) {
          var _ref28;

          if (_isArray29) {
            if (_i31 >= _iterator29.length) break;
            _ref28 = _iterator29[_i31++];
          } else {
            _i31 = _iterator29.next();
            if (_i31.done) break;
            _ref28 = _i31.value;
          }

          var _file5 = _ref28;

          this.emit("uploadprogress", _file5, progress, _file5.upload.bytesSent);
        }
      }
    }
  }, {
    key: "_finishedUploading",
    value: function _finishedUploading(files, xhr, e) {
      var response = void 0;

      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.responseType !== 'arraybuffer' && xhr.responseType !== 'blob') {
        response = xhr.responseText;

        if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
          try {
            response = JSON.parse(response);
          } catch (error) {
            e = error;
            response = "Invalid JSON response from server.";
          }
        }
      }

      this._updateFilesUploadProgress(files);

      if (!(200 <= xhr.status && xhr.status < 300)) {
        this._handleUploadError(files, xhr, response);
      } else {
        if (files[0].upload.chunked) {
          files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr));
        } else {
          this._finished(files, response, e);
        }
      }
    }
  }, {
    key: "_handleUploadError",
    value: function _handleUploadError(files, xhr, response) {
      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (files[0].upload.chunked && this.options.retryChunks) {
        var chunk = this._getChunk(files[0], xhr);
        if (chunk.retries++ < this.options.retryChunksLimit) {
          this._uploadData(files, [chunk.dataBlock]);
          return;
        } else {
          console.warn('Retried this chunk too often. Giving up.');
        }
      }

      for (var _iterator30 = files, _isArray30 = true, _i32 = 0, _iterator30 = _isArray30 ? _iterator30 : _iterator30[Symbol.iterator]();;) {
        var _ref29;

        if (_isArray30) {
          if (_i32 >= _iterator30.length) break;
          _ref29 = _iterator30[_i32++];
        } else {
          _i32 = _iterator30.next();
          if (_i32.done) break;
          _ref29 = _i32.value;
        }

        var file = _ref29;

        this._errorProcessing(files, response || this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
      }
    }
  }, {
    key: "submitRequest",
    value: function submitRequest(xhr, formData, files) {
      xhr.send(formData);
    }

    // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_finished",
    value: function _finished(files, responseText, e) {
      for (var _iterator31 = files, _isArray31 = true, _i33 = 0, _iterator31 = _isArray31 ? _iterator31 : _iterator31[Symbol.iterator]();;) {
        var _ref30;

        if (_isArray31) {
          if (_i33 >= _iterator31.length) break;
          _ref30 = _iterator31[_i33++];
        } else {
          _i33 = _iterator31.next();
          if (_i33.done) break;
          _ref30 = _i33.value;
        }

        var file = _ref30;

        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }

    // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_errorProcessing",
    value: function _errorProcessing(files, message, xhr) {
      for (var _iterator32 = files, _isArray32 = true, _i34 = 0, _iterator32 = _isArray32 ? _iterator32 : _iterator32[Symbol.iterator]();;) {
        var _ref31;

        if (_isArray32) {
          if (_i34 >= _iterator32.length) break;
          _ref31 = _iterator32[_i34++];
        } else {
          _i34 = _iterator32.next();
          if (_i34.done) break;
          _ref31 = _i34.value;
        }

        var file = _ref31;

        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }], [{
    key: "uuidv4",
    value: function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    }
  }]);

  return Dropzone;
}(Emitter);

Dropzone.initClass();

Dropzone.version = "5.3.0";

// This is a map of options for your different dropzones. Add configurations
// to this object for your different dropzone elemens.
//
// Example:
//
//     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
//
// To disable autoDiscover for a specific element, you can set `false` as an option:
//
//     Dropzone.options.myDisabledElementId = false;
//
// And in html:
//
//     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>
Dropzone.options = {};

// Returns the options for an element or undefined if none available.
Dropzone.optionsForElement = function (element) {
  // Get the `Dropzone.options.elementId` for this element if it exists
  if (element.getAttribute("id")) {
    return Dropzone.options[camelize(element.getAttribute("id"))];
  } else {
    return undefined;
  }
};

// Holds a list of all dropzone instances
Dropzone.instances = [];

// Returns the dropzone for given element if any
Dropzone.forElement = function (element) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }
  if ((element != null ? element.dropzone : undefined) == null) {
    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
  }
  return element.dropzone;
};

// Set to false if you don't want Dropzone to automatically find and attach to .dropzone elements.
Dropzone.autoDiscover = true;

// Looks for all .dropzone elements and creates a dropzone for them
Dropzone.discover = function () {
  var dropzones = void 0;
  if (document.querySelectorAll) {
    dropzones = document.querySelectorAll(".dropzone");
  } else {
    dropzones = [];
    // IE :(
    var checkElements = function checkElements(elements) {
      return function () {
        var result = [];
        for (var _iterator33 = elements, _isArray33 = true, _i35 = 0, _iterator33 = _isArray33 ? _iterator33 : _iterator33[Symbol.iterator]();;) {
          var _ref32;

          if (_isArray33) {
            if (_i35 >= _iterator33.length) break;
            _ref32 = _iterator33[_i35++];
          } else {
            _i35 = _iterator33.next();
            if (_i35.done) break;
            _ref32 = _i35.value;
          }

          var el = _ref32;

          if (/(^| )dropzone($| )/.test(el.className)) {
            result.push(dropzones.push(el));
          } else {
            result.push(undefined);
          }
        }
        return result;
      }();
    };
    checkElements(document.getElementsByTagName("div"));
    checkElements(document.getElementsByTagName("form"));
  }

  return function () {
    var result = [];
    for (var _iterator34 = dropzones, _isArray34 = true, _i36 = 0, _iterator34 = _isArray34 ? _iterator34 : _iterator34[Symbol.iterator]();;) {
      var _ref33;

      if (_isArray34) {
        if (_i36 >= _iterator34.length) break;
        _ref33 = _iterator34[_i36++];
      } else {
        _i36 = _iterator34.next();
        if (_i36.done) break;
        _ref33 = _i36.value;
      }

      var dropzone = _ref33;

      // Create a dropzone unless auto discover has been disabled for specific element
      if (Dropzone.optionsForElement(dropzone) !== false) {
        result.push(new Dropzone(dropzone));
      } else {
        result.push(undefined);
      }
    }
    return result;
  }();
};

// Since the whole Drag'n'Drop API is pretty new, some browsers implement it,
// but not correctly.
// So I created a blacklist of userAgents. Yes, yes. Browser sniffing, I know.
// But what to do when browsers *theoretically* support an API, but crash
// when using it.
//
// This is a list of regular expressions tested against navigator.userAgent
//
// ** It should only be used on browser that *do* support the API, but
// incorrectly **
//
Dropzone.blacklistedBrowsers = [
// The mac os and windows phone version of opera 12 seems to have a problem with the File drag'n'drop API.
/opera.*(Macintosh|Windows Phone).*version\/12/i];

// Checks if the browser is supported
Dropzone.isBrowserSupported = function () {
  var capableBrowser = true;

  if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
    if (!("classList" in document.createElement("a"))) {
      capableBrowser = false;
    } else {
      // The browser supports the API, but may be blacklisted.
      for (var _iterator35 = Dropzone.blacklistedBrowsers, _isArray35 = true, _i37 = 0, _iterator35 = _isArray35 ? _iterator35 : _iterator35[Symbol.iterator]();;) {
        var _ref34;

        if (_isArray35) {
          if (_i37 >= _iterator35.length) break;
          _ref34 = _iterator35[_i37++];
        } else {
          _i37 = _iterator35.next();
          if (_i37.done) break;
          _ref34 = _i37.value;
        }

        var regex = _ref34;

        if (regex.test(navigator.userAgent)) {
          capableBrowser = false;
          continue;
        }
      }
    }
  } else {
    capableBrowser = false;
  }

  return capableBrowser;
};

Dropzone.dataURItoBlob = function (dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob
  return new Blob([ab], { type: mimeString });
};

// Returns an array without the rejected item
var without = function without(list, rejectedItem) {
  return list.filter(function (item) {
    return item !== rejectedItem;
  }).map(function (item) {
    return item;
  });
};

// abc-def_ghi -> abcDefGhi
var camelize = function camelize(str) {
  return str.replace(/[\-_](\w)/g, function (match) {
    return match.charAt(1).toUpperCase();
  });
};

// Creates an element from string
Dropzone.createElement = function (string) {
  var div = document.createElement("div");
  div.innerHTML = string;
  return div.childNodes[0];
};

// Tests if given element is inside (or simply is) the container
Dropzone.elementInside = function (element, container) {
  if (element === container) {
    return true;
  } // Coffeescript doesn't support do/while loops
  while (element = element.parentNode) {
    if (element === container) {
      return true;
    }
  }
  return false;
};

Dropzone.getElement = function (el, name) {
  var element = void 0;
  if (typeof el === "string") {
    element = document.querySelector(el);
  } else if (el.nodeType != null) {
    element = el;
  }
  if (element == null) {
    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
  }
  return element;
};

Dropzone.getElements = function (els, name) {
  var el = void 0,
      elements = void 0;
  if (els instanceof Array) {
    elements = [];
    try {
      for (var _iterator36 = els, _isArray36 = true, _i38 = 0, _iterator36 = _isArray36 ? _iterator36 : _iterator36[Symbol.iterator]();;) {
        if (_isArray36) {
          if (_i38 >= _iterator36.length) break;
          el = _iterator36[_i38++];
        } else {
          _i38 = _iterator36.next();
          if (_i38.done) break;
          el = _i38.value;
        }

        elements.push(this.getElement(el, name));
      }
    } catch (e) {
      elements = null;
    }
  } else if (typeof els === "string") {
    elements = [];
    for (var _iterator37 = document.querySelectorAll(els), _isArray37 = true, _i39 = 0, _iterator37 = _isArray37 ? _iterator37 : _iterator37[Symbol.iterator]();;) {
      if (_isArray37) {
        if (_i39 >= _iterator37.length) break;
        el = _iterator37[_i39++];
      } else {
        _i39 = _iterator37.next();
        if (_i39.done) break;
        el = _i39.value;
      }

      elements.push(el);
    }
  } else if (els.nodeType != null) {
    elements = [els];
  }

  if (elements == null || !elements.length) {
    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
  }

  return elements;
};

// Asks the user the question and calls accepted or rejected accordingly
//
// The default implementation just uses `window.confirm` and then calls the
// appropriate callback.
Dropzone.confirm = function (question, accepted, rejected) {
  if (window.confirm(question)) {
    return accepted();
  } else if (rejected != null) {
    return rejected();
  }
};

// Validates the mime type like this:
//
// https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept
Dropzone.isValidFile = function (file, acceptedFiles) {
  if (!acceptedFiles) {
    return true;
  } // If there are no accepted mime types, it's OK
  acceptedFiles = acceptedFiles.split(",");

  var mimeType = file.type;
  var baseMimeType = mimeType.replace(/\/.*$/, "");

  for (var _iterator38 = acceptedFiles, _isArray38 = true, _i40 = 0, _iterator38 = _isArray38 ? _iterator38 : _iterator38[Symbol.iterator]();;) {
    var _ref35;

    if (_isArray38) {
      if (_i40 >= _iterator38.length) break;
      _ref35 = _iterator38[_i40++];
    } else {
      _i40 = _iterator38.next();
      if (_i40.done) break;
      _ref35 = _i40.value;
    }

    var validType = _ref35;

    validType = validType.trim();
    if (validType.charAt(0) === ".") {
      if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
        return true;
      }
    } else if (/\/\*$/.test(validType)) {
      // This is something like a image/* mime type
      if (baseMimeType === validType.replace(/\/.*$/, "")) {
        return true;
      }
    } else {
      if (mimeType === validType) {
        return true;
      }
    }
  }

  return false;
};

// Augment jQuery
if (typeof jQuery !== 'undefined' && jQuery !== null) {
  jQuery.fn.dropzone = function (options) {
    return this.each(function () {
      return new Dropzone(this, options);
    });
  };
}

if (typeof module !== 'undefined' && module !== null) {
  module.exports = Dropzone;
} else {
  window.Dropzone = Dropzone;
}

// Dropzone file status codes
Dropzone.ADDED = "added";

Dropzone.QUEUED = "queued";
// For backwards compatibility. Now, if a file is accepted, it's either queued
// or uploading.
Dropzone.ACCEPTED = Dropzone.QUEUED;

Dropzone.UPLOADING = "uploading";
Dropzone.PROCESSING = Dropzone.UPLOADING; // alias

Dropzone.CANCELED = "canceled";
Dropzone.ERROR = "error";
Dropzone.SUCCESS = "success";

/*

 Bugfix for iOS 6 and 7
 Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
 based on the work of https://github.com/stomita/ios-imagefile-megapixel

 */

// Detecting vertical squash in loaded image.
// Fixes a bug which squash image vertically while drawing into canvas for some images.
// This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
var detectVerticalSquash = function detectVerticalSquash(img) {
  var iw = img.naturalWidth;
  var ih = img.naturalHeight;
  var canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = ih;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var _ctx$getImageData = ctx.getImageData(1, 0, 1, ih),
      data = _ctx$getImageData.data;

  // search image edge pixel position in case it is squashed vertically.


  var sy = 0;
  var ey = ih;
  var py = ih;
  while (py > sy) {
    var alpha = data[(py - 1) * 4 + 3];

    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }

    py = ey + sy >> 1;
  }
  var ratio = py / ih;

  if (ratio === 0) {
    return 1;
  } else {
    return ratio;
  }
};

// A replacement for context.drawImage
// (args are for source and destination).
var drawImageIOSFix = function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
  var vertSquashRatio = detectVerticalSquash(img);
  return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};

// Based on MinifyJpeg
// Source: http://www.perry.cz/files/ExifRestorer.js
// http://elicon.blog57.fc2.com/blog-entry-206.html

var ExifRestore = function () {
  function ExifRestore() {
    _classCallCheck(this, ExifRestore);
  }

  _createClass(ExifRestore, null, [{
    key: "initClass",
    value: function initClass() {
      this.KEY_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    }
  }, {
    key: "encode64",
    value: function encode64(input) {
      var output = '';
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = '';
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = '';
      var i = 0;
      while (true) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + this.KEY_STR.charAt(enc1) + this.KEY_STR.charAt(enc2) + this.KEY_STR.charAt(enc3) + this.KEY_STR.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
        if (!(i < input.length)) {
          break;
        }
      }
      return output;
    }
  }, {
    key: "restore",
    value: function restore(origFileBase64, resizedFileBase64) {
      if (!origFileBase64.match('data:image/jpeg;base64,')) {
        return resizedFileBase64;
      }
      var rawImage = this.decode64(origFileBase64.replace('data:image/jpeg;base64,', ''));
      var segments = this.slice2Segments(rawImage);
      var image = this.exifManipulation(resizedFileBase64, segments);
      return "data:image/jpeg;base64," + this.encode64(image);
    }
  }, {
    key: "exifManipulation",
    value: function exifManipulation(resizedFileBase64, segments) {
      var exifArray = this.getExifArray(segments);
      var newImageArray = this.insertExif(resizedFileBase64, exifArray);
      var aBuffer = new Uint8Array(newImageArray);
      return aBuffer;
    }
  }, {
    key: "getExifArray",
    value: function getExifArray(segments) {
      var seg = undefined;
      var x = 0;
      while (x < segments.length) {
        seg = segments[x];
        if (seg[0] === 255 & seg[1] === 225) {
          return seg;
        }
        x++;
      }
      return [];
    }
  }, {
    key: "insertExif",
    value: function insertExif(resizedFileBase64, exifArray) {
      var imageData = resizedFileBase64.replace('data:image/jpeg;base64,', '');
      var buf = this.decode64(imageData);
      var separatePoint = buf.indexOf(255, 3);
      var mae = buf.slice(0, separatePoint);
      var ato = buf.slice(separatePoint);
      var array = mae;
      array = array.concat(exifArray);
      array = array.concat(ato);
      return array;
    }
  }, {
    key: "slice2Segments",
    value: function slice2Segments(rawImageArray) {
      var head = 0;
      var segments = [];
      while (true) {
        var length;
        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 218) {
          break;
        }
        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 216) {
          head += 2;
        } else {
          length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
          var endPoint = head + length + 2;
          var seg = rawImageArray.slice(head, endPoint);
          segments.push(seg);
          head = endPoint;
        }
        if (head > rawImageArray.length) {
          break;
        }
      }
      return segments;
    }
  }, {
    key: "decode64",
    value: function decode64(input) {
      var output = '';
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = '';
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = '';
      var i = 0;
      var buf = [];
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        console.warn('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      while (true) {
        enc1 = this.KEY_STR.indexOf(input.charAt(i++));
        enc2 = this.KEY_STR.indexOf(input.charAt(i++));
        enc3 = this.KEY_STR.indexOf(input.charAt(i++));
        enc4 = this.KEY_STR.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        buf.push(chr1);
        if (enc3 !== 64) {
          buf.push(chr2);
        }
        if (enc4 !== 64) {
          buf.push(chr3);
        }
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
        if (!(i < input.length)) {
          break;
        }
      }
      return buf;
    }
  }]);

  return ExifRestore;
}();

ExifRestore.initClass();

/*
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 */

// @win window reference
// @fn function reference
var contentLoaded = function contentLoaded(win, fn) {
  var done = false;
  var top = true;
  var doc = win.document;
  var root = doc.documentElement;
  var add = doc.addEventListener ? "addEventListener" : "attachEvent";
  var rem = doc.addEventListener ? "removeEventListener" : "detachEvent";
  var pre = doc.addEventListener ? "" : "on";
  var init = function init(e) {
    if (e.type === "readystatechange" && doc.readyState !== "complete") {
      return;
    }
    (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
    if (!done && (done = true)) {
      return fn.call(win, e.type || e);
    }
  };

  var poll = function poll() {
    try {
      root.doScroll("left");
    } catch (e) {
      setTimeout(poll, 50);
      return;
    }
    return init("poll");
  };

  if (doc.readyState !== "complete") {
    if (doc.createEventObject && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (error) {}
      if (top) {
        poll();
      }
    }
    doc[add](pre + "DOMContentLoaded", init, false);
    doc[add](pre + "readystatechange", init, false);
    return win[add](pre + "load", init, false);
  }
};

// As a single function to be able to write tests.
Dropzone._autoDiscoverFunction = function () {
  if (Dropzone.autoDiscover) {
    return Dropzone.discover();
  }
};
contentLoaded(window, Dropzone._autoDiscoverFunction);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}




var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var defaults = {
    lines: 35,
    length: 12,
    width: 4,
    radius: 50,
    scale: 1.0,
    corners: 0,
    color: '#fbcf5a',
    fadeColor: 'transparent',
    opacity: 0,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 150,
    fps: 20,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: 'none',
    position: 'absolute',
};
window.Spinner = /** @class */ (function () {
    function Spinner(opts) {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    Spinner.prototype.spin = function (target) {
        var _this = this;
        this.stop();
        this.el = document.createElement('div');
        this.el.className = this.opts.className;
        this.el.setAttribute('role', 'progressbar');
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top,
            transform: "scale(" + this.opts.scale + ")",
        });
        if (target) {
            target.insertBefore(this.el, target.firstChild || null);
        }
        var animator;
        var getNow;
        if (typeof requestAnimationFrame !== 'undefined') {
            animator = requestAnimationFrame;
            getNow = function () { return performance.now(); };
        }
        else {
            // fallback for IE 9
            animator = function (callback) { return setTimeout(callback, 1000 / _this.opts.fps); };
            getNow = function () { return Date.now(); };
        }
        var lastFrameTime;
        var state = 0; // state is rotation percentage (between 0 and 1)
        var animate = function () {
            var time = getNow();
            if (lastFrameTime === undefined) {
                lastFrameTime = time - 1;
            }
            state += getAdvancePercentage(time - lastFrameTime, _this.opts.speed);
            lastFrameTime = time;
            if (state > 1) {
                state -= Math.floor(state);
            }
            if (_this.el.childNodes.length === _this.opts.lines) {
                for (var line = 0; line < _this.opts.lines; line++) {
                    var opacity = getLineOpacity(line, state, _this.opts);
                    _this.el.childNodes[line].childNodes[0].style.opacity = opacity.toString();
                }
            }
            _this.animateId = _this.el ? animator(animate) : undefined;
        };
        drawLines(this.el, this.opts);
        animate();
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    Spinner.prototype.stop = function () {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            }
            else {
                clearTimeout(this.animateId);
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = undefined;
        }
        return this;
    };
    return Spinner;
}());

function getAdvancePercentage(msSinceLastFrame, roundsPerSecond) {
    return msSinceLastFrame / 1000 * roundsPerSecond;
}
function getLineOpacity(line, state, opts) {
    var linePercent = (line + 1) / opts.lines;
    var diff = state - (linePercent * opts.direction);
    if (diff < 0 || diff > 1) {
        diff += opts.direction;
    }
    // opacity should start at 1, and approach opacity option as diff reaches trail percentage
    var trailPercent = opts.trail / 100;
    var opacityPercent = 1 - diff / trailPercent;
    if (opacityPercent < 0) {
        return opts.opacity;
    }
    var opacityDiff = 1 - opts.opacity;
    return opacityPercent * opacityDiff + opts.opacity;
}
/**
 * Tries various vendor prefixes and returns the first supported property.
 */
function vendor(el, prop) {
    if (el.style[prop] !== undefined) {
        return prop;
    }
    // needed for transform properties in IE 9
    var prefixed = 'ms' + prop.charAt(0).toUpperCase() + prop.slice(1);
    if (el.style[prefixed] !== undefined) {
        return prefixed;
    }
    return '';
}
/**
 * Sets multiple style properties at once.
 */
function css(el, props) {
    for (var prop in props) {
        el.style[vendor(el, prop) || prop] = props[prop];
    }
    return el;
}
/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */
function drawLines(el, opts) {
    var borderRadius = (Math.round(opts.corners * opts.width * 500) / 1000) + 'px';
    var shadow = 'none';
    if (opts.shadow === true) {
        shadow = '0 2px 4px #000'; // default shadow
    }
    else if (typeof opts.shadow === 'string') {
        shadow = opts.shadow;
    }
    var shadows = parseBoxShadow(shadow);
    for (var i = 0; i < opts.lines; i++) {
        var degrees = ~~(360 / opts.lines * i + opts.rotate);
        var backgroundLine = css(document.createElement('div'), {
            position: 'absolute',
            top: -opts.width / 2 + "px",
            width: (opts.length + opts.width) + 'px',
            height: opts.width + 'px',
            background: getColor(opts.fadeColor, i),
            borderRadius: borderRadius,
            transformOrigin: 'left',
            transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)",
        });
        var line = css(document.createElement('div'), {
            width: '100%',
            height: '100%',
            background: getColor(opts.color, i),
            borderRadius: borderRadius,
            boxShadow: normalizeShadow(shadows, degrees),
            opacity: opts.opacity,
        });
        backgroundLine.appendChild(line);
        el.appendChild(backgroundLine);
    }
}
function parseBoxShadow(boxShadow) {
    var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
    var shadows = [];
    for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
        var shadow = _a[_i];
        var matches = shadow.match(regex);
        if (matches === null) {
            continue; // invalid syntax
        }
        var x = +matches[2];
        var y = +matches[5];
        var xUnits = matches[4];
        var yUnits = matches[7];
        if (x === 0 && !xUnits) {
            xUnits = yUnits;
        }
        if (y === 0 && !yUnits) {
            yUnits = xUnits;
        }
        if (xUnits !== yUnits) {
            continue; // units must match to use as coordinates
        }
        shadows.push({
            prefix: matches[1] || '',
            x: x,
            y: y,
            xUnits: xUnits,
            yUnits: yUnits,
            end: matches[8],
        });
    }
    return shadows;
}
/**
 * Modify box-shadow x/y offsets to counteract rotation
 */
function normalizeShadow(shadows, degrees) {
    var normalized = [];
    for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
        var shadow = shadows_1[_i];
        var xy = convertOffset(shadow.x, shadow.y, degrees);
        normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
    }
    return normalized.join(', ');
}
function convertOffset(x, y, degrees) {
    var radians = degrees * Math.PI / 180;
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    return [
        Math.round((x * cos + y * sin) * 1000) / 1000,
        Math.round((-x * sin + y * cos) * 1000) / 1000,
    ];
}




//verify-email.js
(function() {
  function VerifyEmail(element, parent) {
    this.element = element;
    this.parent = parent;
    this.bindEvent();
  }

  VerifyEmail.prototype = {
    constructor: VerifyEmail,
    bindEvent: function() {
      var element = this.element;
      var parent = this.parent;
      var error = $(parent).find(".email_error");
      var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      var that = this;
      $(element).blur(function() {
        var value = $(element).val();
        if (value == "") {
          that.showError(element, error, "Email Address required");
        } else if (!reg.test(value)) {
          that.showError(element, error, "Email Address invalid");
        } else {
          $(error).css("display", "none");
          $(element).removeClass("error");
          $(parent).find(".btn_submit").removeClass("disabled");
        }
      });
    },
    showError: function(target, errorTarget, message) {
      var parent = this.parent;
      $(errorTarget).html(message);
      $(errorTarget).css("display", "block");
      $(target).addClass("error");
      $(parent).find(".btn_submit").addClass("disabled");
    }
  }

  $.fn.verifyEmail = function(parent) {
    return new VerifyEmail($(this), parent);
  }

})();




//verify-confirm-email.js
(function() {
  function VerifyConfirmEmail(element, parent) {
    this.element = element;
    this.parent = parent;
    this.bindEvent();
  }

  VerifyConfirmEmail.prototype = {
    constructor: VerifyConfirmEmail,
    bindEvent: function() {
      var element = this.element;
      var parent = this.parent;
      $(element).on("input propertychange", function() {
        var email = $(parent).find(".email").not($(this)).val();
        var confirmEmail = $(this).val();
        if (confirmEmail != email) {
          $(this).addClass("error");
          $(this).siblings(".input_error").css("display", "block");
          $(parent).find(".btn_submit").addClass("disabled");
        } else {
          $(this).removeClass("error");
          $(this).siblings(".input_error").css("display", "none");
          $(parent).find(".btn_submit").removeClass("disabled");
        }
      });
    }
  }

  $.fn.verifyConfirmEmail = function(parent) {
    return new VerifyConfirmEmail($(this), parent);
  }

})();




//show-hide-password.js
(function() {
  function ShowHidePassword(element) {
    this.element = element;
    this.bindEvent();
  }

  ShowHidePassword.prototype = {
    constructor: ShowHidePassword,
    bindEvent: function() {
      var element = this.element;
      $(element).click(function() {
        var password = $(this).siblings(".password");
        var otherOperation = $(this).siblings(".operation");
        if ($(this).hasClass("hide_pwd")) {
          $(password).attr("type", "password");
        } else {
          $(password).attr("type", "text");
        }
        $(this).toggle();
        $(otherOperation).toggle();
      });
    }
  }

  $.fn.showHidePassword = function() {
    return new ShowHidePassword($(this));
  }

})();




//verify-input-password.js
(function() {
  function VerifyInputPassword(element, parent) {
    this.element = element;
    this.parent = parent;
    this.bindEvent();
  }

  VerifyInputPassword.prototype = {
    constructor: VerifyInputPassword,
    bindEvent: function() {
      var element = this.element;
      var parent = this.parent;
      var that = this;
      $(element).focus(function() {
        $(parent).find(".password_verify").css("display", "block");
      });

      $(element).on("input propertychange", function() {
        var passwordVal = $(this).val();
        var confirmPassword = $(parent).find(".confirm_password");
        var confirmPasswordVal = $(confirmPassword).val();
        var numberReg = /\d/;
        var letterReg = /[a-zA-z]/;
        var characterReg = /[!@#\$%\^&\*\)\(_-]/;
        var lengthRequirement = $(parent).find(".length_requirement");
        var letterRequirement = $(parent).find(".letter_requirement");
        var numberRequirement = $(parent).find(".number_requirement");
        var characterRequirement = $(parent).find(".character_requirement");
        if (passwordVal != "") {
          $(element).removeClass("error");
          $(element).siblings(".input_error").css("display", "none");
          if (confirmPasswordVal != "" && confirmPasswordVal != passwordVal) {
            $(confirmPassword).addClass("error");
            $(confirmPassword).siblings(".input_error").css("display", "block");
          } else {
            $(confirmPassword).removeClass("error");
            $(confirmPassword).siblings(".input_error").css("display", "none");
          }
        }
        that.updateRequirements(lengthRequirement, passwordVal.length >= 8);
        that.updateRequirements(numberRequirement, numberReg.test(passwordVal));
        that.updateRequirements(letterRequirement, letterReg.test(passwordVal));
        that.updateRequirements(characterRequirement, characterReg.test(passwordVal));
      });
    },
    updateRequirements: function(target, isValid) {
      if (isValid) {
        $(target).removeClass("invalid");
        $(target).addClass("valid");
      } else {
        $(target).removeClass("valid");
        $(target).addClass("invalid");
      }
    }
  }

  $.fn.verifyInputPassword = function(parent) {
    return new VerifyInputPassword($(this), parent);
  }

})();




//verify-confirm-password.js
(function() {
  function VerifyConfirmPassword(element, parent) {
    this.element = element;
    this.parent = parent;
    this.bindEvent();
  }

  VerifyConfirmPassword.prototype = {
    constructor: VerifyConfirmPassword,
    bindEvent: function() {
      var element = this.element;
      var parent = this.parent;
      $(element).on("input propertychange", function() {
        var password = $(parent).find(".origin_password").val();
        var confirmPassword = $(this).val();
        if (confirmPassword != password) {
          $(this).addClass("error");
          $(this).siblings(".input_error").css("display", "block");
          $(parent).find(".btn_submit").addClass("disabled");
        } else {
          $(this).removeClass("error");
          $(this).siblings(".input_error").css("display", "none");
          $(parent).find(".btn_submit").removeClass("disabled");
        }
      });
    }
  }

  $.fn.verifyConfirmPassword = function(parent) {
    return new VerifyConfirmPassword($(this), parent);
  }

})();




//verify-password.js
(function() {
  function VerifyPassword(element, parent) {
    this.element = element;
    this.parent = parent;
    this.bindEvent();
  }

  VerifyPassword.prototype = {
    constructor: VerifyPassword,
    bindEvent: function() {
      var element = this.element;
      var parent = this.parent;
      var error = $(parent).find(".password_error");
      var reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*\)\(_-])[\da-zA-Z!@#\$%\^&\*\)\(_-]{8,50}$/;
      var that = this;
      $(element).on("input propertychange", function() {
        var value = $(element).val();
        if (value == "") {
          that.showError(element, error, "Password required");
        } else if (!reg.test(value)) {
          that.showError(element, error, "Password incorrect");
        } else {
          $(error).css("display", "none");
          $(element).removeClass("error");
          $(parent).find(".btn_submit").removeClass("disabled");
        }
      });
    },
    showError: function(target, errorTarget, message) {
      var parent = this.parent;
      $(errorTarget).html(message);
      $(errorTarget).css("display", "block");
      $(target).addClass("error");
      $(parent).find(".btn_submit").addClass("disabled");
    }
  }

  $.fn.verifyPassword = function(parent) {
    return new VerifyPassword($(this), parent);
  }

})();




//verify-phone-number.js
(function() {
  function VerifyPhoneNumber(element) {
    this.element = element;
    this.bindEvent();
  }

  VerifyPhoneNumber.prototype = {
    constructor: VerifyPhoneNumber,
    bindEvent: function() {
      var element = this.element;
      var reg = /^[0-9]*$/;
      $(element).on("input propertychange", function() {
        var phoneNum = $(this).val();
        if(reg.test(phoneNum)) {
          $(this).removeClass("error");
          $(this).siblings(".input_error").css("display", "none");
        } else {
          $(this).addClass("error");
          $(this).siblings(".input_error").css("display", "block");
        }
      });
      $(element).blur(function() {
        var phoneNum = $(this).val();
        if(reg.test(phoneNum) && phoneNum.length == 10) {
          var formatPhoneNum = "(" + phoneNum.substring(0, 3) + ")" + phoneNum.substring(3, 6) + "-" + phoneNum.substring(6, 10);
          $(this).val(formatPhoneNum);
          $(this).focus(function() {
            var phoneNum = $(this).val();
            var formatPhoneNum = phoneNum.substring(1, 4) + phoneNum.substring(5, 8) + phoneNum.substring(9, 13);
            $(this).val(formatPhoneNum);
            $(this).off("focus");
          });
        } else if(!reg.test(phoneNum) || phoneNum.length != 10) {
          $(this).addClass("error");
          $(this).siblings(".input_error").css("display", "block");
          return;
        }
      });
    }
  }

  $.fn.verifyPhoneNumber = function() {
    return new VerifyPhoneNumber($(this));
  }

})();




//verify-number.js
(function() {
  function VerifyNumber(element, parent) {
    this.element = element;
    this.parent = parent;
    this.bindEvent();
  }

  VerifyNumber.prototype = {
    constructor: VerifyNumber,
    bindEvent: function() {
      var element = this.element;
      var parent = this.parent;
      var that = this;
      $(element).on("input propertychange", function() {
        var pattern = /^[0-9]*$/;
        var number = $(this).val();
        if (pattern.test(number)) {
          $(this).removeClass("error");
          $(this).siblings(".required_error").css("display", "none");
          $(this).siblings(".format_error").css("display", "none");
          $(parent).find(".btn_submit").removeClass("disabled");
        } else {
          $(this).addClass("error");
          $(this).siblings(".required_error").css("display", "none");
          $(this).siblings(".format_error").css("display", "block");
        }
      });
    }
  }

  $.fn.verifyNumber = function(parent) {
    return new VerifyNumber($(this), parent);
  }

})();




//verify-required.js
(function() {
  function VerifyRequired(element) {
    this.element = element;
    this.bindEvent();
  }

  VerifyRequired.prototype = {
    constructor: VerifyRequired,
    bindEvent: function() {
      var element = this.element;
      $(element).find(".btn_submit").click(function() {
        var required_field = $(element).find(".required_field:visible");
        $(required_field).each(function() {
          var isRequired = $(this).attr("data-required");
          var value = $(this).find(".required_value").val();
          var that = $(this);
          if (isRequired == "required") {
            if (value == "") {
              $(this).addClass("error");
              $(this).siblings(".required_error").css("display", "block");
              $(element).find(".btn_submit").addClass("disabled");
              $(this).find(".required_value").change(function() {
                var newVal = $(this).val();
                if(newVal != "") {
                  $(that).removeClass("error");
                  $(that).siblings(".required_error").css("display", "none");
                  $(element).find(".btn_submit").removeClass("disabled");
                }
                $(this).off("change");
              });
            }
          }
        })

        $(element).find("input[required='required']:visible, textarea[required='required']:visible").each(function() {
          var value = $(this).val();
          if(value == "") {
            $(this).addClass("error");
            $(this).siblings(".required_error").css("display", "block");
            $(element).find(".btn_submit").addClass("disabled");
            $(this).blur(function() {
              var newVal = $(this).val();
              if(newVal != "") {
                $(this).removeClass("error");
                $(this).siblings(".required_error").css("display", "none");
                $(element).find(".btn_submit").removeClass("disabled");
              }
              $(this).off("input propertychange");
            })
          }
        });

        $(element).find(".required_checkbox:visible").each(function() {
          var that = $(this);
          var isRequired = $(this).attr("data-required");
          var options = $(this).find("input[type=checkbox]");
          var selected_options = $(this).find("input[type=checkbox]:checked");
          if (selected_options.length <= 0) {
            $(this).addClass("error");
            $(this).find(".required_error").css("display", "block");
            $(element).find(".btn_submit").addClass("disabled");
            $(that).find(".checkbox").click(function (){
              var isChecked = $(this).hasClass("checked");
              if(isChecked) {
                $(that).removeClass("error");
                $(that).find(".required_error").css("display", "none");
                $(element).find(".btn_submit").removeClass("disabled");
              }
            });
          }
        });
      });
    }
  }

  $.fn.verifyRequired = function() {
    return new VerifyRequired($(this));
  }

})();




//verify-character.js
(function() {
  function VerifyCharacter(element, parent) {
    this.element = element;
    this.parent = parent;
    this.bindEvent();
  }

  VerifyCharacter.prototype = {
    constructor: VerifyCharacter,
    bindEvent: function() {
      var element = this.element;
      var parent = this.parent;
      var that = this;
      $(element).on("input propertychange", function() {
        var pattern = /^[A-Za-z0-9!@#\$%\^&\*\)\(_-]*$/;
        var character = $(this).val();
        if (pattern.test(character)) {
          $(this).removeClass("error");
          $(this).siblings(".required_error").css("display", "none");
          $(this).siblings(".format_error").css("display", "none");
          $(parent).find(".btn_submit").removeClass("disabled");
        } else {
          $(this).addClass("error");
          $(this).siblings(".required_error").css("display", "none");
          $(this).siblings(".format_error").css("display", "block");
        }
      });
    }
  }

  $.fn.verifyCharacter = function(parent) {
    return new VerifyCharacter($(this), parent);
  }
})();




//dialog.js
(function() {

  function Dialog(element, options) {
    this.element = element;
    this.options = {
      width: options.width !=undefined? options.width : "auto",
      height: options.height !=undefined? options.height : "auto"
    };
    this.init();
  }

  Dialog.prototype = {
    constructor: Dialog,
    init: function() {
      var element = this.element;
      var that = this;
      var width = this.options.width;
      var height = this.options.height;
      $(element).innerWidth(width);
      $(element).innerHeight(height);
      $(element).find(".dialog_submit").click(function() {
        $(".will_removed").remove();
        that.closeDialog();
      });
      $(element).find(".dialog_cancel").click(function() {
        that.closeDialog();
      });
      $(element).find(".dialog_close").click(function() {
        that.closeDialog();
      });
      $(document).click(function(e) {
        var target = e.target;
        if ($(target).hasClass("mask")) {
          that.closeDialog();
        }
      });
      $(window).resize(function() {
        var screenWidth = $(window).innerWidth();
        if (innerWidth <= 480) {
          $(element).innerWidth("calc(100% - 20px)");
        } else {
          $(element).innerWidth(width);
        }
      });
    },
    closeDialog: function() {
      var element = this.element;
      $(element).addClass("hide");
      $(".mask").css("display", "none");
      $(".will_removed").removeClass("will_removed");
    }
  }

  $.fn.dialog = function(options) {
    return new Dialog($(this), options);
  }
})();




(function () {
	var $uploadDialog = $('.uploadDialog');
	if (0 === $uploadDialog.length) {
		return;
	}

	var acceptableFileTypes = [".eps", ".png", ".jpg", ".pdf", ".psd", ".tif", ".ps"];
	var maxSize = 25; //in MB
	var errorTypes = {
		size: {
			value: maxSize * 1024 * 1024, //file size in bytes
			message: (function () {
				return "<span>Looks like something's not right.</span><br>This file exceeds the maximum " + maxSize + "MB size limit."
			})()
		},
		type: {
			value: acceptableFileTypes,
			message: "<span>Looks like something's not right.</span><br>That's an invalid file type."
		}
	};

	$uploadDialog.each(function () {
		$dialog = $(this);

		var DZ = initUpload($dialog);
		initSpiner($dialog);

		$dialog.find('.dialog_close').click(function () {
			reset($dialog);
		});

		$dialog.find('.use_this').click(function () {
			var file = DZ.files.pop();
			var img = $dialog.find('.upload_dialog_success_content > #template [data-dz-thumbnail]:last');
			$(this).trigger('uploadfinished', [file, img]);
			$dialog.find('.dialog_close').trigger('click');
		});

		$dialog.find('.dialog_options .delete').click(function () {
			$dialog.find('.dialog_close').trigger('click');
		});
	});

	function initUpload($dialog) {
		return new Dropzone($dialog.find('.upload_dialog_success_content')[0], {
			url: "/save-file.html", // Set the url
			autoQueue: false, // Make sure the files aren't queued until manually added
			autoProcessQueue: false,
			uploadMultiple: false,
			thumbnailWidth: 150,
			thumbnailHeight: 150,
			thumbnailMethod: 'contain',
			acceptedFiles: acceptableFileTypes.join(','),
			previewTemplate: $dialog.find('#previews').html(),
			clickable: $dialog.find(".fileinput-button")[0], // Define the element that should be used as click trigger to select files.
			init: function () {
				this.on('addedfile', function (file) {
					var fileType = file.name.replace(/^.*(?=\.[a-z]+$)/, '');

					if (file.size > errorTypes.size.value) {
						clearPreview($dialog);
						showErrorContainer($dialog, errorTypes.size.message);
						return;
					} else if (-1 === acceptableFileTypes.indexOf(fileType)) {
						clearPreview($dialog);
						showErrorContainer($dialog, errorTypes.type.message);
						return;
					}

					hideErrorContainer($dialog);
					this.processFile(file);

				});
				this.on('sending', function (file, request, formData) {
					showUploadProgress($dialog);
				});
				this.on('success', function () {
					showSuccess($dialog)
				});
				this.on('error', function (file, error, request) {
					//show request error
					if (request) {
						reset($dialog);
						showErrorContainer($dialog, error);
					} else {
						console.log(error);
					}
				});
			}
		});
	}

	function initSpiner($dialog) {
		var spinner = new Spinner().spin();
		$dialog.find('.upload_spinner').append(spinner.el);
	}

	function reset($dialog) {
		$dialog.find('.upload_dialog_success_content, .spiner').addClass("hide");
		$dialog.find('.upload_dialog_content').removeClass("hide");
		hideErrorContainer($dialog);
		clearPreview($dialog);
	}

	function showUploadProgress($dialog) {
		$dialog.find('.spiner').removeClass('hide');
		$dialog.find('.upload_dialog_success_content, .upload_dialog_content').addClass('hide');
	}

	function showSuccess($dialog) {
		$dialog.find('.upload_dialog_success_content').removeClass('hide');
		$dialog.find('.spiner, .upload_dialog_content').addClass('hide');
	}

	function clearPreview($dialog) {
		$dialog.find('.upload_dialog_success_content > #template').remove();
	}

	function showErrorContainer($dialog, errorMsg) {
		if (errorMsg) {
			$dialog.find('.uploadError p').html(errorMsg);
		}
		$dialog.find('.uploadError').removeClass('hide');
	}

	function hideErrorContainer($dialog) {
		$dialog.find('.uploadError p').text('');
		$dialog.find('.uploadError').addClass('hide');
	}
})();




//global-header.js
(function() {
  var hasDivider = false;
  var bodyHeight = $("body").innerHeight();
  var htmlHeight = $("html").innerHeight();

  $(function() {
    var quantity = $(".cart_quantity").html();
    if(quantity == 0) {
      $(".cart_quantity").addClass("cart_empty");
    }else {
      $(".cart_quantity").addClass("cart_not_empty");
    }
  });

  $(window).resize(function() {
    if ($(".mobile_dropdown_panel").is(':hidden')) {
      $(".mobile_dropdown_panel .btn_close").click();
      $(".global_header_mask").css("display", "none");
    }
  });

  $(".width_helper").children("nav").hover(function() {
    var globalHeight = $(".global_header").innerHeight();
    var globalTop = $(".global_header").offset().top;
    var promoHeight = $(".promo_header").innerHeight();
    var promoTop = $(".promo_header").offset().top;
    var navItem = $(this).find(".nav_item");
    var top = 0;
    var maskHeight = 0;
    var minHeight = 0;

    if($(navItem).hasClass("promo_nav_item")) {
      $(".promo_nav_item").css("z-index", 60);
      top = promoTop + promoHeight;
    }else {
      $(".promo_nav_item").css("z-index", 0);
      top = globalTop + globalHeight;
    }
    maskHeight = bodyHeight - top;
    minHeight = htmlHeight - top;
    $(".global_header_mask").css({
      "top": top + "px",
      "z-index": 20,
      "height": maskHeight + "px",
      "min-height": minHeight + "px",
      "display": "block"
    });
  }, function() {
    $(".global_header_mask").css({
      "top": 0,
      "display": "none"
    });
    $(".promo_nav_item").css("z-index", 0);
  });

  $(".btn_search").click(function() {
    $(".mobile_promo_nav").find(".search_box").toggle();
    if (hasDivider) {
      $(".promo_header").removeClass("divider");
      hasDivider = false;
    }else {
      $(".promo_header").addClass("divider");
      hasDivider = true;
    }
  });

  $(".btn_menu").click(function() {
    $(".promo_dropdown").css("display", "block");
    $(".mobile_dropdown_panel .btn_close").css("display", "block");
    $(".global_header_mask").css({
      "height": bodyHeight + "px",
      "display": "block"
    });
  });

  $(".mobile_dropdown_panel .btn_close").click(function() {
    $(this).parent().css("display", "none");
    $(".global_header_mask").css("display", "none");
  });

  $(".mobile_dropdown_panel .nav_item").click(function(event) {
    var target = event.target;
    if($(target).hasClass("nav_item")) {
      if ($(this).hasClass("has_child")) {
        $(this).find(".dropdown_panel").css("display", "block");
        $(this).siblings().find(".dropdown_panel").css("display", "none");
      }
    }
  });

  $(".mobile_dropdown_panel .dropdown_panel .dropdown").click(function() {
    $(this).find("li").css("display", "block");
    $(this).siblings().find("li").css("display", "none");
    $(this).parent().siblings().find("li").css("display", "none");
  });

  $(".link_to_global_nav").click(function() {
    $(".global_dropdown").css("display", "block");
    $(".promo_dropdown").css("display", "none");
  });

  $(".link_to_promo_nav").click(function() {
    $(".promo_dropdown").css("display", "block");
    $(".global_dropdown").css("display", "none");
  });
})();




//promo-header.js
(function() {
  $(".sign_in_panel .operation").showHidePassword();
  $(".sign_in_panel .email").verifyEmail($(".sign_in_panel"));
  $(".sign_in_panel .password").verifyPassword($(".sign_in_panel"));
  $(".sign_in_panel").verifyRequired();

  $(".mobile_sign_in_panel .operation").showHidePassword();
  $(".mobile_sign_in_panel .email").verifyEmail($(".mobile_sign_in_panel"));
  $(".mobile_sign_in_panel .password").verifyPassword($(".mobile_sign_in_panel"));
  $(".mobile_sign_in_panel").verifyRequired();

  $(".btn_to_sign_in").click(function() {
    $(".mobile_sign_in").css("display", "block");
    $(".mobile_promo_nav .mobile_dropdown_panel").css("display","none");
  });

  $(".mobile_sign_in .btn_close").click(function() {
    $(".mobile_promo_nav .mobile_dropdown_panel").css("display", "block");
    $(".mobile_sign_in").css("display", "none");
  });

  $(".sign_in_tab").click(function() {
    $(this).addClass("active");
  });

  $(".account_tab").click(function() {
    $(this).addClass("active");
  });

  $(document).mouseup(function(){
    $(".user_profile .active").removeClass("active");
  });

  $(window).resize(function() {
    var screenWidth = $(window).innerWidth();
    if ($(".mobile_dropdown_panel").is(':hidden')) {
      $(".mobile_sign_in").css("display", "none");
    } else {
      $(".mobile_promo_nav").css("display", "block");
    }
  });
})();




//checkbox.js
(function() {
  $(".checkbox:not(.disabled)").each(function() {
    var checkbox = $(this).find("input[type='checkbox']");
    var parent = $(this);
    $(this).click(function(event) {
      var checked = $(parent).hasClass("checked");
      var backgroundColor = $(this).css("background-color");
      if (checked) {
        checkbox.prop("checked", false);
        $(parent).removeClass("checked");
        $(parent).addClass("unchecked");
      } else {
        checkbox.prop("checked", true);
        $(parent).removeClass("unchecked");
        $(parent).addClass("checked");
      }
    });
  });

})();



// require('search');

//zoom-in.js
(function() {
  function Zoom(element, options) {
    this.element = element;
    this.options = {
      width: 200,
      height: 200,
      offset: 10
    }
    if (options) {
      $.extend(this.options, options);
    }
    this.bindEvent();
  }
  Zoom.prototype = {
    constructor: Zoom,
    bindEvent: function() {
      var that = this;
      $(this.element).hover(function() {
        var imgLeft = $(this).get(0).offsetLeft;
        var imgWidth = $(this).get(0).offsetWidth;
        var imgHeight = $(this).get(0).offsetHeight;
        var leftpos = imgLeft + imgWidth + that.options.offset;
        var zoomSrc = $(this).attr("data-zoom-src");
        $(this).after("<div class='img_lightbox'><img class='zoom_img' src='"+ zoomSrc +"'/></div>");
        $(".img_lightbox").css({top: 0, left: leftpos, border: "1px solid #696767"});
        $(".img_lightbox").width(that.options.width);
		    $(".img_lightbox").height(that.options.height);
        $(this).mousemove(function(event) {
          var zoomImgWidth = $(".zoom_img").get(0).offsetWidth;
          var zoomImgHeight = $(".zoom_img").get(0).offsetHeight;
    			var scaleX = Math.round(zoomImgWidth / imgWidth);
    			var scaleY = Math.round(zoomImgHeight / imgHeight);
          var event = event || window.event;
          var scrollLeft = event.offsetX;
          var scrollTop = event.offsetY;
          $(".img_lightbox").get(0).scrollLeft = scrollLeft * scaleX;
          $(".img_lightbox").get(0).scrollTop = scrollTop * scaleY;
        });
      }, function() {
        $(this).unbind('mouseenter').unbind('mouseleave');
        $(this).siblings(".img_lightbox").remove();
      });
    }
  }
  $.fn.zoom = function(options) {
    return new Zoom($(this), options);
  }
})();




//content-select.js
(function(){
  $(".content_select").each(function() {
    var select = $(this);
    var isActive = false;
    $(select).find("ul li").click(function() {
      if(isActive) {
        $(select).find(".selected").removeClass("selected");
        $(this).addClass("selected");
        $(select).find(".active").removeClass("active");
        $(select).removeClass("active");
        isActive = false;
      }else {
        $(select).addClass("active");
        $(select).find("ul").addClass("active");
        $(select).find("ul li").addClass("active");
        isActive = true;
      }

      $(select).mouseleave(function() {
        $(select).find(".active").removeClass("active");
        $(select).removeClass("active");
        isActive = false;
      });
    });
  });
})();




(function() {
  function EditableSelect(element) {
    this.element = element;
    this.init();
  }

  EditableSelect.prototype = {
    constructor: EditableSelect,
    init: function() {
      var element = this.element;
      var input = $(element).find("input");
      var options = $(element).find(".options");
      var option = $(options).find(".option");
      $(element).click(function() {
        $(options).addClass("active");
        $(option).click(function() {
          var value = $(this).html();
          $(input).val(value).change();
          $(options).removeClass("active");
          return false;
        });
        $(document).click(function(e) {
          var target = e.target;
          if ($(target).parents(".editable_select").length == 0) {
            $(options).removeClass("active");
          }
        });
      });
    }
  }

  $.fn.editableSelect = function() {
    return new EditableSelect($(this));
	}
})();




//number-input.js
(function () {
  function NumberInput(element, options) {
    this.element = element;
    this.options = {
      minVal: options.minVal,
      maxVal: options.maxVal
    }
    this.bindEvent();
  }

  NumberInput.prototype = {
    constructor: NumberInput,
    bindEvent: function() {
      var that = this;
      var element = this.element;
      var decreaseBtn = $(element).find(".decrease");
      var increaseBtn = $(element).find(".increase");
      var countText = $(element).find(".number");
      var min = this.options.minVal;
      var max = this.options.maxVal;
      countText.val(min).change();
      increaseBtn.off("click");
      increaseBtn.click(function() {
        if ($(this).hasClass("disabled")) {
          return;
        }
        countText.val(countText.val() - 0 + 1).change();
        decreaseBtn.removeClass("disabled");

        if (countText.val() == max) {
          increaseBtn.addClass("disabled");
        }
      });

      decreaseBtn.off("click");
      decreaseBtn.click(function() {
        if ($(this).hasClass("disabled")) {
          return;
        }
        countText.val(countText.val() - 1).change();
        increaseBtn.removeClass("disabled");

        if (countText.val() == min) {
          decreaseBtn.addClass("disabled");
        }
      });

      countText.off("blur");
      countText.blur(function() {
        var value = countText.val();
        if (value <= min) {
          countText.val(min);
          decreaseBtn.addClass("disabled");
          increaseBtn.removeClass("disabled");
          if (value < min) {
            that.showErrorMsg($(this), ".min_error");
          }
        }
        if (value >= max) {
          countText.val(max);
          increaseBtn.addClass("disabled");
          decreaseBtn.removeClass("disabled");
          if (value > max) {
            that.showErrorMsg($(this), ".max_error");
          }
        }
        if (value > min && value < max){
          countText.val(value);
          decreaseBtn.removeClass("disabled");
          increaseBtn.removeClass("disabled");
        }
      });

      countText.off("focus");
      countText.focus(function() {
        that.hideErrorMsg($(this));
      });
    },
    update: function(options) {
      this.options.minVal = options.minVal;
      this.options.maxVal = options.maxVal;
      this.bindEvent();
    },
    showErrorMsg: function(input, className) {
      var inputError = $(input).parent(".number_input").siblings(className);
      $(inputError).css("display", "block");
      $(input).addClass("error");
    },
    hideErrorMsg: function(input) {
      var inputError = $(input).parent(".number_input").siblings(".input_error");
      $(inputError).css("display", "none");
      $(input).removeClass("error");
    }
  }

  $.fn.numberInput = function(options) {
    return new NumberInput($(this), options);
  }
})();




//product-details.js
(function() {

  var productCarousel = $('.product_carousel .slide').carousel({
    dShow: 6,
    dScroll: 6,
    mShow: 3,
    mScroll: 3,
    wrap: null,
    responsive: true,
    breakpoint: 1280
  });

  var productQuantity = $('.pdp .product_options .product_quantity_b').numberInput({
    minVal: 10,
    maxVal: 20
  });

  var lightBoxCarousel;

  $('.pdp .additional_carousel ul li:first-child .img_container').addClass("active");
  $('.pdp .additional_carousel .navigator.previous').addClass("disabled");

  $(document).on("click", ".product_carousel .slide ul li", function() {
    event.preventDefault();
    var index = $(this).index();
    var src = $(this).find(".img_container .product_img img").attr("data-zoom-src");
    $(".product_carousel .current_no").html(index + 1);
    $(this).siblings().find(".img_container").removeClass("active");
    $(this).find(".img_container").addClass("active");
    $('.product_carousel .img_box img').attr("src", src);
  })


  $(document).on("click", ".pdp .light_box .slide ul li", function() {
    event.preventDefault();
    var zoomSrc = $(this).find(".img_container .product_img img").attr("data-zoom-src");
    $(this).siblings().find(".img_container").removeClass("active");
    $(this).find(".img_container").addClass("active");
    $('.pdp .light_box .img_box img').attr("src", zoomSrc);
  });

  function calcControlCount(slideTotal, showNumber) {
    if (slideTotal % showNumber == 0) {
      return Math.floor(slideTotal / showNumber) - 1;
    } else {
      return Math.floor(slideTotal / showNumber);
    }
  }

  function calcOption(carousel) {
    var mShow = carousel!=undefined? carousel.options.mShow : 0;
    var dShow = carousel!=undefined? carousel.options.dShow : 0;
    var responsive = carousel!=undefined? carousel.options.responsive : false;
    var breakpoint = carousel!=undefined? carousel.options.breakpoint : 0;
    var option = {
      mShow: mShow,
      dShow : dShow,
      responsive : responsive,
      breakpoint : breakpoint
    };
    return option;
  }

  $(".pdp .additional_carousel").each(function() {
    var option;
    var count = 0;
    var controlCount = 0;
    var parent = $(this);
    var slideTotal = $(this).find("ul li").length;
    $(this).find(".navigator.previous").click(function() {
      var screenWidth = $(window).innerWidth();
      if ($(this).parents(".product_carousel").length != 0) {
        option = calcOption(productCarousel);
      } else {
        option = calcOption(lightBoxCarousel);
      }
      if (option.responsive && screenWidth < option.breakpoint) {
        controlCount = calcControlCount(slideTotal, option.mShow);
      } else {
        controlCount = calcControlCount(slideTotal, option.dShow);
      }
      count--;
      if (count <= 0) {
        $(this).addClass("disabled");
        $(this).siblings(".next").removeClass("disabled");
      } else {
        $(this).siblings(".next").removeClass("disabled");
      }
    });
    $(this).find(".navigator.next").click(function() {
      var screenWidth = $(window).innerWidth();
      if ($(this).parents(".product_carousel").length != 0) {
        option = calcOption(productCarousel);
      } else {
        option = calcOption(lightBoxCarousel);
      }
      if (option.responsive && screenWidth < option.breakpoint) {
        controlCount = calcControlCount(slideTotal, option.mShow);
      } else {
        controlCount = calcControlCount(slideTotal, option.dShow);
      }
      count++;
      if (count > 0) {
        $(this).siblings(".previous").removeClass("disabled");
      }
      if(count == controlCount) {
        $(this).addClass("disabled");
      }
    });
  });

  $(".product_carousel .zoom_in").click(function() {
    var bodyHeight = $("body").innerHeight();
    $(".pdp .mask").css("height", bodyHeight + "px");
    $(".pdp .mask").addClass("show");
    $(".pdp .light_box").removeClass("hide");

    lightBoxCarousel = $('.light_box .slide').carousel({
      dShow: 11,
      dScroll: 11,
      wrap: null,
      responsive: false
    });
  });

  $(".pdp .light_box .box_close").click(function() {
    $(".pdp .mask").removeClass("show");
    $(".pdp .light_box").addClass("hide");
  });

  function updateCustomize() {
    var btnCustomize = $(".product_options .btn_customize");
    if ($(".product_options .error").length > 0) {
      $(btnCustomize).addClass("disabled");
    } else {
      $(btnCustomize).removeClass("disabled");
    }
  }

  function disableSizeSelect(select) {
    var isUnAvailbale = $(select).find("option:selected").hasClass("unavailable");
    var errorMsg = $(select).parent(".select_bg").siblings(".input_error");
    if (isUnAvailbale) {
      $(select).addClass("error");
      $(errorMsg).css("display", "block");
    } else {
      $(select).removeClass("error");
      $(errorMsg).css("display", "none");
    }
    updateCustomize();
  }

  disableSizeSelect($('.product_size select'));

  $('.product_size select').change(function() {
    disableSizeSelect($(this));
  });

  function disableShapeSelect(select) {
    var isUnAvailbale = $(select).find(".selected").hasClass("unavailable");
    var errorMsg = $(select).siblings(".input_error");
    if (isUnAvailbale) {
      $(select).addClass("error");
      $(errorMsg).css("display", "block");
    } else {
      $(select).removeClass("error");
      $(errorMsg).css("display", "none");
    }
    updateCustomize();
  }

  disableShapeSelect($(".product_shape .content_select"));

  $(".product_shape .content_select").click(function() {
    disableShapeSelect($(this));
  });

  var currentPage = 1;
  var totalPage = 0;
  var screenWidth = $(window).innerWidth();
  var colorTotal = $(".color_options .color_item").length;
  $(".product_color .start_item").html(1);
  $(".product_color .total_item").html(colorTotal);
  if (screenWidth > 768) {
    initPageSelector(24);
  } else {
    initPageSelector(15);
  }

  function initPageSelector(perPageCount) {
    totalPage = Math.ceil(colorTotal / perPageCount);
    $(".product_color .end_item").html(perPageCount);
    if(colorTotal <= perPageCount) {
      $(".product_color .page_selector").css("display", "none");
    } else {
      $(".product_color .page_selector").css("display", "inline-block");
    }
  }

  $(window).resize(function() {
    var screenWidth = $(window).innerWidth();
    var scrollTop = $(".product_color .color_options").scrollTop();
    if (screenWidth > 768) {
      initPageSelector(24);
      updatePageSelector(scrollTop, 8, 24);
    } else {
      initPageSelector(15);
      updatePageSelector(scrollTop, 5, 15);
    }
  });

  function updatePageSelector(scrollTop, colNumber, perPageCount) {
    var startItem = scrollTop / 31 * colNumber + 1;
    var leftItem = colorTotal - startItem;
    var endItem = leftItem >= perPageCount ? (startItem + perPageCount - 1) : colorTotal;
    $(".product_color .start_item").html(startItem);
    $(".product_color .end_item").html(endItem);
  }

  $(".product_color .next_page").click(function() {
    var top = currentPage * 93;
    var screenWidth = $(window).innerWidth();
    $(".product_color .color_options").animate({scrollTop: top}, 300, function() {
      var scrollTop = $(".product_color .color_options").scrollTop();
      if (screenWidth > 768) {
        updatePageSelector(scrollTop, 8, 24);
      } else {
        updatePageSelector(scrollTop, 5, 15);
      }
    });
    currentPage++;
    if(currentPage > 1) {
      $(".product_color .prev_page").removeClass("disabled");
      if(currentPage == totalPage) {
        $(".product_color .next_page").addClass("disabled");
      }
    }
  });

  $(".product_color .prev_page").click(function() {
    var top = (currentPage - 2) * 93;
    var screenWidth = $(window).innerWidth();
    $(".product_color .color_options").animate({scrollTop: top}, 300, function() {
      var scrollTop = $(".product_color .color_options").scrollTop();
      if (screenWidth > 768) {
        updatePageSelector(scrollTop, 8, 24);
      } else {
        updatePageSelector(scrollTop, 5, 15);
      }
    });
    currentPage--;
    if(currentPage <= 1) {
      $(".product_color .next_page").removeClass("disabled");
      if(currentPage == 1) {
        $(".product_color .prev_page").addClass("disabled");
      }
    }
  });

  function disableColor() {
    $(".product_color .color_item").each(function() {
      if ($(this).hasClass("unavailable")) {
        $(this).find(".color_content").addClass("disabled");
      }
    });
  }

  disableColor();

  $(".color_content").click(function() {
    var name = $(this).attr('data-name');
    var sku = $(this).attr('data-sku');
    var imgSrc = $(this).attr('data-img-src');
    var isUnAvailable = $(this).parent(".color_item").hasClass("unavailable");
    if (!isUnAvailable) {
      $(".color_item.active").removeClass("active");
      $(this).parent().addClass("active");
      $(".product_color .selected_color").html(name);
      $('.product_options .sku_no').html(sku);
      $('.product_carousel .img_box img').attr("src", imgSrc);
    }
  });

  $(".color_content").hover(function() {
    var isUnAvailable = $(this).parent(".color_item").hasClass("unavailable");
    if (!isUnAvailable) {
      var color = $(this).css("background-color");
      $(this).parent().css("border", "2px solid " + color);
    }
  }, function() {
    $(this).parent().css("border-color", "transparent");
  });

  $(".to_tab").click(function(event) {
    event.preventDefault();
    var section = $(this).attr("data-section");
    $(".show_section").addClass("hide_section");
    $(".show_section").removeClass("show_section");
    $("." + section).removeClass("hide_section");
    $("." + section).addClass("show_section");
    $(".active").removeClass("active");
    if (section == "customization_option") {
      $('.tab:nth-child(2)').addClass("active");
    } else if (section == "pricing_info") {
      $('.tab:last-child').addClass("active");
    }
    var top = $(".product_details_container").offset().top;
    $("html, body").animate({scrollTop: top}, 300);
  });

  $('.tab').click(function() {
    var section = $(this).attr("data-section");
    $(".active").removeClass("active");
    $(this).addClass("active");
    $(".show_section").addClass("hide_section");
    $(".show_section").removeClass("show_section");
    $("." + section).removeClass("hide_section");
    $("." + section).addClass("show_section");
  });

  $('.show_all').click(function(event) {
    event.preventDefault();
    var section = $(this).attr("data-section");
    $("." + section).removeClass("fix_height");
    $("." + section).addClass("auto_height");
    $(this).removeClass("show_btn");
    $(this).addClass("hide_btn");
    $(this).prev().removeClass("show_mask");
    $(this).prev().addClass("hide_mask");
    $(this).next().removeClass("hide_btn");
    $(this).next().addClass("show_btn");
  });

  $('.show_less').click(function(event) {
    event.preventDefault();
    var section = $(this).attr("data-section");
    $("." + section).removeClass("auto_height");
    $("." + section).addClass("fix_height");
    $(this).removeClass("show_btn");
    $(this).addClass("hide_btn");
    $(this).prev().prev().removeClass("hide_mask");
    $(this).prev().prev().addClass("show_mask");
    $(this).prev().removeClass("hide_btn");
    $(this).prev().addClass("show_btn");
  });
})();



// require('cart');

//sign.js
(function() {
  $(".sign_in .operation").showHidePassword();
  $(".sign_in .email").verifyEmail($(".sign_in"));
  $(".sign_in .password").verifyPassword($(".sign_in"));
  $(".sign_in").verifyRequired();
})();




//trouble-sign-in.js
(function() {
  $(".trouble_sign_in .send_email").verifyEmail($(".trouble_sign_in"));
  $(".trouble_sign_in").verifyRequired();
})();




//create-new-account.js
(function() {
  $(".create_new_account .operation").showHidePassword();
  $(".create_new_account .account_email").verifyEmail($(".create_new_account"));
  $(".create_new_account .confirm_email").verifyConfirmEmail($(".create_new_account"));
  $(".create_new_account .origin_password").verifyInputPassword($(".create_new_account"));
  $(".create_new_account .confirm_password").verifyConfirmPassword($(".create_new_account"));
  $(".create_new_account").verifyRequired();
  $(".create_new_account .first_name, .create_new_account .last_name").on("input propertychange", function() {
    if ($(this).val != "") {
      $(this).removeClass("error");
      $(this).siblings(".input_error").css("display", "none");
    }
  });
})();




//reset-password.js
(function() {
  $(".reset_password .operation").showHidePassword();
  $(".reset_password .new_password").verifyInputPassword($(".reset_password"));
  $(".reset_password .confirm_password").verifyConfirmPassword($(".reset_password"));
  $(".reset_password").verifyRequired();
})();




//change-password.js
(function() {
  $(".change_password .operation").showHidePassword();
  $(".change_password .old_pwd").verifyPassword($(".change_password"));
  $(".change_password .origin_password").verifyInputPassword($(".change_password"));
  $(".change_password .confirm_password").verifyConfirmPassword($(".change_password"));
  $(".change_password").verifyRequired();
})();




//edit-profile-information.js
(function() {
  $(".edit_profile_information").verifyRequired();
  $(".edit_profile_information .phone_number").verifyPhoneNumber();
  $(".edit_profile_information .zip_code").verifyNumber($(".edit_profile_information"));

  $(".edit_profile_information #purpose").change(function() {
    var value = $(this).val();
    if (value == "Other") {
      $(".edit_profile_information").find(".other_option").css("display", "block");
    } else {
      $(".edit_profile_information").find(".other_option").css("display", "none");
    }
  });
})();




//create-payment-information.js
(function() {
  $(".create_payment_information").verifyRequired();
  $(".create_payment_information .cardholder_name").verifyCharacter($(".create_payment_information"));
  $(".create_payment_information .card_number").verifyNumber($(".create_payment_information"));
  $(".create_payment_information .phone_number").verifyPhoneNumber();
  $(".create_payment_information .zip_code").verifyNumber($(".create_payment_information"));
  $(".create_payment_information .security_code").verifyNumber($(".create_payment_information"));

  $(".create_payment_information .checkbox").click(function() {
    if ($(this).hasClass("unchecked")) {
      $(".address_info").addClass("new_address");
      $(".address_edit").css("display", "block");
    } else {
      $(".address_info").removeClass("new_address");
      $(".address_edit").css("display", "none");
    }
  });

  $(".create_payment_information .security_code_help_icon").click(function() {
    var bodyHeight = $("body").innerHeight();
    $(".security_code_help").removeClass("hide");
    $(".create_payment_information .mask").css("display", "block");
    $(".create_payment_information .mask").css("height", bodyHeight);
  });

  $(".create_payment_information .security_code_help .dialog_close").click(function() {
    $(".security_code_help").addClass("hide");
    $(".create_payment_information .mask").css("display", "none");
  });

  $(".create_payment_information .card_number").on("input propertychange", function() {
    var cardNumber = $(".create_payment_information .card_number");
    var cardNumberVal = $(cardNumber).val();
    $(cardNumber).data("card-number", cardNumberVal);
  });

  $(".create_payment_information .card_number").blur(function() {
    var cardNumberVal = $(this).val();
    var hiddenVal = "";
    if(cardNumberVal.length < 16) {
      for (var i = 0;i < cardNumberVal.length; i++) {
        hiddenVal += "*";
      }
      $(this).val(hiddenVal);
    } else {
      for (var i = 0;i < 12; i++) {
        hiddenVal += "*";
      }
      hiddenVal += cardNumberVal.substring(12, 16);
      $(this).val(hiddenVal);
    }
    $(this).focus(function() {
      var cardNumberVal = $(this).data("card-number");
      $(this).val(cardNumberVal);
      $(this).off("focus");
    });
  });
})();




//address-information.js
(function() {
  $(".address_information .first_name").verifyCharacter($(".address_information"));
  $(".address_information .last_name").verifyCharacter($(".address_information"));
  $(".address_information .company_name").verifyCharacter($(".address_information"));
  $(".address_information .address_line_first").verifyCharacter($(".address_information"));
  $(".address_information .address_line_second").verifyCharacter($(".address_information"));
  $(".address_information .city").verifyCharacter($(".address_information"));
  $(".address_information .editable_select").editableSelect();
})();




//shipping-address.js
(function() {
  $(".address_card .phone_number").each(function() {
    var phoneNum = $(this).attr("data-phone-number");
    var reg = /^[0-9]*$/;
    if(reg.test(phoneNum) && phoneNum.length == 10) {
      var formatPhoneNum = phoneNum.substring(0, 3) + "-" + phoneNum.substring(3, 6) + "-" + phoneNum.substring(6, 10);
      $(this).html(formatPhoneNum);
    }
  });

  $(".address_card").find(".remove").click(function() {
    var bodyHeight = $("body").innerHeight();
    var parent = $(this).parents(".address_card");
    $(".shipping_address .dialog").removeClass("hide");
    $(".mask").css("display", "block");
    $(".mask").css("height", bodyHeight);
    $(parent).addClass("will_removed");
    $(".shipping_address .dialog").dialog({
      width: 560
    });
    return false;
  });

  $(".address_card .save").click(function() {
    return false;
  });

  $(".address_card .edit").click(function() {
    return false;
  });

  $(".address_card").click(function(e) {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
  });
})();




//edit-shipping-address.js
(function() {
  var stateName = $(".edit_shipping_address .state_dropdown").attr("data-state");
  var phoneNumber = $(".edit_shipping_address .phone_number");
  var phone = $(phoneNumber).val();
  var reg = /^[0-9]*$/;
  if(reg.test(phone) && phone.length == 10) {
    var formatPhoneNum = "(" + phone.substring(0, 3) + ")" + phone.substring(3, 6) + "-" + phone.substring(6, 10);
    $(phoneNumber).val(formatPhoneNum);
  }

  $(phoneNumber).focus(function() {
    var phone = $(this).val();
    var formatPhoneNum = phone.substring(1, 4) + phone.substring(5, 8) + phone.substring(9, 13);
    $(this).val(formatPhoneNum);
    $(this).off("focus");
  });

  $(".edit_shipping_address #state").val(stateName);
  $(".edit_shipping_address").verifyRequired();
  $(".edit_shipping_address .phone_number").verifyPhoneNumber();
  $(".edit_shipping_address .zip_code").verifyNumber($(".edit_shipping_address"));
})();




//create-new-shippng-address.js
(function() {
  $(".create_new_shipping_address").verifyRequired();
  $(".create_new_shipping_address .phone_number").verifyPhoneNumber();
  $(".create_new_shipping_address .zip_code").verifyNumber($(".create_new_shipping_address"));
})();




//payment-card.js
(function() {
  $(".payment_card .remove").click(function() {
    var bodyHeight = $("body").innerHeight();
    var parent = $(this).parents(".payment_card");
    $(".payment_information .dialog").removeClass("hide");
    $(".mask").css("display", "block");
    $(".mask").css("height", bodyHeight);
    $(parent).addClass("will_removed");
    $(".payment_information .dialog").dialog({
      width: 560
    });
    return false;
  });

  $(".payment_card .save").click(function() {
    return false;
  });

  $(".payment_card").click(function() {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
  });
})();




//category.js
(function() {
  var isExpand = false;
  $(".navigate_select").click(function() {
    if (isExpand) {
      isExpand = false;
      $(this).find(".main_category_dropdown").removeClass("show");
      $(this).find(".expand_dropdown").css("display", "inline-block");
      $(this).find(".hide_dropdown").css("display", "none");
    } else {
      isExpand = true;
      $(this).find(".main_category_dropdown").addClass("show");
      $(this).find(".expand_dropdown").css("display", "none");
      $(this).find(".hide_dropdown").css("display", "inline-block");
    }
  });
})();




//order-summary-detail.js
(function() {
 $(".detail_section").find(".detail_btn").click(function() {
  $(this).find(".fa-plus-circle").toggleClass("hide");
  $(this).find(".fa-minus-circle").toggleClass("hide");
  $(this).parent().parent().find(".detail_item").toggleClass("hide");
 });
})();




//order-history-summary.js
(function() {

  function updateCardHeight() {
    var cardMaxHeight = 0;
    var screenWidth = $(window).innerWidth();
    if (screenWidth > 992) {
      $(".order_history_summary .checkout_card").each(function() {
        var height = $(this).innerHeight();
        if (height > cardMaxHeight) {
          cardMaxHeight = height;
          $(".order_history_summary .checkout_card").innerHeight(cardMaxHeight);
        }
      });
    }
  }

  updateCardHeight();

  function updateDetailsWidth() {
    $(".order_history_summary .product_summary").each(function() {
      var summaryInfo = $(this).find(".summary_info");
      var detailsInfo = $(this).find(".details_info");
      $(summaryInfo).find("th").each(function(index) {
        var width = $(this).innerWidth();
        var textAlign = $(this).css("text-align");
        var childIndex = index + 1;
        var child = $(detailsInfo).find("td:nth-child("+ childIndex +")");
        $(child).innerWidth(width);
        $(child).css("text-align", textAlign);
      });
    });
  }

  updateDetailsWidth();

  $(".order_history_summary .btn_print").click(function() {
    $(".wrap").addClass("print_page");
    window.print();
  });

  $(window).resize(function() {
    updateCardHeight();
    updateDetailsWidth();
  });
})();




//account-order-history.js
(function() {
  // $(".account_order_history .page").paging({
  //   pageCurrent: 1,
  //   pageTotal: 7
  // });

  function updateDetailsWidth() {
    $(".account_order_history .product_summary").each(function() {
      var summaryInfo = $(this).find(".summary_info");
      var detailsInfo = $(this).find(".details_info");
      var gapColWidth = parseInt($(this).css("grid-column-gap"));
      var marginLeftWidth = parseInt($(this).find(".sidebar").css("marginLeft"));
      var sidebarWidth = $(this).find(".sidebar").innerWidth() + gapColWidth + 2 * marginLeftWidth;
      $(summaryInfo).find("th").each(function(index) {
        var width = $(this).innerWidth();
        var textAlign = $(this).css("text-align");
        var childIndex = index + 1;
        var orderSummaryChildIndex = index + 2;
        var child = $(detailsInfo).find("td:nth-child("+ childIndex +")");
        var orderSummaryTh = $(".order_summary").find("th:nth-child("+ orderSummaryChildIndex +")");
        var orderSummaryTd = $(".order_summary").find("td:nth-child("+ orderSummaryChildIndex +")");
        $(child).innerWidth(width);
        $(orderSummaryTh).innerWidth(width);
        $(".order_summary").find("th:first-child").innerWidth(sidebarWidth);
        $(child).css("text-align", textAlign);
        $(orderSummaryTh).css("text-align", textAlign);
        $(orderSummaryTd).css("text-align", textAlign);
      });
    });
  }

  updateDetailsWidth();

  $(window).resize(function() {
    updateDetailsWidth();
  });

  $(".account_orders .btn_details").click(function() {
    var parent = $(this).parent(".product_details_info");
    var detailsInfo = $(parent).find(".details_info");
    $(this).find(".fa-plus-circle").toggleClass("hide");
    $(this).find(".fa-minus-circle").toggleClass("hide");
    $(detailsInfo).toggle();
  });

  $(".mobile_account_orders .btn_details").click(function() {
    var parent = $(this).parents(".mobile_product_summary");
    var detailsInfo = $(parent).find(".details_info");
    $(this).find(".fa-plus-circle").toggleClass("hide");
    $(this).find(".fa-minus-circle").toggleClass("hide");
    $(detailsInfo).toggle();
  })
})();




(function () {

	$("#startUpload").click(function() {
    var bodyHeight = $("body").innerHeight();
    $(".dialog").removeClass("hide");
    $(".mask").css("display", "block");
    $(".mask").css("height", bodyHeight);
		$(".dialog").dialog({
			width: 500
		});
  });

  //.uploaded-image
  $('.uploadDialog .use_this').on('uploadfinished', function (event, file, img) {
    $preview = $('.uploaded_previews').empty();
    $preview.append(img);
    $preview.append('<p>' + file.name + '</p>');
  });

})();





 function showLoading() {
  var sliOverlay = document.getElementById('sli-overlay');
  if (sliOverlay === null) {
   sliOverlay = document.createElement('div');
   sliOverlay.setAttribute("id","sli-overlay");
   sliOverlay.setAttribute("style", "position: fixed;display: block;width: 100%;height: 100%;top: 0;left: 0;right: 0;bottom: 0;background-color: rgba(255,255,255,.8);z-index: 2;");
   var sliImg = document.createElement('img');
   sliImg.setAttribute("id","sli-img");
   sliImg.setAttribute("class", "loading-indicator");
   sliImg.setAttribute("src", "/assets/images/loading-spinner.png");
   sliOverlay.appendChild(sliImg);
   document.getElementsByTagName("body")[0].appendChild(sliOverlay);
  }
  else{
   sliOverlay.style.display = "block";
  }
 }

 function hideLoading(){
  var sliOverlay = document.getElementById('sli-overlay');
  if (sliOverlay !== null) {
   sliOverlay.style.display = "none";
  }
 }




(function() {
  var maskHeight = $("body").innerHeight();
  var minHeight = $("html").innerHeight();
  $(".account_uploads .upload").each(function() {
    var caption = $(this).find(".caption");
    var captionSpan = $(caption).find("span");
    var captionHeight = $(caption).innerHeight();
    var textHeight = $(captionSpan).innerHeight();
    if (textHeight > captionHeight) {
      var text = $(captionSpan).html();
      var length = text.length;
      text = text.substring(0, 12) + "..." + text.substring(length - 10, length);
      $(captionSpan).html(text);
    }
  });

  $(".account_uploads .thumbnail").click(function() {
    var screenWidth = $(window).innerWidth();
    if (screenWidth > 768) {
      $(".sidebar").css("display", "block");
      $(".mask").css({
        "z-index": 10,
        "height": maskHeight + "px",
        "min-height": minHeight + "px",
        "display": "block"
      });
      $(".account_uploads .zoom_in").css("display", "block");
    }
  });

  $(".account_uploads .zoom_in .btn_close").click(function() {
    $(".mask").css("display", "none");
    $(".account_uploads .zoom_in").css("display", "none");
  });

  $(".account_uploads .download_remove .remove").click(function() {
    var uploadFile = $(this).parents(".upload");
    $(uploadFile).addClass("will_removed");
    $(".mask").css({
      "z-index": 10,
      "height": maskHeight + "px",
      "min-height": minHeight + "px",
      "display": "block"
    });
    $(".account_uploads .dialog").removeClass("hide");
    $(".account_uploads .dialog").dialog({
      width: 560
    });
  });
})();




//creative-brief.js
(function() {
  $(".creative_brief").verifyRequired();
})();



