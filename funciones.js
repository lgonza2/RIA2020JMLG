//Variables globales 
let bookContainer = document.getElementById('bookContainer'); // Contenedor principal de los libros
let currentCategory = "";//Categoria que se esta mostrando 
let mainTitle = document.getElementById('mainTitle'); //Titulo de la pantalla
let currentBooks = []; //Array de libros para manejar los libros que esten en pantalla 
let auxBooks = [];
let orderFilter = document.getElementById('orderFilterValue');
let orderType = document.getElementById('orderType');
let languageFilter =  document.getElementById('languageFilter');
let authorFilter =  document.getElementById('authorFilter');
let currentAuthors;


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
        var userPhone = result.phone;
        
        if(userGender == "male"){
            userGender = "Male";
        }else{
            userGender = "Female";
        }

        document.getElementById('photo').src = userPhotoUrl;
        document.getElementById('userName').innerHTML = userFullName;
        document.getElementById('phone').innerHTML = userPhone;
        document.getElementById('gender').innerHTML = userGender;
        document.getElementById('email').innerHTML = userEmail;

        document.getElementById('contenido').hidden = false;

        }else{
      //  console.error('Error');
        }
    });
}

//Funcion para retornar las categorias existentes en la API
function getCategories(){
    var categorias = document.getElementById('categorias');
    var spinner = categorias.firstElementChild;
    if(categorias.children.length == 1){
    fetch('https://www.etnassoft.com/api/v1/get/?get_categories=all')
    .then((response) => {
    return response.json();
    }).then((response) => {
        categorias.removeChild(spinner);
        var json = response;
        for(let i in json){
            var nodo = document.createElement('a');
            nodo.setAttribute("class","list-group-item list-group-item-action bg-dark text-light border-bottom border-top");
            nodo.setAttribute("href","#");
            nodo.setAttribute("style","font-size:12px;");
            nodo.setAttribute("title", json[i].nicename);
            nodo.setAttribute("onclick","getLibrosFromCategory(this.title)");
            nodo.innerHTML = json[i].name;
            categorias.appendChild(nodo);
        }
});
}
}

//Funcion para llamar la API y retornar los libros de una categoria dada
function getLibrosFromCategory(categoryName){
    console.log(categoryName);
    if(categoryName != currentCategory){
        currentCategory = categoryName;
        resetView();
        document.getElementById('indice').hidden = true;
        document.getElementById('orderFilter').hidden = true;
        showSpinner();
        var search = 'https://www.etnassoft.com/api/v1/get/?category=' + categoryName + '&num_items=50';
        var categoryTitle = fixCategoryName(categoryName);
        mainTitle.innerHTML = "Categoria " + MaysPrimera(categoryTitle.toLowerCase());
        fetch(search)
        .then((response) => {
            return response.json();
         }).then((response) => {
                resetView();
                currentBooks = [];
                document.getElementById('orderFilter').hidden = false;
                for(let i in response){
                    insertBook(response[i]);
                }
                insertBookNodes(currentBooks);
                document.getElementById('defaultUnchecked').checked = false;
                enableFilter(false);
                orderType.value = "asc";
                orderFilter.value = "title";
        });
    }
}

//Funcin para cambiar el label del boton toggle
function changeToggleLabel(){
    var toggle = document.getElementById('menu-toggle');
    if(toggle.title == "Ocultar"){
       toggle.innerHTML = "Mostrar";
       toggle.title = "Mostrar";
    }else{
        toggle.innerHTML = "Ocultar";
        toggle.title = "Ocultar";
    }
  
    
}


//Funcion para borrar los libros actuales al cambiar por otros
function resetView(){
     while(bookContainer.hasChildNodes()){
         var firstNode = bookContainer.firstChild;
         bookContainer.removeChild(firstNode);
     }
}

//Funcion para mostrar el spinner cuando esta cargando la informacion de la API
function showSpinner(){
    var spinner = document.createElement('div');
    spinner.setAttribute("class","text-center");
    var spinnerNode = document.createElement('div');
    spinnerNode.setAttribute("class","spinner-border");
    spinnerNode.setAttribute("style","width: 5rem; height: 5rem;");
    spinnerNode.setAttribute("role","status");
    var spinnerSpan =document.createElement("span");
    spinnerSpan.setAttribute("class","sr-only");
    spinnerSpan.innerHTML = "Loading ...";
    spinnerNode.appendChild(spinnerSpan);
    spinner.appendChild(spinnerNode);
    bookContainer.appendChild(spinner);
}


