<!-- bg dark grey , class color change für abstand oben-->
<div class="c-container-wide c-bg-dark c-text-light c-color-change-top <?= ($site_element['cdt_elements_facts_paddingbottom'] === 'yes') ? 'c-color-change-bottom' : ''; ?>">
    <!-- text only -->
    <div class="c-container c-text-only">
        <div class="c-row c-row-justify-center">
            <div class="c-col-8 c-text-block c-text-center">
                <h2><?= $site_element['cdt_elements_facts_title']; ?></h2>
            </div>
        </div>
    </div>

    <!-- slider facts-->
    <div class="c-container c-facts">
        <div class="c-row">
            <div id="f-siema-facts" class="c-col-12">
            <!-- <div class="c-slider-item"> -->
            <?php foreach( $site_element['cdt_elements_facts_items'] as $f_item):  ?>
                <!-- facts item-->
                <div class="c-facts-item animation-element fade-up">
                    <div class="c-facts-img text">
                        <figure class="c-ratiobox c-ratiobox-1by1 c-img-circle">
                            <?php $srcset = wp_get_attachment_image_srcset( $f_item['cdt_elements_facts_items_image']['ID'], array( 400, 200 ) ); ?>
                            <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $f_item['cdt_elements_facts_items_image']['url']; ?>" alt="" />
                        </figure>
                    </div>
                    <div class="c-text-block c-text-center">
                        <?= $f_item['cdt_elements_facts_items_title']; ?>
                        <?= $f_item['cdt_elements_facts_items_text']; ?>
                    </div>
                </div>
            <?php endforeach; ?>
            </div>
            <!-- </div> -->
        </div>
        <!-- slider control-->
        <div class="c-row c-row-justify-right c-slider-facts-control">
            <div class="c-col-3 c-slider-control-inner">
                <div id="f-slider-facts-status" class="slider-status c-text-small">1 / 6</div>
                <div class="slider-paging">
                    <!-- disabled style: plus slider-paging-disabled-->
                    <span id="f-slider-facts-paging-left" class="slider-paging-left"></span>
                    <span id="f-slider-facts-paging-right" class="slider-paging-right"></span>
                </div>
            </div>
        </div>
    </div>
</div>
