<div class="jumbotron"  >
    <div class="container">
        <h1><?= wp_title(); ?></h1>
        <div class="lead">
            <?php
                if(is_category()){
                    echo category_description();
                }else{
                    echo get_the_excerpt( get_queried_object_id() );
                }
             ?>
        </div>       
    </div>
</div>
<div id="container" class="container">
<div class="row tags">
    <div class="col-md-12">
        <ul class="nav tagList">
            <?php wp_list_categories( array('title_li'=>'','show_count'=>'true') ); ?>
        </ul>
    </div>
    <hr class="col-md-12">
</div>
<div class="row grid">
