
function fetchUser(){fetch('https://randomuser.me/api/')
.then((response) => {
    return response.json();
}).then((response) => {
    var test = response.results[0].name;
    console.log(response);
    document.getElementById('nombre').innerHTML = test.first + ' ' + test.last;
    var genderCmp = document.getElementById('gender');
    var contenido = document.getElementById('contenido');
    
    if(!genderCmp){
        console.log('entre al if');
    var genderContainer = document.createElement("p");
    genderContainer.id = "gender";
    var gender = document.createTextNode('Gender:' +response.results[0].gender);
    genderContainer.appendChild(gender);
    contenido.appendChild(genderContainer);
    }else{
        var gender = document.createTextNode('Gender: ' +response.results[0].gender);
        genderCmp.innerHTML = gender.textContent;
    }

})}

function showData(obj){
}