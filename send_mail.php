<?php
// Prevent PHP notices/warnings from breaking JSON response
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name    = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $email   = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'General Inquiry';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

    if (empty($name) || empty($message) || empty($subject) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please complete all fields with a valid email address."]);
        exit;
    }

    $recipient = "info@avanttechbd.com";
    $email_subject = "=?UTF-8?B?" . base64_encode("[Website Inquiry] " . $subject) . "?=";

    $email_content  = "You have received a new contact inquiry from Avant Technologies website:\n\n";
    $email_content .= "Full Name: " . $name . "\n";
    $email_content .= "Sender Email: " . $email . "\n";
    $email_content .= "Subject: " . $subject . "\n\n";
    $email_content .= "Message:\n" . str_replace("\r\n", "\n", $message) . "\n\n";
    $email_content .= "--------------------------------------------------\n";
    $email_content .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $email_content .= "Timestamp: " . date('Y-m-d H:i:s') . "\n";

    // Valid sender from your own cPanel domain
    $from_email = "info@avanttechbd.com";

    $headers   = array();
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "Content-Transfer-Encoding: 8bit";
    $headers[] = "From: Avant Website <" . $from_email . ">";
    $headers[] = "Reply-To: " . $name . " <" . $email . ">";
    $headers[] = "Return-Path: <" . $from_email . ">";
    $headers[] = "X-Mailer: PHP/" . phpversion();

    $headers_str = implode("\r\n", $headers);

    // -f parameter sets the envelope sender required by Namecheap Exim
    $sent = @mail($recipient, $email_subject, $email_content, $headers_str, "-f" . $from_email);

    if ($sent) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Thank you! Your message has been sent successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Mail delivery failed. Please contact us directly at info@avanttechbd.com."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>