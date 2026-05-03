<?php
/**
 * Create Task Endpoint
 * POST /api/tasks/create.php
 */

require_once '../config/database.php';

setCorsHeaders();
session_start();

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$title = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');
$due_date = $input['due_date'] ?? null;
$estimated_time = intval($input['estimated_time'] ?? 30);
$priority = intval($input['priority'] ?? 4);
$user_id = $_SESSION['user_id'];

if (empty($title)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Task title is required']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare('INSERT INTO tasks (user_id, title, description, due_date, estimated_time, priority) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$user_id, $title, $description, $due_date, $estimated_time, $priority]);
    
    $taskId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Task created successfully',
        'task_id' => $taskId
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to create task: ' . $e->getMessage()]);
}
?>
