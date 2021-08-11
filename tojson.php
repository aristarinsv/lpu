<?php

header("Content-Type: application/json");

$data = file_get_contents("php://input");
if(file_exists('lpu.json')) {

$file = file_get_contents('lpu.json');

file_put_contents('lpu.json', $data);

$file = file_get_contents('lpu.json');

echo $data;
} else echo 'Нет файла';
unset($file);