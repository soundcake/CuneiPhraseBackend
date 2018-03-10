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
            color: #000014;
            font-family: Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;
            max-width: 700px;
        }

        a {
            text-decoration: none;
            color: #4280f4;
        }

        a:hover {
            border-bottom: 1px dotted #4280f4;
        }

        hr {
            color: #CEFFFF;
            border-color: #CEFFFF;
        }

        #addFormContainer {
            border: 1px solid #CEFFFF;
            border-radius: 10px;
            width: 100%;
            clear: both;
            padding: 10px;
        }

        #addLinkForm {
            width: 100%;
            display: block;
            clear: both;
        }

        #addLinkForm label {
            width: 100%;
            float: left;
            clear: both;
            margin-top: 15px;
        }

        #addLinkForm input {
            width: 100%;
            float: left;
            clear: both;
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
academic_paper.link,
academic_paper.title,
page_to_paper.link_context,
page_to_paper.reason 
FROM academic_paper
INNER JOIN page_to_paper
ON academic_paper.id = page_to_paper.academic_paper_id
INNER JOIN web_page 
ON web_page.id = page_to_paper.web_page_id
WHERE web_page.link = '" . $currentPageUrl . "'";
    $result = $conn->query($sql);
    //echo var_dump($result);
    if ($result->num_rows > 0) {
        echo '<p>Our users submitted the following scientific papers related to this article:</p>';
        echo '<ul>';
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            //echo var_dump($row);

            //echo "id: " . $row["id"] . " - Name: " . $row["firstname"] . " " . $row["lastname"] . "<br>";
            echo '<li>';
            echo '<a href="' . $row['link'] . '" target="_blank">' . $row['title'] . '</a>';
            echo '</li>';
        }
        echo '</ul>';
        /*
        echo '<hr />';
        echo '<p>Search academic papers for more:</p>';
        echo '<div id="searchFormContainer">';
        echo '<form id="searchForm">';
        echo '<input type="hidden" value="' . $currentPageUrl . '" />';
        echo '<label for="search_field">Search</label>';
        echo '<input type="text" value="" name="paper_title" id="paper_title" />';
        echo '<label for="paper_link">Link</label>';
        echo '<input type="text" value="" name="paper_link" id="paper_link" />';
        echo '<button type="submit" id="submitFormButton">Search</button>';
        echo '</form>';
        echo '</div>';
        */

    } else {
        echo '<p>No user-submitted scientific papers found for this.</p > ';
    }
    $conn->close();
}
?>

<hr/>

</body>
</html>


