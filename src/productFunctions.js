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
        html += `<tr data-product-id=${data[i].product_id}>\n\
                    <td>${firstLetterToUpperCase(data[i].brand_name)}</td>
                    <td>${firstLetterToUpperCase(data[i].type_name)}</td>
                    <td>${firstLetterToUpperCase(data[i].details)}</td>
                    <td>${data[i].barcode}</td>
                    <td>
                    <button class='btn btn-sm btn-info pull-left check' data-product-id="${data[i].product_id}">Editar</button>
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
    ipcRenderer.send('db-select', {
        table: 'brand',
        purpose: "fillSelectBrand"
    });
}

function fillSelectType() {
    ipcRenderer.send('db-select', {
        table: 'type',
        purpose: "fillSelectType"
    });
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

function newElement(element, button) {
    attributeOperation = button;
    $("#" + element + "Input").val('');
    swapToInput(element);
}

function editElement(element, button) {
    if ($("#" + element + "Select").val() == null) {
        fillAlert("No ha seleccionado una opcion", "warning", "product");
    } else {
        attributeOperation = button;
        const text = $("#" + element + "Select> option:selected").html();
        $("#" + element + "Input").val(text);
        swapToInput(element);
    }
}

function swapToInput(element) {
    document.getElementById(element + "List").style.display = "none";
    document.getElementById("edit-" + element).style.display = "none";
    document.getElementById("new-" + element).style.display = "none";
    document.getElementById(element + "-input").style.display = "block";
    document.getElementById("confirm-" + element).style.display = "block";
    document.getElementById("return-" + element).style.display = "block";
}

function saveElement(element) {
    if (attributeOperation == "new") {
        if (element == "brand") {
            productAttribute = "brand";
            insertElement({
                name: document.getElementById("brand-input").children.item(0).value
            }, productAttribute)
        } else if (element == "type") {
            productAttribute = "type";
            insertElement({
                name: document.getElementById("type-input").children.item(0).value
            }, productAttribute)
        }
    } else if (attributeOperation == "edit") {
        if (element == "brand") {
            productAttribute = "brand";
            overrideElement({
                id: $("#" + element + "Select").val(),
                name: document.getElementById("brand-input").children.item(0).value
            }, productAttribute)
        } else if (element == "type") {
            productAttribute = "type";
            overrideElement({
                id: $("#" + element + "Select").val(),
                name: document.getElementById("type-input").children.item(0).value
            }, productAttribute)
        }
    }
}

function insertElement(data, origin) {
    ipcRenderer.send('db-insert', {
        table: origin,
        data: data,
        purpose: "newElement"
    });
}

ipcRenderer.on('newElement', (event, status) => {
    if (status.success) {
        $("#" + productAttribute + "Select").append(`<option id="${status.data[productAttribute + "_id"]}" selected value="${status.data[productAttribute + "_id"]}">${firstLetterToUpperCase(status.data[productAttribute + "_name"])}</option>`);
        swapToSelect(productAttribute);
        fillAlert("¡Carga exitosa!", "success", "product");
    } else {
        fillAlert("Error en la carga", "danger", "product");
        console.log(status.err);
    }
})

function overrideElement(data, origin) {
    ipcRenderer.send('db-update', {
        table: origin,
        data: data,
        purpose: "editElement"
    });
}

ipcRenderer.on('editElement', (event, status) => {
    if (status.success) {
        $("#" + productAttribute + "Select> option:selected").html(document.getElementById(productAttribute + "-input").children.item(0).value);
        swapToSelect(productAttribute);
        fillAlert("¡Edicion exitosa!", "success", "product");
    } else {
        fillAlert("Error en la edicion", "danger", "product");
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
    $("#" + productAttribute + "Select> option[value='0']").prop("selected", true);

}

function goBack(element) {
    swapToSelect(element);
}

function saveProduct() {
    const brandId = $("#brandSelect").val();
    const brandName = $("#brandSelect option:selected").html();
    const typeId = $("#typeSelect").val();
    const typeName = $("#typeSelect option:selected").html();
    const detail = $("#product-details").val();
    const barcode = $("#bar-code").val();
    const price = $("#price").val();
    const minQuantity = $("#min-quantity").val();

    ipcRenderer.send("db-insert", {
        table: "product",
        data: {
            brand: { id: brandId, name: brandName },
            type: { id: typeId, name: typeName },
            detail,
            barcode,
            price,
            minQuantity,
            quantity: 0
        },
        purpose: "newProduct"
    });
}

ipcRenderer.on("newProduct", (event, status) => {
    if (status.success) {
        $("#product-table-body").append(`<tr data-product-id=${status.data.product_id}>\n\
        <td>${firstLetterToUpperCase(status.data.brand_name)}</td>
        <td>${firstLetterToUpperCase(status.data.type_name)}</td>
        <td>${firstLetterToUpperCase(status.data.details)}</td>
        <td>${status.data.barcode}</td>
        <td>
        <button class='btn btn-sm btn-info pull-left check' data-product-id="${status.data.product_id}">Editar</button>
        </td>
    </tr>`)
    
    $("#brandSelect>option[value='0']").prop("selected", true);
    $("#typeSelect>option[value='0']").prop("selected", true);
    $("#product-details").val('');
    $("#bar-code").val('');
    $("#price").val('');
    $("#min-quantity").val('');
    
    fillAlert("¡Carga  del producto exitosa!", "success", "product");

    } else {
        fillAlert("Error en la carga del producto", "danger", "product");
        console.log(status.err);
    }
})
