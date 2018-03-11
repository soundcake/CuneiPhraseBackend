<?php
/**
 * Created by PhpStorm.
 * User: lukaszsnopkiewicz
 * Date: 10/03/2018
 * Time: 23:50
 */
header("Access-Control-Allow-Origin: *");

/**
 * @var $servername
 * @var $username
 * @var $password
 * @var $dbname
 */
extract(parse_ini_file('config.ini'));


if (
    !(isset($_POST['page_to_paper_id']) || strlen($_POST['page_to_paper_id']) < 1)
    || (!isset($_POST['vote_count']) || !is_numeric($_POST['vote_count']))
) {
    echo 'missing param';
    exit;
}

$pageToPaperId = $_POST['page_to_paper_id'];
$voteCount = $_POST['vote_count'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$voteCount--;
if ($voteCount > 1) {
    $sql = "UPDATE page_to_paper SET vote_count = '$voteCount' WHERE id = '$pageToPaperId'";
    $result = $conn->query($sql);
} else {
    $sql = "DELETE FROM page_to_paper WHERE id = '$pageToPaperId'";
    $result = $conn->query($sql);
}