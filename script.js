let user=null;
let tasks=JSON.parse(localStorage.getItem("tasks"))||[];
let editID=null;

// Login
function login(){
  let u=document.getElementById("username").value;
  let p=document.getElementById("password").value;

  if((u==="pm"||u==="user1"||u==="user2") && p==="123"){
    user=u;
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("taskApp").classList.remove("hidden");
    document.getElementById("welcome").innerText="Welcome "+u;

    if(u==="pm") document.getElementById("pmArea").classList.remove("hidden");
    render();
  }else{
    alert("Wrong Login Details");
  }
}

// Logout
function logout(){ location.reload(); }
function save(){ localStorage.setItem("tasks", JSON.stringify(tasks)); }

// Add / Update Task (PM only)
function addOrUpdateTask(){
  if(user!=="pm") return;

  let title=document.getElementById("title").value;
  let desc=document.getElementById("desc").value;
  let deadline=document.getElementById("deadline").value;
  let assignedTo=document.getElementById("assignedTo").value;

  if(!title||!deadline||!assignedTo){ alert("Fill all fields"); return; }

  if(editID){
    let t=tasks.find(x=>x.id===editID);
    t.title=title; t.desc=desc; t.deadline=deadline; t.assignedTo=assignedTo;
    editID=null;
  }else{
    tasks.push({id:Date.now(), title, desc, deadline, assignedTo, status:"Pending"});
  }

  save();
  clearForm();
  render();
}

// Clear form
function clearForm(){
  title.value=""; desc.value=""; deadline.value=""; assignedTo.value="";
}

// Render tasks
function render(){
  let box=document.getElementById("taskList");
  box.innerHTML="";

  let filtered=user==="pm"?tasks:tasks.filter(t=>t.assignedTo===user);

  filtered.forEach(t=>{
    let div=document.createElement("div");
    div.className="task";

    div.innerHTML=`
      <b>${t.title}</b><br>${t.desc}<br>
      Deadline: ${t.deadline}<br>
      Assigned To: ${t.assignedTo}<br>
      Status: ${t.status}<br>
    `;

    // Users can update status only
    if(user!=="pm" && t.assignedTo===user){
      div.innerHTML+=`
        <select onchange="updateStatus(${t.id}, this.value)">
          <option ${t.status=="Pending"?"selected":""}>Pending</option>
          <option ${t.status=="In Progress"?"selected":""}>In Progress</option>
          <option ${t.status=="Done"?"selected":""}>Done</option>
        </select><br>
      `;
    }

    // PM edit/delete buttons
    if(user==="pm"){
      div.innerHTML+=`
        <button onclick="editTask(${t.id})">Edit</button>
        <button onclick="deleteTask(${t.id})">Delete</button>
      `;
    }

    box.appendChild(div);
  });
}

// Edit task (PM only)
function editTask(id){
  if(user!=="pm") return;
  let t=tasks.find(x=>x.id===id);
  title.value=t.title; desc.value=t.desc; deadline.value=t.deadline; assignedTo.value=t.assignedTo;
  editID=id;
}

// Delete task (PM only)
function deleteTask(id){
  if(user!=="pm") return;
  alert("Task deleted");
  tasks=tasks.filter(t=>t.id!==id);
  save(); render();
}

// Update status (Users only)
function updateStatus(id,val){
  let t=tasks.find(x=>x.id===id);
  if(t.assignedTo!==user) return;
  t.status=val;
  save(); render();
}