//Funcion para poner mayuscula la primera letra de un array
function MaysPrimera(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

//Funcion para crear los objetos Libro
function insertBook(bookData){
    let book = new Object;
    book.title = bookData.title;
    book.author = bookData.author;
    book.pages = bookData.pages;
    book.url = bookData.url_details;
    book.cover = bookData.cover;
    book.language = bookData.language;
    currentBooks.push(book);
}

//Funcion para ordenar los libros segun el filtro dado
function orderBooks(){
    showSpinner();
    if(auxBooks.length == 0){
        insertBookNodes(currentBooks);
    }else{
        insertBookNodes(auxBooks);
    }
    }


//Funcion para ordenar los libros por una de sus propiedades en orden asc o desc
function sortJSON(data, key, orden) {
    return data.sort(function (a, b) {
        var x = a[key],
        y = b[key];
        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

/*Funcion para crear el nodo generico del libro para insertar al DOM
En caso de hacer modificaciones a como se ven los libros , 
solo hay que cambiar este codigo y todos se veran igual*/
function createBookNode(title, url, cover){
    var div = document.createElement('div');
   var titulo=document.createElement('h5');
    titulo.setAttribute("style","font-size: 20px; margin: 5px;");
    titulo.innerHTML=title;
    var nodo = document.createElement('a');
    nodo.setAttribute("name","libro");
    nodo.setAttribute("title",title);
    nodo.setAttribute("href", url);
    
    var img = document.createElement('img');
   
    img.setAttribute("src", cover);
    img.setAttribute("alt",title);
    img.setAttribute("class","minibox imagenLibro");
    nodo.appendChild(img);
    div.setAttribute('style',' display: inline;');
     div.appendChild(nodo);
    
    return div;
}


//Funcion para insertar los libros retornados por la API en el DOM (mostrarlos en la pantalla)
function insertBookNodes(json){
    sortJSON(json, orderFilter.value, orderType.value);
            resetView();
            for(let i in json){
                var node = createBookNode(json[i].title, json[i].url,json[i].cover);
                bookContainer.appendChild(node);
            }
            setAuthors(json);
}


//Funcion para habilitar el filtro de libros 
function enableFilter(checked){
    if(checked){
        languageFilter.disabled = false;
        authorFilter.disabled = false;
    }else{
        languageFilter.disabled = true;
        languageFilter.value = "ninguno";
        authorFilter.disabled = true;
        authorFilter.value = "";
        insertBookNodes(currentBooks);
    }
}

function filterBooksByAuthor(selectedAuthor){
    var filteredBooks = [];

}

//Funcion para filtrar los libros en pantalla por lenguaje
function filterBooksByLanguage(language){
    var filteredBooks = [];
    if(language != "ninguno"){
    for(var i in currentBooks){
        if(currentBooks[i].language == language){
            filteredBooks.push(currentBooks[i]);
        }else{

        }
    }
    auxBooks = currentBooks;
    currentBooks = filteredBooks;
    insertBookNodes(filteredBooks);
    currentBooks = auxBooks;
    auxBooks = filteredBooks;
}else{
    insertBookNodes(currentBooks);
}
}
//Funcion para obtener los autores de los libros que estan en pantalla
function getCurrentAuthors(books){
    currentAuthors = new Set();
    for(var i in books){
        currentAuthors.add(books[i].author);
    }
    return Array.from(currentAuthors).sort();
}


function setAuthors(books){
    while(authorFilter.hasChildNodes()){
        var firstNode = authorFilter.firstChild;
        authorFilter.removeChild(firstNode);
    }
    var emptyValueNode = document.createElement("option");
    emptyValueNode.setAttribute('value', "");
    emptyValueNode.innerHTML = "";
    authorFilter.appendChild(emptyValueNode);
    var authors = getCurrentAuthors(books);
    for(let i in authors){
    var nodo = document.createElement("option");
    nodo.setAttribute('value', authors[i]);
    nodo.innerHTML = a= authors[i];
    authorFilter.appendChild(nodo);
    }
}


//Funcion para arreglar los category name traidos por la API
function fixCategoryName(categoryName){
    if(categoryName == "libros_aspecotos_legales"){
        categoryName = "Aspectos legales";
    }else if(categoryName == "bases_de_datos"){
        categoryName = "Bases de datos";
    }else if(categoryName == "control_de_versiones"){
        categoryName = "Control de versiones";
    }else if(categoryName == "desarrollo_web"){
        categoryName = "Desarrollo Web";
    }else if(categoryName == "diseno_3d"){
        categoryName = "Diseño 3D";
    }else if(categoryName == "ensayos_y_novelas"){
        categoryName = "Ensayos y novelas";
    }else if(categoryName == "marketing_y_business"){
        categoryName = "Marketing y negocios";
    }else if(categoryName == "metodologias_agiles"){
        categoryName = "Metodologias agiles";
    }else if(categoryName == "libros_programacion"){
        categoryName = "Programacion";
    }else if(categoryName == "redes_y_sysadmins"){
        categoryName = "Redes y SysAdmins";
    }else if(categoryName == "seo_y_sem"){
        categoryName = "Seo y Sem";
    }else if(categoryName == "textos-academicos"){
        categoryName = "Textos academicos";
    }else if(categoryName == "libros_web_2_0_y_social_media"){
        categoryName = "Web y Social media";
    }else if(categoryName == "libros_programacion"){
        categoryName = "Programacion";
    }
    return categoryName;
}


function subrayar(letra){
    
    var contenido = document.getElementById(letra).innerHTML;
    if(contenido.includes('<u>')){
        document.getElementById(letra).innerHTML = letra;
    }else{
        document.getElementById(letra).innerHTML = "<u>"+letra+"</u>";
    }

}

function getLibrosFromIndex(index){
    console.log(index);
    resetView();
    showSpinner();
    var indexButtons = document.getElementsByName('indexButton');
    for ( var i in indexButtons){
        indexButtons[i].disabled = true;
    }
    document.getElementById(index).disabled = false;
   var query = 'https://www.etnassoft.com/api/v1/get/?book_title_index=' + index.toLowerCase() + '&num_items=25' ;
    fetch(query)
    .then((response) => {
    return response.json();
    }).then((response) => {
        resetView();
        document.getElementById('indice').hidden = false;
        currentBooks = [];
                for(let i in response){
                    insertBook(response[i]);
                }
                insertBookNodes(currentBooks);
                for ( var i in indexButtons){
                    indexButtons[i].disabled = false;
                }
    });
}






