function decrypt(file){
  $('html').loading({theme: 'dark'})
  var password_string = document.getElementById("password-to-decrypt").value
  console.log(password_string)
  var reader = new FileReader();
  var dec_content= ""
  var lastlength = 0;
  var fid = document.getElementById("fid").value
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/download/"+fid,);
  xhr.send();
  xhr.onreadystatechange = function (data) {
    if (xhr.readyState === 4) {
      var count = JSON.parse(data.target.response)["chunks"]
      var filename = CryptoJS.AES.decrypt(JSON.parse(data.target.response)["fname"], password_string).toString(CryptoJS.enc.Utf8)
      for (var i=1; i <= count; i++){
        var xhrinside = new XMLHttpRequest();
        console.log(i)
        xhrinside.open("GET", "/api/download/"+fid+"/"+i,false);
        xhrinside.onreadystatechange = function (data) {
          if (xhr.readyState === 4) {
            console.log(fid)
            if(data.target.response){
              dec_content += CryptoJS.AES.decrypt(data.target.response, password_string).toString(CryptoJS.enc.Utf8)
            }
          }
        }
        xhrinside.send();
      }
      download(filename,dec_content)
      $('html').loading('stop')
    }
  }
}
