<?php

// Namespace declaration
namespace CiteDuTemps;

use DirectoryIterator;

// Exit if accessed directly 
defined('ABSPATH') or die;


/**
 * PostTypes hooks
 */
class PostTypes {

    /**
     * The singleton instance of this class.
     * @var PostTypes
     */
    private static $instance;

    private $rewrites = [];

    /**
     * Gets the singleton instance of this class.
     * This instance is lazily instantiated if it does not already exist.
     * The given instance can be used to unregister from filter and action hooks.
     * 
     * @return PostTypes The singleton instance of this class.
     */
    public static function instance() {
        return self::$instance ?: (self::$instance = new self());
    }

    /**
     * Creates a new instance of this singleton.
     */
    private function __construct() {
        $this->include_post_types();
    }

    private function include_post_types() {
        $dir = new DirectoryIterator(dirname(__FILE__) . '/post-types/');
        foreach($dir as $fileinfo) {
            if($fileinfo->isDot() || $fileinfo->isDir() || !preg_match('/^([^\.].+?)\.php$/', $fileinfo->getFilename()))
                continue;
            require_once($fileinfo->getRealPath());
        }
    }

    public function register_post_type($name, $icon, $labels, $rewrite, $tags=false, $categories=false) {
        if($rewrite) {
            if(empty($this->rewrites)) {
                add_filter('option_rewrite_rules', [$this, 'rewrite'], 1);
                add_filter('post_type_link', [$this, 'link'], 1, 2);
            }
            $this->rewrites[$name] = $rewrite;
        }

        register_post_type(
            $name,
            [
                'labels' => $labels,
                'public' => true,
                'has_archive' => false,
                'show_ui' => true,
                'show_in_menu' => true,
                'taxonomies' => [],
                'menu_position' => 25,
                'menu_icon' => $icon,
                'capability_type' => $name,
                'map_meta_cap' => true,
                'capabilities' => [
                    // meta caps (don't assign these to roles)
                    'edit_post'              => 'edit_' . $name,
                    'read_post'              => 'read_' . $name,
                    'delete_post'            => 'delete_' . $name,

                    // primitive/meta caps
                    'create_posts'           => 'create_' . $name . 's',

                    // primitive caps used outside of map_meta_cap()
                    'edit_posts'             => 'edit_' . $name . 's',
                    'edit_others_posts'      => 'manage_' . $name . 's',
                    'publish_posts'          => 'manage_' . $name . 's',
                    'read_private_posts'     => 'read',

                    // primitive caps used inside of map_meta_cap()
                    'read'                   => 'read',
                    'delete_posts'           => 'manage_' . $name . 's',
                    'delete_private_posts'   => 'manage_' . $name . 's',
                    'delete_published_posts' => 'manage_' . $name . 's',
                    'delete_others_posts'    => 'manage_' . $name . 's',
                    'edit_private_posts'     => 'edit_' . $name . 's',
                    'edit_published_posts'   => 'edit_' . $name . 's'
                ],
                'rewrite' => [
                    'slug' => $name,
                    'with_front' => false,
                    'feeds' => false,
                    'pages' => false
                ],
                'supports' => ['title', 'excerpt', 'thumbnail', 'revisions', 'page-attributes', 'editor']
            ]
        );
        if($categories)
            register_taxonomy($name . '_category',
                $name,
                [
                    'hierarchical' => true,
                    'public' => true,
                    'publicly_queryable' => false,
                    'show_ui' => true,
                    'show_in_menu' => true,
                    'show_in_quick_edit' => true,
                    'rewrite' => false
                ]
            );
        if($tags)
            register_taxonomy($name . '_tag',
                $name,
                [
                    'hierarchical' => false,
                    'public' => true,
                    'publicly_queryable' => false,
                    'show_ui' => true,
                    'show_in_menu' => true,
                    'show_in_quick_edit' => true,
                    'rewrite' => false
                ]
            );
        foreach(['administrator', 'editor'] as $role) {
            $role = get_role($role);
            if(!empty($role) && !$role->has_cap('manage_' . $name . 's')) {
                $role->add_cap('manage_' . $name . 's');
                $role->add_cap('create_' . $name . 's');
                $role->add_cap('edit_' . $name . 's');
            }
        }
    }

    public function rewrite($rules) {
        if(!is_array($rules))
            return $rules;
        $modified = [];
        $search = [];
        $replace = [];
        $lang = @array_shift(explode('_', get_locale()));
        foreach($this->rewrites as $name => $rewrite) {
            $search[] = '/^' . $name . '\//';
            $rewrite = is_array($rewrite) ? (isset($rewrite[$lang]) ? $rewrite[$lang] : $rewrite['en']) : $rewrite;
            $replace[] = $rewrite . '/';
        }
        foreach($rules as $rule => $target) {
            $rule = preg_replace($search, $replace, $rule);
            $modified[$rule] = $target;
        }
        return $modified;
    }

    public function link($link, $post) {
        if(empty($this->rewrites[$post->post_type]))
            return $link;
        $lang = @array_shift(explode('_', get_locale()));
        if(function_exists('wpml_get_language_information')) {
            $info = wpml_get_language_information(null, $post->ID);
            $lang = $info['language_code'];
        }
        $rewrite = $this->rewrites[$post->post_type];
        $rewrite = is_array($rewrite) ? (isset($rewrite[$lang]) ? $rewrite[$lang] : $rewrite['en']) : $rewrite;
        return str_replace('/' . $post->post_type . '/', '/' . $rewrite . '/', $link);
    }

}

// Trigger initialization
PostTypes::instance();
