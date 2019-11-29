<?php

// Namespace declaration
namespace SofaWeb\PostType;

use SofaWeb\PostTypes;

// Exit if accessed directly 
defined('ABSPATH') or die;

class Project {

    private static $instance;

    public static function instance() {
        return self::$instance ?: (self::$instance = new self());
    }

    private function __construct() {
        add_action('init', [$this, 'register']);
    }

    public function register() {
        PostTypes::instance()->register_post_type('project', 'dashicons-star-filled', [
            'name' => 'Project',
            'singular_name' => 'Project',
            'menu_name' => 'Project',
            'all_items' => 'All Projects',
            'add_new' => 'Add Project',
            'add_new_item' => 'New Project',
            'edit_item' => 'Edit Project',
            'new_item' => 'New Project',
            'view_item' => 'Show Project',
            'search_items' => 'Search Project',
            'not_found' => 'Project has not been found.',
            'not_found_in_trash' => 'Project not found in the trash'
        ], [
            'en' => 'project'
        ], false, false);

        if(!function_exists("register_field_group"))
            return;
    }
}

Project::instance();