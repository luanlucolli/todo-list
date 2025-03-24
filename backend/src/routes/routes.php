<?php

require_once __DIR__ . '/../controllers/TaskController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Responde pré-flights (OPTIONS)
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Remove prefixo "/api" se existir
$uri = preg_replace('#^/api#', '', $uri);

$parsed_url = parse_url($uri);
$path = $parsed_url['path'];
parse_str($parsed_url['query'] ?? '', $query);


// Roteamento
if ($path === '/tasks' && $method === 'GET') {
    TaskController::getAll($query['status'] ?? null);
} elseif ($path === '/tasks' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    TaskController::create($data);
} elseif (preg_match('/\/tasks\/(\d+)$/', $path, $matches) && $method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    TaskController::update($matches[1], $data);
} elseif (preg_match('/\/tasks\/(\d+)\/done$/', $path, $matches) && $method === 'PATCH') {
    TaskController::markAsDone($matches[1]);
} elseif (preg_match('/\/tasks\/(\d+)$/', $path, $matches) && $method === 'PATCH') {
    $data = json_decode(file_get_contents('php://input'), true);
    TaskController::updateStatus($matches[1], $data);
} elseif (preg_match('/\/tasks\/(\d+)$/', $path, $matches) && $method === 'DELETE') {
    TaskController::delete($matches[1]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Rota não encontrada']);
}
