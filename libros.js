google.books.load();

function initialize() {
  var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
// viewer.load('ISBN:0738531367');

//viewer.load('ISBN:9789876347877');
// viewer.load('9780976111146');
// viewer.load('9781291056006');
viewer.load('9780976111122');


}

google.books.setOnLoadCallback(initialize);