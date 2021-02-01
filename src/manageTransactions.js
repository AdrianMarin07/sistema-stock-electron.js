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

function searchInTransaction(origin, id) {
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
        //console.log(txtValueOrigin+ " " +  txtValuePaired);
        //console.log(typeof filterOrigin+ " " + typeof filterPaired);
        
        if (
        txtValueOrigin.trim().toUpperCase().match(filterOrigin === "" ? new RegExp(/^(\w+\S+)$/) : new RegExp(`^(${filterOrigin})`)) 
        && txtValuePaired.trim().toUpperCase().match(filterPaired === "" ? new RegExp(/^(\w+\S+)$/) : new RegExp(`^(${filterPaired})`))) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
