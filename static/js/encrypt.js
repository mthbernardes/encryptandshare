function sendToServer(binary,fid,count,maxchunk) {
  return axios({
    method: "PUT",
    url: "/api/upload/"+fid+"/"+count,
    headers: { 'content-type':"application/octet-stream"},
    data: binary
  })    
}

function encrypt() {
  var rawfile = document.getElementById("file")["files"][0];
  var reader = new FileReader();
  var lastlength = 0;
  var count = 1;
  var password_string = document.getElementById("password").value

  clearInterval(passwordgenerator);
  $("#loader").css("visibility", "visible")
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

  function onload (fid){
    reader.onload = function (e){
      var enc_content = ""
      var binary = ""
      var bytes = reader.result
      var length = bytes.length
      var CHUNK_SIZE = 1024 * 1000
      var count = 1
      var chunks = chunkArrayInGroups(bytes, CHUNK_SIZE)
      var promises = chunks.map((chunk,i) => sendToServer(CryptoJS.AES.encrypt(chunk, password_string).toString(),fid,i+1,chunks.length))

      Promise.all(promises).then(()=>
        $.ajax({
          method: "PATCH",
          url: "/api/upload/"+fid,
          success: function (data) {
            $("#url-share").val(location.protocol + "//" + location.host + "/" + fid)
            $("#url-share").attr("type","text")
            $("#file-select").css("visibility", "hidden")
            $("#upload-button").css("visibility", "hidden")
            $("#limit-downloads").attr("readonly",true)
            $("#loader").css("visibility", "hidden")
          }
        })
      )
    } 
  }
}
