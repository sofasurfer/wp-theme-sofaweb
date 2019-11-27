/*global helix:false */
//   ___   __  __  ____
//  / _ \ / _|/ _|/ ___|__ _ _ ____   ____ _ ___
// | | | | |_| |_| |   / _` | '_ \ \ / / _` / __|
// | |_| |  _|  _| |__| (_| | | | \ V / (_| \__ \
//  \___/|_| |_|  \____\__,_|_| |_|\_/ \__,_|___/
//
// Copyright 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'offcanvas';

	var defaults = {
		trigger: '.c-offcanvas-trigger',
		breakpoint: null,
		transitionDuration: 300
	};

	var keys = {
		tab: 9,
		esc: 27
	};

	var classes = {
		dialog: 'c-' + plugin_name + '-dialog',
		close: 'c-' + plugin_name + '-close',
		backdrop: 'c-' + plugin_name + '-backdrop',
		hidden: 'c-' + plugin_name + '-hidden',
		isOpen: 'c-' + plugin_name + '-open'
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
			this.isHidden = true;
			this.isTransitioning = false;

			// The container to scroll in.
			this.$element.addClass(classes.hidden);
			this.$element.on('click.helix.' + this.uuid, $.proxy(function (event) {
				if ($(event.target).closest('.' + classes.dialog).length === 0) {
					this.hide();
				}
			}, this));

			// The visible part of the off-canvas element
			this.$dialog = this.$element.find('.' + classes.dialog);
			this.$dialog.attr({
				'id': this.uuid,
				'aria-hidden': true
			});
			this.$dialog.css({
				'transition-duration': this.settings.transitionDuration / 1000 + 's'
			});

			// The toggle on the page.
			this.$trigger = $(this.settings.trigger);
			this.$trigger.attr({
				'aria-controls': this.uuid,
				'aria-expanded': false
			});
			this.$trigger.on('click.helix.' + this.uuid, $.proxy(this._expand, this));

			// The close button insode the off-canvas element.
			this.$close = this.$element.find('.' + classes.close);
			this.$close.on('click.helix.' + this.uuid, $.proxy(this._collapse, this));

			// The backdrop
			this.$backdrop = $('<div>', {
				'class': classes.backdrop
			});

			$document.on('keydown.helix.' + this.uuid, $.proxy(this._onKeyDown, this));
			$window.on('helix.resize.' + this.uuid, $.proxy(this.reflow, this));

			this.reflow();
		},

		_onKeyDown: function (event) {
			var key = event.which;

			switch (key) {
				case keys.esc:
					this._collapse();
					break;
			}
		},
		_expand: function () {
			if (this.settings.breakpoint && window.innerWidth > this.settings.breakpoint) {
				return;
			}

			if (this.isTransitioning || !this.isHidden) {
				return;
			}
			this.isTransitioning = true;

			this.$element.removeClass(classes.hidden);
			this.$element.before(this.$backdrop);
			$html.addClass(classes.isOpen);
			$body.css('padding-right', helix.scrollbarWidth + 'px');
			this.$dialog.css('left', 0);
			this.$dialog.attr('aria-hidden', false);
			this.$trigger.attr('aria-expanded', true);

			setTimeout($.proxy(function () {
				this.isHidden = false;
				this.isTransitioning = false;
			}, this), this.settings.transitionDuration);
		},
		_collapse: function () {
			if (this.isTransitioning || this.isHidden) {
				return;
			}
			this.isTransitioning = true;

			this.$dialog.css('left', (this.$dialog.outerWidth() * -1) + 'px');
			this.$dialog.attr('aria-hidden', true);
			this.$trigger.attr('aria-expanded', false);

			setTimeout($.proxy(function () {
				$html.removeClass(classes.isOpen);
				$body.css('padding-right', 0);
				this.$backdrop.detach();
				this.$element.addClass(classes.hidden);

				this.isHidden = true;
				this.isTransitioning = false;
			}, this), this.settings.transitionDuration);
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//

		show: function () {
			this._expand();
		},

		hide: function () {
			this._collapse();
		},

		reflow: function () {
			// Don't skip if the element is invisible :-P

			if (this.settings.breakpoint && window.innerWidth > this.settings.breakpoint) {
				this.hide();
			}

			this.offCanvasWidth = this.$dialog.innerWidth();
		},
		
		destroy: function () {
			if (!this.isHidden) {
				this.hide();
			}

			this.$element.removeAttr('id');
			this.$dialog.removeAttr('style');
			this.$dialog.removeAttr('aria-hidden');
			this.$trigger.removeAttr('aria-expanded');
			this.$trigger.removeAttr('aria-controls');

			this.$trigger.off('click.helix.' + this.uuid);
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
