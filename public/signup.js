document
.getElementById("signupForm")
.addEventListener(
"submit",

async function(e){

e.preventDefault();

let email =
document.getElementById("email").value;

let password =
document.getElementById("password").value;


const response =
await fetch(
"/api/users/signup",
{

method: "POST",

headers: {
"Content-Type":
"application/json"
},

body: JSON.stringify({

email,
password

})

}

);


const data =
await response.json();

alert(data.message);

});