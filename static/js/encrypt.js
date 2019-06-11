function encrypt() {
  var rawfile = document.getElementById("file")["files"][0];
  var reader = new FileReader();
  var lastlength = 0;
  var count = 1;
  var password_string = document.getElementById("password").value

  console.log(password_string)
  clearInterval(passwordgenerator);
  $('html').loading({theme: 'dark'})
  var fname_enc = CryptoJS.AES.encrypt(rawfile.name, password_string).toString();
  var limit = document.getElementById("limit-downloads").value
  $.ajax({
    method: "POST",
    url: "/api/upload",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({fname:fname_enc,limit:limit}),
    success: function (response){
      var fid = response["fid"]
      onload(fid)
      reader.readAsDataURL(rawfile,"utf-8")
    }
  });

  function sendToServer(binary,fid,count){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/upload/"+fid+"/"+count,false);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.send(binary);
  }

  function onload (fid){
    reader.onload = function (e){
      var enc_content = ""
      var binary = ""
      var bytes = reader.result
      var length = bytes.length
      var CHUNK_SIZE = 4096 * 1000
      var count = 1
      if(length <= CHUNK_SIZE){
        console.log("menor")
        enc_content = CryptoJS.AES.encrypt(bytes, password_string).toString();
        sendToServer(enc_content,fid,count)
        console.log(bytes[0])
      } else {
        for (var i = 0; i < length; i++) {
          binary += bytes[i]
          if(binary.length >= CHUNK_SIZE){
            console.log(binary.size)
            enc_content = CryptoJS.AES.encrypt(binary, password_string).toString();
            sendToServer(enc_content,fid,count)
            enc_content = ""
            binary = ""
            count += 1
          }
        }
        if(binary.length > 0){
          enc_content = CryptoJS.AES.encrypt(binary, password_string).toString();
          sendToServer(enc_content,fid,count)
        }
      }
      var xhr = new XMLHttpRequest();
      xhr.open("PATCH", "/api/upload/"+fid);
      xhr.send();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          document.getElementById("url-share").value = location.protocol + "//" + location.host + "/" + fid
          document.getElementById("url-share").type = "text"
          document.getElementById("file-select").style.visibility = "hidden"
          document.getElementById("upload-button").style.visibility = "hidden"
          document.getElementById("limit-downloads").setAttribute("readonly", true)
          $('html').loading('stop')
        }
      }
    }
  }
}

