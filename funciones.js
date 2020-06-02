
function fetchUser(){fetch('https://randomuser.me/api/')
.then((response) => {
return response.json();
}).then((response) => {
    
    if(response.results.length > 0){

        var result = response.results[0];
        var userName = response.results[0].name;
        var userFullName = userName.title + ' ' + userName.first + ' ' + userName.last;
        var userPhotoUrl = result.picture.large;
        var userGender = result.gender;
        var userEmail = result.email;
        
        if(userGender == "male"){
            userGender = "Male";
        }else{
            userGender = "Female";
        }

        document.getElementById('photo').src = userPhotoUrl;
        document.getElementById('userName').innerHTML = userFullName;
        document.getElementById('phone').innerHTML = userEmail;
        document.getElementById('gender').innerHTML = userGender;
        document.getElementById('email').innerHTML = userEmail;

        document.getElementById('contenido').hidden = false;

        }else{
        console.error('Error');
        }
    })
}

