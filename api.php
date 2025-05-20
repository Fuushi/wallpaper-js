<?php
//test api
header('Content-Type: application/json');

echo json_encode([
    'random' => strval(mt_rand())
]);