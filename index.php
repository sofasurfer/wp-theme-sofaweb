<?php
get_template_part('templates/header');


get_template_part('templates/jumbotron');



// Set post
if( have_posts() ) the_post();

echo '<div id="container" class="container">';

the_content();

echo '</div>';

get_template_part('templates/footer');

?>