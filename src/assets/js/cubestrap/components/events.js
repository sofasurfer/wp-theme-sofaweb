/*global helix:false */
//  _____                 _
// | ____|_   _____ _ __ | |_ ___
// |  _| \ \ / / _ \ '_ \| __/ __|
// | |___ \ V /  __/ | | | |_\__ \
// |_____| \_/ \___|_| |_|\__|___/
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window);

	$window.on('resize.helix.events', helix.debounce(function (event) {
		$window.trigger('helix.resize');
	}, 200, false));

	$window.on('scroll.helix.events', helix.debounce(function (event) {
		$window.trigger('helix.scroll');
	}, 200, false));


	$.event.special.lazy = {
		threshold: 20,
		delay: 200,
		setup: function () {
			var delay = $.event.special.lazy.delay;
			var debounced_handler = helix.debounce($.event.special.lazy._handler, delay, false);
			$window.on('scroll.helix.lazy resize.helix.lazy', $.proxy(debounced_handler, this));
			// ensure firing initial event
			$.proxy(debounced_handler, this)(null);
		},
		teardown: function () {
			$window.off('.helix.lazy', $.event.special.lazy._handler);
		},
		_handler: function (event) {
			var viewport_height = window.innerHeight || document.documentElement.clientHeight;
			var elemRect = this.getBoundingClientRect();
			var top = elemRect.top - $.event.special.lazy.threshold,
				bottom = elemRect.bottom + $.event.special.lazy.threshold;

			if (bottom >= 0 && top <= viewport_height) {
		        $.event.simulate('lazy', this, event);
		    }
		}
	};


	$.event.special.visibilitychange = {
		delay: 50,
		setup: function () {
			var event_data = $.data(window, 'event-special-visibilitychange');
			if (!event_data) {
				event_data = {};
				$.data(window, 'event-special-visibilitychange', event_data);

				event_data.elements_info = [];
				event_data.interval = setInterval($.event.special.visibilitychange._handler, $.event.special.visibilitychange.delay);
			}

			var is_visible = jQuery.expr.filters.visible(this);
			event_data.elements_info.push([this, is_visible]);
		},
		teardown: function () {
			var event_data = $.data(window, 'event-special-visibilitychange');
			if (event_data) {
				for (var i = 0; i < event_data.elements_info; i++) {
					if (event_data.elements_info[i][0] === this) {
						array.splice(i, 1);
						return;
					}
				}
			}
		},
		_handler: function (event) {
			var event_data = $.data(window, 'event-special-visibilitychange');
			for (var i = 0; i < event_data.elements_info.length; i++) {
				var is_visible = jQuery.expr.filters.visible(event_data.elements_info[i][0]); // lot faster than .is(':visible')

				if (event_data.elements_info[i][1] !== is_visible) {
					event_data.elements_info[i][1] = is_visible;
					// trigger event on corresponding element
					$(event_data.elements_info[i][0]).trigger('visibilitychange', is_visible);
				}
			}
		}
	};

}(this, this.document, this.jQuery);
