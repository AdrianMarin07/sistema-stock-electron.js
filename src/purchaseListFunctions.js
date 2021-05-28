
ipcRenderer.on("fill-shop-table", (event, status) => {
    if(status.success) {
        printShopListTable(status.data);
    } else {
        console.log(status.err);
    }
});


function printShopListTable(data) {
    if(data.length > 0) {
        $("#shop-list-alert").hide();
        let html = '';
        data.forEach((shopItem) => {
            html += 
                  `<tr>
                      <td>${firstLetterToUpperCase(shopItem.brand_name)}</td>
                      <td>${firstLetterToUpperCase(shopItem.type_name)}</td>
                      <td>${firstLetterToUpperCase(shopItem.details)}</td>
                      <td>${shopItem.barcode}</td>
                      <td>${shopItem.min_quantity}</td>
                      <td>${shopItem.total}</td>
                   </tr>`;
          });
          $("#save-pdf-wrapper").show();
          $("#shop-list-table").show();
          $("#shop-list-table-body").html(html);
    } else {
        $("#shop-list-alert").show();
        $("#save-pdf-wrapper").hide();
        $("#shop-list-table").hide();
    }
};

function saveAsPdf() {
    const tableRows = 
    [...document.querySelectorAll("#shop-list-table > * > tr")].map((tr) => [...tr.children].map(td => td.innerHTML));
    ipcRenderer.send('save-table-asPDF', {tableRows});
}