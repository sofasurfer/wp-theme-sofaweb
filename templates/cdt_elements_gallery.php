<!-- slider img -->
<div class="c-container-wide c-slider-img">
    <!-- class mediaslider-start am anfang einfügen für abstand links-->
    <div class="mediaslider mediaslider-start">  
        <div class="c-row">
            <div class="slider">
                <ul id="f-siema-gallery" class="slider-items <?= $site_element['cdt_elements_gallery_size']; ?>">
                <?php foreach( $site_element['cdt_elements_gallery_images'] as $mediaslide ): ?>
                    <li>
                    <?php if( $mediaslide['type'] == 'video' ): ?>
                        <div class="embed-video">
                            <div class="video-play">PLAY</div>
                            <video muted <?= get_video_poster($mediaslide['ID']) ; ?>>
                                <source src="<?= $mediaslide['url']; ?>" type="video/mp4" />
                            </video>
                        </div>
                    <?php elseif( $mediaslide['type'] == 'image' ): ?>
                            <figure>
                                <?php $srcset = wp_get_attachment_image_srcset( $mediaslide['ID'], array( 400, 200 ) ); ?>
                                <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $mediaslide['url']; ?>" alt="" />
                            </figure>
                    <?php endif; ?>
                    </li>
                <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </div>
    <!-- slider control-->
    <div class="c-container c-slider-img-control <?= $site_element['cdt_elements_gallery_size']; ?>">
        <div class="c-row c-row-justify-right">
            <div class="c-col-10 c-slider-control-inner">
                <div id="f-slider-gallery-status" class="c-text-small">1 / 6</div>
                <div class="slider-paging">
                    <!-- disabled style: plus slider-paging-disabled-->
                    <span id="f-siema-gallery-paging-left" class="slider-paging-left slider-paging-disabled"></span>
                    <span id="f-siema-gallery-paging-right" class="slider-paging-right"></span>
                </div>
            </div>
        </div>
    </div>
</div>  