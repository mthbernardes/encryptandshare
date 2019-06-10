function encrypt() {
  var rawfile = document.getElementById("file")["files"][0];
  var reader = new FileReader();
  var enc_content = "";
  //var password = document.getElementById("password").value
  var password = "admin"
  var lastlength = 0;
  var count = 1;

  clearInterval(passwordgenerator);
  $('html').loading({theme: 'dark'})
  var fname_enc = CryptoJS.AES.encrypt(rawfile.name, password).toString();
  var limit = document.getElementById("limit-downloads").value
  $.ajax({
    method: "POST",
    url: "/api/upload",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({fname:fname_enc,limit:limit}),
    success: function (response){
      var fid = response["fid"]
      onload(fid)
      reader.readAsArrayBuffer(rawfile)
    }
  });

  function sendToServer(binary,fid,count){
    console.log(binary)
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/upload/"+fid+"/"+count,false);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.send(binary);
  }

  function onload (fid){
    reader.onload = function (e){
      console.log(e)
      console.log(Math.round((e.loaded /1000000))+ "Mb/" + Math.round((e.total/1000000))+"Mb")
      var binary = ""
      var bytes = new Uint8Array(e.target.result)
      var length = bytes.byteLength;
      var CHUNK_SIZE = 4096 * 1000
      var count = 1
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
        //binary += bytes[i]
        //if(binary.length >= CHUNK_SIZE){
        //  enc_content += CryptoJS.AES.encrypt(binary, password).toString(CryptoJS.enc.Utf8);
        //  console.log(enc_content)
        //  sendToServer(enc_content,fid,count)
        //  count += 1
        //  binary = ""
        //}
      }
      if(binary){
        //enc_content += CryptoJS.AES.encrypt(binary, password).toString(CryptoJS.enc.Utf8);
        //sendToServer(binary,fid,count)
        download("file.jpg",binary)
      }
      console.log(binary)
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


  //  function onload(fid){
  //    reader.onload = function (e) {
  //      console.log(e)
}

function decrypt(file){
  $('html').loading({theme: 'dark'})
  var password = "admin"
  //var password = document.getElementById("password").value
  var reader = new FileReader();
  var dec_content=""
  var lastlength = 0;
  var fid = document.getElementById("fid").value
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/download/"+fid,);
  xhr.send();
  xhr.onreadystatechange = function (data) {
    if (xhr.readyState === 4) {
      var count = JSON.parse(data.target.response)["chunks"]
      var filename = CryptoJS.AES.decrypt(JSON.parse(data.target.response)["fname"],password).toString(CryptoJS.enc.Utf8)
      for (var i=1; i <= count; i++){
        var xhrinside = new XMLHttpRequest();
        xhrinside.open("GET", "/api/download/"+fid+"/"+i,false);
        xhrinside.onreadystatechange = function (data) {
          if (xhr.readyState === 4) {
            //result = e.target.result.slice(lastlength,)
            //lastlength = e.target.response.length
            dec_content += CryptoJS.AES.decrypt(data.target.response, password).toString(CryptoJS.enc.Utf8)
            //console.log(data.target.response)
            //dec_content += data.target.response
          }
        }
        xhrinside.send();
      }
      download(filename,dec_content)
      console.log(dec_content)
      $('html').loading('stop')
    }
  }
}

function download(fname,fcontent){
  console.log("Dowloading...")
  var data = new Blob([fcontent],{type: 'application/octet-binary'})
  var url = window.URL.createObjectURL(data);
  var element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', fname);
  element.style.display = 'none';
  console.log(element)
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function hex2a(hex){
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
