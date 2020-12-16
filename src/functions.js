const $ = require('jquery');
require('bootstrap');
const { ipcRenderer } = require('electron');

function showRecord(data) {

    ipcRenderer.send('db-select', { table: 'stock', purpose: 'fill-modal-header'});

}

function closeRecord() {
    document.getElementById("record-modal").style.display = "none";
}

function checkConfirmation() {
    document.getElementById("confirmation-modal").style.display = "block";
}

function closeConfirmation() {
    document.getElementById("confirmation-modal").style.display = "none";
}

function saveProduct() {
    document.getElementById("confirmation-modal").style.display = "none";
}

function insert() {
    const brand = {
        id: 1,
        name: 'tecno'
    };

    ipcRenderer.send('db-insert', { table: 'brand', data: brand });
    const type = {
        name: 'Pintura',
        id: 1,
        brand
    }
    ipcRenderer.send('db-insert', { table: 'type', data: type });
    const product = {
        detail: "blanca 3L",
        id: 1,
        type
    }
    ipcRenderer.send('db-insert', { table: 'product', data: product });
    const record = {
        transaction: 1,
        date: '9-12-20 17:22:30',
        quantity: 20,
        product
    };
    ipcRenderer.send('db-insert', { table: 'record', data: record });
}

function select() {
    ipcRenderer.send('db-select', { table: 'brand' });
    ipcRenderer.send('db-select', { table: 'type' });
    ipcRenderer.send('db-select', { table: 'product' });
    ipcRenderer.send('db-select', { table: 'record' });
}

function remove() {
    const brand = {
        id: 1,
        name: 'tecno'
    };
    ipcRenderer.send('db-delete', { table: 'brand', data: brand });
}


function requestStock(purpose) {
    
    ipcRenderer.send('db-select', { table: 'stock', purpose: purpose});
    
}

ipcRenderer.on('fill-stock-table', (event, status) => {
    if (status.success) {
        printStockTable(status.data);
    }
    console.log(status)
});

ipcRenderer.on('fill-transaction-table', (event, status) => {
    if (status.success) {
        printTransactionTable(status.data);
    }
    console.log(status)
});

ipcRenderer.on('fill-modal-header', (event, status) => {
    const { data } = status;
    if (status.success) {
        document.getElementById("id-modal-header").append(data.brand_name);
        document.getElementById("id-modal-header").append(data.type_name);
        document.getElementById("id-modal-header").append(data.details);
        document.getElementById("record-modal").style.display = "block";
    }
    console.log(status)
});

function printStockTable(data) {

    for (let i = 0; i < data.length; i++) {
        var html = '';
        let transaction;
        if (data[i].transaction_type == 1) {
            transaction = 'Entrada';
        } else {
            transaction = 'Salida';
        }
        html += "<tr>\n\
                    <td>" + firstLetterToUpperCase(data[i].brand_name) + "</td>\n\
                    <td>" + firstLetterToUpperCase(data[i].type_name) + "</td>\n\
                    <td>" + firstLetterToUpperCase(data[i].details) + "</td>\n\
                    <td>" + transaction + "</td>\n\
                    <td>" + data[i].date + "</td>\n\
                    <td>" + data[i].quantity + "</td>\n\
                    <td>\n\
                        <a class='btn btn-sm btn-info pull-left check' id='show-product' onclick='showRecord(" + data[i].record_id + ")'><span class='glyphicon glyphicon-eye-open'></span>Consultar</a>\n\
                    </td>\n\
                </tr>";
    }
    $("#stock-table-boddy").html(html);
};

function printTransactionTable(data) {

    for (let i = 0; i < data.length; i++) {
        var html = '';
        let transaction;
        if (data[i].transaction_type == 1) {
            transaction = 'Entrada';
        } else {
            transaction = 'Salida';
        }
        html += "<tr>\n\
                    <td>" + firstLetterToUpperCase(data[i].brand_name) + "</td>\n\
                    <td>" + firstLetterToUpperCase(data[i].type_name) + "</td>\n\
                    <td>" + firstLetterToUpperCase(data[i].details) + "</td>\n\
                    <td>" + data[i].quantity + "</td>\n\
                    <td>" + transaction + "</td>\n\
                    <td>\n\
                        <a class='btn btn-sm btn-info pull-left check' id='show-record' onclick='showRecord(" + data[i] + ")'><span class='glyphicon glyphicon-eye-open'></span>Consultar</a>\n\
                    </td>\n\
                </tr>";
    }
    $("#transactions-table-boddy").html(html);
};


function firstLetterToUpperCase(string) {

    if (typeof string !== 'string') {
        return '';
    } else {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
