<?php
include('conection.php');

$sql = "SELECT a.id_auto, a.placa, a.serie, a.marca, a.modelo, p.nombre, p.email 
        FROM autos a
        INNER JOIN propietarios p ON a.id_propietario = p.id";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $autos = [];
    while ($row = $result->fetch_assoc()) {
        $autos[] = $row;
    }
    echo json_encode(["success" => true, "autos" => $autos]);
} else {
    echo json_encode(["success" => false, "error" => "No se encontraron autos"]);
}

$conn->close();
