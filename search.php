<?php
/**
 * Created by PhpStorm.
 * User: josh
 * Date: 10/03/18
 * Time: 16:58
 */

$q = $_GET['q'];

$searchUrl = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=" . $q . "%20open_access:y&format=json&resulttype=core";

$results = file_get_contents($searchUrl);
$decodedResults = json_decode($results);

foreach ($decodedResults->resultList->result as $resultItem) {

    foreach($resultItem->fullTextUrlList as $fullTextUrl){
        $url = $fullTextUrl[0]->url;
        break;
    }

    $doi = $resultItem->doi;
    $title = $resultItem->title;

    echo 'DOI:'.$doi;
    echo "<br>";
    echo 'TITLE:'.$title;
    echo "<br>";
    echo 'URL:'.$url;
    echo "<br>";
    echo "<br>";
    echo "<br>";

}