<?php

// Namespace declaration
namespace CiteDuTemps\PostType;

use CiteDuTemps\PostTypes;

// Exit if accessed directly 
defined('ABSPATH') or die;

class Header {

    private static $instance;

    public static function instance() {
        return self::$instance ?: (self::$instance = new self());
    }

    private function __construct() {
        add_action('init', [$this, 'register']);
    }

    public function register() {
        PostTypes::instance()->register_post_type('header', 'dashicons-star-filled', [
            'name' => 'Header',
            'singular_name' => 'Header',
            'menu_name' => 'Header',
            'all_items' => 'All Headers',
            'add_new' => 'Add Header',
            'add_new_item' => 'New Header',
            'edit_item' => 'Edit Header',
            'new_item' => 'New Header',
            'view_item' => 'Show Header',
            'search_items' => 'Search Header',
            'not_found' => 'Header has not been found.',
            'not_found_in_trash' => 'Header not found in the trash'
        ], [
            'de' => 'header'
        ], false, false);

        if(!function_exists("register_field_group"))
            return;
    }
}

Header::instance();