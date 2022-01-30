let txt;
let busy = false;

async function submitcheck() {
    try {
        if (!busy) {
            busy = true;
            let soundFile = document.getElementById("sb_sound");
            let soundDescription = document.querySelector("#sb_description");
            let GuildID = document.querySelector("#sb_GuildID");

            if (soundFile.files) {
                if (soundFile.files.length == 0) {
                    const dysplay = document.createElement('a');

                    txt = "pls insert a video file!";
                    dysplay.textContent = txt;

                    document.getElementById('PDisplayfail').append(dysplay);
                    dysplay.classList.add('open');
                    setTimeout(() => {
                        dysplay.classList.remove('open');
                        dysplay.classList.add('close');
                        setTimeout(() => {
                            document.getElementById('PDisplayfail').removeChild(dysplay);
                            busy = false;
                        }, 200);
                    }, 3000);

                }
                else {

                    if (soundDescription.value == "" || GuildID.value.length !== 18 || isNaN(GuildID.value)) {

                        txt = "pls insert a description and a valid Guild ID!";
                        const dysplay = document.createElement('a');
                        dysplay.textContent = txt;

                        document.getElementById('PDisplayfail').append(dysplay);
                        dysplay.classList.add('open');
                        setTimeout(() => {
                            dysplay.classList.remove('open');
                            dysplay.classList.add('close');
                            setTimeout(() => {
                                document.getElementById('PDisplayfail').removeChild(dysplay);
                                busy = false;
                            }, 200);
                        }, 3000)
                        return
                    }

                    let file = soundFile.files[0];
                    var reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = async function (event) {
                        the_url = event.target.result
                        if (file.size < 19423445) {

                            let data = {
                                cmd: 'base64fs',
                                base64: the_url,
                                description: soundDescription.value,
                                GuildID: GuildID.value
                            }


                            const load = document.createElement('div');
                            load.className = 'load';
                            document.getElementById('PDisplaysuc').append(load);

                            const options = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            };

                            const response = await fetch('/api', options).then(async response => {

                                const json = await response.json();
                                console.log(json);

                                document.getElementById('PDisplaysuc').removeChild(load);

                                const dysplay = document.createElement('a');
                                if (json.suc6) {
                                    txt = 'successful!';
                                    dysplay.textContent = txt;

                                    document.getElementById('PDisplaysuc').append(dysplay);
                                    dysplay.classList.add('open');
                                    setTimeout(() => {
                                        dysplay.classList.remove('open');
                                        dysplay.classList.add('close');
                                        setTimeout(() => {
                                            document.getElementById('PDisplaysuc').removeChild(dysplay);
                                            busy = false;
                                        }, 200);
                                    }, 3000)
                                    return uploadsuc6(soundFile, soundDescription);
                                } else if (!json.suc6) {
                                    txt = 'faild try again!';
                                    dysplay.textContent = txt;

                                    document.getElementById('PDisplayfail').append(dysplay);
                                    dysplay.classList.add('open');
                                    setTimeout(() => {
                                        dysplay.classList.remove('open');
                                        dysplay.classList.add('close');
                                        setTimeout(() => {
                                            document.getElementById('PDisplayfail').removeChild(dysplay);
                                            busy = false;
                                        }, 200);
                                    }, 3000)
                                    return
                                } else {
                                    txt = 'strange error try again!';
                                    dysplay.textContent = txt;

                                    document.getElementById('PDisplayfail').append(dysplay);
                                    dysplay.classList.add('open');
                                    setTimeout(() => {
                                        dysplay.classList.remove('open');
                                        dysplay.classList.add('close');
                                        setTimeout(() => {
                                            document.getElementById('PDisplayfail').removeChild(dysplay);
                                            busy = false;
                                        }, 200);
                                    }, 3000)
                                    return
                                }
                            })

                        } else {
                            console.log(humanFileSize(file.size, "MB"))
                        }
                    }

                }
            }
            else {
                if (soundFile.value == "") {
                    alert("Select one or more files.");
                } else {
                    alert("The files property is not supported by your browser!");
                }
            }
        }
    } catch (error) {
        console.log(error)
    }

};

function display() {
    let soundFile = document.getElementById("sb_sound");
    let file = soundFile.files[0];

    if (!file) {
        let nameA = document.getElementById('name');
        nameA.innerHTML = `name: none`;

        let sizeA = document.getElementById('size');
        sizeA.innerHTML = `size: none (max.19.MB)`;

        try {
            let oldVideo = document.getElementById('videoRead');
            document.getElementById('infoFile').removeChild(oldVideo);
        } catch (err) {

        }

    } else {

        let nameA = document.getElementById('name');
        nameA.innerHTML = `name: ${file.name}`;

        let sizeA = document.getElementById('size');
        sizeA.innerHTML = `size: ${humanFileSize(file.size, "MB")} (max. 19.4MB)`;


        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async function (event) {
            let parent = document.getElementById('infoFile');
            try {
                let oldVideo = document.getElementById('videoRead');
                parent.removeChild(oldVideo);
            } catch (err) {

            }


            let video = document.createElement('video');
            let the_url = event.target.result;

            video.setAttribute('width', "400");
            video.setAttribute('id', "videoRead");
            video.setAttribute('controls', "");

            let source = document.createElement('source');
            source.setAttribute('id', "vid-source");
            source.setAttribute('type', 'video/mp4');
            source.setAttribute('src', the_url);

            video.append(source);

            parent.append(video);
        }
    }
}




function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (bytes < thresh) return bytes + ' B';
    var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (bytes >= thresh);
    return bytes.toFixed(1) + ' ' + units[u];
}



async function uploadsuc6(soundFile, soundDescription) {
    soundFile.value = '';
    soundDescription.value = '';
    display();
}