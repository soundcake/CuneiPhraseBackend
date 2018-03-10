<?php
/**
 * Created by PhpStorm.
 * User: josh
 * Date: 10/03/18
 * Time: 15:21
 */
?>
<html>
<head>
    <style>
        body {
            font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;
        }
    </style>
</head>
<body>


<h1>CuneiPhrase</h1>

<?php if (isset($_GET['url'])): ?>
    <p>You are on page <?php echo $_GET['url']; ?></p>
<?php else: ?>
    <p>Can't find your page</p>
<?php endif; ?>

</body>
</html>


