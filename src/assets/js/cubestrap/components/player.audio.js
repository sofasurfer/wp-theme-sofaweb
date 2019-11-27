//     _             _ _       ____  _
//    / \  _   _  __| (_) ___ |  _ \| | __ _ _   _  ___ _ __
//   / _ \| | | |/ _` | |/ _ \| |_) | |/ _` | | | |/ _ \ '__|
//  / ___ \ |_| | (_| | | (_) |  __/| | (_| | |_| |  __/ |
// /_/   \_\__,_|\__,_|_|\___/|_|   |_|\__,_|\__, |\___|_|
//                                           |___/
//
// Copyright 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: sergio.abad@goldbachinteractive.ch
//
// TODO Implement pointer-move on pointer-down on seeker and volume.
// TODO Hanlde network state.
//
// https://html.spec.whatwg.org/multipage/embedded-content.html#dom-mediacontroller
// https://developer.mozilla.org/en/docs/Web/API/HTMLMediaElement
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
//
;void function (window, document, $) {
	'use strict';

	var $window = $(window),
	    $document = $(document),
	    $html = $(document.documentElement),
	    $body = $(document.body);

	var plugin_name = 'audioplayer';

/*
	var NETWORK_EMPTY = 0,
		NETWORK_IDLE = 1,
		NETWORK_LOADING = 2,
		NETWORK_NO_SOURCE = 3;
*/

	var defaults = {
		seekerAxis: 'x',
		volumeAxis: 'x'
	};

	var classes = {
		original: 'h-' +plugin_name + '-original',
		play: 'h-' +plugin_name + '-play',
		pause: 'h-' +plugin_name + '-pause',
		togglePlay: 'h-' +plugin_name + '-toggleplay',
		mute: 'h-' +plugin_name + '-mute',
		unmute: 'h-' +plugin_name + '-unmute',
		muted: 'h-' +plugin_name + '-muted',
		toggleMute: 'h-' +plugin_name + '-togglemute',
		volumeBar: 'h-' +plugin_name + '-volume',
		volumeCurrent: 'h-' +plugin_name + '-volume-current',
		seekerBar: 'h-' +plugin_name + '-seeker',
		seekerCurrent: 'h-' +plugin_name + '-seeker-current',
		seekerPlayed: 'h-' +plugin_name + '-seeker-played',
		seekerBuffered: 'h-' +plugin_name + '-seeker-buffered',
		timeElapsed: 'h-' +plugin_name + '-time-elapsed',
		timeTotal: 'h-' +plugin_name + '-time-total',
/*
		networkEmpty: 'h-' +plugin_name + '-network-empty',
		networkIdle: 'h-' +plugin_name + '-network-idle',
		networkLoading: 'h-' +plugin_name + '-network-loading',
		networkNoSource: 'h-' +plugin_name + '-network-nosource'
*/
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
			this.$original = this.$element.find('.' + classes.original);
			this.api = this.$original[0];

			// To disable any of the controls;
			// - Add them to the markup and
			// - Set display:none; in the style sheets.

			this.$play = this.$element.find('.' + classes.play);
			this.$pause = this.$element.find('.' + classes.pause);
			this.$mute = this.$element.find('.' + classes.mute);
			this.$unmute = this.$element.find('.' + classes.unmute);

			this.$togglePlay = this.$element.find('.' + classes.togglePlay);
			this.$toggleMute = this.$element.find('.' + classes.toggleMute);

			this.lang = {
				play: this.$togglePlay.text(),
				pause: this.$togglePlay.attr('data-text-pause'),
				mute: this.$toggleMute.text(),
				unmute: this.$toggleMute.attr('data-text-unmute')
			};

			// Prepare the volume control.
			this.$volumeBar = this.$element.find('.' + classes.volumeBar);
			this.$volumeCurrent = this.$element.find('.' + classes.volumeCurrent);

			this.volumeAxis = this.settings.volumeAxis === 'x' ? 'width' : 'height';

			this._updateVolumeBar();

			// Prepare the time control and display.
			this.$seekerBar = this.$element.find('.' + classes.seekerBar);
			this.$seekerCurrent = this.$element.find('.' + classes.seekerCurrent);
			this.$seekerPlayed = this.$element.find('.' + classes.seekerPlayed).detach();
			this.$seekerBuffered = this.$element.find('.' + classes.seekerBuffered).detach();

			this.seekerAxis = this.settings.seekerAxis === 'x' ? 'width' : 'height';

			this.$timeElapsed = this.$element.find('.' + classes.timeElapsed);
			this.$timeTotal = this.$element.find('.' + classes.timeTotal);

			this._updateElapsedTime();

/*
			this.networkStateClasses = [
				classes.networkEmpty,
				classes.networkIdle,
				classes.networkLoading,
				classes.networkNoSource
			].join(' ');

			this.networkStateInterval = setInterval($.proxy(this._checkNetworkState, this), 100);

			this.api.addEventListener('loadstart', $.proxy(function (event) {
				if (this.api.networkState !== NETWORK_LOADING) {
					return;
				}

				this.$element.removeClass(this.networkStateClasses);
				this.$element.addClass(classes.networkLoading);
			}, this));
*/
			this.$play.on('click.base.' + this.uuid, $.proxy(this.play, this));
			this.$pause.on('click.base.' + this.uuid, $.proxy(this.pause, this));
			this.$mute.on('click.base.' + this.uuid, $.proxy(this.mute, this));
			this.$unmute.on('click.base.' + this.uuid, $.proxy(this.unmute, this));

			this.$togglePlay.on('click.base.' + this.uuid, $.proxy(this.togglePlay, this));
			this.$toggleMute.on('click.base.' + this.uuid, $.proxy(this.toggleMute, this));

			this.$seekerBar.on('click.base.' + this.uuid, $.proxy(this._onSeekerBarClick, this));
			this.$volumeBar.on('click.base.' + this.uuid, $.proxy(this._onVolumeBarClick, this));

			this.api.addEventListener('timeupdate', $.proxy(this._updateElapsedTime, this));
			this.api.addEventListener('volumechange', $.proxy(this._updateVolumeBar, this));
			this.api.addEventListener('playing', $.proxy(this._onPlayingChange, this));
			this.api.addEventListener('pause', $.proxy(this._onPlayingChange, this));
			this.api.addEventListener('durationchange', $.proxy(this._updateTotalTime, this));
			this.api.addEventListener('progress', $.proxy(this._updateBuffered, this));
		},

		_extractTimeranges: function (timeranges) {
			var temp, values = [];

			for (var i = 0; i < timeranges.length; i++) {
				temp = {
					start: 100 / this.api.duration * timeranges.start(i),
					end: 100 / this.api.duration * timeranges.end(i)
				};

				if (isNaN(temp.start) || isNaN(temp.end)) {
					continue;
				}

				values.push(temp);
			}

			return values;
		},

		_checkNetworkState: function () {
			this.$element.removeClass(this.networkStateClasses);

			switch (this.api.networkState) {
				case NETWORK_EMPTY:
					this.$element.addClass(classes.networkEmpty);
					break;

				case NETWORK_IDLE:
					this.$element.addClass(classes.networkIdle);
					break;

				case NETWORK_LOADING:
					this.$element.addClass(classes.networkLoading);
					break;

				case NETWORK_NO_SOURCE:
					this.$element.addClass(classes.networkNoSource);
					break;
			}
		},

		_log: function (type, message) {
			console[type](plugin_name + ': ' + message);
		},
		_convertTime: function (total_seconds) {
			// Divide by 60 and *loose* the remainder.
			var minutes = Math.floor(total_seconds / 60),
			// Divide by 60 and *take* the remainder.
			    seconds = Math.floor(total_seconds % 60);

			return minutes + ':' + ('0' + seconds).slice(-2);
		},
		_onPlayingChange: function (event) {
			if (this.api.paused) {
				this.$togglePlay.text(this.lang.play);
			} else {
				this.$togglePlay.text(this.lang.pause);
			}
		},
		_onVolumeBarClick: function (event) {
			// Get the position of the volume-bar to offset
			// the document-coordinates of the mouse-click.
			var click_offset = this.$volumeBar.position().left,
			// Calculate the click position inside the volume-bar.
			    click_position = event['page' + this.settings.volumeAxis.toUpperCase()] - click_offset,
			// Convert the click position to a fraction of one.
			    volume_position = 1 / this.$volumeBar[this.volumeAxis]() * click_position;

			this.setVolume(volume_position);
		},
		_onSeekerBarClick: function (event) {
			// Get the position of the seeker-bar to offset
			// the document-coordinates of the mouse-click.
			var click_offset = this.$seekerBar.position().left,
			// Calculate the click position inside the seeker-bar.
			    click_position = event['page' + this.settings.seekerAxis.toUpperCase()] - click_offset,
			// Convert the click position to a fraction of one.
			    song_position = 1 / this.$seekerBar[this.seekerAxis]() * click_position;

			this.seekTo(this.api.duration * song_position);
		},
		_updateVolumeBar: function () {
			var volume_percentage;

			if (this.api.muted) {
				this.$element.addClass(classes.muted);
				this.$volumeBar.off('click', this._onVolumeBarClick);
				this.$toggleMute.text(this.lang.unmute);

				// Muted means no volume.
				volume_percentage = 0;
			} else {
				this.$element.removeClass(classes.muted);
				// TODO Secure against multiple event-listeners.
				this.$volumeBar.on('click', $.proxy(this._onVolumeBarClick, this));
				this.$toggleMute.text(this.lang.mute);

				// The API's range for the volume is 0 to 1.
				volume_percentage = this.api.volume * 100;
			}

			this.$volumeCurrent[this.volumeAxis](volume_percentage + '%');
		},
		_updateBuffered: function () {
			var timeranges = this._extractTimeranges(this.api.buffered);

			this.$seekerBar.find('.' + classes.seekerBuffered).remove();
			$.each(timeranges, $.proxy(function (index, value) {
				this.$seekerBar.append(
					this.$seekerBuffered.clone().css({
						left: value.start + '%',
						width: value.end - value.start + '%'
					})
				);
			}, this));
		},
		_updateElapsedTime: function () {
			var timeranges = this._extractTimeranges(this.api.played);

			this.$seekerBar.find('.' + classes.seekerPlayed).remove();
			$.each(timeranges, $.proxy(function (index, value) {
				this.$seekerBar.append(
					this.$seekerPlayed.clone().css({
						left: value.start + '%',
						width: value.end - value.start + '%'
					})
				);
			}, this));

			// Store the current time locally to avoid a changing value.
			var current_time = this.api.currentTime;

			// Update element.
			this.$timeElapsed.text(this._convertTime(current_time));

			// Update seeker-bar.
			var elapsed_percentage = 100 / this.api.duration * current_time;
			this.$seekerCurrent[this.seekerAxis](elapsed_percentage + '%');
		},
		_updateTotalTime: function () {
			this.$timeTotal.text(this._convertTime(this.api.duration));
		},

		//  ____        _     _ _           _    ____ ___
		// |  _ \ _   _| |__ | (_) ___     / \  |  _ \_ _|
		// | |_) | | | | '_ \| | |/ __|   / _ \ | |_) | |
		// |  __/| |_| | |_) | | | (__   / ___ \|  __/| |
		// |_|    \__,_|_.__/|_|_|\___| /_/   \_\_|  |___|
		//

		play: function () {
			this.api.play();
		},
		pause: function () {
			this.api.pause();
		},
		togglePlay: function () {
			if (this.api.paused) {
				this.play();
			} else {
				this.pause();
			}
		},

		mute: function () {
			this.api.muted = true;
		},
		unmute: function () {
			this.api.muted = false;
		},
		toggleMute: function () {
			if (this.api.muted) {
				this.unmute();
			} else {
				this.mute();
			}
		},
		setVolume: function (volume) {
			if (isNaN(volume)) {
				this._log('error', "setVolume(double volume) requires its parameter to be a number.");
				return;
			}

			this.api.volume = volume * 1.0;
		},

		seekTo: function (time) {
			if (isNaN(time)) {
				this._log('error', "seekTo(double time) requires its parameter to be a number.")
				return;
			}

			this.api.currentTime = time * 1.0;
		},

		reflow: function () {
			// Skip the reflow, if the element is hidden.
			if (!jQuery.expr.filters.visible(this.element)) {
				return;
			}

			// As we set the widths in percentages, we don't need to do anything here.
			this._log('info', "There's no need to reflow this plugin.");
		},
		destroy: function () {
			this.$play.off('click.base.' + this.uuid);
			this.$pause.on('click.base.' + this.uuid);
			this.$mute.off('click.base.' + this.uuid);
			this.$unmute.on('click.base.' + this.uuid);

			this.$togglePlay.off('click.base.' + this.uuid);
			this.$toggleMute.off('click.base.' + this.uuid);

			this.$seekerBar.off('click.base.' + this.uuid);
			this.$volumeBar.off('click.base.' + this.uuid);

			this.api.removeEventListener('timeupdate');
			this.api.removeEventListener('volumechange');
			this.api.removeEventListener('playing');
			this.api.removeEventListener('pause');
			this.api.removeEventListener('durationchange');
			this.api.removeEventListener('progress');
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
