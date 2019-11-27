/*global helix:false */
//
// Copyright 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void#Immediately_Invoked_Function_Expressions
;void function (window, document, $) {
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	// This name will be used in:
	// - The data-helix plugin initialization string.
	// - The CSS class-prefixes in style sheets and markup.
	var plugin_name = 'boilerplate';

	// The plugin's settings. Identical for all instances.
	// They can be overridden at the plugin-initialization.
	var defaults = {};

	// Keyboard mapping
	// Do no use these aliases for KeyPress events!
	// Shorten or extend as necessary, after having made your copy.
	var keys = {
		tab: 9,
		enter: 13,
		escape: 27,
		pageUp: 33,
		pageDown: 34,
		end: 35,
		home: 36,
		leftArrow: 37,
		upArrow: 38,
		rightArrow: 39,
		downArrow: 40,

		zero: 48,
		// ...
		nine: 57,

		f1: 112,
		// ...
		f12: 123
	};

	// The classes used by the plugin.
	// Prefix with plugin_name and omit the dot.
	// Camelcase for property names and dash-seperated groups for CSS.
	var classes = {
		someClass: 'h-' + plugin_name + '-someclass',
		someClassSub: 'h-' + plugin_name + '-someclass-sub'
	};

	function Plugin(element, options) {
		this.element = element;
		this.$element = $(element);
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);
		// The plugin's UUID will be used to namespace events.
		// Using the plugin_name leads to conflicts with multiple instances using the same nodes.
		this.uuid = helix.generateUUID();
		this._init();
	}

	$.extend(Plugin.prototype, {
		_init: function () {

		},

		_privateMethod1: function (param1, param2) {

		},
		_privateMethod2: function (param1, param2) {

		},
		_onKeyDown: function (event) {
			// http://api.jquery.com/event.which/
			var key = event.which;

			switch (key) {
				case keys.home:
				case keys.leftArrow:
					this._privateMethod1();
					break;

				case keys.end:
				case keys.rightArrow:
					this._privateMethod2();
					break;
			}
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//

		publicMethod1: function (param1, param2) {

		},
		publicMethod2: function (param1, param2) {

		},

		reflow: function () {
			// Skip the reflow, if the element is hidden.
			if (!$.expr.filters.visible(this.element)) {
				return;
			}

		},
		destroy: function () {

		}
	});

	$.fn[plugin_name] = function (options) {
		// http://stackoverflow.com/a/7057090
		var args = Array.prototype.slice.call(arguments, 1);

		// Is the first parameter an object (options), or was omitted,
		// instantiate a new instance of the plugin.
		if (options === undefined || typeof options === 'object') {
			return this.each(function (index, element) {

				// Only allow the plugin to be instantiated once,
				// so we check that the element has no plugin instantiation yet
				if (!$.data(element, 'plugin_' + plugin_name)) {

					// if it has no instance, create a new one,
					// pass options to our plugin constructor,
					// and store the plugin instance
					// in the elements jQuery data object.
					$.data(element, 'plugin_' + plugin_name, new Plugin(element, options));
				}
			});

		// If the first parameter is a string and it doesn't start
		// with an underscore or "contains" the `init`-function,
		// treat this as a call to a public method.
		} else if (typeof options === 'string' && options[0] !== '_') {

			// Cache the method call
			// to make it possible
			// to return a value
			var returns;

			this.each(function (index, element) {
				var instance = $.data(element, 'plugin_' + plugin_name);

				// Tests that there's already a plugin-instance
				// and checks that the requested public method exists
				if (instance instanceof Plugin && typeof instance[options] === 'function') {

					// Call the method of our plugin instance,
					// and pass it the supplied arguments.
					returns = instance[options].apply(instance, args);
				}

				// Allow instances to be destroyed via the 'destroy' method
				// Put your destroy routine into this.destroy.
				if (options === 'destroy') {
					$.data(element, 'plugin_' + plugin_name, null);
				}
			});

			// If the earlier cached method
			// gives a value back return the value,
			// otherwise return this to preserve chainability.
			return returns !== undefined ? returns : this;
		}
	};

}(this, this.document, this.jQuery);
