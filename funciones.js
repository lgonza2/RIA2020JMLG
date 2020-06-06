
let bookContainer = document.getElementById('bookContainer');
let currentCategory = "";
let mainTitle = document.getElementById('mainTitle');
let currentBooks = [];

function fetchUser(){fetch('https://randomuser.me/api/')
.then((response) => {
return response.json();
}).then((response) => {
    //console.log(response);
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


function getLibrosFromCategory(categoryName){
    if(categoryName != currentCategory){
        currentCategory = categoryName;
        resetView();
        showSpinner();
        var search = 'https://www.etnassoft.com/api/v1/get/?category=' + categoryName + '&num_items=50';
        var categoryTitle = fixCategoryName(categoryName);
        fetch(search)
        .then((response) => {
            return response.json();
         }).then((response) => {
                resetView();
                currentBooks = [];
                document.getElementById('orderFilter').hidden = false;
                mainTitle.innerHTML = "Categoria " + MaysPrimera(categoryTitle.toLowerCase());
                var json = response;
                for(let i in json){
                    var nodo = createBookNode(json[i].title, json[i].url_details,json[i].cover);
                    bookContainer.appendChild(nodo);
                    var ancla = document.createElement('a');
                    insertBook(json[i]);
                }
                getCurrentAuthors();
        });
    }
}


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

function resetView(){

     while(bookContainer.hasChildNodes()){
         var firstNode = bookContainer.firstChild;
         bookContainer.removeChild(firstNode);
     }
}


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

function MaysPrimera(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


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

function orderBooks(){

    var orderFilter = document.getElementById('orderFilterValue').value;
    var orderType = document.getElementById('orderType').value;
    showSpinner();
    if(orderFilter == "Titulo"){
        if(orderType == "ASC"){
            insertBookNodes(currentBooks,"title","asc");
        }else{
            insertBookNodes(currentBooks,"title","desc");
        }
    }else if(orderFilter == "Autor"){
        if(orderType == "ASC"){
            insertBookNodes(currentBooks,"author","asc");
        }else{
            insertBookNodes(currentBooks,"author","desc");
        }
    }else if(orderFilter == "Paginas"){
        if(orderType == "ASC"){
            insertBookNodes(currentBooks,"pages","asc");
        }else{
            insertBookNodes(currentBooks,"pages","desc");
        }
    }


}

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


function createBookNode(title, url, cover){
    var nodo = document.createElement('a');
    nodo.setAttribute("name","libro");
    nodo.setAttribute("title",title);
    nodo.setAttribute("href", url);
    var img = document.createElement('img');
    img.setAttribute("src", cover);
    img.setAttribute("alt",title);
    img.setAttribute("class","minibox imagenLibro")
    nodo.appendChild(img);
    return nodo;
}

function insertBookNodes(json, property, order){
    sortJSON(json, property, order);
            resetView();
            for(let i in currentBooks){
                var node = createBookNode(currentBooks[i].title, currentBooks[i].url_details,currentBooks[i].cover);
                bookContainer.appendChild(node);
            }
}

function enableFilter(checked){
    if(checked){
        document.getElementById('languageFilter').disabled = false;
        document.getElementById('authorFilter').disabled = false;
    }else{
        document.getElementById('languageFilter').disabled = true;
        document.getElementById('authorFilter').disabled = true;
    }
}

function filterBooksByLanguage(language){


    
}

function getCurrentAuthors(){
    var currentAuthors = new Set();
    for(var i in currentBooks){
        currentAuthors.add(currentBooks[i].author);
        console.log(currentBooks[i].author);
    }
}

function fixCategoryName(categoryName){
    console.log(categoryName);
    if(categoryName == "Libros_aspecotos_legales"){
        categoryName = "Aspectos legales";
    }else if(categoryName == "Bases_de_datos"){
        categoryName = "Bases de datos";
    }else if(categoryName == "Control_de_versiones"){
        categoryName = "Control de versiones";
    }else if(categoryName == "Desarrollo_web"){
        categoryName = "Desarrollo Web";
    }else if(categoryName == "Bases_de_datos"){
        categoryName = "Bases de datos";
    }else if(categoryName == "Bases_de_datos"){
        categoryName = "Bases de datos";
    }else if(categoryName == "Bases_de_datos"){
        categoryName = "Bases de datos";
    }else if(categoryName == "Bases_de_datos"){
        categoryName = "Bases de datos";
    }else if(categoryName == "Bases_de_datos"){
        categoryName = "Bases de datos";
    }
    return categoryName;
}



