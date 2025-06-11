// Script for login form submission
/*document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const loginData = {
        userName: document.getElementById('UserName').value,
        password: document.getElementById('password').value
    };

    fetch('http://localhost:5035/api/Account/AdminLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(async response => {
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            let errorMessage = 'Login failed';
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back!'
            }).then(() => {
                window.location.href = '/dashboard.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message || 'Invalid username or password.'
            });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    });
});

*/


document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userData = {
        fullName: document.getElementById('names').value,
        password: document.getElementById('passwordCreate').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('emailCreate').value
    };

    if (userData.password !== userData.confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Passwords do not match!'
        });
        return;
    }

    fetch('http://localhost:5035/api/Account/AdminRegister', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Account Created") {
            Swal.fire({
                icon: 'success',
                title: 'Account Created Successfully',
                text: 'You can now log in.'
            });
            // تم حذف window.location.href لأن صفحة login.html لم تعد موجودة
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Something went wrong. Please try again.'
            });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    });
});



/*=============== SHOW HIDE PASSWORD LOGIN ==============
const passwordAccess = (loginPass, loginEye) =>{
   const input = document.getElementById(loginPass),
         iconEye = document.getElementById(loginEye)

   iconEye.addEventListener('click', () =>{
      // Change password to text
      input.type === 'password' ? input.type = 'text'
						              : input.type = 'password'

      // Icon change
      iconEye.classList.toggle('ri-eye-fill')
      iconEye.classList.toggle('ri-eye-off-fill')
   })
}
passwordAccess('password','loginPassword')

/*=============== SHOW HIDE PASSWORD CREATE ACCOUNT ===============
const passwordRegister = (loginPass, loginEye) =>{
   const input = document.getElementById(loginPass),
         iconEye = document.getElementById(loginEye)

   iconEye.addEventListener('click', () =>{
      // Change password to text
      input.type === 'password' ? input.type = 'text'
						              : input.type = 'password'

      // Icon change
      iconEye.classList.toggle('ri-eye-fill')
      iconEye.classList.toggle('ri-eye-off-fill')
   })
}
passwordRegister('passwordCreate','loginPasswordCreate')

/*=============== SHOW HIDE LOGIN & CREATE ACCOUNT ===============
const loginAcessRegister = document.getElementById('loginAccessRegister'),
      buttonRegister = document.getElementById('loginButtonRegister'),
      buttonAccess = document.getElementById('loginButtonAccess')

buttonRegister.addEventListener('click', () => {
   loginAcessRegister.classList.add('active')
})

buttonAccess.addEventListener('click', () => {
   loginAcessRegister.classList.remove('active')
})
*/