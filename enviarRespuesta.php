<?php

include('conection.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $placa = $conn->real_escape_string($_POST['placa'] ?? '');
    $serie = $conn->real_escape_string($_POST['serie'] ?? '');
    $marca = $conn->real_escape_string($_POST['marca'] ?? '');
    $modelo = $conn->real_escape_string($_POST['modelo'] ?? '');
    $nombre = $conn->real_escape_string($_POST['nombre'] ?? '');
    $email = $conn->real_escape_string($_POST['email'] ?? '');

    if ($placa && $serie && $marca && $modelo && $nombre && $email) {

        $conn->begin_transaction();

        try {
            $sql_existe = "SELECT id FROM propietarios WHERE nombre = ? AND email = ? LIMIT 1";
            $stmt_existe = $conn->prepare($sql_existe);
            if (!$stmt_existe) {
                throw new Exception("Error al preparar la consulta del propietario: " . $conn->error);
            }
            $stmt_existe->bind_param("ss", $nombre, $email);
            $stmt_existe->execute();
            $result_existe = $stmt_existe->get_result();

            if ($result_existe->num_rows > 0) {
                $propietario = $result_existe->fetch_assoc();
                $propietario_id = $propietario['id'];
            } else {
                $sql_propietario = "INSERT INTO propietarios (nombre, email) VALUES (?, ?)";
                $stmt_propietario = $conn->prepare($sql_propietario);
                if (!$stmt_propietario) {
                    throw new Exception("Error al preparar la consulta del propietario: " . $conn->error);
                }
                $stmt_propietario->bind_param("ss", $nombre, $email);

                if (!$stmt_propietario->execute()) {
                    throw new Exception("Error en la inserción del propietario: " . $stmt_propietario->error);
                }

                $propietario_id = $conn->insert_id;
            }

            $sql_auto = "INSERT INTO autos (placa, serie, marca, modelo, id_propietario) VALUES (?, ?, ?, ?, ?)";
            $stmt_auto = $conn->prepare($sql_auto);
            if (!$stmt_auto) {
                throw new Exception("Error al preparar la consulta del automóvil: " . $conn->error);
            }
            $stmt_auto->bind_param("ssssi", $placa, $serie, $marca, $modelo, $propietario_id);

            if (!$stmt_auto->execute()) {
                throw new Exception("Error en la inserción del automóvil: " . $stmt_auto->error);
            }

            $conn->commit();

            echo json_encode(["success" => true, "message" => "Registro exitoso"]);
        } catch (Exception $e) {
            $conn->rollback();

            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        } finally {
            if (isset($stmt_auto)) $stmt_auto->close();
            if (isset($stmt_propietario)) $stmt_propietario->close();
            if (isset($stmt_existe)) $stmt_existe->close();

            $conn->close();
        }
    } else {
        echo json_encode(["success" => false, "error" => "Faltan datos"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
}
?>
