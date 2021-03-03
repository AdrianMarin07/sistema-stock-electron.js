function insert() {
    const brand = {
        id: 1,
        name: 'tersuave'
    };

    ipcRenderer.send('db-insert', { table: 'brand', data: brand, purpose: "none" });
    const type = {
        name: 'Pintura',
        id: 1,
    }
    ipcRenderer.send('db-insert', { table: 'type', data: type, purpose: "none" });
    const product = {
        detail: "blanca 3L",
        id: 1,
        quantity: 20,
        type,
        brand
    }
    ipcRenderer.send('db-insert', { table: 'product', data: product, purpose: "none" });
    const record = {
        transaction: 0,
        date: '9-12-20 17:22:30',
        quantity: 20,
        product
    };
    ipcRenderer.send('db-insert', { table: 'record', data: record, purpose: "none" });
}

function select() {
    ipcRenderer.send('db-select', { table: 'brand', purpose: "select" });
    ipcRenderer.send('db-select', { table: 'type', purpose: "select" });
    ipcRenderer.send('db-select', { table: 'product', purpose: "select" });
    ipcRenderer.send('db-select-record-by-product', { table: 'record', purpose: "select", product_id: 1});

}

ipcRenderer.on('select', (event, status) => {
    status.success && console.log(status.data);
})

function remove() {
    const brand = {
        id: 1,
        name: 'tecno'
    };
    ipcRenderer.send('db-delete', { table: 'brand', data: brand, purpose: "none" });
}