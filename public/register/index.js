const run = async () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('password-confirm').value;

    if (username == '') return username = null;
    if (password == '') return password = null;
    if (password !== passwordConfirm) return;

    let data = {
        username: username,
        password: password
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('/register', options);
};