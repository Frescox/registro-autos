<?php
include ('conection.php');

header('Content-Type: application/json'); 


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id_auto'])) {
    $id_auto = $conn->real_escape_string($_GET['id_auto']);

    $sql = "DELETE FROM autos WHERE id_auto = '$id_auto'";

    if ($conn->query($sql) === TRUE) {
        $sql_propietario = "DELETE FROM propietarios 
                            WHERE id NOT IN (SELECT id_propietario FROM autos)";

        if ($conn->query($sql_propietario) === TRUE) {
            echo json_encode(["success" => true, "message" => "Auto y propietario eliminados con éxito"]);
        } else {
            echo json_encode(["success" => false, "error" => "Error al eliminar el propietario: " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Error al eliminar el auto: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Solicitud inválida"]);
}

$conn->close();
?>
