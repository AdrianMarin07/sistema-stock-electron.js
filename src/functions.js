const $ = require('jquery');
const { ipcRenderer } = require('electron');


function showRecord(data) {

    ipcRenderer.send('db-select', { table: 'stock', purpose: 'fill-modal-header' });

}

function displayContent(content_name) {
    const names = [...document.querySelectorAll(".content")].map((node) => {
        return node.id;
    });
    names.forEach((content) => {
        if (content == content_name) {
            $("#" + content).fadeIn();
        } else {
            $("#" + content).hide();
        }
    })
    fillContent(content_name);
}

function fillContent(content_name) {
    switch (content_name) {
        case "request-stock-container":
            ipcRenderer.send('db-select', { table: 'stock', purpose: 'fill-stock-table' });
            break;
        case "manage-stock-container":
            ipcRenderer.send('db-select', { table: 'stock', purpose: 'fill-transaction-table' });
            break;
        default:
            break;
    }
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

    ipcRenderer.send('db-insert', { table: 'brand', data: brand, purpose: "none" });
    const type = {
        name: 'Pintura',
        id: 1,
        brand
    }
    ipcRenderer.send('db-insert', { table: 'type', data: type, purpose: "none" });
    const product = {
        detail: "blanca 3L",
        id: 1,
        type
    }
    ipcRenderer.send('db-insert', { table: 'product', data: product, purpose: "none" });
    const record = {
        transaction: 1,
        date: '9-12-20 17:22:30',
        quantity: 20,
        product
    };
    ipcRenderer.send('db-insert', { table: 'record', data: record, purpose: "none" });
}

function select() {
    ipcRenderer.send('db-select', { table: 'brand', purpose: "select" });
    ipcRenderer.send('db-select', { table: 'type', purpose: "select" });
    ipcRenderer.send('db-select', { table: 'product', purpose: "select" });
    ipcRenderer.send('db-select', { table: 'record', purpose: "select" });

    ipcRenderer.on('select', (event, status) => {
        status.success && console.log(status.data);
    })
}

function remove() {
    const brand = {
        id: 1,
        name: 'tecno'
    };
    ipcRenderer.send('db-delete', { table: 'brand', data: brand, purpose: "none" });
}


function requestStock(purpose) {

    ipcRenderer.send('db-select', { table: 'stock', purpose: purpose });

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
});

ipcRenderer.on('fill-modal-header', (event, status) => {
    const { data } = status;
    if (status.success) {
        const productHeader = "Historial del Producto: " + firstLetterToUpperCase(data[0].type_name) + " " + firstLetterToUpperCase(data[0].brand_name) + " " + firstLetterToUpperCase(data[0].details);
        document.getElementById("id-record-modal-header").innerHTML = productHeader;
        document.getElementById("record-modal").style.display = "block";
    }
    console.log(status)
});

function printStockTable(data) {

    for (let i = 0; i < data.length; i++) {
        var html = '';
        html += `<tr>\n\
                    <td> ${firstLetterToUpperCase(data[i].brand_name)} </td>
                    <td> ${firstLetterToUpperCase(data[i].type_name)} </td>
                    <td> ${firstLetterToUpperCase(data[i].details)} </td>
                    <td> ${data[i].transaction_type == 0 ? "Salida" : "Entrada"} </td>
                    <td> ${data[i].date} </td>
                    <td> ${data[i].quantity} </td>
                    <td>
                        <a class='btn btn-sm btn-info pull-left check' id='show-product' onclick='showRecord(${data[i].record_id})'>Consultar</a>
                    </td>
                </tr>`;
    }
    $("#stock-table-boddy").html(html);
};

function printTransactionTable(data) {

    for (let i = 0; i < data.length; i++) {
        var html = '';
        html += `<tr>\n\
                    <td> ${firstLetterToUpperCase(data[i].brand_name)} </td>
                    <td> ${firstLetterToUpperCase(data[i].type_name)}</td>
                    <td> ${firstLetterToUpperCase(data[i].details)} </td>
                    <td>${data[i].quantity}</td>
                    <td>
                        <a class='btn btn-sm btn-info pull-left manage' id='show-add-modal' onclick='showAddModal(${data[i].record_id})'>Agregar</a>
                        <a class='btn btn-sm btn-info pull-left manage' id='show-remove-modal' onclick='showRemoveModal(${data[i].record_id})'>Quitar</a> </td>
                    <td>
                        <a class='btn btn-sm btn-info pull-left check' id='show-record' onclick='showRecord(${data[i].record_id})'>Consultar</a>
                    </td>
                </tr>`;
    }
    $("#transactions-table-boddy").html(html);
};

function checkUser() {
    const user = document.getElementById("user-name").value
    const password = document.getElementById("user-password").value

    if (user == "gaaleo" && password == "1234") {
        displayContent('new-product-container')
    } else {
        alert("Usuario y/o contraseña incorrecta")
    }
}

function firstLetterToUpperCase(string) {

    if (typeof string !== 'string') {
        return '';
    } else {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

