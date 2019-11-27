<?php
$cdt_images = count($site_element['cdt_elements_images_list']);

if( $cdt_images == 1 ): ?>
    <!-- img only -->
    <?php $srcset = wp_get_attachment_image_srcset( $site_element['cdt_elements_images_list'][0]['ID'], array( 400, 200 ) ); ?>
    <div class="c-container-medium c-img-only animation-element fade-up">
        <figure class="text">
            <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $site_element['cdt_elements_images_list'][0]['url']; ?>" alt="" />
        </figure>
    </div>
<?php elseif( $cdt_images == 2 ): ?>
    <!-- img 2 col-->
    <div class="c-container c-img-2col">
        <div class="c-row">
            <div class="c-col-8 animation-element fade-up">
                <figure class="text">
                    <?php $srcset = wp_get_attachment_image_srcset( $site_element['cdt_elements_images_list'][0]['ID'], array( 400, 200 ) ); ?>
                    <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $site_element['cdt_elements_images_list'][0]['url']; ?>" alt="" />
                </figure>   
            </div>
        </div>  
        <div class="c-row c-row-justify-right">
            <div class="c-col-8 c-img-2col-alignment animation-element fade-up">
                <figure class="c-img-2col-border text">
                    <?php $srcset = wp_get_attachment_image_srcset( $site_element['cdt_elements_images_list'][1]['ID'], array( 400, 200 ) ); ?>
                    <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $site_element['cdt_elements_images_list'][1]['url']; ?>" alt="" />
                </figure>   
            </div>
        </div>
    </div>
<?php elseif( $cdt_images == 3 ): ?>

    <!-- img 3 col-->
    <div class="c-container-medium c-img-3col">
        <div class="c-row c-row1 c-row-justify-between">
            <div class="c-col-5 animation-element fade-up">
                <figure class="text">
                    <?php $srcset = wp_get_attachment_image_srcset( $site_element['cdt_elements_images_list'][0]['ID'], array( 400, 200 ) ); ?>
                    <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $site_element['cdt_elements_images_list'][0]['url']; ?>" alt="" />             
                </figure>   
            </div>
            <div class="c-col-6 c-img-3col-alignment1 animation-element fade-up">
                <figure class="text">
                    <?php $srcset = wp_get_attachment_image_srcset( $site_element['cdt_elements_images_list'][1]['ID'], array( 400, 200 ) ); ?>
                    <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $site_element['cdt_elements_images_list'][1]['url']; ?>" alt="" />
                </figure>   
            </div>
        </div>
        <div class="c-row c-row2">
            <div class="c-col-6 c-col-offset-4 c-img-3col-alignment2 animation-element fade-up">
                <figure class="c-img-3col-border text">
                    <?php $srcset = wp_get_attachment_image_srcset( $site_element['cdt_elements_images_list'][2]['ID'], array( 400, 200 ) ); ?>
                    <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $site_element['cdt_elements_images_list'][2]['url']; ?>" alt="" />                
                </figure>   
            </div>
        </div>
    </div>
<?php endif; ?>