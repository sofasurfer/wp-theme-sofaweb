/*global helix:false */
//  ____             _       _ ____  _
// / ___|  ___   ___(_) __ _| / ___|| |__   __ _ _ __ ___
// \___ \ / _ \ / __| |/ _` | \___ \| '_ \ / _` | '__/ _ \
//  ___) | (_) | (__| | (_| | |___) | | | | (_| | | |  __/
// |____/ \___/ \___|_|\__,_|_|____/|_| |_|\__,_|_|  \___|
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
// https://www.addthis.com/services
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'socialshare';

	var defaults = {
		direction: 'horizontal',
		breakpoint: null,
		providers: {
			facebook: { uri: 'http://www.facebook.com/sharer/sharer.php?u=[URL]&title=[TITLE]' },
			twitter: { uri: 'http://twitter.com/intent/tweet?status=[TITLE]+[URL]' },
			googleplus: {
				uri: 'https://plus.google.com/share?url=[URL]',
				width: 500, height: 400
			},
			pinterest: {
				uri: 'http://pinterest.com/pin/create/bookmarklet/?media=[MEDIA]&url=[URL]&is_video=false&description=[TITLE]',
				width: 765, height: 560
			},
			reddit: { uri: 'http://www.reddit.com/submit?url=[URL]&title=[TITLE]' },
			delicious: { uri: 'http://del.icio.us/post?url=[URL]&title=[TITLE]]&notes=[DESCRIPTION]' },
			stumbleupon: { uri: 'http://www.stumbleupon.com/submit?url=[URL]&title=[TITLE]' },
			linkedin: { uri: 'http://www.linkedin.com/shareArticle?mini=true&url=[URL]&title=[TITLE]&source=[SOURCE/DOMAIN]' },
			slashdot: { uri: 'http://slashdot.org/bookmark.pl?url=[URL]&title=[TITLE]' },
			technorati: { uri: 'http://technorati.com/faves?add=[URL]&title=[TITLE]' },
			posterous: { uri: 'http://posterous.com/share?linkto=[URL]' },
			tumblr: { uri: 'http://www.tumblr.com/share?v=3&u=[URL]&t=[TITLE]' },
			evernote: { uri: 'http://www.evernote.com/clip.action?url=[URL]&title=[TITLE]' }
		}
	};

	var classes = {
		viewport: 'h-' + plugin_name + '-viewport',
		list: 'h-' + plugin_name + '-list',
		toggle: 'h-' + plugin_name + '-toggle',
		open: 'h-' + plugin_name + '-open',
		vertical: 'h-' + plugin_name + '-vertical',
		addThisToolbox: 'addthis_toolbox'
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
			this.$viewport = this.$element.find('.' + classes.viewport);
			this.$list = this.$element.find('.' + classes.list);
			this.$buttons = this.$list.find('button');
			this.$toggle = this.$element.find('.' + classes.toggle);

			this.isOpen = false;
			this.currentPopUp = null;

			if (this.$list.hasClass(classes.addThisToolbox)) {
				this._setupAddThisVersion();
			} else  {
				this._setupHelixVersion();
			}

			this.$element.on('mouseover.helix.' + this.uuid, $.proxy(this._expandList, this));
			this.$element.on('mouseout.helix.' + this.uuid, $.proxy(this._collapseList, this));
			this.$toggle.on('click.helix.' + this.uuid, $.proxy(this._toggleList, this));

			$window.on('resize.helix.' + this.uuid, $.proxy(this.reflow, this));

			this.reflow();
		},
		_expandList: function () {
			this.isOpen = true;

			this.$element.addClass(classes.open);
		},
		_collapseList: function () {
			this.isOpen = false;

			this.$element.removeClass(classes.open);
		},
		_toggleList: function () {
			if (this.isOpen) {
				this._collapseList();
			} else {
				this._expandList();
			}
		},
		_setupAddThisVersion: function () {
			this.$element.one('pointerenter', $.proxy(function (event) {
				// Rrefer to http://support.addthis.com/customer/portal/articles/1337994-the-addthis_config-variable
				window.addthis_config = window.addthis_config || {};
				window.addthis_config.ui_use_css = false;

				// Set the protocol to HTTPS for File, FTP, and others.
				var protocol = (location.protocol !== 'http:' && location.protocol !== 'https:') ? 'https:' : '',
				    source = protocol + '//s7.addthis.com/js/300/addthis_widget.js#domready=1';

				if ($('script[src="' + source + '"]').length === 0) {
					// Inject the AddThis script, so it can initialize with the previously set config-object.
					$('<script>', { src: source, async: true }).appendTo('body');
				}
			}, this));
		},
		_setupHelixVersion: function () {
			// The equivalent regular expression literal would be: /socialshare-([^\s]+)/i
			// So: "socialshare-" followed by at least one of anything but a space-character.
			// And with the parentheses, we catch the part following our plugin-name.
			var regex = new RegExp(plugin_name + '-([^\\s]+)', 'i');

			this.$buttons.on('click.helix.' + this.uuid, $.proxy(function (event) {
				var $button = $(event.target).closest('button');

				var classes = $button.closest('li').attr('class'),
					current = classes.match(regex)[1];

				// Always check the button first, then the document, and the window last.
				var title = $button.attr('data-title') ||
				            this._getMetaContent('DC.title') ||
				            document.title;

				var href = $button.attr('data-href') ||
				           $('link[rel=canonical]').attr('href') ||
				           this._getMetaContent('og:url') ||
				           location.href;

				var creator = $button.attr('data-creator') ||
				              this._getMetaContent('DC.creator');

				// Get all available information for the selected provider.
				var provider = this.settings.providers[current];

				// If there is no address, there is no point in continuing.
				// Maybe we could display a feedback to the user.
				if (!provider.uri) {
					console.error(plugin_name + ': No source provided for this social network.');
					return;
				}

				if (creator.length > 0) {
					title += ' - ' + creator;
				}

				provider.uri = provider.uri.replace('[URL]', encodeURIComponent(href));
				provider.uri = provider.uri.replace('[TITLE]', encodeURIComponent(title));

				this._openPopUp(provider.uri, provider.width, provider.height);
			}, this));
		},
		_getMetaContent: function (name) {
			return $('meta[name="' + name + '"], [property="' + name + '"]').attr('content') || '';
		},
		_openPopUp: function (url, window_width, window_height, window_name) {
			if (this.currentPopUp !== null) {
				this.currentPopUp.close();
			}

			window_width = window_width || 600;
			window_height = window_height || 460;
			window_name = window_name || plugin_name;

			var window_features = 'width=' + window_width + ',height=' + window_height + ',scrollbars=1';

			this.currentPopUp = window.open(url, window_name, window_features);

			// Center the pop-up initially
			// The contained service will probably adjust the size, but mostly vertically.
			this.currentPopUp.moveTo(
				screen.width / 2 - window_width / 2,
				screen.height / 2 - window_height / 2
			);
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//
		
		reflow: function () {
			if (this.settings.direction === 'vertical') {
				this.$element.addClass(classes.vertical);
			} else if (this.settings.breakpoint !== null && window.innerWidth < this.settings.breakpoint) {
				this.$element.addClass(classes.vertical);
			} else {
				this.$element.removeClass(classes.vertical);
			}
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
