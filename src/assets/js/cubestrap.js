//  ____                  __      ____  _ _         ___       _ _
// | __ )  __ _ ___  ___  \ \    / ___|(_) |_ ___  |_ _|_ __ (_) |_
// |  _ \ / _` / __|/ _ \  \ \   \___ \| | __/ _ \  | || '_ \| | __|
// | |_) | (_| \__ \  __/   \ \   ___) | | ||  __/  | || | | | | |_
// |____/ \__,_|___/\___|    \_\ |____/|_|\__\___| |___|_| |_|_|\__|
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
;void function (window, document, $) {
	'use strict';

	var PSEUDO_STATIC_VARIABLES_COME_HERE = 'some value',
	    UNTIL_ES6_WE_CAN_CHANGE_THESE_LATER = 'BUT DO NOT!!!';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	// Plugin defaults
	// Example: $.event.special.swipe.verticalDistanceThreshold = 40;

	// Initialization of Helix-plugins.
	//     Data-attribute syntax is as follows:
	//         data-helix='{ "name": "" }'
	//         data-helix='{ "name": "", "options": { "": "" } }'
	//         data-helix='[{ "name": "", "options": { "": "" } }]'
	//         data-helix='[{ "name": "", "options": { "": "" } }, { "name": "", "options": { "": "" } }]'
	$document.on('initializePlugins', function (event) {
		$('[data-helix]').each(function (index, element) {
			var $element = $(element),
				data = $element.data('helix'),
				plugins;

			if (!data || data.length === 0) {
				return;
			} else if (data instanceof Array) {
				plugins = data;
			} else if (data instanceof Object) {
				plugins = [data];
			} else {
				return;
			}

			$.each(plugins, function (index, plugin) {
				if (plugin.name && $.fn[plugin.name]) {
					$element[plugin.name](plugin.options || {});
				}
			});
		});

		// Fancy Forms
		$.fn.fancyselect && $('.h-form-standard select').fancyselect();
		$.fn.fancycheckbox && $('.h-form-standard input[type="checkbox"]').fancycheckbox();
		$.fn.customradio && $('.h-form-standard input[type="radio"]').customradio();

		// Responsive Images
		$.fn.srcset && $body.srcset();
	});

	// Do not use an array of parameters but an object.
	// The events might be called again by the backend's Javascript:
	// Keep duplicate event-listeners in mind! (unbind first)
	$document.on('initializeCustomEventName', function (event, params) {
		params = $.extend({ param1: 'Default', param2: 'Values' }, params);
	});

	$document.on('ready helix.ready', function (event) {
		$document.trigger('initializePlugins');
		$document.trigger('initializeCustomEventName', { param1: 'Hello', param2: 'World' });

		// Non-plugin code (DEPRECATED)
		// Try to keep this section to an absolute minimum.
		// If you can do something in a custom-event: do it!
	});

}(this, this.document, this.jQuery);
