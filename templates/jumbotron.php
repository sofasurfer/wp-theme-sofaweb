<div class="page-header jumbotron"  >
    <div class="container">
        <h1><?= get_the_title(); ?></h1>

        <?php if( get_post_type() != 'post' ): ?>
            <div class="lead"><?= get_the_excerpt(); ?></div> 
        <?php else: ?>
            <div class="blogmeta subnav">
                <p>Posted: <?= get_the_date();?>
                <span class="tags">&nbsp;|             <?php
                  $htmltags = array();
                  foreach(get_the_category() as $cat){
                    array_push($htmltags, '<a href="/'.$cat->taxonomy.'/'.$cat->slug.'/">'.$cat->name.'</a> ');
                  }
                ?>
                Tags: <?php echo implode(',', $htmltags); ?></span>
                </p>
            </div>
            <div class="lead"><?= get_the_excerpt();?></div>
            <div class="">
                <span style="font-size:58px;">
                <a href="/relax/?video=sky2-bg.mp4">*</a>
                <a href="/relax/?video=dolphin-bg.mp4">*</a>
                <a href="/relax/?video=forest-bg.mp4">*</a>
                </span>
            </div>           
        <?php endif; ?>      
    </div>
</div>