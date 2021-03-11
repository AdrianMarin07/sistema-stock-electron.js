function printUserTable(data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<tr>\n\
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                    <button class='btn btn-sm btn-info pull-left check'>Editar</button>    
                    <button class='btn btn-sm btn-info pull-left check'>Eliminar</button>
                    </td>
                </tr>`;
    }
    $("#user-table-body").html(html);
};

ipcRenderer.on('fill-user-table', (event, status) => {
    if (status.success) {
        printUserTable(status.data);
    } else {
        console.log(status.err);
    }
});

function checkUser() {
    const user = document.getElementById("user-name").value
    const password = document.getElementById("user-password").value

    if (user == "gaaleo" && password == "1234") {
        $("#user-name").val("");
        $("#user-password").val("");
    } else {
        alert("Usuario y/o contraseña incorrecta")
        $("#user-password").val("");
    }
}
