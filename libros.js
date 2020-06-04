




function buscarLibro(query){
    var bookQuantityTitle = document.getElementById('bookQuantityTitle');
    var libros = document.getElementsByName('libro'); 
    if(query == ''){
        showAllBooks();
    }else{
    var normalQuery = query;
    query = query.toLowerCase();
    bookQuantityTitle.innerHTML = 'Resultados de búsqueda para \'' + normalQuery + '\'';
    document.getElementById('borrarFiltro').hidden = false;
    var booksQty = libros.length;// si luego queremos poner la cantidad de resultados
    for(var i = 0; i < libros.length ; i++){
        if(libros[i].title.toLowerCase().includes(query)){
            libros[i].hidden = false;
        }else{
            booksQty --;
            libros[i].hidden = true;
        }
    }
}  
}

function showAllBooks(){
    var libros = document.getElementsByName('libro'); 
    var bookQuantity = document.getElementsByName("libro").length;
    bookQuantityTitle.innerHTML = 'Mostrando '+  bookQuantity + ' de ' + bookQuantity + ' libros.';
    document.getElementById('borrarFiltro').hidden = true;
    for(var i = 0; i < libros.length ; i++){
        libros[i].hidden = false;
    }
    document.getElementById('search').value = '';
    
}
