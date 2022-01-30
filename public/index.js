async function sb() {
    window.open('sb/');
};

async function invlink() {
    const Confirm = {
        open(options) {
            options = Object.assign({}, {
                title: '',
                message: '',
                TextButton1: '',
                TextButton2: '',
                on1: function () { },
                on2: function () { },
                oncancel: function () { }
            }, options);

            const html = `
                <div class="confirm">
                    <div class="confirm__window">
                        <div class="confirm__titlebar">
                            <span class="confirm__title">${options.title}</span>
                            <button class="confirm__close">&times;</button>
                        </div>
                        <div class="confirm__content">${options.message}</div>
                        <div class="confirm__buttons">
                            <button class="confirm__button confirm__button--ok confirm__button--fill">${options.TextButton1}</button>
                            <button class="confirm__button confirm__button--cancel confirm__button--fill">${options.TextButton2}</button>
                        </div>
                    </div>
                </div>
            `;

            const template = document.createElement('template');
            template.innerHTML = html;

            // Elements
            const confirmEl = template.content.querySelector('.confirm');
            const btnClose = template.content.querySelector('.confirm__close');
            const btnOk = template.content.querySelector('.confirm__button--ok');
            const btnCancel = template.content.querySelector('.confirm__button--cancel');

            confirmEl.addEventListener('click', e => {
                if (e.target === confirmEl) {
                    options.oncancel();
                    this._close(confirmEl);
                }
            });

            btnOk.addEventListener('click', () => {
                options.onok();
                this._close(confirmEl);
            });

            btnCancel.addEventListener('click', () => {
                options.on2();
                this._close(confirmEl);
            });

            btnClose.addEventListener('click', () => {
                this._close(confirmEl);
            });

            document.body.appendChild(template.content);
        },

        _close(confirmEl) {
            confirmEl.classList.add('confirm--close');

            confirmEl.addEventListener('animationend', () => {
                document.body.removeChild(confirmEl);
            });
        }
    };


    Confirm.open({
        title: 'which bot?',
        message: 'Which bot do you wanne invite to a server?',
        TextButton1: 'mr. spast',
        TextButton2: 'music spast',
        ono1: () => {
            //mainbot
            window.open('https://discord.com/oauth2/authorize?client_id=711598866595840030&scope=bot&permissions=8');
        },
        on2: () => {
            //music
            window.open('https://discord.com/oauth2/authorize?client_id=746149562359742564&scope=bot&permissions=8');
        },
        oncancel: () => { }
    });
}