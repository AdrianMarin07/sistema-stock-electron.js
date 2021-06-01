ipcRenderer.on('fill-user-table', (event, status) => {
    if (status.success) {
        printUserTable(status.data);
    } else {
        console.log(status.err);
    }
});

function printUserTable(data) {
    console.log(data);
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<tr data-user-id=${data[i].user_id}>\n\
                    <td>${data[i].user}</td>
                    <td>${firstLetterToUpperCase(data[i].name)}</td>
                    <td>${firstLetterToUpperCase(data[i].last_name)}</td>
                    <td>${data[i].email}</td>
                    <td>
                    <button class='btn btn-sm btn-info pull-left check' data-user-id="${data[i].user_id}" onclick="showModal('editUser',${data[i].user_id})">Editar</button>    
                    <button class='btn btn-sm btn-danger pull-left check' data-user-id="${data[i].user_id}" onclick="showModal('deleteUser',${data[i].user_id})">Eliminar</button>
                    </td>
                </tr>`;
    }
    $("#user-table-body").html(html);
};

function saveUser(operator) {

    const user = $("#user").val();
    const name = $("#name").val();
    const lastName = $("#last-name").val();
    const eMail = $("#email").val();
    const password = $("#password").val();
    const userId = $("#user-id").val();

    ipcRenderer.send("db-" + operator, {
        table: "users",
        data: {
            user,
            name,
            lastName,
            eMail,
            password,
            type: 'user',
            id: userId
        },
        purpose: operator + "User"
    });

};

ipcRenderer.on("insertUser", (event, status) => {
    if (status.success) {
        $("#user-table-body").append(`<tr data-user-id=${status.data.user_id}>\n\
        <td>${(status.data.user)}</td>
        <td>${firstLetterToUpperCase(status.data.name)}</td>
        <td>${firstLetterToUpperCase(status.data.last_name)}</td>
        <td>${status.data.email}</td>
        <td>
        <button class='btn btn-sm btn-info pull-left check' data-user-id="${status.data.user_id}" onclick="showModal('editUser',${status.data.user_id})">Editar</button>
        <button class='btn btn-sm btn-danger pull-left check' data-user-id="${status.data.user_id}" onclick="showModal('deleteUser',${status.data.user_id})">Eliminar</button>
        </td>
    </tr>`)

        $("#user").val('');
        $("#name").val('');
        $("#last-name").val('');
        $("#email").val('');
        $("#password").val('');

        fillAlert("¡Carga  del usuario exitosa!", "success", "user");

    } else {
        fillAlert("Error en la carga del usuario", "danger", "user");
        console.log(status.err);
    }
});

ipcRenderer.on("updateUser", (event, status) => {
    if (status.success) {

        const children = document.querySelector(`tr[data-user-id="${$("#user-id").val()}"]`).children
    
        children.item(0).innerHTML = $("#user").val();
        children.item(1).innerHTML = $("#name").val();
        children.item(2).innerHTML = $("#last-name").val();
        children.item(3).innerHTML = $("#email").val();

        fillAlert("¡Edición  del usuario exitosa!", "success", "user");

        setTimeout(function () { $("#user-modal").modal("hide"); }, 1000);
        
    } else {
        fillAlert("Error en la edición del usuario", "danger", "user");
        console.log(status.err);
    }
});

function deleteUser() {

    const userId = $("#user-id").val();

    ipcRenderer.send("db-delete", { table: "users", data: { id: userId }, purpose: "deleteUser" });

};

ipcRenderer.on("deleteUser", (event, status) => {
    if (status.success) {

        fillAlert("¡Eliminación del usuario existosa!", "success", "user");

        setTimeout(function () { $("#user-modal").modal("hide"); }, 1000);

    } else {

        fillAlert("Error en la eliminación del usuario", "danger", "user");

        console.log(status.err);
    }
});

//function checkUser() {
//    const user = document.getElementById("user-name").value
//    const password = document.getElementById("user-password").value
//
//    if (user == "gaaleo" && password == "1234") {
//        $("#user-name").val("");
//        $("#user-password").val("");
//    } else {
//        alert("Usuario y/o contraseña incorrecta")
//        $("#user-password").val("");
//    }
//}
