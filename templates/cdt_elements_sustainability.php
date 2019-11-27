<!-- bg light grey , class color change für abstand oben, color-change-bottom für margin nach unten-->
<div class="c-container-wide c-bg-light c-color-change-top <?= ($site_element['cdt_elements_sustainability_paddingbottom'] === 'yes') ? 'c-color-change-bottom' : ''; ?>">
    <!-- text only, zusätzliche classes für zentrierung: c-row-justify-center, c-text-center -->
    <div class="c-container c-text-only">
        <div class="c-row c-row-justify-center">
            <div class="c-col-8 c-text-block c-text-center">
                <h2><?= $site_element['cdt_elements_sustainability_title']; ?></h2>
                <?= $site_element['cdt_elements_sustainability_text']; ?>
            </div>
        </div>
    </div>  
    <?php
    $cdt_count = 0;
    ?>
    <?php foreach( $site_element['cdt_elements_sustainability_items'] as $cdt_sustainability ): ?>
        <?php $srcset = wp_get_attachment_image_srcset( $cdt_sustainability['cdt_elements_sustainability_items_image']['ID'], array( 400, 200 ) ); ?>
        <?php if( $cdt_count % 2 == 0 ): ?>           
        <!-- text circle img, bild links-->
        <div class="c-container c-text-img-circle">
            <div class="c-row c-row-align-center c-row-justify-right">
                <div class="c-col-4  animation-element fade-up">
                    <figure class="c-ratiobox c-ratiobox-1by1 c-img-circle text">
                        <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $cdt_sustainability['cdt_elements_sustainability_items_image']['url']; ?>" alt="" />
                    </figure>
                </div>
                <div class="c-col-7  animation-element fade-up">
                    <div class="c-teaser-circle-text c-text-block text">
                        <h3><?= $cdt_sustainability['cdt_elements_sustainability_items_title']; ?></h3>
                        <p><?= $cdt_sustainability['cdt_elements_sustainability_items_text']; ?></p>
                    </div>
                </div>
            </div>
        </div>
        <?php else: ?>
        <!-- text circle img, bild rechts -->
        <div class="c-container c-text-img-circle">
            <div class="c-row c-row-align-center c-row-reverse c-row-justify-right">
                <div class="c-col-4 animation-element fade-up">
                    <figure class="c-ratiobox c-ratiobox-1by1 c-img-circle text">
                        <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $cdt_sustainability['cdt_elements_sustainability_items_image']['url']; ?>" alt="" />
                    </figure>
                </div>
                <div class="c-col-7 animation-element fade-up">
                    <div class="c-teaser-circle-text c-text-block text">
                        <h3><?= $cdt_sustainability['cdt_elements_sustainability_items_title']; ?></h3>
                        <p><?= $cdt_sustainability['cdt_elements_sustainability_items_text']; ?></p>
                    </div>
                </div>
            </div>
        </div>
        <?php endif; ?>
        <?php $cdt_count++; ?>
    <?php endforeach; ?>                
</div>