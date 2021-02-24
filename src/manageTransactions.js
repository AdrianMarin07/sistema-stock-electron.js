function showTransactionModal(id, transaction) {

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

        } else if (transaction == "Quitar") {
            ipcRenderer.send("db-product-decrease", { data: product, purpose: "decrease-quantity", amount })
        }
    } else {
        fillTransactionAlert("Por favor, ingrese un número válido");
    }

}

ipcRenderer.on("add-quantity", (event, result) => {
    if (result.success) {
        fillTransactionAlert(`¡Carga exitosa!`);
        ipcRenderer.send('db-select', { table: 'stock', purpose: 'fill-transaction-table' });
    } else {
        fillTransactionAlert(result.err)        
        console.log(result.err);
    }
})

ipcRenderer.on("decrease-quantity", (event, result) => {
    if (result.success) {
        fillTransactionAlert(`¡Baja exitosa!`);
        ipcRenderer.send('db-select', { table: 'stock', purpose: 'fill-transaction-table' });
    } else {
        if(result.err.match(/^(Error product qua)/)){
            fillTransactionAlert("Error en la baja. El monto ingresado supera el valor actual del stock")
        } else {
            fillTransactionAlert(result.err);
        }
        console.log(result.err);
    }
})


function fillTransactionAlert(message) {
    $("#transaction-alert").html(message)
    $("#transaction-input").val("");
    $("#transaction-alert").fadeIn();
    setTimeout(function () {
        $("#transaction-alert").hide()
    }, 2500)
}

