/*global helix:false */
//  ____                 _ _ _
// / ___|  ___ _ __ ___ | | | |__   _____  __
// \___ \ / __| '__/ _ \| | | '_ \ / _ \ \/ /
//  ___) | (__| | | (_) | | | |_) | (_) >  <
// |____/ \___|_|  \___/|_|_|_.__/ \___/_/\_\
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
// Based on https://github.com/wieringen/tinyscrollbar
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $body = $(document.body);

	var plugin_name = 'scrollbox';

	var defaults = {
		// Vertical or horizontal scrollbar? ( x || y ).
		axis: 'y',
		// Enable or disable the mousewheel;
		wheel: true,
		// How many pixels must the mouswheel scroll at a time.
		wheelSpeed: 40,
		// Lock default scrolling window when there is no more content.
		wheelLock: false,
		// Enable invert style scrolling
		scrollInvert: false,
		// Set the size of the scrollbar to auto or a fixed number.
		trackSize: false,
		// Set the size of the knob to auto or a fixed number.
		knobSize: false
	};

	var classes = {
		viewport: 'h-' + plugin_name + '-viewport',
		content: 'h-' + plugin_name + '-content',
		bar: 'h-' + plugin_name + '-bar',
		knob: 'h-' + plugin_name + '-knob'
	};

	function Plugin(element, options) {
		this.element = element;
		this.$element = $(element);
		this.settings = $.extend({}, defaults, options);
		this.uuid = helix.generateUUID();
		this._init();
	}

	$.extend(Plugin.prototype, {
		_init: function () {
			this.$viewport = this.$element.children('.' + classes.viewport);
			this.$content = this.$viewport.children('.' + classes.content);
			this.$scrollbar = this.$element.children('.' + classes.bar);
			this.$knob = this.$scrollbar.children('.' + classes.knob);

			this.isHorizontal = this.settings.axis === 'x';

			this.contentPosition = 0;
			this.knobPosition = 0;

			this.events = {
				pointerDown: 'pointerdown.helix.' + this.uuid,
			    pointerEnd: [
					'pointerup.helix.' + this.uuid,
					'pointercancel.helix.' + this.uuid
				].join(' '),
				pointerMove: 'pointermove.helix.' + this.uuid,
			    mouseWheel: [
					'wheel.helix.' + this.uuid,
					'mousewheel.helix.' + this.uuid,
					'DOMMouseScroll.helix.' + this.uuid
				].join(' '),
				viewportResize: 'resize.helix.' + this.uuid
			};

			this.$element.on(this.events.pointerDown, $.proxy(this._pointerDownHandler, this));
			this.$element.on(this.events.pointerEnd, $.proxy(this._pointerEndHandler, this));
			this.$element.on(this.events.mouseWheel, $.proxy(this._mouseWheelHandler, this));

			$window.on(this.events.viewportResize, $.proxy(this.reflow, this));

			new helix.timer(500, $.proxy(this.reflow, this)).start();
		},
		_pointerDownHandler: function (event) {
			if (this.contentRatio >= 1) {
				return;
			}

			event = event.originalEvent || event;

			// Ignore mouse clicks outside the knob.
			if (event.pointerType === 'mouse' && !this.$knob.is(event.target)) {
				return;
			}

			// Remember start positions
			this.pointerStart = [event.clientX, event.clientY];
			this.pointerStartContentPos = this.contentPosition;
			// bind move handler
			$body.on(this.events.pointerMove, $.proxy(this._pointerMoveHandler, this));
		},
		_pointerMoveHandler: function (event) {
			event.preventDefault();

			event = event.originalEvent || event;
			var pointerDelta = [event.clientX - this.pointerStart[0], event.clientY - this.pointerStart[1]];

			if (event.pointerType === 'touch') {
				pointerDelta = [-pointerDelta[0], -pointerDelta[1]];
			}

			if (this.isHorizontal) {
				this.scrollTo((pointerDelta[0] * this.trackRatio) + this.pointerStartContentPos);
			} else {
				this.scrollTo((pointerDelta[1] * this.trackRatio) + this.pointerStartContentPos);
			}
		},
		_pointerEndHandler: function (event) {
			event.stopPropagation();

			$body.off(this.events.pointerMove, this._pointerMoveHandler);
			this.pointerStart = null;
			this.pointerStartContentPos = null;
		},
		_mouseWheelHandler: function (event) {
			if (this.isHorizontal && this.viewportSize.width - this.contentSize.width > 0) {
				return;
			} else  if (this.viewportSize.height - this.contentSize.height > 0) {
				return;
			}

			var evntObj = event.originalEvent || window.event;
			var deltaDir = 'delta' + this.settings.axis.toUpperCase();
			var wheelSpeedDelta = -(evntObj[deltaDir] || evntObj.detail || (-1 / 3 * evntObj.wheelDelta)) / 40;

			this.scrollTo(this.contentPosition - (wheelSpeedDelta * this.settings.wheelSpeed));

			if (this.settings.wheelLock || (this.contentPosition < this.endPosition && this.contentPosition > 0)) {
				event.preventDefault();
			}
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//
		
		scrollTo: function (position) {
			// Ensure a correct range (0 - endPosition)
			position = Math.min(Math.max(position, 0), this.endPosition);

			var alignment,
			    direction;

			if (this.isHorizontal) {
				alignment = 'left';
				direction = 'width';
			} else {
				alignment = 'top';
				direction = 'height';
			}

			// Move the knob and content to the correct position.
			this.$knob.css(alignment, position / this.trackRatio + 'px');
			this.$content.css(alignment, -position + 'px');

			// Save the new content position.
			this.contentPosition = position;
		},
		reflow: function (event) {
			this.viewportSize = { width: this.$viewport.innerWidth(), height: this.$viewport.innerHeight() };
			this.contentSize = { width: this.$content.outerWidth(), height: this.$content.outerHeight() };

			var content_size,
			    viewport_size,
			    alignment,
			    direction;

			if (this.isHorizontal) {
				viewport_size = this.viewportSize.width;
				content_size = this.contentSize.width;
				alignment = 'left';
				direction = 'width';
			} else {
				viewport_size = this.viewportSize.height;
				content_size = this.contentSize.height;
				alignment = 'top';
				direction = 'height';
			}

			this.contentRatio = viewport_size / content_size;
			this.trackSize = this.settings.trackSize || viewport_size;
			this.knobSize = Math.min(this.trackSize, Math.max(0, (this.settings.knobSize || (this.trackSize * this.contentRatio))));
			this.trackRatio = this.settings.knobSize ? (content_size - viewport_size) / (this.trackSize - this.knobSize) : (content_size / this.trackSize);
			this.endPosition = content_size - viewport_size;

			this.contentPosition = Math.min(this.contentPosition, content_size - viewport_size);

			this.$knob.css(alignment, this.contentPosition / this.trackRatio + 'px');
			this.$knob.css(direction, this.knobSize + 'px');
			this.$content.css(alignment, (this.contentRatio >= 1) ? 0 : -this.contentPosition + 'px');
			this.$scrollbar.css(direction, this.trackSize + 'px');

			if (this.contentRatio < 1) {
				this.$scrollbar.show();
			} else {
				this.$scrollbar.hide();
			}
		},
		destroy: function () {
			this.$element.off(this.events.pointerDown);
			this.$element.off(this.events.pointerEnd);
			this.$element.off(this.events.mouseWheel);

			$window.off(this.events.viewportResize);
		}
	});

	$.fn[plugin_name] = function (options) {
		var args = arguments;

		if (options === undefined || typeof options === 'object') {
			return this.each(function (index, element) {
				if (!$.data(element, 'plugin_' + plugin_name)) {
					$.data(element, 'plugin_' + plugin_name, new Plugin(element, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_') {
			var returns;

			this.each(function (index, element) {
				var instance = $.data(element, 'plugin_' + plugin_name);

				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}

				if (options === 'destroy') {
					$.data(element, 'plugin_' + plugin_name, null);
				}
			});

			return returns !== undefined ? returns : this;
		}
	};

}(this, this.document, this.jQuery);
