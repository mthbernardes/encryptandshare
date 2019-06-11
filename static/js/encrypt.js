function encrypt() {
  var rawfile = document.getElementById("file")["files"][0];
  var reader = new FileReader();
  var lastlength = 0;
  var count = 1;
  //var password = document.getElementById("password").value
  var password_string = "admin"

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
      //reader.readAsArrayBuffer(rawfile,"utf-8")
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
      var CHUNK_SIZE = 2048 * 1000
      var count = 1
      if(length <= CHUNK_SIZE){
        console.log("menor")
        //wordarray = CryptoJS.lib.WordArray.create(bytes)
        //enc_content = CryptoJS.AES.encrypt(wordarray, password_string).toString();
        enc_content = CryptoJS.AES.encrypt(bytes, password_string).toString();
        sendToServer(enc_content,fid,count)
        console.log(bytes[0])
      } else {
        for (var i = 0; i < length; i++) {
          binary += bytes[i]
          if(binary.length >= CHUNK_SIZE){
            enc_content = CryptoJS.AES.encrypt(binary, password_string).toString();
            sendToServer(enc_content,fid,count)
            enc_content = ""
            binary = ""
            count += 1
          }
        }
        if(binary.length > 0){
          console.log(binary.length)
          enc_content = CryptoJS.AES.encrypt(binary, password_string).toString();
          sendToServer(binary,fid,count)
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

function decrypt(file){
  $('html').loading({theme: 'dark'})
  var password_string = "admin"
  //var password = document.getElementById("password").value
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
      var filename = CryptoJS.AES.decrypt(JSON.parse(data.target.response)["fname"],password_string).toString(CryptoJS.enc.Utf8)
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
      //download(filename,dec_content)
      $('html').loading('stop')
    }
  }
}

//function download(fname,fcontent){
//  console.log("Dowloading...")
//  var data = new Blob([fcontent],{encoding: 'utf-8'})
//  var url = window.URL.createObjectURL(data);
//  var element = document.createElement('a');
//  element.setAttribute('href', url);
//  element.setAttribute('download', fname);
//  element.style.display = 'none';
//  console.log(element)
//  document.body.appendChild(element);
//  element.click();
//  document.body.removeChild(element);
//}
function downloadURI(name,uri) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}
