document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const errorMessage = document.getElementById('errorMessage');

    // Hide any previous error messages
    errorMessage.classList.add('hidden');
    
    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                remember
            })
        });

        const data = await response.json();

        if (data.success) {
            // Store token if remember me is checked
            if (remember) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                sessionStorage.setItem('authToken', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
            }
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        } else {
            // Show error message
            errorMessage.textContent = data.message || 'Invalid username or password';
            errorMessage.classList.remove('hidden');
            
            // Clear password field
            document.getElementById('password').value = '';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'An error occurred during login. Please try again.';
        errorMessage.classList.remove('hidden');
    }
}); 