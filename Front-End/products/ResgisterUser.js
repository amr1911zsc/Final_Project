function validateRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById("first").value.trim();
    const password = document.getElementById("Password").value.trim();
    const confirmPassword = document.getElementById("ConfirmPassword").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("Email").value.trim();

    if (!fullName || !password || !confirmPassword || !address || !phone || !email) {
        Swal.fire("Missing Data", "Please fill in all fields", "warning");
        return;
    }

    if (password !== confirmPassword) {
        Swal.fire("Password Mismatch", "Passwords do not match", "error");
        return;
    }

    fetch("http://localhost:5035/api/Account/UserRegister", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName: fullName,
            password: password,
            confirmPassword: confirmPassword,
            address: address,
            phone: phone,
            email: email
        })
    })
    .then(async response => {
        const responseText = await response.text();

        if (!response.ok) {
            try {
                const errorJson = JSON.parse(responseText);
                let errorMessage = "";

                if (Array.isArray(errorJson)) {
                    // زي لما يكون DuplicateUserName أو ضعف الباسورد
                    errorMessage = errorJson.map(e => e.description).join("<br>");
                } else if (typeof errorJson === "object") {
                    // ModelState errors
                    errorMessage = Object.values(errorJson).flat().join("<br>");
                } else {
                    errorMessage = responseText;
                }

                Swal.fire("Registration Failed", errorMessage, "error");
                return;
            } catch (e) {
                Swal.fire("Registration Failed", responseText, "error");
                return;
            }
        }

        Swal.fire("Registered!", responseText, "success");
        setTimeout(() => {
            window.location.href = "signin.html";
        }, 1000);
    })
    .catch(error => {
        Swal.fire("Error", error.message, "error");
    });
}
