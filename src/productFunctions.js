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
                    <td data-brand-id=${data[i].fk_brand}>${firstLetterToUpperCase(data[i].brand_name)}</td>
                    <td data-type-id=${data[i].fk_type}>${firstLetterToUpperCase(data[i].type_name)}</td>
                    <td>${firstLetterToUpperCase(data[i].details)}</td>
                    <td>${data[i].barcode}</td>
                    <td>${data[i].price}</td>
                    <td>${data[i].min_quantity}</td>
                    <td>
                    <button class='btn btn-sm btn-info pull-left check' data-product-id="${data[i].product_id}" onclick="showModal('editProduct',${data[i].product_id})">Editar</button>
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

function newElement(element) {
    $("#" + element + "Input").val('');
    swapToInput(element);
}

function editElement(element) {
    if ($("#" + element + "Select").val() == null) {
        fillAlert("No ha seleccionado una opcion", "warning", "product");
    } else {
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
    if ($('#productModalTittle').data("attribute-operator") == "new") {
        if (element == "brand") {
            insertBrand({
                name: document.getElementById("brand-input").children.item(0).value
            })
        } else if (element == "type") {
            insertType({
                name: document.getElementById("type-input").children.item(0).value
            })
        }
    } else if ($('#productModalTittle').data("attribute-operator") == "edit") {
        if (element == "brand") {
            overrideBrand({
                id: $("#" + element + "Select").val(),
                name: document.getElementById("brand-input").children.item(0).value
            })
        } else if (element == "type") {
            overrideType({
                id: $("#" + element + "Select").val(),
                name: document.getElementById("type-input").children.item(0).value
            })
        }
    }
}

function insertBrand(data) {
    ipcRenderer.send('db-insert', {
        table: "brand",
        data: data,
        purpose: "newBrand"
    });
}

ipcRenderer.on('newBrand', (event, status) => {
    if (status.success) {
        $("#brandSelect").append(`<option id="${status.data["brand_id"]}" selected value="${status.data["brand_id"]}">${firstLetterToUpperCase(status.data["brand_name"])}</option>`);
        swapToSelect("brand");
        fillAlert("¡Carga exitosa!", "success", "product");
    } else {
        fillAlert("Error en la carga", "danger", "product");
        console.log(status.err);
    }
})

function insertType(data) {
    ipcRenderer.send('db-insert', {
        table: "type",
        data: data,
        purpose: "newType"
    });
}

ipcRenderer.on('newType', (event, status) => {
    if (status.success) {
        $("#typeSelect").append(`<option id="${status.data["type_id"]}" selected value="${status.data["type_id"]}">${firstLetterToUpperCase(status.data["type_name"])}</option>`);
        swapToSelect("type");
        fillAlert("¡Carga exitosa!", "success", "product");
    } else {
        fillAlert("Error en la carga", "danger", "product");
        console.log(status.err);
    }
})

function overrideBrand(data) {
    ipcRenderer.send('db-update', {
        table: "brand",
        data: data,
        purpose: "editBrand"
    });
}

ipcRenderer.on('editBrand', (event, status) => {
    if (status.success) {
        $("#brandSelect> option:selected").html(document.getElementById("brand-input").children.item(0).value);
        swapToSelect("brand");
        fillAlert("¡Edicion exitosa!", "success", "product");
    } else {
        fillAlert("Error en la edicion", "danger", "product");
        console.log(status.err);
    }
})

function overrideType(data) {
    ipcRenderer.send('db-update', {
        table: "type",
        data: data,
        purpose: "editType"
    });
}

ipcRenderer.on('editType', (event, status) => {
    if (status.success) {
        $("#typeSelect> option:selected").html(document.getElementById("type-input").children.item(0).value);
        swapToSelect("type");
        fillAlert("¡Edicion exitosa!", "success", "product");
    } else {
        fillAlert("Error en la edicion", "danger", "product");
        console.log(status.err);
    }
})

function swapToSelect(element) {
    document.getElementById(element + "List").style.display = "block";
    document.getElementById("edit-" + element).style.display = "block";
    document.getElementById("new-" + element).style.display = "block";
    document.getElementById(element + "-input").style.display = "none";
    document.getElementById("confirm-" + element).style.display = "none";
    document.getElementById("return-" + element).style.display = "none";
    $("#" + element + "Select> option[value='0']").prop("selected", true);

}

function goBack(element) {
    swapToSelect(element);
}

function saveProduct(operator) {
    const brandId = $("#brandSelect").val();
    const brandName = $("#brandSelect option:selected").html();
    const typeId = $("#typeSelect").val();
    const typeName = $("#typeSelect option:selected").html();
    const detail = $("#product-details").val();
    const barcode = $("#bar-code").val();
    const price = $("#price").val();
    const minQuantity = $("#min-quantity").val();
    const productId = $("#product-id").val();

    ipcRenderer.send("db-" + operator, {
        table: "product",
        data: {
            brand: { id: brandId, name: brandName },
            type: { id: typeId, name: typeName },
            detail,
            barcode,
            price,
            minQuantity,
            quantity: 0,
            id: productId
        },
        purpose: operator + "Product"
    });
}

ipcRenderer.on("insertProduct", (event, status) => {
    if (status.success) {
        $("#product-table-body").append(`<tr data-product-id=${status.data.product_id}>\n\
        <td>${firstLetterToUpperCase(status.data.brand_name)}</td>
        <td>${firstLetterToUpperCase(status.data.type_name)}</td>
        <td>${firstLetterToUpperCase(status.data.details)}</td>
        <td>${status.data.barcode}</td>
        <td>${status.data.price}</td>
        <td>${status.data.min_quantity}</td>
        <td>
        <button class='btn btn-sm btn-info pull-left check' data-product-id="${status.data.product_id}" onclick="showModal('editProduct',${status.data.product_id})">Editar</button>
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

ipcRenderer.on("updateProduct", (event, status) => {
    if (status.success) {

        const children = document.querySelector(`#manage-product-container tr[data-product-id="${$("#product-id").val()}"]`).children

        children.item(0).innerHTML = $("#brandSelect option:selected").html();
        children.item(0).attributes["data-brand-id"].value = $("#brandSelect option:selected").val();
        children.item(1).innerHTML = $("#typeSelect option:selected").html();
        children.item(1).attributes["data-type-id"].value = $("#typeSelect option:selected").val();
        children.item(2).innerHTML = $("#product-details").val();
        children.item(3).innerHTML = $("#bar-code").val();
        children.item(4).innerHTML = $("#price").val();
        children.item(5).innerHTML = $("#min-quantity").val();

        fillAlert("¡Edición  del producto exitosa!", "success", "product");

        setTimeout(function () { $("#product-modal").modal("hide"); }, 1000);
        
    } else {
        fillAlert("Error en la edición del producto", "danger", "product");
        console.log(status.err);
    }
})
