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
            ipcRenderer.send('db-select', { table: 'product', purpose: 'fill-product-table' });
            break;
        case "manage-user-container":
            ipcRenderer.send('db-select', { table: 'users', purpose: 'fill-user-table' });
            break;
        case "shop-list-container": 
            ipcRenderer.send("db-select-purchase-list", { purpose: 'fill-shop-table' });
        default:
            break;
    }
}



function showModal(origin) {

    switch (origin) {

        case "newProduct":
            document.getElementById("brandList").style.display = "block";
            document.getElementById("edit-brand").style.display = "block";
            document.getElementById("new-brand").style.display = "block";

            document.getElementById("typeList").style.display = "block";
            document.getElementById("edit-type").style.display = "block";
            document.getElementById("new-type").style.display = "block";

            document.getElementById("brand-input").style.display = "none";
            document.getElementById("confirm-brand").style.display = "none";
            document.getElementById("type-input").style.display = "none";
            document.getElementById("confirm-type").style.display = "none";
            $("#product-modal").modal("show");
            break;
        
        case "editProduct":
            break;

        case "newUser":
            document.getElementById("userModalTittle").innerHTML = 'Nuevo Usuario';
            $("#user-modal").modal("show");
            break;

        case "editUser":
            document.getElementById("userModalTittle").innerHTML = 'Editar Usuario';

            $("#user-modal").modal("show");
            break;

        default:
        break;
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
    ipcRenderer.send("db-select-record-by-product", { product_id: id, purpose: "fillRecordModal" });
}

ipcRenderer.on("fillRecordModal", (event, data) => {
    if (data.success) {
        fillRecordModal(data.data);
    } else {
        console.log(data.err)
    }
})

function fillRecordModal(data) {
    let html = "";
    data.forEach((record) => {
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
        body = document.getElementById("stock-table-body");
    } else if (origin == "transaction") {
        body = document.getElementById("transactions-table-body");
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



