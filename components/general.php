<?php

// Namespace declaration
namespace CiteDuTemps;

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
        add_action( 'init', [$this, 'cdt_register_maim_menu'] );
        add_action('admin_head', [$this, 'my_custom_admin_css']);
        add_shortcode( 'openinghours', [$this, 'cdt_shortcode_openinghours'] );
        add_shortcode( 'admission', [$this, 'cdt_shortcode_admission'] );
        add_shortcode( 'contactinfo', [$this, 'cdt_shortcode_contactinfo'] );
        add_shortcode( 'wp_version', [$this, 'c_shortcode_version'] );
        add_filter('nav_menu_css_class' , [$this, 'cdt_special_nav_class'] , 10 , 2);
        add_filter('acf/format_value/type=textarea', [$this, 'cdt_format_value'], 10, 3);
        add_filter('acf/fields/google_map/api', [$this, 'my_acf_google_map_api'] );
        add_filter('use_block_editor_for_post', '__return_false', 10);
        add_filter('use_block_editor_for_post_type', '__return_false', 10);

        add_shortcode( 'cdt_post_languages', [$this, 'cdt_post_languages'] );

        add_shortcode( 'cdt_post_locale', [$this, 'cdt_post_locale'] );

        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'menus' );

        load_theme_textdomain('cite-du-temps', get_stylesheet_directory() . '/lang');


        if( function_exists('acf_add_options_page') ) {
            acf_add_options_page();   
        }
    }

    public function cdt_init(){
        remove_post_type_support( 'page', 'editor' );
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

    public function cdt_shortcode_openinghours(){
        return get_field('cdt_options_openinghours', 'option');
    }

    public function cdt_shortcode_admission(){
        return get_field('cdt_options_admission', 'option');
    }

    public function cdt_shortcode_contactinfo(){
        return get_field('cdt_options_contactinfo', 'option');
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