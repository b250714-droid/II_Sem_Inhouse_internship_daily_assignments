<?php
include("db_connect.php");
include("checkStudentRegError.php");   
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <div class="card shadow p-4">
        <h2 class="text-center text-primary mb-4">Student Registration Form</h2>

        <?php if (!empty($error)) { ?>
            <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
        <?php } ?>

        <form action="" method="post">

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">First Name</label>
                    <input type="text" name="first_name" class="form-control" placeholder="Enter First Name" value="<?php echo htmlspecialchars($first_name); ?>">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Last Name</label>
                    <input type="text" name="last_name" class="form-control" placeholder="Enter Last Name" value="<?php echo htmlspecialchars($last_name); ?>">
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" placeholder="Enter Email" value="<?php echo htmlspecialchars($email); ?>">
            </div>

            <div class="mb-3">
                <label class="form-label">Mobile Number</label>
                <input type="tel" name="mobile" class="form-control" placeholder="Enter Mobile Number" value="<?php echo htmlspecialchars($mobile); ?>">
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Gender</label>
                    <select name="gender" class="form-select">
                        <option <?php echo ($gender == "") ? "selected" : ""; ?>>Select Gender</option>
                        <option <?php echo ($gender == "Male") ? "selected" : ""; ?>>Male</option>
                        <option <?php echo ($gender == "Female") ? "selected" : ""; ?>>Female</option>
                        <option <?php echo ($gender == "Other") ? "selected" : ""; ?>>Other</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Date of Birth</label>
                    <input type="date" name="dob" class="form-control" value="<?php echo htmlspecialchars($dob); ?>">
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">City</label>
                <input type="text" name="city" class="form-control" placeholder="Enter City" value="<?php echo htmlspecialchars($city); ?>">
            </div>

            <div class="mb-3">
                <label class="form-label">Course</label>
                <select name="course" class="form-select">
                    <option <?php echo ($course == "") ? "selected" : ""; ?>>Select Course</option>
                    <option <?php echo ($course == "B.Tech AI") ? "selected" : ""; ?>>B.Tech AI</option>
                    <option <?php echo ($course == "BCA") ? "selected" : ""; ?>>BCA</option>
                    <option <?php echo ($course == "BBA") ? "selected" : ""; ?>>BBA</option>
                    <option <?php echo ($course == "MCA") ? "selected" : ""; ?>>MCA</option>
                </select>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-control">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" name="confirmPassword" class="form-control">
                </div>
            </div>

            <div class="mb-3 form-check">
                <input type="checkbox" name="terms" class="form-check-input" id="termsCheck">
                <label class="form-check-label" for="termsCheck">I agree to the Terms & Conditions</label>
            </div>

            <div class="text-center">
                <button type="reset" class="btn btn-secondary me-2">Clear</button>
                <button type="submit" class="btn btn-primary">Register</button>
            </div>

        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>