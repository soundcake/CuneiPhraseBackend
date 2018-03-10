<?php
/**
 * Created by PhpStorm.
 * User: josh
 * Date: 10/03/18
 * Time: 15:08
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
    !(isset($_POST['page']) || strlen($_POST['page']) < 1)
    || (!isset($_POST['doi']) || strlen($_POST['doi']) < 1)
    || (!isset($_POST['paper_title']) || strlen($_POST['paper_title']) < 1)
    || (!isset($_POST['paper_link']) || strlen($_POST['paper_title']) < 1)
    || (!isset($_POST['context']) || strlen($_POST['context']) < 1)
    || (!isset($_POST['reason']) || strlen($_POST['reason']) < 1)
) {
    echo 'missing param';
    exit;
}


$page = $_POST['page'];
$doi = $_POST['doi'];
$context = $_POST['context'];
$reason = $_POST['reason'];
$paperTitle = $_POST['paper_title'];
$paperLink = $_POST['paper_link'];


$paperId = 0;
$pageId = 0;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT id FROM web_page WHERE link = '$page'";
$result = $conn->query($sql);
if ($result->num_rows === 0) {
    $sql = "INSERT INTO web_page(link) VALUES ('$page')";
    $result = $conn->query($sql);
}
$sql = "SELECT id FROM web_page WHERE link = '$page'";
$result = $conn->query($sql);
$resultAssoc = $result->fetch_assoc();
$pageId = $resultAssoc['id'];


$sql = "SELECT id, vote_count FROM academic_paper WHERE doi = '$doi'";
$result = $conn->query($sql);
if ($result->num_rows === 0) {
    $sql = "INSERT INTO academic_paper(doi, title, link) VALUES ('$doi', '$paperTitle', '$paperLink')";
    $result = $conn->query($sql);
}
$sql = "SELECT id FROM academic_paper WHERE doi = '$doi'";
$result = $conn->query($sql);
$resultAssoc = $result->fetch_assoc();
$paperId = $resultAssoc['id'];

if ($paperId && $pageId) {
    $sql = "INSERT INTO page_to_paper (academic_paper_id, web_page_id, link_context, reason, vote_count)
VALUES ($paperId,$pageId,'$context','$reason', 1)";
    $result = $conn->query($sql);
}


$conn->close();