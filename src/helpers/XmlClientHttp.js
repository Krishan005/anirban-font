const API_URL = process.env.REACT_APP_API_BASE_URL
const ALLOW_ORIGIN = process.env.REACT_APP_ALLOWED_ORIGIN;

async function fileUpload(url, data) {
    var xhr = new XMLHttpRequest();
    // xhr.upload.onprogress = function (event) {
    //     // console.log(`Uploaded ${event.loaded} of ${event.total}`);
    //     let percent = (event.loaded * 100) / event.total;
    //     callback(percent);
    // };

    xhr.onloadend = function () {
        if (xhr.status == 200 || xhr.status == 201) {
            console.log("Success");
        } else {
            console.log("error");
        }
    };

    xhr.open("post", API_URL + url);
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.setRequestHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);

    return new Promise((resolve, reject) => {
        xhr.send(data);
        xhr.onload = () => {
            let response = JSON.parse(xhr.response);
            resolve(response);
        };
    });
}

export {
    fileUpload
}