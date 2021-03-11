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

ipcRenderer.on('fill-product-table', (event, status) => {
    if (status.success) {
        printProductTable(status.data);
    } else {
        console.log(status.err);
    }
});

function swapRow(element) {
    document.getElementById(element + "List").style.display = "none";
    document.getElementById("edit-" + element).style.display = "none";
    document.getElementById("new-" + element).style.display = "none";
    document.getElementById(element + "-input").style.display = "block";
    document.getElementById("confirm-" + element).style.display = "block";
}

function saveElement(element) {
    document.getElementById(element + "List").style.display = "block";
    document.getElementById("edit-" + element).style.display = "block";
    document.getElementById("new-" + element).style.display = "block";
    document.getElementById(element + "-input").style.display = "none";
    document.getElementById("confirm-" + element).style.display = "none";
}

function editElement(element) {
    swapRow(element);
}

function newElement(element) {
    swapRow(element);

}

function saveProduct() {
    document.getElementById("confirmation-modal").style.display = "none";
}
