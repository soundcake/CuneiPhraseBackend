<?php
/**
 * Created by PhpStorm.
 * User: josh
 * Date: 10/03/18
 * Time: 15:21
 */
?>

<?php
/**
 * @var $servername
 * @var $username
 * @var $password
 * @var $dbname
 */
extract(parse_ini_file('config.ini'));

$currentPageUrl = '';
if (isset($_GET['url'])) {
    $currentPageUrl = $_GET['url'];
}


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

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

<?php if ($currentPageUrl && strlen($currentPageUrl) > 0): ?>
    <p>You are on page <?php echo $currentPageUrl; ?></p>
<?php else: ?>
    <p>Can't find your page</p>
<?php endif; ?>

<hr/>

<?php
if ($currentPageUrl && strlen($currentPageUrl) > 0) {
    $sql = "
SELECT 
web_page.link AS web_page,
academic_paper.paper,
page_to_paper.link_context,
page_to_paper.reason 
FROM academic_paper
INNER JOIN page_to_paper
ON academic_paper.id = page_to_paper.academic_paper_id
INNER JOIN web_page 
ON web_page.id = page_to_paper.web_page_id
WHERE web_page.link = $currentPageUrl";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo '<p>Our users submitted the following scientific papers related to this article:</p>';
        echo '<ul>';
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            echo var_dump($row);

            //echo "id: " . $row["id"] . " - Name: " . $row["firstname"] . " " . $row["lastname"] . "<br>";
            echo '<li>';
            echo '<a href="' . $row['paper'] . '" targe="_blank">' . $row['paper'] . '</a>';
            echo '</li>';
        }
        echo '</ul>';
    } else {
        echo '<p>No user-submitted scientific papers found for this.</p > ';
    }
    $conn->close();
}
?>

</body>
</html>


