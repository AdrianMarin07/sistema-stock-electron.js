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
        case "manage-product-container":
            ipcRenderer.send('db-select', { table: 'product', purpose: 'fill-user-table' });
            break;
        case "manage-user-container":
            ipcRenderer.send('db-select', { table: 'users', purpose: 'fill-user-table' });
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
                    <td></td>
                    <td></td>
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
                    <td></td>
                    <td></td>
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

function printUserTable(data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<tr>\n\
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                    <button class='btn btn-sm btn-info pull-left check'>Editar</button>    
                    <button class='btn btn-sm btn-info pull-left check'>Eliminar</button>
                    </td>
                </tr>`;
    }
    $("#user-table-boddy").html(html);
};

function closeTransaction(){
    $("#transaction-modal").hide();
}

function closeRecord() {
    document.getElementById("record-modal").style.display = "none";
}

function checkConfirmation() {
    //document.getElementById("confirmation-modal").style.display = "block";
    $("#confirmation-modal").modal("show");
}

function showProductModal(origin){
    if(origin==0){
        document.getElementById("brandList").style.display = "block";
        document.getElementById("edit-brand").style.display = "block";
        document.getElementById("new-brand").style.display = "block";

        document.getElementById("typeList").style.display = "block";
        document.getElementById("edit-type").style.display = "block";
        document.getElementById("new-type").style.display = "block";

        document.getElementById("brand-input").style.display = "none";
        document.getElementById("confirm-brand").style.display = "none";
        document.getElementById("type-input").style.display = "none";
        console.log(document.getElementById("type-input"))
        document.getElementById("confirm-type").style.display = "none";
    }
    $("#product-modal").modal("show");
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

ipcRenderer.on('fill-user-table', (event, status) => {
    if (status.success) {
        printUserTable(status.data);
    }
});

function checkUser() {
    const user = document.getElementById("user-name").value
    const password = document.getElementById("user-password").value

    if (user == "gaaleo" && password == "1234") {
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

function filterTableContent(origin, id) {
    let body, tr, i;
    let inputOrigin, filterOrigin, tdOrigin, txtValueOrigin;
    let inputPaired, filterPaired, tdPaired, txtValuePaired;
    inputOrigin = document.getElementById(id);
    filterOrigin = inputOrigin.value.toUpperCase();
    switch (id) {
        case "transactionTypeInput":
            inputPaired = document.getElementById("transactionBrandInput");
            break;
        case "transactionBrandInput":
            inputPaired = document.getElementById("transactionTypeInput");
            break;
        case "checkTypeInput":
            inputPaired = document.getElementById("checkBrandInput");
            break;
        case "checkBrandInput":
            inputPaired = document.getElementById("checkTypeInput");
            break;
        default: 
        break;
    }
    filterPaired = inputPaired.value.toUpperCase();
    if (origin == "check") {
        body = document.getElementById("stock-table-boddy");
    } else if (origin == "transaction") {
        body = document.getElementById("transactions-table-boddy");
    }
    tr = body.getElementsByTagName("TR");
    for (i = 0; i < tr.length; i++) {
        tdOrigin = tr[i].getElementsByTagName("td")[id === "checkTypeInput" || id === "transactionTypeInput" ? 1 : 0];
        tdPaired = tr[i].getElementsByTagName("td")[id === "checkBrandInput" || id === "transactionBrandInput" ? 1 : 0];
        txtValueOrigin = tdOrigin.textContent || tdOrigin.innerText;
        txtValuePaired = tdPaired.textContent || tdPaired.innerText;
        
        if (
        txtValueOrigin.trim().toUpperCase().match(filterOrigin === "" ? new RegExp(/^(\w+\S+)$/) : new RegExp(`^(${filterOrigin})`)) 
        && txtValuePaired.trim().toUpperCase().match(filterPaired === "" ? new RegExp(/^(\w+\S+)$/) : new RegExp(`^(${filterPaired})`))) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function swapRow(element){
    document.getElementById(element + "List").style.display = "none";
    document.getElementById("edit-" + element).style.display = "none";
    document.getElementById("new-" + element).style.display = "none";
    document.getElementById(element + "-input").style.display = "block";
    document.getElementById("confirm-" + element).style.display = "block";
}

function editElement(element){
    swapRow(element);
}

function newElement(element){
    swapRow(element);

}

function saveElement(element){
    document.getElementById(element + "List").style.display = "block";
    document.getElementById("edit-" + element).style.display = "block";
    document.getElementById("new-" + element).style.display = "block";
    document.getElementById(element + "-input").style.display = "none";
    document.getElementById("confirm-" + element).style.display = "none";
}