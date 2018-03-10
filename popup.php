<?php
/**
 * Created by PhpStorm.
 * User: josh
 * Date: 10/03/18
 * Time: 15:21
 */
?>
<h1>CuneiPhrase</h1>

<?php if (isset($_GET['url'])):?>
    <h2>You are on page <?php echo $_GET['url'];?></h2>
<?php else:?>
    <h2>Can't find your page</h2>
<?php endif;?>



