<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="index, follow">

    <title><?php wp_title( '|', true, 'right' ); ?><?= get_bloginfo(); ?></title>
    <meta name="description" content="Welcome to SofaSurfer the place for digital related problem solving and IT-development since 1999." /> 
    <meta name="author" content="sofasurfer" />
    <link rel="canonical" href="https://www.sofasurfer.org/" />
    
   
    <base href="https://www.sofasurfer.org/" id="site_url" />
    
    <link rel="stylesheet" href="<?= get_stylesheet_directory_uri(); ?>/dist/assets/css/main.1.min.css?v=<?= do_shortcode('[wp_version]') ;?>" />
    <script type="text/javascript">
        var timerStart = Date.now();
    </script>    
</head>
<body class="">
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>

            <a class="navbar-brand" href="https://www.sofasurfer.org/" title="SofaSurfer">SofaSurfer</a>
            
        </div>
            
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav"><li class=" first"><a href="work/" title="Work / Portfolio"  ><i class=" fa fa-briefcase  icon-white"></i> Work</a></li>
<li class=" "><a href="blog/" title="Blog"  ><i class=" fa fa-book  icon-white"></i> Blog</a></li>
<li class=" "><a href="about-me/" title="About me"  ><i class=" fa fa-envelope  icon-white"></i> About</a></li>
<li class="">
    <a href="profile/" title="Login Page">
        <i class="fa fa-sign-in"></i> Login
    </a>
</li>


</ul><form class="navbar-form navbar-right" role="search" action="site-search/" method="get">
    <div class="input-group">
      <input type="text" id="site-search" class="form-control" placeholder="Search for..." autocomplete="on" name="query" value="" >
      <span class="input-group-btn">
        <button class="btn btn-default" type="submit">Go!</button>
      </span>
    </div>
    <input type="hidden" name="id" value="336" />
</form>
<ul>
</ul>
        </div>
    </div>
</nav>




<!DOCTYPE html>
<html  <?php language_attributes(); ?> >
    <head>
        <meta charset="utf-8">
        <title><?php wp_title( '|', true, 'right' ); ?><?= get_bloginfo(); ?></title>
        <meta name="author" content="cubegrafik GmbH">
        <meta name="description" content="<?= get_field('cdt_metadescription'); ?>">

        
        <meta property="og:locale" content="<?= do_shortcode('[cdt_post_locale]'); ?>"/>
        <meta property="og:type" content="article"/>
        <meta property="og:title" content="<?php wp_title( '|', true, 'right' ); ?><?= get_bloginfo(); ?>"/>
        <meta property="og:description" content="<?= get_field('cdt_metadescription'); ?>"/>
        <meta property="og:image" content="<?= the_post_thumbnail_url('large'); ?>"/>
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />


        <!-- Preventing IE11 to request by default the /browserconfig.xml more than one time -->
        <meta name="msapplication-config" content="none" />
        <!-- Disable touch highlighting in IE -->
        <meta name="msapplication-tap-highlight" content="no" />
        <!-- Ensure edge compatibility in IE (HTTP header can be set in web server config) -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <!-- Force viewport width and pixel density. Plus, disable shrinking. -->
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <!-- Disable Skype browser-plugin -->
        <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />

        <link rel="apple-touch-icon" sizes="180x180" href="<?= get_stylesheet_directory_uri(); ?>/dist/assets/images/ico/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="<?= get_stylesheet_directory_uri(); ?>/dist/assets/images/ico/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="<?= get_stylesheet_directory_uri(); ?>/dist/assets/images/ico/favicon-16x16.png" />
        <link rel="manifest" href="<?= get_stylesheet_directory_uri(); ?>/dist/assets/images/ico/site.webmanifest" />
        <link rel="mask-icon" href="<?= get_stylesheet_directory_uri(); ?>/dist/assets/images/ico/safari-pinned-tab.svg" color="#7a7c81" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        <!-- google font-->
        <link rel="stylesheet" href="<?= get_stylesheet_directory_uri(); ?>/dist/assets/css/main.1.min.css?v=<?= do_shortcode('[wp_version]') ;?>" />

    </head>
    <body>
        
        <!-- offcanvas dialog-->
        <input type="checkbox" id="c-offcanvas" />
        
        <!-- header, class c-header-sticky hinzufügen für styling sticky header -->
        <header class="c-header" role="banner">
            <!-- meta-->
            <div class="c-container-wide c-bg-light c-header-meta">
                <div class="c-container-medium c-text-right">

                    <?= do_shortcode('[cdt_post_languages ulclass="c-lang-list" ]'); ?>
                    <ul class="c-meta-list">
                        <li><a target="_blank" href="<?= get_field('cdt_options_career_url', 'option'); ?>"><?= __('Jobs', 'cite-du-temps'); ?></a></li>
                    </ul>
                </div>  
            </div>
            <!-- main-->
            <div class="c-container-medium c-header-main">
                <div class="c-header-logo">
                    <a href="<?php echo get_home_url(); ?>"><img src="<?= get_stylesheet_directory_uri(); ?>/dist/assets/images/citedutemps-logo.svg" alt="Cité du temps" /></a>
                </div>
                <nav class="c-nav-main">
                    <!-- The WordPress Menu goes here -->
                    <?php wp_nav_menu( 
                        array( 
                            'theme_location'    => 'header-menu',
                            'container'         => false,
                            'menu_class'        => 'c-nav-main-list',
                        )
                    ); ?>                
                </nav>
            </div>
            <!-- offcanvas trigger-->
            <label for="c-offcanvas" class="c-offcanvas-trigger">
                <span></span>
                <span></span>
                <span></span>
            </label>
            
            <!-- offcanvas nav-->
            <nav class="c-container-wide c-offcanvas-nav">
                <div class="c-container c-offcanvas-lang">
                    <?= do_shortcode('[cdt_post_languages ulclass="c-offcanvas-lang-list" ]'); ?>
                    <ul class="c-offcanvas-meta-list">
                        <li><a target="_blank" href="<?= get_field('cdt_options_career_url', 'option'); ?>"><?= __('Jobs', 'cite-du-temps'); ?></a></li>
                    </ul>
                </div>
                <div class="c-container">
                    <!-- The WordPress Menu goes here -->
                    <?php wp_nav_menu( 
                        array( 
                            'theme_location'    => 'header-menu',
                            'container'         => false,
                            'menu_class'        => 'c-offcanvas-nav-list',
                        )
                    ); ?>                      
                </div>
            </nav>
        </header>

        <!-- content-->
        <main class="c-content" role="main">