// Javascript for the gallery page

var title = document.getElementById("gallery-title");
var titleEdit = document.getElementById("gallery-title-edit");

title.onclick = function(e) {
	e.preventDefault();
	titleEdit.style.display = 'block';
}