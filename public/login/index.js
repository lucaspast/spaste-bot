const run = async () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if (username == '') username = null;
    if (password == '') password = null;


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

    const response = await fetch('/login', options);
    const json = await response.json();

    console.log(json)
};