<?php

error_log( get_post_type() );

get_template_part('templates/header');

if ( (!is_front_page() && is_home()) || is_category() ) {
    get_template_part('templates/archive_header');
    while ( have_posts() ) {
        the_post();
        get_template_part('templates/archive');
    }
    get_template_part('templates/archive_footer');
}else{
    get_template_part('templates/jumbotron');
    echo '<div id="container" class="container">';
    if( have_posts() ) the_post();
    the_content();
    echo '</div>';
}

get_template_part('templates/footer');

?>