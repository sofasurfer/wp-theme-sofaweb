<?php

$c_classes = array('c-container-wide');
if( $site_element['cdt_elements_imagetext_background'] == 'gray' ){
    array_push($c_classes, 'c-bg-light');
    array_push($c_classes, 'c-color-change-top');
}
if( $site_element['cdt_elements_imagetext_paddingbottom'] == 'yes' ){
    array_push($c_classes, 'c-color-change-bottom');
}

$c_container_class = 'c-text-img-2col-left';
if( $site_element['cdt_elements_imagetext_imageposition'] == 'right' ){
    $c_container_class = 'c-text-img-2col-right';
}
$srcset = wp_get_attachment_image_srcset( $site_element['cdt_elements_imagetext_image']['ID'], array( 400, 200 ) );

?>

<!-- bg light grey , class color change für abstand oben, color-change-bottom für margin nach unten-->
<div class="c-container-wide <?= implode(' ', $c_classes); ?> ">
    <!-- text img / img left-->
    <div class="c-container c-text-img-2col <?= $c_container_class; ?>">
        <div class="c-row c-row-justify-between c-row-align-center">
            <?php if( $site_element['cdt_elements_imagetext_imageposition'] == 'left' ): ?>
            <div class="c-col-5  animation-element fade-up">
                <figure class="text">
                    <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $site_element['cdt_elements_imagetext_image']['url']; ?>" alt="" />
                </figure>
            </div>
            <div class="c-col-6 c-text-block animation-element fade-up">
                <div class="text"><?= $site_element['cdt_elements_imagetext_text']; ?></div>           
            </div>
            <?php else: ?>
            <div class="c-col-6 c-text-block animation-element fade-up">
                <div class="text"><?= $site_element['cdt_elements_imagetext_text']; ?></div>                 
            </div>
            <div class="c-col-5 animation-element fade-up">
                <figure class="text">
                    <img class="lazy" srcset="<?php echo esc_attr( $srcset ); ?>" data-src="<?= $site_element['cdt_elements_imagetext_image']['url']; ?>" alt="" />
                </figure>
            </div>
            <?php endif; ?>
        </div>
    </div>
</div>