/*global helix:false */
//  ____           _ _
// |  _ \ __ _  __| (_) ___
// | |_) / _` |/ _` | |/ _ \
// |  _ < (_| | (_| | | (_) |
// |_| \_\__,_|\__,_|_|\___/
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
// http://api.jquery.com/wrapall/
// http://oaa-accessibility.org/example/28/
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $body = $(document.body);

	var plugin_name = 'fancyradio';

	var defaults = {};

	var classes = {
		namespace: 'h-form-fancyradio',
		unchecked: 'h-form-fancyradio-unchecked',
		checked: 'h-form-fancyradio-checked',
		disabledUnchecked: 'h-form-fancyradio-disabledunchecked',
		disabledChecked: 'h-form-fancyradio-disabledchecked',
		hidden: 'h-form-hidden'
	};

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._init();
	}

	$.extend(Plugin.prototype, {
		_init: function () {
			this.$group = $(this.element);
			this.$group.closest('form').on('reset.helix.' + plugin_name, $.proxy(this._onReset, this));

			this.$originals = this.$group.find('input[type=radio]');
			this.$originals.each($.proxy(this._addReplacement, this));
		},
		_addReplacement: function (index, original) {
			// http://jsperf.com/prop-vs-ischecked/7
			var is_checked = original.checked,
			    is_disabled = original.disabled;

			var $original = $(original);

			var $replacement = $('<button>', {
				'class':
					classes.namespace +
					' ' + classes.namespace + '-' +
					(is_disabled ? 'disabled' : '') +
					(is_checked ? 'checked' : 'unchecked'),
				'aria-role': 'radio',
				'aria-checked': is_checked,
				disabled: is_disabled,
				tabindex: is_checked ? 0 : -1,
				text: is_checked ? 'Checked' : 'Unchecked'
			});

			$replacement.on('click.helix.' + plugin_name, $.proxy(this._onClick, this));
			$replacement.on('keypress.helix.' + plugin_name, $.proxy(this._onKeyDown, this));

			$original.attr('tabindex', -1);
			$original.addClass(classes.hidden);
			$original.before($replacement);

			$original.on('change.helix.' + plugin_name, $.proxy(this._onChange, this));

			$original.on('visibilitychange', function (event) {
				$replacement.css('display', $original.css('display'));
			});
		},
		changeClass: function (class_name) {
			this.$replacement.removeClass().addClass(classes.namespace + ' ' + class_name);
		},
		updateOriginal: function (checked_state) {
			if (typeof checked_state === undefined) {
				checked_state = !this.$original.is(':checked');
			}

			this.$original.prop('checked', checked_state);
			this.currentState = checked_state;
		},
		updateReplacement: function () {
			if (this.$original.is(':disabled') && this.$original.is(':checked')) {
				this.changeClass(classes.disabledChecked);
			} else if (this.$original.is(':disabled')) {
				this.changeClass(classes.disabledUnchecked);
			} else if (this.$original.is(':checked')) {
				this.changeClass(classes.checked);
			} else {
				this.changeClass(classes.unchecked);
			}

			this.$replacement.text(this.currentState ? 'Checked' : 'Unchecked');
			this.$replacement.prop('disabled', this.$original.is(':disabled'));
			this.$replacement.prop('aria-disabled', this.$original.is(':disabled'));
			this.$replacement.prop('aria-checked', this.currentState);
		},
		_onClick: function (event) {
			event && event.preventDefault();

			this.updateOriginal(!this.currentState);
			this.updateReplacement();
		},
		_onKeyDown: function (event) {
			event.preventDefault();

			switch (event.which) {
				case 13:
				case 32:
					this._onClick(event);
					break;
			}
		},
		_onChange: function (event) {
			this.currentState = this.$original.is(':checked');
			this.updateReplacement();
		},
		_onReset: function (event) {
			this.updateOriginal(this.initialState);
			this.updateReplacement();
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

/* Thomas */

;void function (window, document, $) {
	'use strict';

	$.fn.customradio = function (options) {
		var _options = $.extend({
			radioStructure: '<button type="button" role="radio"></button>',
			radioDisabled: 'h-form-fancyradio-disabled',
			radioDisabledChecked: 'h-form-fancyradio-disabled-checked',
			radioDefault: 'h-form-fancyradio',
			radioChecked: 'h-form-fancyradio-checked',
			hidden: 'h-form-hidden'
		}, options);

		return this.each(function () {
			var radio = $(this);
			if (!radio.hasClass(_options.hidden) && radio.is(':radio')) {
				var replaced = $(_options.radioStructure);
				this._replaced = replaced;

				if (radio.is(':disabled') && radio.is(':checked')) {
					replaced.addClass(_options.radioDisabledChecked);
				} else if (radio.is(':disabled')) {
					replaced.addClass(_options.radioDisabled);
				} else if (radio.is(':checked')) {
					replaced.addClass(_options.radioChecked);
				} else {
					replaced.addClass(_options.radioDefault);
				}

				replaced.click(function () {
					if ($(this).hasClass(_options.radioDefault)) {
						radio.attr('checked', 'checked');
						changeRadio(radio.get(0));
					}
				});

				radio.click(function () {
					changeRadio(this);
				});

				replaced.insertBefore(radio);
				radio.addClass(_options.hidden);
			}
		});

		function escapeString(inputString) {
			return inputString.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g, '\\$1');
		}

		function changeRadio(_this) {
			$(_this).change(); // trigger change event
			// remove selection on other radios with same name
			$('input:radio[name=' + escapeString($(_this).attr('name')) + ']').not(_this).each(function () {
				if (this._replaced && !$(this).is(':disabled')) {
					this._replaced.removeClass().addClass(_options.radioDefault);
					$(this).removeAttr('checked');
				}
			});
			// add 'selection' to new radio
			_this._replaced.removeClass().addClass(_options.radioChecked);
		}
	};

}(this, this.document, this.jQuery);
