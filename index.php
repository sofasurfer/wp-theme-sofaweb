<?php
get_template_part('templates/header');

// Set post

error_log( "POST:" . get_post_type() );

if( get_post_type() == "post" ){
    get_template_part('templates/jumbotron');
    echo '<div id="container" class="container">';

    if ( have_posts() ) {
        while ( have_posts() ) {
            echo("<h1>KIB</>");
            the_post(); 

            //
            // Post Content here
            //
        } // end while
    } // end if

    echo '</div>';    
}else{
    
    if( have_posts() ) the_post();
    get_template_part('templates/jumbotron');
    echo '<div id="container" class="container">';
    the_content();
    echo '</div>';
}

get_template_part('templates/footer');

?>