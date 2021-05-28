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



function showModal(origin, id) {

    switch (origin) {

        case "newProduct":

            $('#productModalTittle').html('Nuevo producto:');

            $("#brandSelect option[value='0']").prop("selected", true);
            $("#brandList").css("display", "block");
            $("#edit-brand").css("display", "block");
            $("#new-brand").css("display", "block");

            $("#typeSelect option[value='0']").prop("selected", true);
            $("#typeList").css("display", "block");
            $("#edit-type").css("display", "block");
            $("#new-type").css("display", "block");

            $("#brand-input").css("display", "none");
            $("#confirm-brand").css("display", "none");
            $("#return-brand").css("display", "none");
            $("#type-input").css("display", "none");
            $("#confirm-type").css("display", "none");
            $("#return-type").css("display", "none");

            $("#brandInput").val('');
            $("#typeInput").val('');
            $("#product-details").val('');
            $("#bar-code").val('');
            $("#price").val('');
            $("#min-quantity").val('');

            $("#confirm-product").off('click');
            $("#confirm-product").on('click', () => { saveProduct('insert') });

            $("#product-modal").modal("show");
            break;

        case "editProduct":
            
            $('#productModalTittle').html('Editando producto:');

            let productId = $(`tr[data-product-id=${id}]`).children();

            $(`#brandSelect option[value='${productId[0].dataset.brandId}']`).prop("selected", true);
            $(`#brandList`).css("display", "block");
            $(`#edit-brand`).css("display", "block");
            $(`#new-brand`).css("display", "block");

            $(`#typeSelect option[value='${productId[1].dataset.typeId}']`).prop("selected", true);
            $(`#typeList`).css("display", "block");
            $(`#edit-type`).css("display", "block");
            $(`#new-type`).css("display", "block");

            $(`#brand-input`).css("display", "none");
            $(`#confirm-brand`).css("display", "none");
            $(`#return-brand`).css("display", "none");
            $(`#type-input`).css("display", "none");
            $(`#confirm-type`).css("display", "none");
            $(`#return-type`).css("display", "none");

            $(`#brandInput`).val('');
            $(`#typeInput`).val('');
            $(`#product-details`).val(productId[2].innerHTML);
            $(`#bar-code`).val(productId[3].innerHTML);
            $(`#price`).val(productId[4].innerHTML);
            $(`#min-quantity`).val(productId[5].innerHTML);

            $("#product-id").val(id);

            $("#confirm-product").off('click');
            $("#confirm-product").on('click', () => { saveProduct('update') });

            $("#product-modal").modal("show");

            break;

        case "newUser":

            $('#userModalTittle').html('Nuevo usuario:');

            $("#user").val('');
            $("#name").val('');
            $("#last-name").val('');
            $("#email").val('');
            $("#password").val('');
            
            $("#confirm-user").off('click');
            $("#confirm-user").on('click', () => { saveUser('insert') });

            $("#user-modal").modal("show");
            break;

        case "editUser":

            $('#userModalTittle').html('Editando usuario:');

            $("#confirm-user").off('click');
            $("#confirm-user").on('click', () => { saveUser('update') });

            $("#user-modal").modal("show");
            break;

        case "deleteUser":

            $('#userModalTittle').html('¿Realmente desea eliminar este usuario?');

            $("#confirm-user").off('click');
            $("#confirm-user").on('click', () => { deleteUser() });

            $("#user-modal").modal("show");

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

function fillAlert(message, infoType, content) {
    $("#" + content + "-alert").html(message)
    $("#" + content + "-alert").val("");
    $("#" + content + "-alert").addClass("alert-" + infoType);
    $("#" + content + "-alert").css("visibility", "visible");
    $("#" + content + "-alert").fadeIn();
    setTimeout(function () {
        $("#" + content + "-alert").removeClass("alert-" + infoType);
        $("#" + content + "-alert").fadeOut({
            done: (anim, bool) => {
                $("#" + content + "-alert").css("display", "block");
                $("#" + content + "-alert").css("visibility", "hidden");
            }
        })
    }, 1500)
}

function changeMode() {

    //Agregar cambio de ícono al botón para resaltarlo

    document.getElementById("dark-mode").classList.toggle("dark-mode-enabled"); // Cambia el color de fondo del botón

    let container = [ // WIP!!! 
        document.getElementsByClassName("display"),
        document.getElementsByClassName("content"),
        document.getElementsByClassName("form-control"),
        document.getElementsByClassName("modal-content")
    ]

    for (let i = 0; i < container.length; i++) {
        console.log('primer for')
        for (let j = 0; j < container[i].length; j++) {
            console.log('segundo for')
            container[i][j].classList.toggle("dark-mode-background");
        }
    }
}
