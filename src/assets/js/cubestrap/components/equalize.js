/*global helix:false */
//  _____                  _ _
// | ____|__ _ _   _  __ _| (_)_______
// |  _| / _` | | | |/ _` | | |_  / _ \
// | |__| (_| | |_| | (_| | | |/ /  __/
// |_____\__, |\__,_|\__, |_|_/___\___|
//                      |_|
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'equalize';

	var defaults = {
		children: null,
		uniform: false,
		debounceDelay: 300
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
			$window.on('helix.resize.' + this.uuid, $.proxy(this.reflow, this));
			this.$element.on('visibilitychange.helix.' + this.uuid, $.proxy(this.reflow, this));

			var debounced = helix.debounce($.proxy(this.reflow, this), this.settings.debounceDelay);
			this.$element.find('img').each($.proxy(function (index, element) {
				element.onload = debounced;
			}, this));

			this.reflow();
		},
		reflow: function () {
			// do nothing, if element is hidden
			if (!jQuery.expr.filters.visible(this.element)) {
				return;
			}

			var $children = (this.settings.children) ? this.$element.find(this.settings.children) : this.$element.children();

			if (this.settings.uniform) {
				var children = [];

				// set childs height to auto
				$children.each(function () {
					var $child = $(this);
					children.push($child.css({ 'height': 'auto' }));
				});

				// find the tallest child
				var current_tallest = 0;
				for(var i = 0 ; i < children.length ; i++) {
					var elHeight = children[i].height();
					current_tallest = elHeight > current_tallest ? elHeight : current_tallest;
				}

				// set the height of all children to the height of the tallest child
				for(var i = 0 ; i < children.length ; i++) {
					children[i].height(current_tallest);
				}
			} else {
				var current_tallest = 0,
				current_row_start = 0,
				current_row_top = 0,
				top_position = 0;

				var children = [];
				// set childs height to auto
				$children.each(function () {
					var $child = $(this);
					children.push($child.css({ 'height': 'auto' }));
				});

				// determine child dimension - batch read of DOM
				var children_info = children.map(function ($child) {
					var child = $child.get(0);
					return [$child, 0, 0, child.offsetWidth, $child.height()];
				});

				for (var i = 0; i < children_info.length; i++) {
					top_position = children_info[i][0].position().top;
					if (current_row_top !== top_position) {
						for (var j = current_row_start; j < i; j++) {
							children_info[j][0].height(current_tallest);
						}

						current_row_top = top_position;
						current_tallest = children_info[i][4];
						current_row_start = i;
					} else {
						var elHeight = children_info[i][4];
						current_tallest = elHeight > current_tallest ? elHeight : current_tallest;
					}
				}

				for (var j = current_row_start; j < i; j++) {
					children_info[j][0].height(current_tallest);
				}
			}

			$children = null;

			this.$element.trigger('reflow');
		},
		destroy: function () {
			$window.off('helix.resize.' + this.uuid);
			this.$element.off('visibilitychange.helix.' + this.uuid);

			// TODO Remove debounced event-listeners on images.
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
