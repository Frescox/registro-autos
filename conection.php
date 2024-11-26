<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "registroauto_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Conexión fallida: " . $conn->connect_error]));
}