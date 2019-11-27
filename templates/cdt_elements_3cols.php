<!-- bg light grey , class color change für abstand oben-->
<div class="c-container-wide c-bg-light c-color-change-top <?= ($site_element['cdt_elements_3cols_paddingbottom'] === 'yes') ? 'c-color-change-bottom' : ''; ?>">
    <!-- text only, zusätzliche classes für zentrierung: c-row-justify-center, c-text-center -->
    <div class="c-container c-text-only">
        <div class="c-row c-row-justify-center">
            <div class="c-col-8 c-text-block c-text-center">
                <h2><?= $site_element['cdt_elements_3cols_title']; ?></h2>
                <?= $site_element['cdt_elements_3cols_text']; ?>
            </div>
        </div>
    </div>
    
    <!-- plan your visit  -->
    <div class="c-container-medium c-teaser-3col c-text-3col">
        <div class="c-row c-row-justify-center">
            <div class="c-col-4 animation-element fade-up">
                <div class="c-teaser-item c-box c-text-block text">
                    <?= $site_element['cdt_elements_3cols_col_1']; ?>
                </div>
            </div>
            <div class="c-col-4 animation-element fade-up">
                <div class="c-teaser-item c-box c-text-block text">
                    <?= $site_element['cdt_elements_3cols_col_2']; ?>
                </div>
            </div>
            <div class="c-col-4 animation-element fade-up">
                <div class="c-teaser-item c-box c-text-block text">
                    <?= $site_element['cdt_elements_3cols_col_3']; ?>
                </div>
            </div>
        </div>
    </div>
    <!-- text only, zusätzliche classes für zentrierung: c-row-justify-center, c-text-center -->
    <div class="c-container c-text-only">
        <div class="c-row c-row-justify-center">
            <div class="c-col-8 c-text-block c-text-center">
                <p><?= $site_element['cdt_elements_3cols_cta']; ?></p>
            </div>
        </div>
    </div>  
</div>

            