const $ = require('jquery');
const { ipcRenderer } = require('electron');


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

function printStockTable(data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<tr data-product-id="${data[i].fk_product}">\n\
                    <td data-brand-id="${data[i].fk_brand}"> ${firstLetterToUpperCase(data[i].brand_name)} </td>
                    <td data-type-id="${data[i].fk_type}"> ${firstLetterToUpperCase(data[i].type_name)} </td>
                    <td> ${firstLetterToUpperCase(data[i].details)} </td>
                    <td> ${data[i].transaction_type == 0 ? "Salida" : "Entrada"} </td>
                    <td> ${data[i].date} </td>
                    <td> ${data[i].total} </td>
                    <td>
                        <button class='btn btn-sm btn-info pull-left check' id='show-product-${data[i].fk_product}' onclick='showRecord(${data[i].fk_product})'>Consultar</button>
                    </td>
                </tr>`;
    }
    $("#stock-table-boddy").html(html);
};

function printTransactionTable(data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<tr data-product-id="${data[i].fk_product}">\n\
                    <td data-brand-id="${data[i].fk_brand}"> ${firstLetterToUpperCase(data[i].brand_name)} </td>
                    <td data-type-id="${data[i].fk_type}"> ${firstLetterToUpperCase(data[i].type_name)}</td>
                    <td> ${firstLetterToUpperCase(data[i].details)} </td>
                    <td> ${data[i].total}</td>
                    <td>
                        <button class='btn btn-sm btn-info pull-left manage' id='show-add-modal-${data[i].fk_product}' onclick='showTransactionModal(${data[i].fk_product}, 0)'>Agregar</button>
                        <button class='btn btn-sm btn-info pull-left manage' id='show-remove-modal-${data[i].fk_product}' onclick='showTransactionModal(${data[i].fk_product}, 1)'>Quitar</button> </td>
                    <td>
                        <button class='btn btn-sm btn-info pull-left check' id='show-record-${data[i].fk_product}' onclick='showRecord(${data[i].fk_product})'>Consultar</button>
                    </td>
                </tr>`;
    }
    $("#transactions-table-boddy").html(html);
};

function closeTransaction(){
    $("#transaction-modal").hide();
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

function showRecord(id) {
    ipcRenderer.send("db-select-record-by-product",{product_id: id, purpose: "fillRecordModal"});
}

ipcRenderer.on("fillRecordModal", (event, data)=>{
    if (data.success) {
        fillRecordModal(data.data);
    } else {
        console.log(data.err)
    }
})

function fillRecordModal(data){
    let html = "";
    data.forEach((record)=> {
        html += 
        `<tr>
         <td>${record.transaction_type == 0 ? "Alta" : "Baja"}</td>
         <td>${record.date}</td>
         <td>${record.quantity}</td>
         </tr>`;
    })
    $("#historyTableBody").html(html);
    $("#history-modal").modal("show");
}

