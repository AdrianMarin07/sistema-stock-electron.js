ipcRenderer.on('fill-transaction-table', (event, status) => {
    if (status.success) {
        printTransactionTable(status.data);
    } else {
        console.log(status.err);
    }
});

function printTransactionTable(data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<tr data-product-id="${data[i].id_product}">\n\
                    <td data-brand-id="${data[i].fk_brand}"> ${firstLetterToUpperCase(data[i].brand_name)} </td>
                    <td data-type-id="${data[i].fk_type}"> ${firstLetterToUpperCase(data[i].type_name)}</td>
                    <td> ${firstLetterToUpperCase(data[i].details)} </td>
                    <td> ${data[i].barcode} </td>
                    <td> ${data[i].price} </td>
                    <td> ${data[i].total} </td>
                    <td>
                        <button class='btn btn-sm btn-info pull-left manage' id='show-add-modal-${data[i].id_product}' onclick='showTransactionModal(${data[i].id_product}, 0)'>Agregar</button>
                        <button class='btn btn-sm btn-info pull-left manage' id='show-remove-modal-${data[i].id_product}' onclick='showTransactionModal(${data[i].id_product}, 1)'>Quitar</button> </td>
                    <td>
                        <button class='btn btn-sm btn-info pull-left check' id='show-record-${data[i].id_product}' onclick='showRecord(${data[i].id_product})'>Consultar</button>
                    </td>
                </tr>`;
    }
    $("#transactions-table-body").html(html);
};

function showTransactionModal(id, transaction) {

    $("#transaction-input").val('');
    const parent = document.getElementById("show-record-" + id).parentElement.parentElement
    let product = `${parent.childNodes[3].innerHTML} ${parent.childNodes[1].innerHTML} ${parent.childNodes[5].innerHTML}`
    $("#id-transaction-modal-header").html(product);
    if (transaction == 0) {
        $("#transaction-modal-label").html("Defina la cantidad que desea añadir al producto");
        $("#submit-transaction").html("Agregar");
    } else if (transaction == 1) {
        $("#transaction-modal-label").html("Defina la cantidad que desea sustraer al producto");
        $("#submit-transaction").html("Quitar");
    }
    $("#product-id").val(id);
    $("#transaction-modal").modal('show');
}


function submitTransaction() {
    const amount = +$("#transaction-input").val()
    const transaction = $("#submit-transaction").html()

    if (Number.isInteger(amount) && amount > 0) {
        const id = $("#product-id").val();
        const columns = $(`tr[data-product-id="${id}"]`).children();
        const brand = {
            id: columns[0].dataset["brandId"],
            name: columns[0].innerHTML
        };
        const type = {
            name: columns[1].innerHTML,
            id: columns[1].dataset["typeId"],
        }
        const product = {
            detail: columns[2].innerHTML,
            id: id,
            quantity: columns[3].innerHTML,
            type,
            brand
        }

        if (transaction == "Agregar") {
            ipcRenderer.send("db-product-increase", { data: product, purpose: "add-quantity", amount })

        } else if (transaction == "Quitar") {
            ipcRenderer.send("db-product-decrease", { data: product, purpose: "decrease-quantity", amount })
        }
    } else {
        fillAlert("Por favor, ingrese un número válido", "warning", "transaction");
    }
}

ipcRenderer.on("add-quantity", (event, result) => {
    if (result.success) {

        const children = document.querySelector(`#manage-stock-container tr[data-product-id="${$("#product-id").val()}"]`).children.item(5);        
        children.innerHTML = +children.innerHTML + +$("#transaction-input").val();

        fillAlert("¡Carga exitosa!", "success", "transaction");

        $("#transaction-input").val('');
    } else {
        fillAlert(result.err, "danger" , "transaction")
        console.log(result.err);
        $("#transaction-input").val('');
    }
})

ipcRenderer.on("decrease-quantity", (event, result) => {
    if (result.success) {
        
        const children = document.querySelector(`#manage-stock-container tr[data-product-id="${$("#product-id").val()}"]`).children.item(5);
        children.innerHTML = +children.innerHTML - +$("#transaction-input").val();

        fillAlert(`¡Baja exitosa!`, "success" , "transaction");
        
        $("#transaction-input").val('');
    } else {
        if (result.err.match(/^(Error product qua)/)) {
            fillAlert("Error en la baja. El monto ingresado supera el valor actual del stock", "danger", "transaction")
            $("#transaction-input").val('');
        } else {
            fillAlert(result.err, "danger", "transaction");
            $("#transaction-input").val('');
        }
        console.log(result.err);
    }
})

