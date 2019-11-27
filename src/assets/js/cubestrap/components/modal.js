/*global helix:false */
//  __  __           _       _
// |  \/  | ___   __| | __ _| |
// | |\/| |/ _ \ / _` |/ _` | |
// | |  | | (_) | (_| | (_| | |
// |_|  |_|\___/ \__,_|\__,_|_|
//
// Copyright 2014 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'modal';

	var defaults = {};

	var classes = {
		dialog: 'h-' + plugin_name + '-dialog',
		backdrop: 'h-' + plugin_name + '-backdrop',
		close: 'h-' + plugin_name + '-close',
		isOpen: 'h-' + plugin_name + '-open',
		isHidden: 'h-' + plugin_name + '-hidden'
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
			this.id = this.$element.attr('id');
			this.isVisible = false;

			this.$open = $('[data-modal="' + this.id + '"]');
			this.$open.on('click.helix.' + this.uuid, $.proxy(this.show, this));

			this.$close = this.$element.find('.' + classes.close);
			this.$close.on('click.helix.' + this.uuid, $.proxy(this.hide, this));

			this.$dialog = this.$element.find('.' + classes.dialog);
			this.$dialog.attr('role', 'dialog');
			this.$dialog.attr('aria-hidden', true);

			this.$label = this.$dialog.find('h1, h2, h3, h4, h5, h6, legend').first();
			if (this.$label.length > 0) {
				this.$dialog.attr('aria-labelledby', this.$label.attr('id'));
			}

			this.$placeholder = $('<span>');
			this.$backdrop = $('<div>', { 'class': classes.backdrop });

			this.$element.on('click.helix.' + this.uuid, $.proxy(function (event) {
				if ($(event.target).closest('.' + classes.dialog).length === 0) {
					this.hide();
				}
			}, this));
		},

		_onKeyDown: function (event) {
			if (event.which === 27 && this.isVisible) {
				this.hide();
			}
		},
		_showDialog: function () {
			$('.h-' + plugin_name).each(function (index, element) {
				$(element)[plugin_name]('hide');
			});

			if (this.isVisible) {
				return;
			}
			this.isVisible = true;

			this.$element.before(this.$placeholder);
			this.$element.detach();
			this.$element.appendTo($body);

			this.$element.after(this.$backdrop);
			this.$element.removeClass(classes.isHidden);
			this.$element.attr('aria-hidden', false);

			$html.addClass(classes.isOpen);
			$body.css('paddingRight', helix.scrollbarWidth + 'px');

			$body.on('keydown.helix.' + this.uuid, $.proxy(this._onKeyDown, this));
		},
		_hideDialog: function () {
			if (!this.isVisible) {
				return;
			}
			this.isVisible = false;

			$html.removeClass(classes.isOpen);
			$body.css({ 'padding-right': 0 });

			this.$element.attr('aria-hidden', true);
			this.$element.addClass(classes.isHidden);
			this.$backdrop.detach();

			this.$element.detach();
			this.$placeholder.after(this.$element);
			this.$placeholder.detach();

			$body.off('keydown.helix.' + this.uuid);
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//

		show: function (event) {
			this._showDialog();
		},

		hide: function () {
			this._hideDialog();
		},

		reflow: function () {},

		destroy: function () {
			if (this.isVisible) {
				this.hide();
			}

			this.$dialog.removeAttr('role');
			this.$dialog.removeAttr('aria-labelledby');
			this.$dialog.removeAttr('aria-hidden');

			this.$open.off('click.helix.' + this.uuid);
			this.$close.off('click.helix.' + this.uuid);
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
