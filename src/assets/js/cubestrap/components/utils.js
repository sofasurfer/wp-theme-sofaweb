//  _   _ _   _ _ _ _   _
// | | | | |_(_) (_) |_(_) ___  ___
// | | | | __| | | | __| |/ _ \/ __|
// | |_| | |_| | | | |_| |  __/\__ \
//  \___/ \__|_|_|_|\__|_|\___||___/
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
;void function (window, document) {
	'use strict';

	window.helix = window.helix || new function () {
		// WARNING This method uses jQuery!
		// The jQuery object is provided through the arguments.
		this.measureElement = function (viewport, element, includeMargins) {
		    var vpscroll = viewport ? viewport.scrollTop() : 0;
		    var vptop = viewport ? viewport.offset().top : 0;

		    var offset = element.offset();
		    var bounds = {
		        top: offset.top + vpscroll - vptop,
		        left: offset.left,
		        width: element.width(),
		        height: element.height(),
		        outerWidth: element.outerWidth(),
		        outerHeight: element.outerHeight()
		    };

		    if (includeMargins) {
		        var marginTop = parseInt(element.css('margin-top'), 10);
		        var marginRight = parseInt(element.css('margin-right'), 10);
		        var marginBottom = parseInt(element.css('margin-right'), 10);
		        var marginLeft = parseInt(element.css('margin-left'), 10);

		        // we must check for NaN for ie 8/9
		        $.extend(bounds, {
		            marginTop: isNaN(marginTop) ? 0 : marginTop,
		            marginRight: isNaN(marginRight) ? 0 : marginRight,
		            marginBottom: isNaN(marginBottom) ? 0 : marginBottom,
		            marginLeft: isNaN(marginLeft) ? 0 : marginLeft
		        });
		    }

		    return bounds;
		};

		//  _   _ _   _ ___ ____
		// | | | | | | |_ _|  _ \
		// | | | | | | || || | | |
		// | |_| | |_| || || |_| |
		//  \___/ \___/|___|____/
		//
		// http://jsfiddle.net/briguy37/2MVFd/
		//

		this.generateUUID = function () {
			var date = new Date().getTime();

			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (character) {
				var random = (date + Math.random() * 16) % 16 | 0;
				date = Math.floor(date / 16);
				return (character === 'x' ? random : (random & 0x7 | 0x8)).toString(16);
			});

			return uuid;
		};

		//  _____                    _ _   _
		// |_   _| __ __ _ _ __  ___(_) |_(_) ___  _ __  ___
		//   | || '__/ _` | '_ \/ __| | __| |/ _ \| '_ \/ __|
		//   | || | | (_| | | | \__ \ | |_| | (_) | | | \__ \
		//   |_||_|  \__,_|_| |_|___/_|\__|_|\___/|_| |_|___/
		//

		var supportsTransitions = null;

		Object.defineProperty(this, 'supportsTransitions', {
			get: function () {
				if (supportsTransitions === null) {
					supportsTransitions = (function (element) {
						var transitions = [
							'transition',
							'msTransition',
							'MozTransition',
							'WebkitTransition'
						];

						for (var i = 0; i < transitions.length; i++) {
							if (transitions[i] in element.style) {
								return true;
							}
						}
						return false;
					})(document.documentElement);
				}

				return supportsTransitions;
			}
		});

		//  ____                 _ _ _              __        ___     _ _   _
		// / ___|  ___ _ __ ___ | | | |__   __ _ _ _\ \      / (_) __| | |_| |__
		// \___ \ / __| '__/ _ \| | | '_ \ / _` | '__\ \ /\ / /| |/ _` | __| '_ \
		//  ___) | (__| | | (_) | | | |_) | (_| | |   \ V  V / | | (_| | |_| | | |
		// |____/ \___|_|  \___/|_|_|_.__/ \__,_|_|    \_/\_/  |_|\__,_|\__|_| |_|
		//

		var scrollbarWidth = null;

		Object.defineProperty(this, 'scrollbarWidth', {
			get: function () {
				if (scrollbarWidth === null) {
					var element = document.createElement('div');
					element.style.position = 'absolute';
					element.style.left = '-999999px';
					element.style.width = '50px';
					element.style.height = '50px';
					element.style.overflow = 'scroll';

					document.body.appendChild(element);
					scrollbarWidth = element.offsetWidth - element.clientWidth;
					document.body.removeChild(element);
				}

				return scrollbarWidth;
			}
		});

		//  _____ _
		// |_   _(_)_ __ ___   ___ _ __
		//   | | | | '_ ` _ \ / _ \ '__|
		//   | | | | | | | | |  __/ |
		//   |_| |_|_| |_| |_|\___|_|
		//

		this.timer = /* obj */ function (/* int (ms) */ delay, /* fn */ callback) {
			var is_running = false,
			    last_tick = new Date().getTime();

			this.tick = function self() {
				if (!is_running) {
					return;
				}

				var now = new Date().getTime();

				if (now - last_tick > delay) {
					last_tick = new Date().getTime();
					callback();
				}

				window.requestAnimationFrame(self);
			};

			this.start = function () {
				if (is_running) {
					return;
				}
				is_running = true;

				this.tick();
			};

			this.stop = function () {
				is_running = false;
			};
		};

		//  ____       _
		// |  _ \  ___| |__   ___  _   _ _ __   ___ ___
		// | | | |/ _ \ '_ \ / _ \| | | | '_ \ / __/ _ \
		// | |_| |  __/ |_) | (_) | |_| | | | | (_|  __/
		// |____/ \___|_.__/ \___/ \__,_|_| |_|\___\___|
		//

		this.debounce = /* fn */ function (/* fn */ callback, /* int (ms) */ threshold, /* bool */ immediately) {
			var timeout, args, context, timestamp, result;

			var debounced = function () {
				var last = new Date().getTime() - timestamp;

				if (last < threshold && last >= 0) {
					timeout = setTimeout(debounced, threshold - last);
				} else {
					timeout = null;

					if (!immediately) {
						result = callback.apply(context, args);

						if (!timeout) {
							context = args = null;
						}
					}
				}
			};

			return function () {
				context = this;
				args = Array.prototype.slice.call(arguments);
				timestamp = new Date().getTime();

				if (!timeout) {
					timeout = setTimeout(debounced, threshold);

					if (immediately) {
						result = callback.apply(context, args);
						context = args = null;
					}
				}

				return result;
			};
		};
	}();

}(this, this.document);
