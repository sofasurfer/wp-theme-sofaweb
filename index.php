<?php
get_template_part('templates/header');

// Set post
if( have_posts() ) the_post();

// get header showroom
$showroom_elements = get_field('cdt_headers');
if(!empty($showroom_elements)){
    include( locate_template( 'templates/showroom.php', false, false ) );
}else{
    include( locate_template( 'templates/title.php', false, false ) );
}

// get site elements
$site_elements = get_field('cdt_elements');
if( !empty($site_elements)){
    foreach( $site_elements as $site_element ){
        include( locate_template( 'templates/' . $site_element['acf_fc_layout'] . '.php', false, false ) );
    }
}

// echo '<pre>';
// print_r($site_elements);
// echo '</pre>';


get_template_part('templates/footer');

?>