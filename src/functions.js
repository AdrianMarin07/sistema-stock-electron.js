require('bootstrap');
const { ipcRenderer } = require('electron');

function showRecord(){
    document.getElementById("record-modal").style.display = "block";
}

function closeRecord(){
    document.getElementById("record-modal").style.display = "none";
}

function checkConfirmation(){    
    document.getElementById("confirmation-modal").style.display = "block";
}

function closeConfirmation() {
    document.getElementById("confirmation-modal").style.display = "none";
}

function saveProduct(){
    document.getElementById("confirmation-modal").style.display = "none";
}

function insert() {
    ipcRenderer.send('db-insert', {table: 'brand', data: {name: "Nivea"}});
}
function select() {
    ipcRenderer.send('db-select', {table: 'brand'});
}