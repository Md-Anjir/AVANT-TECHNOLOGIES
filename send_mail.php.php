<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Form data sanitize
    $name    = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $email   = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'Website Contact Inquiry';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

    // Validation
    if (empty($name) || empty($message) || empty($subject) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please complete all required fields with a valid email address."]);
        exit;
    }

    // Email Config
    $recipient = "info@avanttechbd.com";
    $email_subject = "[Avant Website Inquiry] " . $subject;

    // Email Body
    $email_content = "You have received a new message from Avant Technologies Website:\n\n";
    $email_content .= "Full Name: {$name}\n";
    $email_content .= "Email Address: {$email}\n";
    $email_content .= "Subject: {$subject}\n\n";
    $email_content .= "Message:\n{$message}\n\n";
    $email_content .= "--------------------------------------------------\n";
    $email_content .= "Sent from: " . $_SERVER['SERVER_NAME'] . " on " . date('Y-m-d H:i:s');

    // Headers
    $headers = "From: Avant Web Contact <no-reply@avanttechbd.com>\r\n";
    $headers .= "Reply-To: {$name} <{$email}>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send Mail
    if (mail($recipient, $email_subject, $email_content, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Thank you! Your message has been sent successfully to Avant Technologies."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Server error: Unable to send email. Please contact us via phone."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>