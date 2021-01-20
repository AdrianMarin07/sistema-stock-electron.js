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
        name: 'tersuave'
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
        quantity: 0,
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
});

function printStockTable(data) {

    for (let i = 0; i < data.length; i++) {
        var html = '';
        html += `<tr data-product-id="${data[i].fk_product}">\n\
                    <td data-brand-id="${data[i].fk_brand}"> ${firstLetterToUpperCase(data[i].brand_name)} </td>
                    <td data-type-id="${data[i].fk_type}"> ${firstLetterToUpperCase(data[i].type_name)} </td>
                    <td> ${firstLetterToUpperCase(data[i].details)} </td>
                    <td> ${data[i].transaction_type == 0 ? "Salida" : "Entrada"} </td>
                    <td> ${data[i].date} </td>
                    <td> ${data[i].total} </td>
                    <td>
                        <a class='btn btn-sm btn-info pull-left check' id='show-product-${data[i].record_id}' onclick='showRecord(${data[i].record_id})'>Consultar</a>
                    </td>
                </tr>`;
    }
    $("#stock-table-boddy").html(html);
};

function printTransactionTable(data) {

    for (let i = 0; i < data.length; i++) {
        var html = '';
        html += `<tr data-product-id="${data[i].fk_product}">\n\
                    <td data-brand-id="${data[i].fk_brand}"> ${firstLetterToUpperCase(data[i].brand_name)} </td>
                    <td data-type-id="${data[i].fk_type}"> ${firstLetterToUpperCase(data[i].type_name)}</td>
                    <td> ${firstLetterToUpperCase(data[i].details)} </td>
                    <td> ${data[i].total}</td>
                    <td>
                        <a class='btn btn-sm btn-info pull-left manage' id='show-add-modal-${data[i].fk_product}' onclick='showTransactionModal(${data[i].fk_product}, 0)'>Agregar</a>
                        <a class='btn btn-sm btn-info pull-left manage' id='show-remove-modal-${data[i].fk_product}' onclick='showTransactionModal(${data[i].fk_product}, 1)'>Quitar</a> </td>
                    <td>
                        <a class='btn btn-sm btn-info pull-left check' id='show-record-${data[i].fk_product}' onclick='showRecord(${data[i].fk_product})'>Consultar</a>
                    </td>
                </tr>`;
    }
    $("#transactions-table-boddy").html(html);
};

function showTransactionModal(id, transaction) {

    const parent = document.getElementById("show-record-" + id).parentElement.parentElement
    let product = `${parent.childNodes[3].innerHTML} ${parent.childNodes[1].innerHTML} ${parent.childNodes[5].innerHTML}`

    if (transaction == 0) {
        $("#id-transaction-modal-header").html("Defina la cantidad que desea añadir al producto: " + product);

        $("#submit-transaction").html("Agregar");
    } else if (transaction == 1) {
        $("#id-transaction-modal-header").html("Defina la cantidad que desea sustraer al producto: " + product);

        $("#submit-transaction").html("Quitar");
    }
    $("#product-id").val(id);
    $("#transaction-modal").fadeIn()
}

function closeTransaction() {
    $("#transaction-modal").fadeOut()
}


function submitTransaction() {
    const amount = +$("#transaction-input").val()
    const transaction = $("#submit-transaction").html()

    if (Number.isInteger(amount) && amount > 0) {
        const id = $("#product-id").val();
        const columns = $(`tr[data-product-id="${id}"]`).children();
        console.log(columns)
        const brand = {
            id: columns[0].dataset["brandId"],
            name: columns[0].innerHTML
        };
        const type = {
            name: columns[1].innerHTML,
            id: columns[1].dataset["typeId"],
            brand
        }
        const product = {
            detail: columns[2].innerHTML,
            id: id,
            quantity: columns[3].innerHTML,
            type
        }

        if (transaction == "Agregar") {
            ipcRenderer.send("db-product-increase", { data: product, purpose: "add-quantity", amount })

        }
    } else {

    }

}

ipcRenderer.on("add-quantity", (result) => {
    if (result.success) {
        fillAlert()
    } else {
        console.log(result.err);
    }
})


function fillAlert() {
    const transaction = $("#submit-transaction").html()
    $("#transaction-alert").html(`¡${transaction == "Agregar" ? "Carga" : "Baja"} exitosa!`)
    $("#transaction-input").val("");

    //$("#transaction-alert").html(`Error en la ${transaction == "Agregar" ? "carga" : "baja"} del producto`)
    $("#transaction-alert").fadeIn();
    setTimeout(function () {
        $("#transaction-alert").hide()
    }, 2500)
    //$("#transaction-alert").html("Por favor, ingrese un número válido");
}

function checkUser() {
    const user = document.getElementById("user-name").value
    const password = document.getElementById("user-password").value

    if (user == "gaaleo" && password == "1234") {
        displayContent('new-product-container')
        $("#user-name").val("");
        $("#user-password").val("");
    } else {
        alert("Usuario y/o contraseña incorrecta")
        $("#user-password").val("");
    }
}

function firstLetterToUpperCase(string) {

    if (typeof string !== 'string') {
        return '';
    } else {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

