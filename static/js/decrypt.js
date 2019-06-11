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
      var count = data.chunks
      var filename = CryptoJS.AES.decrypt(data.fname, password_string).toString(CryptoJS.enc.Utf8)
      for (var i=1; i <= count; i++){
        $.ajax({
          method: "GET",
          async: false,
          url: "/api/download/"+fid+"/"+i,
          success: function (data){
            dec_content += CryptoJS.AES.decrypt(data, password_string).toString(CryptoJS.enc.Utf8)
          }
        });
      }
      download(filename,dec_content)
      $("#loader").css("visibility", "hidden")
    }
  });
}
