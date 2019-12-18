
<div class="post col-md-4 grid-item" id="[[+alias]]">
  <div class="thumbnail">
    <?php if(has_post_thumbnail()): ?>
    <figure>
      <a href="<?= get_permalink();?>" alt="[[+pagetitle]]" title="[[+pagetitle]]"><?= do_shortcode("[render_imagetag size=\"people\" class=\"img-responsive\" id=\"".get_post_thumbnail_id()."\"]"); ?></a>
    </figure>
    <?php endif; ?>
    <div class="content">
        <h2 class="title"><a href="<?= get_permalink();?>" alt="[[+pagetitle]]" title="[[+pagetitle]]"><?= get_the_title(); ?></a></h2>   
        <p class="post-info"><?= get_the_date();?></p>
        <div class="entry">
            <p><?= get_the_excerpt();?></p>
        </div>
        <div class="postmeta">
          <span class="tags">
            <?php
              $htmltags = array();
              foreach(get_the_category() as $cat){
                array_push($htmltags, '<a href="/'.$cat->taxonomy.'/'.$cat->slug.'/">'.$cat->name.'</a> ');
              }
            ?>
            Tags: <?php echo implode(',', $htmltags); ?>
        </span>         
          <span class="links">
            <a href="<?= get_permalink();?>" class="readmore btn btn-default">Read more</a>
          </span>
        </div>
    </div>
  </div>
</div>