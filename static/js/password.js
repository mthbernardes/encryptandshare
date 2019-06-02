function generatePasswords() {
  var password = ""
  for(i=0; i<5; i++){
    password += (Math.random() * 10000000).toString(36).replace('.', '')
  }
  document.getElementById("password").value = password;
}

var passwordgenerator = window.setInterval(generatePasswords,1000)
