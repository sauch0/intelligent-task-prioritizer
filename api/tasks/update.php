<?php
/**
 * Update Task Endpoint
 * POST /api/tasks/update.php
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$task_id = intval($input['id'] ?? 0);
$title = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');
$due_date = $input['due_date'] ?? null;
$priority = intval($input['priority'] ?? 4);
$status = $input['status'] ?? null;
$user_id = $_SESSION['user_id'];

if ($task_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Valid task ID is required']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Verify ownership
    $stmt = $pdo->prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?');
    $stmt->execute([$task_id, $user_id]);
    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Access denied']);
        exit;
    }
    
    $updateFields = [];
    $params = [];
    
    if ($title !== '') { $updateFields[] = 'title = ?'; $params[] = $title; }
    if (isset($input['description'])) { $updateFields[] = 'description = ?'; $params[] = $description; }
    if (isset($input['due_date'])) { $updateFields[] = 'due_date = ?'; $params[] = $due_date; }
    if (isset($input['estimated_time'])) { $updateFields[] = 'estimated_time = ?'; $params[] = intval($input['estimated_time']); }
    if (isset($input['priority'])) { $updateFields[] = 'priority = ?'; $params[] = $priority; }
    if ($status) { $updateFields[] = 'status = ?'; $params[] = $status; }
    
    if (empty($updateFields)) {
        echo json_encode(['success' => true, 'message' => 'No fields to update']);
        exit;
    }
    
    $query = 'UPDATE tasks SET ' . implode(', ', $updateFields) . ' WHERE id = ? AND user_id = ?';
    $params[] = $task_id;
    $params[] = $user_id;
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true,
        'message' => 'Task updated successfully'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update task: ' . $e->getMessage()]);
}
?>
