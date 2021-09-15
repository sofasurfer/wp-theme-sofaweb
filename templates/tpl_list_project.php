<div class="col-md-6 item-hover">
    <a class="" title="" href="<?= get_the_excerpt($project); ?>" target="_blank">
        <?= do_shortcode("[render_imagetag size=\"people\" class=\"img-rounded img-responsive\" id=\"".get_post_thumbnail_id($project)."\"]"); ?>
        <div class="caption item-hover-caption" style="display: none;">
        <h3><?= $project->post_title; ?></h3>
        <?= $project->post_content; ?>
        </div>  
    </a>
</div>