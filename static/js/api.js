function upload(fcontent, fname){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var response = JSON.parse(xhr.responseText);
      document.getElementById("url-share").value = location.protocol + "//" + location.host + "/" + response["fid"]
      document.getElementById("url-share").type = "text"
    }
  }
  xhr.open("POST", "/api/upload");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({fcontent:fcontent, fname:fname}));
}

function download(fname,fcontent){
  var element = document.createElement('a');
  element.setAttribute('href', fcontent);
  element.setAttribute('download', fname);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function getfile() {
  var fid = document.getElementById("fid").value
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var response = JSON.parse(xhr.responseText);
      var file = new File([response["fcontent"]],response["fname"])
      decrypt(file)
      //fname= decrypt(response["fname"])
      //fcontent = decrypt(response["fcontent"])
      //if (fname) {
      //  download(fname,fcontent)
      //} else {
      //    alert("Impossible to decrypt")
      //  }
      }
    }
  xhr.open("POST", "/api/download");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({fid:fid}));
}
