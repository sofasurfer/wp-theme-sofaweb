<?php

// Namespace declaration
namespace SofaWeb;

// Exit if accessed directly 
defined('ABSPATH') or die;

/**
 * General hooks
 */
class General {

    /**
     * The singleton instance of this class.
     * @var General
     */
    private static $instance;

    /**
     * Gets the singleton instance of this class.
     * This instance is lazily instantiated if it does not already exist.
     * The given instance can be used to unregister from filter and action hooks.
     * 
     * @return General The singleton instance of this class.
     */
    public static function instance() {
        return self::$instance ?: (self::$instance = new self());
    }

    /**
     * Creates a new instance of this singleton.
     */
    private function __construct() {
        // add_action('wp_enqueue_scripts', [$this, 'custom_scripts']);
        add_action('init', [$this, 'cdt_init']);
        add_action('init', [$this, 'cdt_register_maim_menu'] );
        add_action('admin_head', [$this, 'my_custom_admin_css']);

        add_shortcode( 'wp_version', [$this, 'c_shortcode_version'] );
        add_shortcode( 'get_posts', [$this, 'c_get_posts'] );
        add_shortcode( 'render_imagetag', [$this, 'c_shortcode_render_image'] );
        add_shortcode( 'pagination_bar', [$this, 'c_pagination_bar'] );
        add_shortcode( 'get_search_results', [$this, 'c_get_search_results'] );
        add_shortcode( 'get_search_title', [$this, 'c_get_search_title'] );
        // add_shortcode( 'cdt_post_languages', [$this, 'cdt_post_languages'] );
        // add_shortcode( 'cdt_post_locale', [$this, 'cdt_post_locale'] );

        // add_filter('nav_menu_css_class' , [$this, 'cdt_special_nav_class'] , 10 , 2);
        // add_filter('acf/format_value/type=textarea', [$this, 'cdt_format_value'], 10, 3);
        // add_filter('acf/fields/google_map/api', [$this, 'my_acf_google_map_api'] );


        // Disable gutenberg
        add_filter( 'the_excerpt', 'shortcode_unautop');
        add_filter( 'the_excerpt', 'do_shortcode');
        add_filter( 'get_the_excerpt', 'do_shortcode', 5 );

        remove_filter('the_content', 'wpautop');

        add_filter('use_block_editor_for_post', '__return_false', 10);
        add_filter('use_block_editor_for_post_type', '__return_true', 10);

        add_filter('use_block_editor_for_page', '__return_false', 10);





        if( function_exists('acf_add_options_page') ) {
            acf_add_options_page();   
        }
    }

