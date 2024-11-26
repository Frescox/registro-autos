<?php

include('conection.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id_auto'])) {
    $id_auto = $conn->real_escape_string($_GET['id_auto']);

    $sql = "SELECT autos.*, propietarios.nombre, propietarios.email
            FROM autos
            JOIN propietarios ON autos.id_propietario = propietarios.id
            WHERE autos.id_auto = '$id_auto'";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $auto = $result->fetch_assoc();
        echo json_encode(["success" => true, "auto" => $auto]);
    } else {
        echo json_encode(["success" => false, "error" => "No se encontró el auto"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Solicitud inválida"]);
}

$conn->close();
?>
