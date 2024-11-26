<?php

include('conection.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if(isset($_POST['id_auto'], $_POST['placa'], $_POST['serie'], $_POST['marca'], $_POST['modelo'], $_POST['nombre'], $_POST['email'])) {
        $id_auto = $conn->real_escape_string($_POST['id_auto']);
        $placa = $conn->real_escape_string($_POST['placa']);
        $serie = $conn->real_escape_string($_POST['serie']);
        $marca = $conn->real_escape_string($_POST['marca']);
        $modelo = $conn->real_escape_string($_POST['modelo']);
        $nombre = $conn->real_escape_string($_POST['nombre']);
        $email = $conn->real_escape_string($_POST['email']);

        $sql = "UPDATE autos SET
                    placa = '$placa',
                    serie = '$serie',
                    marca = '$marca',
                    modelo = '$modelo'
                WHERE id_auto = '$id_auto'";

        if ($conn->query($sql) === TRUE) {
            $sql_propietario = "UPDATE propietarios SET nombre = '$nombre', email = '$email' WHERE id IN (SELECT id_propietario FROM autos WHERE id_auto = '$id_auto')";
            
            if ($conn->query($sql_propietario) === TRUE) {
                echo json_encode(["success" => true, "message" => "Auto y propietario actualizados con éxito"]);
            } else {
                echo json_encode(["success" => false, "error" => "Error al actualizar el propietario: " . $conn->error]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "Error al actualizar el auto: " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Solicitud inválida"]);
}

$conn->close();
?>
