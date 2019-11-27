/*global helix:false */
//   ____ _               _    _
//  / ___| |__   ___  ___| | _| |__   _____  __
// | |   | '_ \ / _ \/ __| |/ / '_ \ / _ \ \/ /
// | |___| | | |  __/ (__|   <| |_) | (_) >  <
//  \____|_| |_|\___|\___|_|\_\_.__/ \___/_/\_\
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'fancycheckbox';

	var defaults = {};

	var classes = {
		checked: 'h-' + plugin_name + '-checked',
		disabled: 'h-' + plugin_name + '-disabled',
		hidden: 'h-form-hidden'
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
			this.initialState = this.element.checked;

			this.$checkbox = $('<button>', {
				'class': 'h-' + plugin_name,
				'role': 'checkbox',
				'aria-checked': this.element.checked,
				'aria-required': this.element.required,
				disabled: this.element.disabled,
				tabindex: 0,
				text: this.element.checked ? 'Checked' : 'Unchecked',
				type: 'button'
			});

			if (this.element.disabled) {
				this.$checkbox.addClass(classes.disabled);
			}

			if (this.element.checked) {
				this.$checkbox.addClass(classes.checked);
			}

			this.$checkbox.on('click.helix.' + this.uuid, $.proxy(this._onReplacementClick, this));

			this.$element.attr({ 'tabindex': -1 });
			this.$element.addClass(classes.hidden);
			this.$element.before(this.$checkbox);
			this.$element.on('change.helix.' + this.uuid, $.proxy(this._onOriginalChange, this));

			this.$form = $(this.element.form);
			this.$form.on('reset.helix.' + this.uuid, $.proxy(this._onFormReset, this));

			this.$element.on('visibilitychange.helix.' + this.uuid, $.proxy(function (event) {
				this.$checkbox.css('display', this.$element.css('display'));
			}, this));
		},

		_onReplacementClick: function (event) {
			this._setCheckboxState(!this.element.checked);
		},

		_onOriginalChange: function (event) {
			this._updateReplacement();
		},

		_onFormReset: function (event) {
			this._setCheckboxState(this.initialState);
		},

		_setCheckboxState: function (checkedState) {
			if (typeof checkedState === undefined) {
				checkedState = !this.$element.checked;
			}

			this.$element.prop('checked', checkedState).trigger('change');
		},

		_updateReplacement: function () {
			if (this.element.disabled) {
				this.$checkbox.addClass(classes.disabled);
			} else {
				this.$checkbox.removeClass(classes.disabled);
			}

			if (this.element.checked) {
				this.$checkbox.addClass(classes.checked);
			} else {
				this.$checkbox.removeClass(classes.checked);
			}

			this.$checkbox.prop('aria-disabled', this.element.disabled);
			this.$checkbox.prop('aria-checked', this.element.checked);

			this.$checkbox.text(this.element.checked ? 'Checked' : 'Unchecked');
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//

		reflow: function () {
			// Skip the reflow, if the element is hidden.
			if (!$.expr.filters.visible(this.element)) {
				return;
			}

		},

		destroy: function () {
			this.$checkbox.on('click.helix.' + this.uuid);
			this.$element.on('change.helix.' + this.uuid);
			this.$form.on('reset.helix.' + this.uuid);
			this.$element.on('visibilitychange.helix.' + this.uuid);
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
