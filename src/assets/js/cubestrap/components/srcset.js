/*global helix:false */
//  ____           ____       _
// / ___| _ __ ___/ ___|  ___| |_
// \___ \| '__/ __\___ \ / _ \ __|
//  ___) | | | (__ ___) |  __/ |_
// |____/|_|  \___|____/ \___|\__|
//
// Copyright 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: sergio.abad@goldbachinteractive.ch
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'srcset';

	var SRCSET_REGEXP = /(\S+)\s+(\d+)w(?:\s+([\d\.]+)x)?/mi;

	var defaults = {
		// Threshold in percentage of the viewport.
		// Set to null to disable lazy-loading.
		threshold: 50,
		// Restore the original source, if an element leaves the threshold.
		restoreInvisible: true
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
			this.$images = this.$element.find('[data-srcset]');

			this.images = [];
			this.imagesLoaded = 0;
			this.pixelDensity = (window.devicePixelRatio || 1).toString();

			$window.on('helix.resize.' + this.uuid, $.proxy(this.reflow, this));

			if (this.settings.threshold !== null) {
				$window.on('helix.scroll.' + this.uuid, $.proxy(this.reflow, this));
			}

			this.update();
			this.reflow();
		},

		_processImage: function (image_node) {
			// The current source needs to be outside the normal range for the initial reflow.
			var image = { node: image_node, sources: {}, current: -1 };

			var backup_density,
			    srcset = image.node.getAttribute('data-srcset').split(',');

			for (var i = 0; i < srcset.length; i++) {
				var source = SRCSET_REGEXP.exec(srcset[i]),
				    density = source[3] || '1';

				if (!backup_density) {
					backup_density = density;
				}

				if (!image.sources[density]) {
					image.sources[density] = [];
				}

				image.sources[density].push({
					address: source[1],
					width: parseInt(source[2], 10)
				});
			}

			image.density = image.sources.hasOwnProperty(this.pixelDensity) ? this.pixelDensity : backup_density;
			image.useBackground = image.node.tagName !== 'IMG' ? true : false;

			if (this.settings.restoreInvisible) {
				if (image.useBackground) {
					// Using jQuery to catch background-images from style sheets.
					image.original = $(image.node).css('background-image');
				} else {
					image.original = image.node.src;
				}
			}

			return image;
		},
		_processImages: function () {
			this.images = [];

			for (var i = 0; i < this.$images.length; i++) {
				this.images.push(this._processImage(this.$images[i]));
			}
		},

		_updateImage: function  (image) {
			image.bounds = image.node.getBoundingClientRect();
		},
		_updateImages: function  () {
			for (var i = 0; i < this.images.length; i++) {
				this._updateImage(this.images[i]);
			}
		},

		_setSource: function (image) {
			// Abort, if the image is not visible.
			if (image.bounds.width === 0) {
				return;
			}

			// If there are no sources, there is no point in continuing.
			if (image.sources.length === 0) {
				return;
			}

			// Check if the image is within reach of the viewport.
			if (this.settings.threshold !== null) {
				var window_height = window.innerHeight,
				    threshold = window_height * (this.settings.threshold / 100);

				// Define before and after tests.
				//
				// The detachment from the if-clause is for better readability.
				// This is slower for images that pass the before-check.
				var before = image.bounds.bottom + threshold < 0,
					after = image.bounds.top - window_height - threshold > 0;

				// Reset the initial image source if the image is not in reach of the viewport.
				if (before || after) {
					if (this.settings.restoreInvisible) {
						if (image.useBackground) {
							image.node.style.backgroundImage = image.original;
						} else {
							image.node.src = image.original;
						}

						// Restore the current position to the initialization value.
						image.current = -1;
					}

					return;
				}
			}

			// If we don't restore sources and all sources are processed, we can detach the listener for the scroll-event.
			//
			// The cheapest operation comes first. The imagesLoaded test comes last, as we only want to increase the counter if the image hadn't been loaded before.
			if (!this.settings.restoreInvisible && image.current < 0 && ++this.imagesLoaded > this.images.length) {
				$window.off('helix.scroll.' + this.uuid);
			}

			// Determine the appropriate source.
			var source_new;

			// TODO Find a vanilla Javascript method to find the new source.
			//      This MUST be compatible down to IE9 and SHOULD be compatible with IE8 too.
			$.each(image.sources[image.density], function (index, source_node) {
				source_new = index;

				if (image.bounds.width < source_node.width) {
					return false;
				}
			});

			// Only update the source, if there is a difference.
			if (source_new !== image.current) {
				image.current = source_new;

				var address = image.sources[image.density][source_new].address;

				if (image.useBackground) {
					image.node.style.backgroundImage = 'url("' + address + '")';
				} else {
					image.node.src = address;
				}
			}
		},
		_setSources: function () {
			for (var i = 0; i < this.images.length; i++) {
				this._setSource(this.images[i]);
			}
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//

		// Trigger "update" after you change the data-srcset attributes.
		update: function () {
			this._processImages();
		},
		reflow: function () {
			this._updateImages();
			this._setSources();
		},
		destroy: function () {
			$window.off('helix.resize.' + this.uuid);
			$window.off('helix.scroll.' + this.uuid);
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
