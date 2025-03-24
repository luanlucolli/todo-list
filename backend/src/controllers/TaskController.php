<?php

require_once __DIR__ . '/../models/Task.php';
require_once __DIR__ . '/../config/db.php';

class TaskController
{

    public static function getAll($status = null)
    {
        global $pdo;

        $query = "SELECT * FROM tasks";
        if ($status !== null) {
            $query .= " WHERE status = ?";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$status]);
        } else {
            $stmt = $pdo->query($query);
        }

        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($tasks);
    }

    public static function create($data)
    {
        global $pdo;

        $stmt = $pdo->prepare("INSERT INTO tasks (title, description) VALUES (?, ?)");
        $stmt->execute([$data['title'], $data['description'] ?? '']);
        echo json_encode(['message' => 'Tarefa criada com sucesso']);
    }

    public static function update($id, $data)
    {
        global $pdo;

        $stmt = $pdo->prepare("UPDATE tasks SET title = ?, description = ? WHERE id = ?");
        $stmt->execute([$data['title'], $data['description'] ?? '', $id]);
        echo json_encode(['message' => 'Tarefa atualizada com sucesso']);
    }

    public static function updateStatus($id, $data)
    {
        global $pdo;

        if (!isset($data['status']) || !in_array($data['status'], [0, 1])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status inválido']);
            return;
        }

        $stmt = $pdo->prepare("UPDATE tasks SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $id]);
        echo json_encode(['message' => 'Status atualizado com sucesso']);
    }

    public static function markAsDone($id)
    {
        global $pdo;

        $stmt = $pdo->prepare("UPDATE tasks SET status = 1 WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Tarefa marcada como concluída']);
    }

    public static function delete($id)
    {
        global $pdo;

        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Tarefa excluída']);
    }
}
