function decrypt(file){
  $("#loader").css("visibility", "visible")
  var password_string = $("#password-to-decrypt").val();
  var reader = new FileReader();
  var dec_content= "";
  var lastlength = 0;
  var fid = $("#fid").val();
  
  $.ajax({
    method: "POST",
    url: "/api/download/"+fid,
    success: function (data){
      var count = [...Array(data.chunks).keys()]
      var filename = CryptoJS.AES.decrypt(data.fname, password_string).toString(CryptoJS.enc.Utf8)
      console.log(filename)
      var promises = count.map((count)=>downloadfromserver(fid,count+1))
      Promise.all(promises).then((response)=>
        response.map(data=>CryptoJS.AES.decrypt(data.data, password_string).toString(CryptoJS.enc.Utf8))
      ).then(
        response=>response.join("")
      ).then(
        response=>download(filename,response)
      )
    }
  })
}
      
function downloadfromserver(fid,i){
  return axios({
    method: "GET",
    url: "/api/download/"+fid+"/"+i,
    })
}
