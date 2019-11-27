/*global helix:false */
// __   _______ ____  _
// \ \ / /_   _|  _ \| | __ _ _   _  ___ _ __
//  \ V /  | | | |_) | |/ _` | | | |/ _ \ '__|
//   | |   | | |  __/| | (_| | |_| |  __/ |
//   |_|   |_| |_|   |_|\__,_|\__, |\___|_|
//                            |___/
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'ytplayer';

	var defaults = {};

	var classes = {
		embedded: 'h-' + plugin_name + '-embedded',
		viewport: 'h-' + plugin_name + '-viewport',
		controls: 'h-' + plugin_name + '-controls',
		play: 'h-' + plugin_name + '-play',
		pause: 'h-' + plugin_name + '-pause',
		stop: 'h-' + plugin_name + '-stop',
		mute: 'h-' + plugin_name + '-mute',
		unmute: 'h-' + plugin_name + '-unmute',
		close: 'h-' + plugin_name + '-close',
		noscript: 'h-' + plugin_name + '-noscript',
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
			this.$poster = this.$viewport.children();

			this.$controls = this.$element.find('.' + classes.controls);
			this.$play = this.$element.find('.' + classes.play);
			this.$pause = this.$element.find('.' + classes.pause);
			this.$stop = this.$element.find('.' + classes.stop);
			this.$mute = this.$element.find('.' + classes.mute);
			this.$unmute = this.$element.find('.' + classes.unmute);
			this.$close = this.$element.find('.' + classes.close);
			this.$noscript = this.$element.find('.' + classes.noscript).detach();
			this.$iframe = $(this.$noscript.text());

			this.api = null;
			this.timer = null;

			this.$element.on('video.end.helix', $.proxy(this._unembedPlayer, this));
			this.$viewport.on('click.helix.' + this.uuid, $.proxy(function (event) {
				event.preventDefault();
				this._embedPlayer();
			}, this));

			this.$play.on('click.helix.' + this.uuid, $.proxy(this.play, this));
			this.$pause.on('click.helix.' + this.uuid, $.proxy(this.pause, this));
			this.$stop.on('click.helix.' + this.uuid, $.proxy(this.stop, this));
			this.$mute.on('click.helix.' + this.uuid, $.proxy(this.mute, this));
			this.$unmute.on('click.helix.' + this.uuid, $.proxy(this.unmute, this));

			this.$close.on('click.helix.' + this.uuid, $.proxy(this._unembedPlayer, this));

			this.$controls.detach();
		},
		_log: function (type, message) {
			console[type](plugin_name + ': ' + message);
		},

		_embedPlayer: function () {
			this.$viewport.off('click.helix.' + this.uuid);
			this.$viewport.empty().append(this.$iframe);

			this.api = this.$iframe[0].contentWindow;

			this._pingPlayer();
			$window.on('message', $.proxy(this._receivePlayerResponse, this));

			this.$element.addClass(classes.embedded);
			this.$element.append(this.$controls);
		},
		_unembedPlayer: function () {
			this.$controls.detach();
			this.$element.removeClass(classes.embedded);

			$window.off('message', this._receivePlayerResponse);

			this.api = null;

			this.$viewport.empty().append(this.$poster);
			this.$viewport.on('click.helix.' + this.uuid, $.proxy(this._embedPlayer, this));
		},
		_pingPlayer: function() {
			this.timer = new helix.timer(100, $.proxy(function () {
				if (this.api !== null) {
					this.api.postMessage(JSON.stringify({
						id: this.uuid,
						event: 'listening'
					}), '*');
				}
			}, this));

			this.timer.start();
		},
		_receivePlayerResponse: function (event) {
			var data = JSON.parse(event.originalEvent.data);

			// ignore messages from other players
			if (data.id !== this.uuid) {
				return;
			}

			// stop pinging player
			if (this.timer !== null) {
				this.timer.stop();
				this.timer = null;
			}

			switch (data.event) {
				case 'onReady':
					this.$element.trigger('video.ready.helix');
					break;

				case 'initialDelivery':
					this.$element.trigger('video.info.helix', [data.info]);
					break;

				case 'infoDelivery':
					if (typeof (data.info.playerState) !== 'undefined') {
						if (data.info.playerState === -1) {
							this.$element.trigger('video.unstarted.helix', [data.info]);
						} else if (data.info.playerState === 0) {
							this.$element.trigger('video.end.helix', [data.info]);
						} else if (data.info.playerState === 1) {
							this.$element.trigger('video.play.helix', [data.info]);
						} else if (data.info.playerState === 2) {
							this.$element.trigger('video.pause.helix', [data.info]);
						} else {
							this._log('warn', 'Unknown player state: ' + data.info.playerState);
						}
					}
					break;

				default:
					this._log('warn', 'Unknown event: ' + data.event);
					break;
			}
		},
		_sendPlayerCommand: function (func, args) {
			if (this.api !== null) {
				this.api.postMessage(JSON.stringify({
					id: this.uuid,
					event: 'command',
					func: func,
					args: args || []
				}), '*');
			}
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//

		embed: function() {
			this._embedPlayer();
		},

		unembed: function() {
			this._unembedPlayer();
		},

		play: function() {
			this._sendPlayerCommand('playVideo');
		},

		pause: function () {
			this._sendPlayerCommand('pauseVideo');
		},

		stop: function () {
			this._sendPlayerCommand('stopVideo');
		},

		seekTo: function(seconds, seekAhead) {
			this._sendPlayerCommand('seekTo', [seconds, seekAhead]);
		},

		mute: function() {
			this._sendPlayerCommand('mute');
		},

		unmute: function() {
			this._sendPlayerCommand('unMute');
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
