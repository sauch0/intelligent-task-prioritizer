<?php
/**
 * Delete Task Endpoint
 * POST /api/tasks/delete.php
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
    
    $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
    $stmt->execute([$task_id, $user_id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Task deleted successfully'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete task: ' . $e->getMessage()]);
}
?>
