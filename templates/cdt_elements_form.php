<!-- bg light grey , class color change für abstand oben-->
<div class="c-container-wide c-bg-light c-color-change-top <?= ($site_element['cdt_elements_form_element_paddingbottom'] === 'yes') ? 'c-color-change-bottom' : ''; ?>">
    <!-- form-->
    <div class="c-container c-form">
        <div class="c-row c-row-justify-center">
            <div class="c-col-10">
                <?= do_shortcode('[contact-form-7 id="'. $site_element['cdt_elements_form_element']->ID . '" title="Group Information"]'); ?>
            </div>
        </div>
    </div>
</div>