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
 * @var $azureaccesskey
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
            max-width: 660px;
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

        label {
            width: 100%;
            clear: both;
            float: left;
        }

        #searchButton {
            float: left;
            clear: both;
            margin-top: 5px;
        }

        #searchSuggested {
            float: left;
            margin-top: 5px;
        }

        #searchField {
            float: left;
            margin-top: 5px;
            clear: both;
        }

        #search_results {
            margin-top: 5px;
            float: left;
            clear: both;
        }

        .red {
            color: red;
            font-weight: bold;
        }

        .green {
            color: green;
            font-weight: bold;
        }

        .vote-count {
            font-weight: normal;
            color: #666;
        }

        .hidden {
            display: none;
        }

        em {
            font-size: 80%;
        }
    </style>

    <script src="/js/jquery.js"></script>
    <script src="/js/main.js"></script>

</head>
<body id="main_body" data-index="<?php echo $currentPageUrl; ?>">


<h1>CuneiPhrase</h1>

<?php if ($currentPageUrl && strlen($currentPageUrl) > 0): ?>
    <p>You are on page <?php echo $currentPageUrl; ?></p>

    <?php
    $keywords = '';
    $page = file_get_contents($currentPageUrl);
    $page_text = strip_tags($page);

    $len = strlen($page_text);
    $limitedPageText = $page_text;
    $maxlen = 5000;
    if ($len > $maxlen) {
        $halfpage = $len / 2;
        $y = round($halfpage - ($maxlen / 2));
        $limitedPageText = substr($page_text, $y, $maxlen);
    }

    $host = 'https://westcentralus.api.cognitive.microsoft.com';
    //$path = '/text/analytics/v2.0/sentiment';
    $path = '/text/analytics/v2.0/keyPhrases';

    function GetSentiment($host, $path, $key, $data)
    {

        $headers = "Content-type: text/json\r\n" .
            "Ocp-Apim-Subscription-Key: $key\r\n";

        $data = json_encode($data);

        // NOTE: Use the key 'http' even if you are making an HTTPS request. See:
        // http://php.net/manual/en/function.stream-context-create.php
        $options = array(
            'http' => array(
                'header' => $headers,
                'method' => 'POST',
                'content' => $data
            )
        );
        $context = stream_context_create($options);
        $result = file_get_contents($host . $path, false, $context);
        return $result;
    }

    $data = array(
        'documents' => array(
            array('id' => '1', 'language' => 'en', 'text' => $limitedPageText),
        )
    );

    $result = GetSentiment($host, $path, $azureaccesskey, $data);
    $decodedResult = json_decode($result);
    $azureKeywords = $decodedResult->documents[0]->keyPhrases;
    $keywords = implode('%20', $azureKeywords);
    ?>
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
academic_paper.doi AS doi,
page_to_paper.link_context,
page_to_paper.id AS page_to_paper_id,
page_to_paper.reason, 
page_to_paper.vote_count AS vote_count
FROM academic_paper
INNER JOIN page_to_paper
ON academic_paper.id = page_to_paper.academic_paper_id
INNER JOIN web_page 
ON web_page.id = page_to_paper.web_page_id
WHERE web_page.link = '" . $currentPageUrl . "'
ORDER BY vote_count DESC
";
    $result = $conn->query($sql);
    //echo var_dump($result);
    if ($result->num_rows > 0) {
        echo '<p id="firstParagraph">Our users submitted the following scientific papers related to this article:</p>';
        echo '<p id="secondParagraph" class="green hidden"><em>[New items added - please re-load to re-order]</em></p>';
        echo '<ul id="initial_list">';
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            //echo var_dump($row);
            //echo "id: " . $row["id"] . " - Name: " . $row["firstname"] . " " . $row["lastname"] . "<br>";
            echo '<li class="link-listing" data-sort="' . $row['vote_count'] . '">';
            echo '<a data-index="' . $row['page_to_paper_id'] . '|' . $row['vote_count'] . '" class="vote-up green" href="#">&uarr;</a>';
            echo '<span class="vote-count">[' . $row['vote_count'] . ']</span>';
            echo '<a data-index="' . $row['page_to_paper_id'] . '|' . $row['vote_count'] . '" class="vote-down red" href="#">&darr; </a>';
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

        echo '<hr />';
        echo '<div id="search_form">';
        echo '<label for="searchField">Search academic papers for more:</label>';
        echo '<input type="text" id="searchField" name="searchField"/>';
        echo '<button type="button" id="searchButton" class="search-button">Search</button>';
        if ($keywords) {
            echo '<button type="button" id="searchSuggested" data-count="0" data-keywords="'.htmlspecialchars(json_encode($azureKeywords), ENT_QUOTES, 'UTF-8').'" class="search-button">Show Suggested</button>';
        }
        echo '</div>';
        ?>
        <div id="search_results"></div>
        <?php
        echo '<hr />';
    } else {
        echo '<p id="firstParagraph">No user-submitted scientific papers found for this.</p > ';
        echo '<p id="secondParagraph" class="green hidden"><em>[New items added - please re-load to re-order]</em></p>';
        echo '<ul id="initial_list">';
        echo '</ul>';
        echo '<hr />';
        echo '<div id="search_form">';
        echo '<label for="searchField">Search academic papers for more:</label>';
        echo '<input type="text" id="searchField" name="searchField"/>';
        echo '<button type="button" id="searchButton" class="search-button">Search</button>';
        if ($keywords) {
            echo '<button type="button" id="searchSuggested" data-count="0" data-keywords="'.htmlspecialchars(json_encode($azureKeywords), ENT_QUOTES, 'UTF-8').'" class="search-button">Show Suggested</button>';
        }
        echo '</div>';
        ?>
        <div id="search_results"></div>
        <?php
        echo '<hr />';
    }
    $conn->close();
}
?>


</body>
</html>


