var cl = console.log;

const postform = document.getElementById("postform");
const postcontainer = document.getElementById("postcontainer");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const subBtn = document.getElementById("subBtn");
const updBtn = document.getElementById("updBtn");
const loader = document.getElementById("loader");


const baseurl = 'https://jsonplaceholder.typicode.com';
const posturl = `${baseurl}/posts`;

let postArr = [];

const snackBarMSG = (msg, iconName) =>{
    Swal.fire({
        title : msg,
        icon : iconName,
        timer : 2500
    })
}

const onEdit = (ele) =>{
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId", editId);
    let editUrl = `${baseurl}/posts/${editId}`;
    callApi("GET", editUrl);
    window.scroll(0,0);
}

const onDelete = (ele) =>{
    Swal.fire({
        title: "Do you want to Remove the Posts?",
        showCancelButton: true,
        confirmButtonText: "Remove",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let deleId = ele.closest(".card").id;
            localStorage.setItem("deleId", deleId);
            let deleUrl = `${baseurl}/posts/${deleId}`;
            callApi("DELETE", deleUrl);
            Swal.fire("Removed successfully!!!", "", "success");
        } 
      });
}

const templating = (arr) =>{
    postcontainer.innerHTML = arr.map(post =>{
        return `<div class="card mt-5" id="${post.id}">
                    <div class="card-header">
                        <h3>${post.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>
                </div>`
    }).join('')
}

const callApi = (methodName, apiUrl, msgBody) =>{
    
    let xhr = new XMLHttpRequest();
    xhr.open(methodName, apiUrl);
    xhr.setRequestHeader('Content-type', "appilcation/json");
    xhr.setRequestHeader('Authrization', "Breaer Token from Local Storage");
    if(msgBody){xhr.send(JSON.stringify(msgBody))} else {xhr.send(msgBody)}
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            //cl(xhr.response)
            let res = JSON.parse(xhr.response);
            loader.classList.remove("d-none")
            if (methodName === "GET") {
                if (Array.isArray(res)) {
                    templating(res)
                } else {
                    title.value = res.title,
                    body.value = res.body,
                    userId.value = res.userId
                    updBtn.classList.remove("d-none");
                    subBtn.classList.add("d-none");
                }  
            }else if(methodName === "POST"){
                msgBody.id = res.id;
                cl(msgBody);
                let card = document.createElement('div');
                card.className = "card mt-5";
                card.id = msgBody.id;
                card.innerHTML = `<div class="card-header">
                                        <h3>${msgBody.title}</h3>
                                    </div>
                                    <div class="card-body">
                                        <p>${msgBody.body}</p>
                                    </div>
                                    <div class="card-footer d-flex justify-content-between">
                                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                                    </div>`
                postcontainer.prepend(card);
                postform.reset();
            }else if(methodName === "PATCH"){
                postform.reset();
                updBtn.classList.add("d-none");
                subBtn.classList.remove("d-none");
                let card = [...document.getElementById(msgBody.id).children];
                cl(card);
                card[0].innerHTML = `<h3>${msgBody.title}</h3>`;
                card[1].innerHTML = `<p>${msgBody.body}</p>`;
            }else if(methodName === "DELETE"){
                let id = localStorage.getItem("deleId");
                document.getElementById(id).remove();
            }
        loader.classList.add("d-none")
        }
    
    }
}

callApi("GET", posturl)

const createPosts = (e) =>{
    e.preventDefault();
    let post = {
        title : title.value,
        body : body.value.trim(),
        userId : userId.value
    }
    cl(post);
    callApi("POST", posturl, post)
    snackBarMSG(`${post.title} Posts created Successfully`, `success`)
}

const updatePost = () =>{
    let updId = localStorage.getItem("editId");
    let updUrl = `${baseurl}/posts/${updId}`;
    let updObj = {
        title : title.value,
        body : body.value.trim(),
        userId : userId.value,
        id : updId
    }
    cl(updObj);
    callApi("PATCH", updUrl, updObj);
    snackBarMSG(`${updObj.title} Posts updated Successfully`, `success`)
}

postform.addEventListener("submit", createPosts);
updBtn.addEventListener("click", updatePost);