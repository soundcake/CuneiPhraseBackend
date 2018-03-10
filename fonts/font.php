<?php
/**
 * Created by PhpStorm.
 * User: josh
 * Date: 10/03/18
 * Time: 20:54
 */
header('Content-Type: font/opentype');
header("Access-Control-Allow-Origin: *");
echo file_get_contents('Behistun.otf');
exit;
