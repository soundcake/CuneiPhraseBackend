<?php
/**
 * Created by PhpStorm.
 * User: josh
 * Date: 10/03/18
 * Time: 16:58
 */

$q = $_GET['q'];

$searchUrl = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=" . $q . "&format=json";

$results = file_get_contents($searchUrl);
$decodedResults = json_decode($results);

foreach ($decodedResults->resultList->result as $resultItem) {

    $doi = $resultItem->doi;
    $title = $resultItem->title;

    echo 'DOI:'.$doi;
    echo "<br>";
    echo 'TITLE:'.$title;
    echo "<br>";
    echo "<br>";
    echo "<br>";
}