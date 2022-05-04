<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="index, follow">


    <?php
    $og_info = apply_filters('c_get_ogobj','');
    ?>
    <title><?php wp_title( '|', true, 'right' ); ?><?= get_bloginfo(); ?></title>
    <meta name="author" content="sofasurfer">
    <meta name="description" content="<?= $og_info['description']; ?>">



    <meta property="og:type" content="article"/>
    <meta property="og:title" content="<?= $og_info['title']; ?>"/>
    <meta property="og:description" content="<?= $og_info['description']; ?>"/>
    <?php if(!empty($og_info['image']) ): ?>
    <meta property="og:image" content="<?= $og_info['image'][0]; ?>"/>
    <meta property="og:image:width" content="<?= $og_info['image'][1]; ?>" />
    <meta property="og:image:height" content="<?= $og_info['image'][2]; ?>" />
    <?php endif; ?>

    <!-- Preventing IE11 to request by default the /browserconfig.xml more than one time -->
    <meta name="msapplication-config" content="none">
    <!-- Disable touch highlighting in IE -->
    <meta name="msapplication-tap-highlight" content="no">
    <!-- Ensure edge compatibility in IE (HTTP header can be set in web server config) -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
    <!-- Force viewport width and pixel density. Plus, disable shrinking. -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Disable Skype browser-plugin -->
    <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE">

    <link rel="canonical" href="<?= get_site_url(); ?>" />
    <base href="<?= get_site_url(); ?>" id="site_url" />
    
    <link rel="stylesheet" href="<?= get_stylesheet_directory_uri(); ?>/dist/assets/css/main.1.min.css?v=<?= do_shortcode('[wp_version]') ;?>" />
    <script type="text/javascript">
        var timerStart = Date.now();
    </script>    
</head>
<body class="<?= get_post_type();?>">
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

            <a class="navbar-brand" href="/" title="SofaSurfer">SofaSurfer</a>
            
        </div>
            
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">


            <?php wp_nav_menu( 
                array( 
                    'theme_location'    => 'header-menu',
                    'container'         => false,
                    'menu_class'        => 'nav navbar-nav',
                )
            ); ?>
            <form class="navbar-form navbar-right" role="search" action="search/" method="get">
                <div class="input-group">
                  <input type="text" autocomplete="off" id="site-search" class="form-control" placeholder="seek..." autocomplete="on" name="query" value="" >
<!--                   <span class="input-group-btn">
                    <button class="btn btn-default" type="submit">Go!</button>
                  </span> -->
                </div>
                <input type="hidden" name="id" value="336" />
            </form>

        </div>
    </div>
</nav>

