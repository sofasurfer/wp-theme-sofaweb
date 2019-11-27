    </main>

    <!-- footer-->
    <footer class="c-footer" role="contentinfo">
        <div class="c-container-medium c-footer-main">
            <div class="c-row">
                <div class="c-col-3">
                    <figure class="c-footer-logo">
                        <a href="<?php echo get_home_url(); ?>"><img src="<?= get_stylesheet_directory_uri(); ?>/dist/assets/images/citedutemps-logo-light.svg" alt="Cité du temps" /></a>
                    </figure>   
                </div>
                <div class="c-col-5 c-footer-address c-text-light c-showroom-text">
                    <?= do_shortcode('[contactinfo]'); ?>
                </div>
                <div class="c-col-4 c-text-light">
                    <?= get_field('cdt_options_jobs', 'option'); ?>
                </div>
            </div>
        </div>
        <div class="c-container-wide c-footer-disclaimer">
            <div class="c-container-medium">
                <div class="c-row c-row-reverse">
                    <div class="c-col-6 c-text-right">

                        <?php wp_nav_menu( 
                            array( 
                                'theme_location'    => 'footer-menu',
                                'container'         => false,
                                'menu_class'        => 'c-footer-disclaimer-list',
                            )
                        ); ?>

                    </div>
                    <div class="c-col-6">
                        &copy; <?= __('2019 Cité du Temps SA', 'cite-du-temps'); ?>
                    </div>                  

                </div>
            </div>
        </div>
    </footer>

   <div class="cookie-notice c-text-small c-text-light" id="cookie-notice">
       <div class="c-open-circle-inner">
            <div class="c-open-circle-text">
                <?= get_field('cdt_options_cookienotice', 'option'); ?>
            </div>
        </div>
    </div>
    <script type="text/javascript">
    var templateUrl = '<?= get_bloginfo("template_url"); ?>';
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.0.0/dist/lazyload.min.js"></script>
    <script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
    <script src="<?= get_stylesheet_directory_uri(); ?>/dist/assets/js/minimal.1.min.js?v=<?= do_shortcode('[wp_version]') ;?>"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCiRdwZdvC8are3PWqcCcDqpwsk2buF1cw&callback=initMap&libraries=places&language=<?= ICL_LANGUAGE_CODE;?>&region=CH" async defer></script>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-141196758-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-141196758-1');
    </script>
</body>
</html>