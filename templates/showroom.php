<!-- showroom -->
<div class="c-showroom">
    
    <!-- slide-->
    <div class="c-container-medium">
        <?php foreach( $showroom_elements as $showroom_element ): ?>
            <div class="c-row c-row-reverse c-row-align-center">
                <div class="c-col-6 c-showroom-img animation-element fade-up">
                    <figure class="c-ratiobox c-ratiobox-1by1 c-img-circle text">
                        <?php $srcset = wp_get_attachment_image_srcset( get_post_thumbnail_id($showroom_element->ID), array( 400, 200 ) ); ?>
                        <img class="lazy" data-src="<?= get_the_post_thumbnail_url( $showroom_element->ID, 'full'); ?>" srcset="<?php echo esc_attr( $srcset ); ?>">
                    </figure>
                </div>
                <div class="c-col-6 c-showroom-text animation-element fade-up">
                    <div class="text">
                        <h1><?= $showroom_element->post_title; ?></h1>
                        <?= $showroom_element->post_content; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <!-- end slide-->
</div>