document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate password match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Validate password strength
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }

    try {
        const response = await fetch('api/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname,
                email,
                username,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup');
    }
}); 