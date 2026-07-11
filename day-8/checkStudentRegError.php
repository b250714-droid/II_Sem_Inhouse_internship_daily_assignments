<?php
include_once("db_connect.php");

$error = "";
$first_name = $last_name = $email = $mobile = $gender = $dob = $city = $course = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $first_name = mysqli_real_escape_string($conn, $_POST["first_name"]);
    $last_name  = mysqli_real_escape_string($conn, $_POST["last_name"]);
    $email      = mysqli_real_escape_string($conn, $_POST["email"]);
    $mobile     = mysqli_real_escape_string($conn, $_POST["mobile"]);
    $gender     = mysqli_real_escape_string($conn, $_POST["gender"]);
    $dob        = mysqli_real_escape_string($conn, $_POST["dob"]);
    $city       = mysqli_real_escape_string($conn, $_POST["city"]);
    $course     = mysqli_real_escape_string($conn, $_POST["course"]);
    $password   = mysqli_real_escape_string($conn, $_POST["password"]);
    $confirmPassword = mysqli_real_escape_string($conn, $_POST["confirmPassword"]);
    $terms      = isset($_POST["terms"]) ? true : false;

    if ($first_name == "" || $last_name == "" || $email == "" || $mobile == "" ||
        $gender == "Select Gender" || $dob == "" || $city == "" ||
        $course == "Select Course" || $password == "" || $confirmPassword == "") {
        $error = "All fields are required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } elseif (!preg_match('/^[0-9]{10}$/', $mobile)) {
        $error = "Mobile number must be exactly 10 digits.";
    } elseif ($password != $confirmPassword) {
        $error = "Passwords do not match.";
    } elseif (!$terms) {
        $error = "You must agree to the Terms & Conditions.";
    } else {
        $checkQuery = "select * from student where email='$email'";
        $checkResult = mysqli_query($conn, $checkQuery);

        if (mysqli_num_rows($checkResult) > 0) {
            $error = "This email is already registered.";
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $insertQuery = "insert into student
                (first_name, last_name, email, mobile, gender, dob, city, course, password)
                values ('$first_name','$last_name','$email','$mobile','$gender','$dob','$city','$course','$hashedPassword')";

            $result = mysqli_query($conn, $insertQuery);

            if ($result) {
                header("Location: login.php");
                exit();
            } else {
                $error = "Error occurred while saving your details.";
            }
        }
    }
}
?>