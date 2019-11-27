//   ____           _
//  / ___| ___  ___| |_ _   _ _ __ ___  ___
// | |  _ / _ \/ __| __| | | | '__/ _ \/ __|
// | |_| |  __/\__ \ |_| |_| | | |  __/\__ \
// \____|\___||___/\__|\__,_|_|  \___||___/
//
// Copyright 2014, 2015 Goldbach Interactive (Switzerland) AG
// Maintainer: florian.maeder@goldbachinteractive.ch
//
;void function (window, document, $) {
	'use strict';

	function pointerEventData(event) {
	    var evt = event.originalEvent || event;

		return {
			time: ( new Date() ).getTime(),
			coords: [evt.clientX, evt.clientY]
		};
	}

	function triggerCustomEvent(obj, eventType, event, bubble) {
		var originalType = event.type;
		event.type = eventType;
		if (bubble) {
			$.event.trigger(event, undefined, obj);
		} else {
			$.event.dispatch.call(obj, event);
		}
		event.type = originalType;
	}

	$.event.special.tap = {
		// Abort tap if touch moves further than 10 pixels in any direction
		distanceThreshold: 10,
		// Abort tap if touch lasts longer than half a second
		timeThreshold: 500,

		setup: function () {
			var self = this,
			$self = $(self);

			// Retrieve the events data for this element and add the swipe context
			var event_data = $.data(this, 'event-special-tap');
			if (!event_data) {
				event_data = {};
				$.data(this, 'event-special-tap', event_data);
			}

			var context = {};
			event_data.ctx = context;

			context.down = function (event) {
				var start = pointerEventData(event),
				    stop = null,
				    origTarget = event.target,
				    timeout = null,
				    detected = false;

				context.move = function (event) {
					stop = pointerEventData(event);

					if (Math.abs(start.coords[ 0 ] - stop.coords[ 0 ]) > $.event.special.tap.distanceThreshold ||
						Math.abs(start.coords[ 1 ] - stop.coords[ 1 ]) > $.event.special.tap.distanceThreshold) {
						context.unbind();
					}
				};

				context.up = function (event) {
					context.unbind();
					if (origTarget === event.target) {
						$.event.simulate('tap', self, event);
					}
				};

				context.unbind = function () {
					clearTimeout(timeout);
					$self.off('pointermove', context.move);
					$self.off('pointerup', context.up);
					$self.off('pointerout', context.unbind);
				};

				timeout = setTimeout(context.unbind, $.event.special.tap.timeThreshold);
				$self.on('pointermove', context.move);
				$self.one('pointerup', context.up);
				$self.one('pointerout', context.unbind);
			};

			$self.on('pointerdown', context.down);
		},
		teardown: function () {
			var event_data = $.data(this, 'event-special-tap');
			if (event_data) {
				var context = event_data.ctx;
				$(this).off('pointerdown', context.down);
				$(this).off('pointermove', context.move);
				$(this).off('pointerup', context.up);
				$(this).off('pointerout', context.up);

				delete event_data.ctx;
				$.removeData(this, 'event-special-tap');
			}
		}
	};


	// Also handles swipeleft, swiperight
	$.event.special.swipe = {
		scrollSupressionThreshold: 30,
		durationThreshold: 1000,
		horizontalDistanceThreshold: 60,
		verticalDistanceThreshold: 20,

		gestureDetected: function (start, stop) {
			if ( Math.abs(start.coords[ 0 ] - stop.coords[ 0 ]) > $.event.special.swipe.horizontalDistanceThreshold &&
				Math.abs(start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold) {

				return true;
			}
			return false;
		},

		setup: function () {
			var self = this,
			$self = $(self);

			// Retrieve the events data for this element and add the swipe context
			var event_data = $.data(this, 'event-special-swipe');
			if (!event_data) {
				event_data = {};
				$.data(this, 'event-special-swipe', event_data);
			}

			var context = {};
			event_data.ctx = context;

			context.down = function (event) {
				var start = pointerEventData(event),
					origTarget = event.target,
					detected = false;

				// unbind previous context, if any
				if (context.unbind) {
					context.unbind();
				}

				context.move = function (event) {
					var stop = pointerEventData(event);

					// expired (gesture took too long)
					if (stop.time - start.time > $.event.special.swipe.durationThreshold) {
						context.unbind();
						return;
					}

					if (!detected) {
						detected = $.event.special.swipe.gestureDetected(start, stop);
						if (detected) {
							var direction = start.coords[0] > stop.coords[ 0 ] ? 'swipeleft' : 'swiperight';
							triggerCustomEvent( self, 'swipe', $.Event('swipe', { target: origTarget, swipestart: start, swipestop: stop }), true);
							triggerCustomEvent( self, direction, $.Event(direction, { target: origTarget, swipestart: start, swipestop: stop } ), true);
						}
					}

					// prevent scrolling
					if ( Math.abs(start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold) {
						event.preventDefault();
					}
				};

				context.up = function (event) {
					context.unbind();
					$self.one('click', function(event) {
						if(detected) {
							event.preventDefault();
						}
					});
				};

				context.unbind = function () {
					$self.off('pointermove', context.move);
					$self.off('pointerup', context.up);
				    //self.removeEventListener('pointermove', context.move, true);
				    //self.removeEventListener('pointerup', context.up, true);
				};

				$self.on('pointermove', context.move)
					.one('pointerup', context.up);
				//self.addEventListener('pointermove', context.move, true);
				//self.addEventListener('pointerup', context.up, true);
			};

		    $self.on('pointerdown', context.down);
			//self.addEventListener('pointerdown', context.down, true);
		},

		teardown: function () {
			var event_data = $.data(this, 'event-special-swipe');
			if (event_data) {
				var context = event_data.ctx;
				$(this).off('pointerdown', context.down);
				$(this).off('pointermove', context.move);
				$(this).off('pointerup', context.up);
				$(this).off('pointerout', context.up);

				delete event_data.ctx;
				$.removeData(this, 'event-special-swipe');
			}
		}
	};

	$.each({
		taphold: 'tap',
		swipeleft: 'swipe.left',
		swiperight: 'swipe.right'
	}, function (event, sourceEvent) {
		$.event.special[ event ] = {
			setup: function () {
				$(this).bind(sourceEvent, $.noop);
			},
			teardown: function () {
				$(this).unbind(sourceEvent);
			}
		};
	});

}(this, this.document, this.jQuery);
