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
    const brand = {
        id: 1, 
        name: 'tecno'
    };

    ipcRenderer.send('db-insert', {table: 'brand', data: brand});
    const type = {
        name: 'Pintura', 
        id: 1, 
        brand 
    }
    ipcRenderer.send('db-insert', {table: 'type', data: type});
    const product = {
        detail: "blanca 3L", 
        id: 1, 
        type
    }
    ipcRenderer.send('db-insert', {table: 'product', data: product});
    const record = {
        transaction: 1, 
        date: '9-12-20 17:22:30', 
        quantity: 20, 
        product
    };
    ipcRenderer.send('db-insert', {table: 'record', data: record});
}

function select () {
    ipcRenderer.send('db-select', {table: 'brand'});
    ipcRenderer.send('db-select', {table: 'type'});
    ipcRenderer.send('db-select', {table: 'product'});
    ipcRenderer.send('db-select', {table: 'record'});
}

function remove() {
    const brand = {
        id: 1, 
        name: 'tecno'
    };
    ipcRenderer.send('db-delete', {table: 'brand', data: brand});
}