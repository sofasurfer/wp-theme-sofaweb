<?php
$iconname = "fa-briefcase";
switch ($project->post_name) {
    case 'about':
        $iconname = "fa-envelope";
        break;
    case 'blog':
        $iconname = "fa-book";
        break;
}

?>
<div class="col-md-4">
        <a class="" title="" href="<?= get_permalink($project); ?>">     
            <h3><i class=" fa <?=$iconname;?> "></i> <?= $project->post_title; ?></h3>
        </a>
        <div class="caption caption-fixed"><?= get_the_excerpt($project); ?></div>  
</div>