<?php
require_once 'config.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// Get database connection
$conn = getDBConnection();

// Prepare and execute query
$stmt = $conn->prepare("SELECT id, username, password, role, fullname FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    // Verify password
    if (password_verify($password, $user['password'])) {
        // Generate token
        $token = bin2hex(random_bytes(32));
        
        // Store token in database
        $stmt = $conn->prepare("UPDATE users SET token = ?, token_expiry = DATE_ADD(NOW(), INTERVAL 1 DAY) WHERE id = ?");
        $stmt->bind_param("si", $token, $user['id']);
        $stmt->execute();
        
        // Return success response
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'fullname' => $user['fullname']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}

$conn->close();
?> 