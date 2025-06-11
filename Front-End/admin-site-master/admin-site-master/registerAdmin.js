document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const data = {
        fullName: form.fullName.value,
        address: form.address.value,
        phone: form.phone.value,
        email: form.email.value,
        password: form.password.value,
        confirmPassword: form.confirmPassword.value
    };

    if (data.password !== data.confirmPassword) {
        document.getElementById('message').textContent = "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch('http://localhost:5035/api/Account/AdminRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('message').textContent = result.message;
            document.getElementById('message').style.color = 'green';
            form.reset();
        } else {
            document.getElementById('message').textContent = result[0]?.description || "Registration failed.";
        }

    } catch (error) {
        document.getElementById('message').textContent = "Error: " + error.message;
    }
});
