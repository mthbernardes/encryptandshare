function handleFileSelect(evt) {
  var file = evt.target.files[0]; // FileList object
  var output = [];
  output.push('<strong>', escape(file.name)," ",file.size, ' bytes</strong>');
  document.getElementById('file-selected').innerHTML = output.join('');
}

try {
  document.getElementById('file').addEventListener('change', handleFileSelect, false);
} catch (e) {
  console.log(e)
}

document.getElementById("url-share").onclick = function() {
  this.select();
  document.execCommand('copy');
}

document.getElementById("password").onclick = function() {
  this.select();
  document.execCommand('copy');
}