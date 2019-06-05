function generatePasswords() {
  var password = ""
  var array = new Uint32Array(6);
  window.crypto.getRandomValues(array);
  for (var i = 0; i < array.length; i++) {
    password += array[i].toString(36);
  }
  document.getElementById("password").value = password;
}

var passwordgenerator = window.setInterval(generatePasswords,1000)
