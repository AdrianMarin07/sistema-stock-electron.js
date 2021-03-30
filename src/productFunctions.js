const { stat } = require("fs");

let productAttribute;
let attributeOperation;

ipcRenderer.on('fill-product-table', (event, status) => {
    if (status.success) {
        printProductTable(status.data);
        fillSelects();
    } else {
        console.log(status.err);
    }
});

function printProductTable(data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<tr>\n\
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                    <button class='btn btn-sm btn-info pull-left check'>Editar</button>
                    </td>
                </tr>`;
    }
    $("#product-table-body").html(html);
};

function fillSelects() {
    fillSelectBrand();
    fillSelectType();
}

function fillSelectBrand() {
    ipcRenderer.send('db-select', { table: 'brand', purpose: "fillSelectBrand" });
}

function fillSelectType() {
    ipcRenderer.send('db-select', { table: 'type', purpose: "fillSelectType" });
}

ipcRenderer.on('fillSelectBrand', (event, status) => {
    if (status.success) {
        fillBrand(status.data)
    } else {
        console.log(status.err);
    }
})

function fillBrand(data) {
    $("#brandSelect").empty()
    $("#brandSelect").append(`<option value="0" hidden disabled selected> -- Seleccione una opción -- </option>`)
    for (let i = 0; i < data.length; i++) {
        $("#brandSelect").append(`<option id="${data[i].brand_id}" value="${data[i].brand_id}">${firstLetterToUpperCase(data[i].brand_name)}</option>`)
    }
}

ipcRenderer.on('fillSelectType', (event, status) => {
    if (status.success) {
        fillType(status.data)
    } else {
        console.log(status.err);
    }
})

function fillType(data) {
    $("#typeSelect").empty()
    $("#typeSelect").append(`<option value="0" hidden disabled selected> -- Seleccione una opción -- </option>`)
    for (let i = 0; i < data.length; i++) {
        $("#typeSelect").append(`<option id="${data[i].type_id}" value="${data[i].type_id}">${firstLetterToUpperCase(data[i].type_name)}</option>`)
    }
}

function saveElement(element) {
    if (attributeOperation == "new") {
        if (element == "brand") {
            productAttribute = "brand";
            insertElement({ name: document.getElementById("brand-input").children.item(0).value }, "brand")
        } else if (element == "type") {
            productAttribute = "type";
            insertElement({ name: document.getElementById("type-input").children.item(0).value }, "type")
        }
    } else if (attributeOperation == "edit") {
        if (element == "brand") {
            productAttribute = "brand";
            overrideElement({id: $("#" + element + "Select").val(), name: document.getElementById("brand-input").children.item(0).value }, "brand")
        } else if (element == "type") {
            productAttribute = "type";
            overrideElement({id: $("#" + element + "Select").val(), name: document.getElementById("type-input").children.item(0).value }, "type")
        }
    }
}

function insertElement(data, origin) {
    ipcRenderer.send('db-insert', { table: origin, data: data, purpose: "newElement" });
}

function overrideElement(data, origin) {
    ipcRenderer.send('db-update', { table: origin, data: data, purpose: "editElement" });
}

ipcRenderer.on('newElement', (event, status) => {
    if (status.success) {
        $("#" + productAttribute + "Select").append(`<option id="${status.data[productAttribute + "_id"]}" selected value="${status.data[productAttribute + "_id"]}">${firstLetterToUpperCase(status.data[productAttribute + "_name"])}</option>`);
        swapToSelect(productAttribute);

        //ACA VA EL "ALERT!"

    } else {
        console.log(status.err);
    }
})

ipcRenderer.on('editElement', (event, status) => {
    if (status.success) {
        $("#" + productAttribute + "Select>option:selected").html(document.getElementById(productAttribute + "-input").children.item(0).value);
        swapToSelect(productAttribute);

        //ACA VA EL "ALERT!"

    } else {
        console.log(status.err);
    }
})

function swapToSelect(element) {
    productAttribute = element;
    document.getElementById(productAttribute + "List").style.display = "block";
    document.getElementById("edit-" + productAttribute).style.display = "block";
    document.getElementById("new-" + productAttribute).style.display = "block";
    document.getElementById(productAttribute + "-input").style.display = "none";
    document.getElementById("confirm-" + productAttribute).style.display = "none";
    document.getElementById("return-" + productAttribute).style.display = "none";
    $("#" + productAttribute + "Select>option[value='0']").prop("selected",true);

}

function editElement(element, button) {
    if ($("#" + element + "Select").val() == null) {
        console.log("No ha seleccionado una opcion")
        // Añadir "alert" para avisar que no ha seleccionado una opcion
    } else {
        attributeOperation = button;
        const text = $("#" + element + "Select>option:selected").html();
        $("#" + element + "Input").val(text);
        swapToInput(element);
    }
}

function newElement(element, button) {
    attributeOperation = button;
    $("#" + element + "Input").val('');
    swapToInput(element);
}

function goBack(element) {
    swapToSelect(element);
}

function swapToInput(element) {
    document.getElementById(element + "List").style.display = "none";
    document.getElementById("edit-" + element).style.display = "none";
    document.getElementById("new-" + element).style.display = "none";
    document.getElementById(element + "-input").style.display = "block";
    document.getElementById("confirm-" + element).style.display = "block";
    document.getElementById("return-" + element).style.display = "block";
    $("#" + productAttribute + "Select>option[value='0']").prop("selected",true);
}

function saveProduct() {
    $("#brandSelect>option[value='0']").prop("selected",true);
    $("#typeSelect>option[value='0']").prop("selected",true);
    $("#product-details").val('');
    $("#bar-code").val('');
    $("#price").val('');
    $("#min-quantity").val('');

    //ACA VA EL "ALERT!"
}
