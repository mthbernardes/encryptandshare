function intergerValidate(event) {
    var code;

    if (event.keyCode == 0) {
        code = event.charCode;
    } else {
        code = event.keyCode;
    }

    if (code < 48 || code > 57) {
        if (code != 8 && code != 46 && code != 37 && code != 39) {
            event.preventDefault();
        }
    }
}


document.getElementById("url-share").onclick = function() {
  this.select();
  document.execCommand('copy');
}

document.getElementById("password").onclick = function() {
  this.select();
  document.execCommand('copy');
}

