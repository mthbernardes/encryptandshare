function generatePasswords() {
  var password = window.niceware.generatePassphrase(12).join([separador = ' '])
  document.getElementById("password").value = password;
}
var passwordgenerator = window.setInterval(generatePasswords,1000)
