/*global helix:false */
//     _                         _ _
//    / \   ___ ___ ___  _ __ __| (_) ___  _ __
//   / _ \ / __/ __/ _ \| '__/ _` | |/ _ \| '_ \
//  / ___ \ (_| (_| (_) | | | (_| | | (_) | | | |
// /_/   \_\___\___\___/|_|  \__,_|_|\___/|_| |_|
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
// http://www.w3.org/WAI/PF/aria-practices/#accordion
// http://webaim.org/discussion/mail_thread?thread=6075
// http://www.oaa-accessibility.org/examplep/accordian1/
//
// ScrollHeight works in Internet Explorer 9.
// http://www.quirksmode.org/dom/w3c_cssom.html
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'accordion';

	var defaults = {
		firstOpen: false,
		onlyOne: true,
		buffer: 100
	};

	var keys = {
		enter: 13,
		space: 32,
		pageUp: 33,
		pageDown: 34,
		end: 35,
		home: 36,
		leftArrow: 37,
		upArrow: 38,
		rightArrow: 39,
		downArrow: 40
	};

	var classes = {
		item: 'h-' + plugin_name + '-item',
		closed: 'h-' + plugin_name + '-closed',
		tabs: 'h-' + plugin_name + '-tab',
		panels: 'h-' + plugin_name + '-panel'
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
			this.$items = this.$element.find('.' + classes.item);
			this.$tabs = this.$element.find('.' + classes.tabs);
			this.uuid = helix.generateUUID();
			this.current = 0;
			this.items = [];

			this._setup();

			$window.on('helix.resize' + this.uuid, $.proxy(this.reflow, this));
			this.$element.on('visibilitychange.helix.' + this.uuid, $.proxy(this.reflow, this));
		},

		_setup: function () {
			this.$items.each($.proxy(function (index, element) {
				var $item = $(element),
				    $tab = $item.find('.' + classes.tabs),
				    $panel = $item.find('.' + classes.panels);

				$tab.attr({
					'role': 'tab',
					'aria-expanded': false,
					'aria-selected': false,
					'tabindex': -1,
					'id': this.uuid + '.' + index
				});

				$tab.on('keydown.helix.' + this.uuid, $.proxy(this._onKeyDown, this));
				$tab.on('click.helix.' + this.uuid, $.proxy(function (event) {
					event.preventDefault();
					var index = this.$tabs.index(event.currentTarget);
					this._select(index);
					this._toggle();
				}, this));

				$panel.attr({
					'role': 'tabpanel',
					'aria-hidden': true,
					'aria-labelledby': this.uuid + '.' + index
				});

				$panel[0].style.maxHeight = $panel[0].scrollHeight + this.settings.buffer + 'px';

				if (index === 0) {
					$tab.attr('tabindex', 0);

					if (!this.settings.firstOpen) {
						$item.addClass(classes.closed);
					} else {
						$tab.attr('aria-selected', true);
					}
				} else {
					$item.addClass(classes.closed);
				}

				this.items.push({
					$node: $item,
					$tab: $tab,
					$panel: $panel
				});
			}, this));
		},

		_onKeyDown: function (event) {
			var key = event.which;

			switch (key) {
				case keys.leftArrow:
				case keys.upArrow:
					event.preventDefault();
					this._selectPrev();
					break;

				case keys.rightArrow:
				case keys.downArrow:
					event.preventDefault();
					this._selectNext();
					break;

				case keys.enter:
				case keys.space:
					event.preventDefault();
					this._toggle();
					break;

				case keys.home:
					event.preventDefault();
					this._select(0);
					break;

				case keys.end:
					event.preventDefault();
					this._select(this.items.length - 1);
					break;
			}
		},

		_select: function (index) {
			var current = this.items[this.current],
			    item = this.items[index];

			this.current = index;

			item.$tab.attr('tabindex', 0);
			item.$tab.focus();
			current.$tab.attr('tabindex', -1);
		},
		_selectPrev: function () {
			// Store the new index locally, in case we are at the beginning.
			var index = this.current - 1;

			if (index < 0) {
				return;
			}

			this._select(index);
		},
		_selectNext: function () {
			// Store the new index locally, in case we are at the end.
			var index = this.current + 1;

			if (index >= this.items.length) {
				return;
			}

			this._select(index);
		},

		_toggle: function () {
			var item = this.items[this.current];

			if (item.$tab.attr('aria-selected') === 'true') {
				this._collapse(this.current);
			} else {
				this._expand(this.current);
			}
		},

		_expand: function (index) {
			if (this.settings.onlyOne) {
				this._collapseAll();
			}

			var item = this.items[index];

			var max_height = item.$panel[0].scrollHeight + this.settings.buffer;

			item.$panel.css('max-height', max_height + 'px');
			item.$panel.attr('aria-hidden', false);
			item.$tab.attr('aria-selected', true);
			item.$tab.attr('aria-expanded', true);
			item.$node.removeClass(classes.closed);
		},

		_expandAll: function () {
			if (this.settings.onlyOne) {
				return;
			}

			for (var i = 0; i < this.items.length; i++) {
				this._expand(i);
			}
		},

		_collapse: function (index) {
			var item = this.items[index];

			item.$panel.attr('aria-hidden', true);
			item.$tab.attr('aria-selected', false);
			item.$tab.attr('aria-expanded', false);
			item.$node.addClass(classes.closed);
		},

		_collapseAll: function () {
			for (var i = 0; i < this.items.length; i++) {
				this._collapse(i);
			}
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//

		reflow: function () {},

		destroy: function () {
			$window.off('helix.resize.' + this.uuid);
			this.$element.off('visibilitychange.helix.' + this.uuid);

			this.$tabs.off('keydown.helix.' + this.uuid);
			this.$tabs.off('click.helix.' + this.uuid);

			// TODO Remove ARIA-attributes.
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
