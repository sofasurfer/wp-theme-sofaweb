<?php
$cdt_count = 0;
?>
<?php foreach( $site_element['cdt_elements_teaserlist_teaser'] as $cdt_teaser ): ?>
    
    <?php
        $cdt_brand = get_field('cdt_teaser_logo', $cdt_teaser->ID);
        $cdt_date = get_field('cdt_teaser_date', $cdt_teaser->ID);
        $cdt_cta_text = get_field('cdt_teaser_cta_text', $cdt_teaser->ID);
        $cdt_cta_link = get_field('cdt_teaser_cta_link', $cdt_teaser->ID);
        $cdt_title = get_field('cdt_teaser_title', $cdt_teaser->ID);
        $cdt_srcset = wp_get_attachment_image_srcset( get_post_thumbnail_id($cdt_teaser->ID), array( 400, 200 ) );
        if( empty($cdt_title) ){
            $cdt_title = $cdt_teaser->post_title;
        }
    ?>

    <?php if( $cdt_count % 2 == 0 ): ?>
    <!-- teaser single circle, row-reverse für variante bild rechts -->
    <div class="c-container-medium c-teaser-circle">
        <div class="c-row c-row-reverse c-row-align-center">
            <div class="c-col-5 animation-element fade-up">
                <figure class="c-ratiobox c-ratiobox-1by1 c-img-circle text">
                    <img class="lazy" srcset="<?php echo esc_attr( $cdt_srcset ); ?>" data-src="<?= get_the_post_thumbnail_url( $cdt_teaser->ID, 'full'); ?>" alt="" />
                </figure>
            </div>
            <div class="c-col-7 animation-element fade-up">
                <div class="c-teaser-circle-text c-text-block text">
                    <h2><?= $cdt_title; ?></h2>
                    <p><?= $cdt_teaser->post_content; ?></p>
                    <?php if( !empty($cdt_cta_link) ): ?>
                    <a class="c-link-arrow" href="<?= $cdt_cta_link; ?>"><?= $cdt_cta_text; ?></a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <?php else: ?>
    <!-- teaser single circle, bild links, variante event vorschau -->
    <div class="c-container-medium c-teaser-circle">
        <div class="c-row c-row-align-center">
            <div class="c-col-5 animation-element fade-up">
                <figure class="c-ratiobox c-ratiobox-1by1 c-img-circle text">
                    <img class="lazy" srcset="<?php echo esc_attr( $cdt_srcset ); ?>" data-src="<?= get_the_post_thumbnail_url( $cdt_teaser->ID, 'full'); ?>" alt="" />
                </figure>
            </div>
            <div class="c-col-7 animation-element fade-up">
                <div class="c-teaser-circle-text c-text-block text">
                    <?php if( !empty($cdt_date) ): ?>
                        <span class="c-date"><?= $cdt_date;?></span>
                    <?php endif; ?>
                    <h2><?= $cdt_teaser->post_title; ?></h2>
                    <p><?= $cdt_teaser->post_content; ?></p>
                    <?php if( !empty($cdt_cta_link) ): ?>
                    <a class="c-link-arrow" href="<?= $cdt_cta_link; ?>"><?= $cdt_cta_text; ?></a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>
    <?php $cdt_count++; ?>
<?php endforeach; ?>