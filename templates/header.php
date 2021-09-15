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

