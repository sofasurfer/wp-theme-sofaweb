

window.addEventListener("load", function(){

  /*
    Masonry grid
  */
  $('.grid').masonry({
    // options
    itemSelector: '.grid-item',
  });


  /*
    Hover Item
  */
  $('.item-hover').hover( function() {
      $(this).find('.item-hover-caption').fadeIn(300);
  }, function() {
      $(this).find('.item-hover-caption').fadeOut(100);
  })

  /*
    Scroll Top
  */
  $('#back-top').hide();  
  $(window).scroll(function () {
    if ($(this).scrollTop() > 280) {
      $('#back-top').fadeIn();
      $('body').addClass('sticky');
    } else {
      $('#back-top').fadeOut();
      $('body').removeClass('sticky');
    }
  });
  $("#back-top").click(function(event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

  /*
    Pritty Code 
  */
  $( 'pre' ).each( function(key, value){
    $(this).text( $(this).html() );
  });

  $('.prettyprint_old').html(function(i,h){
    return h.replace(/[<>\"\'\t\n]/g, function(m) { return {
      '<' : '&lt;',
      '>' : '&gt;',
      "'" : '&#39;',
      '"' : '&quot;',
      '\t': '  ',
      '\n': '<br/>'
    }[m]});
  });

});