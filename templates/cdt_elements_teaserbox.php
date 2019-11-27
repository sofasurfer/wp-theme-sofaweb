<?php

if( $site_element['cdt_elements_teaserbox_size'] == 'large' ){
    $ttag = "h2";
    $cdt_large = true;
    $cdt_cols_c1 = 'c-teaser-2col';
    $cdt_cols_c2 = 'c-col-6';
}else{
    $ttag = "h3";    
    $cdt_large = false;
    $cdt_cols_c1 = 'c-teaser-3col';
    $cdt_cols_c2 = 'c-col-4';    
}

$cdt_brands = array(
    'omega' => 'omega-logo.svg',
    'swatch' => 'swatch-logo.svg'
);
?>

<!-- bg light grey , class color change für abstand oben-->
<div class="c-container-wide c-bg-light c-color-change-top <?= ($site_element['cdt_elements_teaserbox_paddingbottom'] === 'yes') ? 'c-color-change-bottom' : ''; ?>">

    <div class="c-container-medium <?= $cdt_cols_c1; ?>">
        <div class="c-row c-row-justify-center">
        <?php foreach( $site_element['cdt_elements_teaserbox_teaser'] as $cdt_teaser ): ?>
        <?php
            $cdt_brand = get_field('cdt_teaser_logo', $cdt_teaser->ID);
            $cdt_cta_text = get_field('cdt_teaser_cta_text', $cdt_teaser->ID);
            $cdt_cta_link = get_field('cdt_teaser_cta_link', $cdt_teaser->ID);
            $cdt_title = get_field('cdt_teaser_title', $cdt_teaser->ID);
            $cdt_srcset = wp_get_attachment_image_srcset( get_post_thumbnail_id($cdt_teaser->ID), array( 400, 200 ) );
            if( empty($cdt_title) ){
                $cdt_title = $cdt_teaser->post_title;
            }            
        ?>
        <div class="<?= $cdt_cols_c2; ?> animation-element fade-up">
            <div class="c-teaser-item text">
                <?php if( $cdt_large && $cdt_brand ): ?>
                <figure class="c-teaser-logo">
                    <img class="lazy" data-src="<?= get_stylesheet_directory_uri(); ?>/dist/assets/images/<?= $cdt_brands[$cdt_brand]; ?>" alt="<?= $cdt_brand; ?>" />
                </figure>
                <?php endif; ?>                
                <figure class="c-teaser-img c-ratiobox c-ratiobox-16by9">
                    <img class="lazy" srcset="<?php echo esc_attr( $cdt_srcset ); ?>" data-src="<?= get_the_post_thumbnail_url( $cdt_teaser->ID, 'full'); ?>" alt="" />
                </figure>
                <div class="c-teaser-text c-text-block">
                    <<?=$ttag;?>><?= $cdt_title; ?></<?=$ttag;?>>   
                    <p><?= $cdt_teaser->post_content; ?></p>
                    <?php if( !empty($cdt_cta_link) ): ?>
                        <a class="c-link-arrow" href="<?= $cdt_cta_link; ?>"><?= $cdt_cta_text; ?></a>
                    <?php endif; ?> 
                </div>
            </div>
        </div>
        <?php endforeach; ?>
        </div>
    </div>
</div>