    public function cdt_init(){

        // remove_post_type_support( 'page', 'editor' );
        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'menus' );
        add_post_type_support( 'page', 'excerpt' );

    }

    public function cdt_register_maim_menu() {
      register_nav_menu('header-menu',__( 'Header Menu' ));
      register_nav_menu('footer-menu',__( 'Footer Menu' ));
    }

    public function cdt_special_nav_class ($classes, $item) {
        if (in_array('current-menu-item', $classes) ){
            $classes[] = 'c-active ';
        }
        return $classes;
    }

    public function my_acf_google_map_api() {
        $api['key'] = '';
        return $api;
    }



    public function cdt_format_value( $value, $post_id, $field ) {
        // run do_shortcode on all textarea values
        $value = do_shortcode($value);
        // return
        return $value;
    }

    public function c_shortcode_version(){
        $my_theme = wp_get_theme( 'cite-du-temps' );
        if ( $my_theme->exists() ){
            return $my_theme->get( 'Version' );
        }
        return 1.0;
    }


    public function c_get_search_title(){
        $args = array( 
            's' => $_GET['query']);

        $wp_query = new \WP_Query( $args );

        return  $wp_query->found_posts . " Results for: " . $_GET['query'];
    }

    public function c_get_search_results(){

        $s=get_search_query();
        
        $s = $_GET['query'];

        $args = array( 's' => $s );
        
        error_log('args:' . print_r($args,true));

        // The Query
        $wp_query = new \WP_Query( $args );
        $results = "";
        $counter = 1;
        if ( $wp_query->have_posts() ) {
                $results .= "<table class=\"table table-condense table-hover\">";
                foreach($wp_query->posts as $post) {
                    $results .= '<tr><td><h3>'.$counter.'. <a href="' . get_the_permalink($post->ID) . '"">' . get_the_title($post->ID) . ' :' . '</a></h3>';
                    $results .= '<div class="extract"><p>'.get_the_excerpt($post->ID).'</p></div></td></tr>';
                    $counter++;
                }
                $results .= "</table>";
            }else{
                $results .= '<div class="alert alert-info"><p>Sorry, but nothing matched your search criteria. Please try again with some different keywords.</p></div>';
        }
        return $results;
    }

    public function c_pagination_bar() {
        global $wp_query;
     
        $total_pages = $wp_query->max_num_pages;

        $list = "";
        if ($total_pages > 1){
            $current_page = max(1, get_query_var('paged'));
     
            $list .= "<li>" . paginate_links(array(
                'base' => get_pagenum_link(1) . '%_%',
                'format' => '/page/%#%',
                'current' => $current_page,
                'total' => $total_pages,
            )) . '</li>';
        }
        return $list;
    }

    /*
        Returns posts
    */
    public function c_get_posts($atts){
        global $wp_query;
        $p_query = array(
            'post_type'     => $atts['type'],
            'orderby'       => 'date',
            'order'         => 'DESC'
        );
        if( !empty($atts['size'])){ 
            $p_query['numberposts'] = $atts['size'];
        }
        if( !empty($atts['ids'])){
            $p_query['post__in'] = explode(',', $atts['ids']);
        }
        $p_query = array_merge($p_query,$atts);

        $rev_posts = get_posts( $p_query );

        ob_start();
        foreach( $rev_posts as $project ){
            include(  get_template_directory() . '/templates/'. $atts['tpl'] .'.php' );
        } 

        return ob_get_clean();

    }

    /*
        Renders an image tag by it's ID
    */
    public function c_shortcode_render_image($args){
        if( empty($args['size']) ){
            $src = wp_get_attachment_image_src( $args['id'], 'full' );
        }else{
            $src = wp_get_attachment_image_src( $args['id'], $args['size'] );
        }
        $srcset = wp_get_attachment_image_srcset( $args['id'], array( 400, 200 ) );
        $sizes = wp_get_attachment_image_sizes( $args['id'], array( 400, 200 ) );
        return '<img class="lazy '.$args['class'].'" srcset="'.$srcset.'" data-src="'.$src[0].'" alt="" />';
    }

    public function cdt_post_locale(){
        $lang = ICL_LANGUAGE_CODE;
        $langs = icl_get_languages( 'skip_missing=0' );
        if( isset( $langs[$lang]['default_locale'] ) ) {
            return $langs[$lang]['default_locale'];
        }
        return "en_US";
    }

    public function my_custom_admin_css() {
        echo '<style>
        .acf-fc-layout-handle{
            color: white!important;
            background-color: #0073aa;
        }
        </style>';
    }

    public function cdt_post_languages($args){
        $lswitch = "";
        $languages = icl_get_languages('skip_missing=1');
        if(1 < count($languages)){
            $lswitch = '<ul class="'.$args['ulclass'].'">';
            foreach($languages as $l){
                if( $l['active'] == 1 ){
                    $lswitch .=  '<li class="c-active"><a href="'.$l['url'].'">'.$l['code'].'</a></li>';
                }else{
                    $lswitch .=  '<li><a href="'.$l['url'].'">'.$l['code'].'</a></li>';
                }

            }
            $lswitch .= '</ul>';
        }
        return $lswitch;
    }
}

// Trigger initialization
General::instance();