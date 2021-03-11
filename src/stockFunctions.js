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
    $("#stock-table-body").html(html);
};


ipcRenderer.on('fill-stock-table', (event, status) => {
    if (status.success) {
        printStockTable(status.data);
    } else {
        console.log(status.err);
    }
});