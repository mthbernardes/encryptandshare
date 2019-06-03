function encrypt() {
  clearInterval(passwordgenerator)
  $('body').loading({theme: 'dark'});
  var file = document.getElementById("file")["files"][0]
  var reader = new FileReader();
  reader.onload = function (e) {

    var contents = e.target.result
    var password = document.getElementById("password").value
    document.getElementById("password").value = password
    var fileContentsEnc = CryptoJS.AES.encrypt(contents, password).toString();
    var fileNameEnc = CryptoJS.AES.encrypt(file.name, password).toString();
    upload(fileContentsEnc,fileNameEnc)
  }
  reader.readAsDataURL(file)
}

function decrypt(file){
  var reader = new FileReader();
  reader.onload = function (e) {
      var password = document.getElementById("password-to-decrypt").value
      var fname = CryptoJS.AES.decrypt(file.name, password).toString(CryptoJS.enc.Utf8)
      var fcontent = CryptoJS.AES.decrypt(e.target.result, password).toString(CryptoJS.enc.Utf8)
      if (fcontent) {
        console.log(file.name)
        console.log(fname)
        download(fname,fcontent)
      } else {
        alert("Unable to decrypt");
      }
    }
  reader.readAsText(file)
}
