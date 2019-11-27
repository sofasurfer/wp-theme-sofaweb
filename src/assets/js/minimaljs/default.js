    
    /*

        General global functions

    */
    var markerStart = false;

    function isEmail(email) {
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email);
    }

    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString()+"; path=/";
    }

    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    /*
    Lazy Load
    */
    var lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy"
    });

    /*
        Map route
    */
    function calculateRoute(directionsService,directionsDisplay,map){

        if( $('#c-map-location').val() != '' ){

            var iconStart = {
                url: templateUrl + '/dist/assets/images/pin-secondary.png',
                strokeWeight: 0,
                size: new google.maps.Size(24, 30),
                scaledSize: new google.maps.Size(24, 30)
            }

            var selectedMode = $('input[name=travel-type]:checked').val();
            var start = $('#c-map-location').val();

            var end = new google.maps.LatLng($('#c-map').data('lat'), $('#c-map').data('lng'));
            var request = {
                origin: start,
                destination: end,
                travelMode: selectedMode
            };

            directionsService.route(request, function(result, status) {
                if (status == 'OK') {
                    var leg = result.routes[ 0 ].legs[ 0 ];
                    $('#c-map-distance').show();
                    $('#c-map-distance').text( leg.distance.text );
                    $('#c-map-duration').html( leg.duration.text ).removeClass('wpcf7-not-valid-tip');

                    $('#c-map-direction').attr('href', 'http://maps.google.com/maps?KIB=test&daddr='+encodeURIComponent(leg.end_address)+'&saddr='+encodeURIComponent(leg.start_address) );

                    directionsDisplay.setDirections(result);
                    if (!markerStart) {
                        markerStart = new google.maps.Marker({
                            position: leg.start_location,
                            map: map,
                            icon: iconStart,
                            title: $('#c-map-location').val()
                        });
                    }else{
                        markerStart.setPosition( leg.start_location );
                    }
                }else{
                    $('#c-map-distance').hide();
                    $('#c-map-duration').html( 'Invalid location' ).addClass('wpcf7-not-valid-tip');
                }
            });
        }

    }


    function initMap(){
        

        /*
            Google MAP            
        */
        if( $('#c-map').length ){

            var iconEnd = {
                url: templateUrl + '/dist/assets/images/pin-museum.png',
                strokeWeight: 0,
                size: new google.maps.Size(34, 42),
                scaledSize: new google.maps.Size(34, 42)

            }
            var stylez = [ { "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f5f5" } ] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#dadada" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ]},{"featureType": "transit.station","elementType": "geometry","stylers": [{"color": "#eeeeee"}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#c9c9c9"}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{"color": "#7db2d7"}]},{"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]}]; 
            var mapDiv = document.getElementById("c-map");
            var latlngO = new google.maps.LatLng($('#c-map').data('lat'), $('#c-map').data('lng'));
            var latlngD = new google.maps.LatLng($('#c-map').data('lat'), $('#c-map').data('lng'));
            var mapOptions = 
            {
                zoom: $('#c-map').data('zoom'),
                center:latlngD,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },

            };
            var map = new google.maps.Map(mapDiv, mapOptions);        

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({
                                                suppressMarkers: true,
                                                polylineOptions: { strokeColor: "#EB0027" }
                                            });

            var mapType = new google.maps.StyledMapType(stylez, { name:"Grayscale" });    
            map.mapTypes.set('tehgrayz', mapType);
            map.setMapTypeId('tehgrayz');

            var markerEnd = new google.maps.Marker({
                position: latlngD,
                map: map,
                icon: iconEnd,
                title: $('#c-map').data('address')
            });

            directionsDisplay.setMap(map);

            $('#c-map-location').change(function(){
                setTimeout(function(){
                    calculateRoute(directionsService,directionsDisplay,map);
                }, 800);
            });

            $('#c-map-search').click(function(){
                calculateRoute(directionsService,directionsDisplay,map);
            });

            $('input[type=radio][name=travel-type]').change(function() {
                calculateRoute(directionsService,directionsDisplay,map);
            });

            $('#c-map-location').click(function(){
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    // Get address from lat long
                    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&key=' + $('#c-map').data('apikey');
                    $.getJSON( url, function( data ) {

                        console.log( data.results[0].formatted_address );
                        $('#c-map-location').val( data.results[0].formatted_address );
                        calculateRoute(directionsService,directionsDisplay,map);

                    });
                });
              }
            });

            $('.c-btn-directions-close').click(function(){
                $('.c-directions-panel').addClass('hidden');
                $(this).hide();
                $('.c-btn-directions-open').show();
            });

            $('.c-btn-directions-open').click(function(){
                $('.c-directions-panel').removeClass('hidden');
                $(this).hide();
                $('.c-btn-directions-close').show();
            });            

            // Autocomplete
            var input = document.getElementById('c-map-location');
            var options = {
              bounds: map.getBounds()
            };

            autocomplete = new google.maps.places.Autocomplete(input, options);            
        }        
    }


    /*
        When page is loaded
    */
    $(document).ready(function() {

        /*
            Cookie Disclaimer
        */
        if ( !getCookie('cookiebanner') ) {
            $('#cookie-notice').show();
            $('#accept-cookie-notice').click(function(event){
              event.preventDefault();
              setCookie('cookiebanner','TRUE');
              $('#cookie-notice').hide();
            });
        }


        /*
            Facts
        */
        if( $('#f-siema-facts').length ){

            var f_winwith = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var f_perpage = 4;
            if( f_winwith < 580 ){
                f_perpage = 2;
            }else if( f_winwith < 850 ){
                f_perpage = 3;
            }

            function factStats(){
                currentSlide = this.currentSlide;
                $('#f-slider-facts-status').text( (Math.ceil(currentSlide/f_perpage)+1) + ' / ' +  Math.ceil(this.innerElements.length/f_perpage) );
            }

            var fSlider = new Siema({
                selector: '#f-siema-facts',
                loop: false,
                perPage: f_perpage,
                onInit: factStats,
                onChange: factStats,
            });
            $( "#f-slider-facts-paging-left" ).click(function() {
                fSlider.goTo(fSlider.currentSlide-f_perpage);
            });
            $( "#f-slider-facts-paging-right" ).click(function() {
                fSlider.goTo(fSlider.currentSlide+f_perpage);
            });
        }
        


        /*
            Gallery
        */
        if( $('#f-siema-gallery').length ){
            
            var f_winwith = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var sliderOffset = 41;
            if( f_winwith < 580 ){
                var sliderOffset = 15;
            }

            var swipeAction = true;
            var sliderActive = 0;
            var sliderItems = $("#f-siema-gallery li");
            var sliderSize = [];
            var sliderOffsetLeft = $('#f-siema-gallery').offset().left;

            // get all image sizes
            sliderItems.each(function(idx, li) {
                sliderSize.push( $(li).find('img').width() );
            });

            // Set slider paging status
            function setGalleryStatus(){
                $('#f-slider-gallery-status').text( (sliderActive+1) + ' / ' +  sliderItems.length );
            }

            // Check slider status by scoll position
            $(".slider").scroll(function() {
                var sPos = $('#f-siema-gallery').offset().left ;
                var sPosRight = ($(window).width() - ($('#f-siema-gallery').offset().left + $('#f-siema-gallery').outerWidth()) );

                // Check if beginning of slider              
                if( sPos < 0 ){
                    sPos = Math.abs( sPos )+sliderOffsetLeft;
                    var sCounter = 1;
                    var sSize = 0;

                    // Get current slider page position
                    $.each(sliderSize, function( index, value ) {
                        sSize = Math.round(sSize+value+sliderOffset-2);
                        if( (sPos) >= sSize ){
                            sliderActive = sCounter;
                            setGalleryStatus();
                        }
                        sCounter = sCounter+1;
                    });

                    // Check if end of slider
                    var diff =  $('#f-siema-gallery')[0].scrollWidth -  $('.slider').scrollLeft() - 5; 
                    if( diff <= $('#f-siema-gallery').outerWidth() ){
                        sliderActive = (sliderItems.length-1);
                        setGalleryStatus();
                        $('#f-siema-gallery-paging-right').addClass('slider-paging-disabled');
                    }else{
                        $('#f-siema-gallery-paging-right').removeClass('slider-paging-disabled');
                    }

                }else{

                    sliderActive = 0;
                    setGalleryStatus();
                }

                // Set back pagin active inactive
                if( sliderActive == 0 ){
                    $('#f-siema-gallery-paging-left').addClass('slider-paging-disabled');
                }else{
                    $('#f-siema-gallery-paging-left').removeClass('slider-paging-disabled');
                }
            });

            /*
                Slider pagination
            */
            $('#f-siema-gallery-paging-left').click(function () {
                var leftPos = $('.slider').scrollLeft();
                $(".slider").animate({
                    scrollLeft: leftPos - sliderSize[sliderActive-1] - sliderOffset
                }, 400);
                swipeAction=true;
            });

            $('#f-siema-gallery-paging-right').click(function () {
                var leftPos = $('.slider').scrollLeft();
                $(".slider").animate({
                    scrollLeft: leftPos + sliderSize[sliderActive] + sliderOffset
                }, 400);
                swipeAction=true;
            });
            
            // Set inital status 
            setGalleryStatus();
        
            // Swipe implementation
            var myOptions = [];
            var myElement = document.getElementById('f-siema-gallery');
            var hammertime = new Hammer( myElement, myOptions);
            hammertime.on('swipe', function(ev) {
                if(swipeAction){
                    swipeAction=false;
                    if( ev.deltaX > 0 ){
                        $('#f-siema-gallery-paging-left').trigger( "click" );
                    }else{
                        $('#f-siema-gallery-paging-right').trigger( "click" );
                    }
                }
            });


        }


        /*
      
          In view animation
        
        */
        var $animation_elements = $('.animation-element');
        var $window = $(window);

        function check_if_in_view() {
          var delay = 0;
          var window_height = $window.height();
          var window_top_position = $window.scrollTop();
          var window_bottom_position = (window_top_position + window_height);
          var window_offset = 0; //((window_height/100) * 10 );

          $.each($animation_elements, function() {

            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = ($element.offset().top + window_offset);
            var element_bottom_position = (element_top_position + element_height);


            //check to see if this current container is within viewport
            if ((element_bottom_position >= window_top_position) &&
              (element_top_position <= window_bottom_position)) {
                setTimeout(function(element) {
                    $element.addClass('in-view');
                }, delay);
                delay = delay + 300;
            }
          });
        }

        $window.on('scroll resize', check_if_in_view);
        $window.trigger('scroll');

    });




