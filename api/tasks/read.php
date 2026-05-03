<?php
/**
 * Read Tasks Endpoint
 * GET /api/tasks/read.php
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

$user_id = $_SESSION['user_id'];
$status = $_GET['status'] ?? null;

try {
    $pdo = getDBConnection();
    
    $query = 'SELECT * FROM tasks WHERE user_id = ?';
    $params = [$user_id];
    
    if ($status) {
        $query .= ' AND status = ?';
        $params[] = $status;
    }
    
    $query .= ' ORDER BY priority ASC, created_at DESC';
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $tasks = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'tasks' => $tasks
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch tasks: ' . $e->getMessage()]);
}
?>
