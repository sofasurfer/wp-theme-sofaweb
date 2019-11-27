/*global helix:false */
//  ____       _           _
// / ___|  ___| | ___  ___| |_
// \___ \ / _ \ |/ _ \/ __| __|
//  ___) |  __/ |  __/ (__| |_
// |____/ \___|_|\___|\___|\__|
//
// Copyright 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
// http://oaa-accessibility.org/example/10/
// http://www.w3.org/TR/wai-aria/roles#combobox
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'fancyselect';

	var defaults = {};

	var keys = {
		tab: 9,
		enter: 13,
		esc: 27,
		pageUp: 33,
		pageDown: 34,
		end: 35,
		home: 36,
		leftArrow: 37,
		upArrow: 38,
		rightArrow: 39,
		downArrow: 40,
	};

	var classes = {
		combobox: 'h-' + plugin_name + '-combobox',
		listbox: 'h-' + plugin_name + '-listbox',
		optionSelected: 'h-' + plugin_name + '-option-selected',
		optionDisabled: 'h-' + plugin_name + '-option-disabled',
		open: 'h-' + plugin_name + '-open',
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
			this.initialValue = this.$element.val();
			this.isExpanded = false;
			this.isDisabled = this.element.disabled;
			this.searchNeedle = '';
			this.searchTimeout = null;

			var $viewport = this.$element.closest('.modal-dialog, .scrollbox-inner');
			this.$viewport = $viewport.length > 0 ? $viewport : null;

			this.$element.on('change.helix.' + this.uuid, $.proxy(this._onSelectChange, this));

			this.$form = $(this.element.form);
			this.$form.on('reset.helix.' + this.uuid, $.proxy(this._onFormReset, this));

			this.$element.on('visibilitychange.helix.' + this.uuid, $.proxy(function (event) {
				this.$combobox.css('display', this.$element.css('display'));
			}, this));

//			The following doesn't work in Firefox.
//			https://bugzilla.mozilla.org/show_bug.cgi?id=556743
//			this.$label = $(this.element.labels).first();
			this.$label = $('label[for="' + this.element.id + '"]').first();
			this.$label.attr({ id: this.uuid + '-label' });

			this.$label.on('click.helix.' + this.uuid, $.proxy(this._onLabelClick, this))

			this.$combobox = $('<span>', {
				'class': classes.combobox + ' ' + (this.$element.attr('class') || '').replace(classes.hidden, ''),
				'aria-expanded': false,
				'aria-autocomplete': 'list',
				'aria-owns': this.uuid + '-listbox',
				'aria-required': this.element.required,
				'aria-labelledby': this.uuid + '-label',
				'aria-live': 'polite',
//				haspopup is implied by the combobox-role.
//				'aria-haspopup': true,
				id: this.uuid + '-combobox',
				role: 'combobox',
				tabindex: 0
			});

			this.$combobox.on('click.helix.' + this.uuid, $.proxy(function (event) {
				event.stopPropagation();
				this._toggleListbox();
			}, this));
			this.$combobox.on('keydown.helix.' + this.uuid, $.proxy(this._onKeyDown, this));
			this.$combobox.on('keypress.helix.' + this.uuid, $.proxy(this._onKeyPress, this));

			this.$listbox = $('<ul>', {
				'class': classes.listbox,
				id: this.uuid + '-listbox',
				role: 'listbox'
			});

			$body.on('selectopened.helix.' + this.uuid, $.proxy(function (event) {
				if (event.target !== this.$element.get(0)) {
					this._collapseListbox();
				}
			}, this));

			$body.on('click.helix.' + this.uuid, $.proxy(this._onBodyClick, this));

			$window.on('helix.resize.' + this.uuid, $.proxy(this.reflow, this));

			this._populateListbox();
			this._setListboxValue(this.initialValue);

			this.$element.attr('tabindex', -1);
			this.$element.addClass(classes.hidden);
			this.$element.before(this.$combobox);
			this.$element.on('DOMSubtreeModified', $.proxy(this._populateListbox, this));

			if (this.element.autofocus) {
				this.$combobox.trigger('focus');
			}
		},

		_onSelectChange: function (event) {
			var value = this.$element.val();
			this._setListboxValue(value);
		},

		_setSelectValue: function (value) {
			if (this.$element.val() !== value) {
				this.$element.val(value);
				this.$element.trigger('change');
			}
		},

		_onLabelClick: function (event) {
			event.preventDefault();
			this.$combobox.trigger('focus');
		},

		_onComboboxBlur: function () {
			this._collapseListbox();

			this.seachNeedle = '';
			clearTimeout(this.searchTimeout);
			this.searchTimeout = null;
		},

		_onListboxClick: function (event) {
			var value = $(event.target).closest('li').attr('data-value');

			this._collapseListbox();
			this._setSelectValue(value);
		},

		_onBodyClick: function (event) {
			if (this.isExpanded) {
				var $target = $(event.target);

				if ($target.closest(this.$combobox).length === 0 && $target.closest(this.$listbox).length === 0) {
					this._collapseListbox();
				}
			}
		},

		_onFormReset: function () {
			this._collapseListbox();

			if (this.$element.val() === this.initialValue) {
				this._setListboxValue(this.initialValue);
			} else {
				this._setSelectValue(this.initialValue);
			}
		},

		_onKeyPress: function (event) {
			var key = event.which || event.keyCode;

			event.preventDefault();
			event.stopPropagation();

			if (this.searchTimeout) {
				clearTimeout(this.searchTimeout);
			}
			this.searchTimeout = setTimeout($.proxy(this._clearSearchTimeout, this), 1000);

			this.searchNeedle += String.fromCharCode(key).toUpperCase();

			this.$listbox.children('li').each($.proxy(function (index, element) {
				var $element = $(element),
					haystack = $element.text().toUpperCase();

				if (haystack.substring(0, this.searchNeedle.length) === this.searchNeedle) {
					this._setSelectValue($element.attr('data-value'));
					return false;
				}
			}, this));
		},

		_onKeyDown: function (event) {
			var key = event.which || event.keyCode;

			switch (key) {
				case keys.upArrow:
				case keys.downArrow:
					event.preventDefault();
					event.stopPropagation();

					var current = this.$listbox.find('.' + classes.optionSelected),
					    direction;

					if (key === keys.upArrow) {
						direction = 'prevAll';
					} else {
						direction = 'nextAll';
					}

					if (current[direction]().length > 0) {
						var value = current[direction](':not(.' + classes.optionDisabled + ')').first().attr('data-value');
						this._setSelectValue(value);
					}

					this._clearSearchTimeout();
					break;

				case keys.enter:
					event.preventDefault();
					event.stopPropagation();

					this._toggleListbox();
					this._clearSearchTimeout();
					break;

				case keys.esc:
					if (this.isExpanded) {
						event.preventDefault();
						event.stopPropagation();
					}

					this._collapseListbox();
					this._clearSearchTimeout();
					break;
			}
		},

		_setListboxValue: function (value) {
			var $options = this.$listbox.children(),
//				The following doesn't work in Firefox below version 26.
//				$option = $(this.element.selectedOptions).first();
				$option = $options.filter('[data-value="' + value + '"]');

			$options.attr({ 'aria-selected': false });
			$options.removeClass(classes.optionSelected);

			$option.attr({ 'aria-selected': true });
			$option.addClass(classes.optionSelected);

			this.$combobox.attr({ 'aria-activedescendant': $option.attr('id') });
			this.$combobox.text($option.text());

			this._scrollListboxTo($option);
		},

		_setListboxBounds: function () {
		    var bounds = helix.measureElement(this.$viewport, this.$combobox, false);

			this.$listbox.css({
			    left: bounds.left,
			    top: bounds.top + bounds.outerHeight,
				width: bounds.outerWidth
			});
		},

		_scrollListboxTo: function ($option) {
			var option_position = $option.position().top + this.$listbox.scrollTop();
			this.$listbox.scrollTop(option_position);
		},

		_expandListbox: function (event) {
			if (this.isExpanded) {
				return;
			}
			this.isExpanded = true;

			this._setListboxBounds();

			this.$combobox.attr({ 'aria-expanded': true });
			this.$combobox.addClass(classes.open);
			this.$listbox.appendTo($(this.element).closest('.modal, body'));

			this.$element.trigger('selectopened.helix');
		},

		_collapseListbox: function () {
			if (!this.isExpanded) {
				return;
			}
			this.isExpanded = false;

			this._clearSearchTimeout();

			this.$combobox.attr('aria-expanded', false);
			this.$combobox.removeClass(classes.open);
			this.$listbox.detach();
		},

		_toggleListbox: function () {
			if (this.isExpanded) {
				this._collapseListbox();
			} else {
				this._expandListbox();
			}
		},

		_populateListbox: function () {
			this.$listbox.empty();

			var $options = $(this.element.options);

			$options.each($.proxy(function (index, element) {
				var $original = $(element);

				var $option = $('<li>', {
					role: 'option',
					id: this.uuid + '-option-' + index,
				});

				$option.text($original.text());
				$option.attr('data-value', $original.val());
				$option.appendTo(this.$listbox);

				if ($original.is(':selected')) {
					$option.addClass(classes.optionSelected);
				}

				if ($original.is(':disabled')) {
					$option.addClass(classes.optionDisabled);
					$option.attr({ 'aria-disabled': true });

					// Return here, to avoid attaching a click-handler.
					return;
				}

				$option.on('click.helix.' + this.uuid, $.proxy(function (event) {
					this._collapseListbox();
					this._setSelectValue($option.attr('data-value'));
				}, this));
			}, this));
		},

		_clearSearchTimeout: function () {
			clearTimeout(this.searchTimeout);
			this.searchTimeout = null;
			this.searchNeedle = '';
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

			if (this.isExpanded) {
				this._setListboxBounds();
			}
		},
		destroy: function () {

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
