            <!-- map-->
            <div class="c-container-wide c-map-container c-bg-light  <?= ($site_element['cdt_elements_map_paddingbottom'] === 'yes') ? 'c-color-change-bottom' : ''; ?>">
                <!-- directions panel-->
                <div class="c-directions-panel">
                    <!-- open / close link  button open standardmässig auf display none gesetzt, muss noch ein style gemacht werden, der den sichtbar macht, wo möchtest du die class setzen?-->
                    <button class="c-btn-directions-close c-icon c-ir"><?= __('Close Panel', 'cite-du-temps'); ?></button>
                    <button class="c-btn-directions-open c-icon c-ir"><?= __('Open Panel', 'cite-du-temps'); ?></button>
                    <!-- content-->
                    <h3><?= __('Get directions', 'cite-du-temps'); ?></h3>
                    <fieldset class="c-form-directions">
                        
                        <div class="c-form-item">
                            <ul class="c-direction-list">
                                <li>
                                    <input type="radio" checked="checked" name="travel-type" id="travel-mode-transit" title="Transit" value="TRANSIT">
                                    <label class="c-icon c-travel-icon c-travel-transit c-ir" for="travel-mode-transit" title="Transit"><?= __('Transit', 'cite-du-temps'); ?></label>
                                </li>
                                <li>
                                    <input type="radio" name="travel-type" id="travel-mode-drive" title="Drive" value="DRIVING">
                                    <label class="c-icon c-travel-icon c-travel-car c-ir" for="travel-mode-drive" title="Drive"><?= __('Drive', 'cite-du-temps'); ?></label>
                                </li>
                                <li>
                                    <input type="radio" name="travel-type" id="travel-mode-bicycle" title="Bicycle" value="BICYCLING">
                                    <label class="c-icon c-travel-icon c-travel-bike c-ir" for="travel-mode-bicycle" title="Bicycle"><?= __('Bicycle', 'cite-du-temps'); ?></label>
                                </li>
                                <li>
                                    <input type="radio" name="travel-type" id="travel-mode-walk" title="Walk" value="WALKING">
                                    <label class="c-icon c-travel-icon c-travel-walk c-ir" for="travel-mode-walk" title="Walk"><?= __('Walk', 'cite-du-temps'); ?></label>
                                </li>
                            </ul>
                        </div>
                        <div class="c-form-item">
                            <input class="c-form-text" type="text" id="c-map-location" name="first-location" placeholder="<?= __('Enter your current location', 'cite-du-temps'); ?>" />
                            <button id="c-map-search" class="c-icon c-btn-search c-ir"><?= __('Search', 'cite-du-temps'); ?></button>
                        </div>  
                    </fieldset>
                    <div class="c-directions-info">
                        <p id="c-map-distance" class="c-directions-distance"></p>
                        <p id="c-map-duration" class="c-directions-time"></p>
                    </div>
                    <div class="c-text-block">
                        <a id="c-map-direction" href="https://goo.gl/maps/3Z6PcwZTLjhrHdRUA" target="_blank"><?= __('View directions', 'cite-du-temps'); ?></a>
                    </div>
                </div>

                
                <!-- map-->
                <div id="c-map" class="c-map" 
                    data-apikey="AIzaSyCiRdwZdvC8are3PWqcCcDqpwsk2buF1cw" 
                    data-zoom="<?= $site_element['cdt_elements_map_zoom']; ?>" 
                    data-address="Nicolas G. Hayek Strasse 2, 2502 Biel/Bienne, Switzerland" 
                    data-lat="47.1440516" 
                    data-lng="7.260791899999958">
                </div>
                
            </div>
