const { createClient } = supabase;
supabase = createClient('https://yrwzfuhdwmsygfksjrwi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjg3ODY2MiwiZXhwIjoxOTQ4NDU0NjYyfQ.dlRgknRLgXl57xNrgcKO1_DpXI3JD3w7fUVV0y-1sxw')

var form = document.getElementById("taskCreationForm");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

var form = document.getElementsByName("feedback")[0];
function handleForm(event) { event.preventDefault(); feedbackfunc() }
form.addEventListener('submit', handleForm);


let blurred=false;
function feedbackfunc() {
  document.getElementById("discord").value = supabase.auth.session().user.user_metadata.full_name;
  if(!blurred){
    document.getElementById("feedback").classList.remove("hidden")
    document.getElementById("maindiv").classList.add("blur")
  } else {
    document.getElementById("feedback").classList.add("hidden")
    document.getElementById("maindiv").classList.remove("blur")
  }

  blurred = !blurred;
      
}

async function signInWithGithub() { const { user, session, error } = await supabase.auth.signIn({ provider: 'github' }); }
async function signInWithDiscord() { const { user, session, error } = await supabase.auth.signIn({ provider: 'discord' }); }

var timesrun = 0;

async function createTask() {
  var date = document.getElementById("datepicker").valueAsDate;
  var title = document.getElementById("title").value;
  var skillsNeeded = document.getElementById("skillsNeeded").value;
  var description = document.getElementById("description").value;

  if (date !== null) {
    var epochTime = (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000 + 46800);
  } else {
    var epochTime = "None";
  }

  supabase
    .from('tasks')
    .insert([
      {
        title: title,
        username: supabase.auth.session().user.user_metadata.full_name,
        profilepic: supabase.auth.session().user.user_metadata.avatar_url,
        description: description,
        deadline: epochTime,
        skillsNeeded: skillsNeeded,
        provider_id: supabase.auth.session().user.user_metadata.provider_id
      }
    ]
    ).then(function (data, error) {
      if (data.status == 201) {
        alert("Task Created!")
      } else {
        alert("Something went wrong! Try again later")
      }
    })

  document.getElementById("taskCreationForm").reset();
}



function waitForElement() {
  if (supabase.auth.session() !== null) {
    timesrun = 10;
    document.getElementById("createTask").classList.remove("hidden");
    document.getElementById("signin").outerHTML = '<div onclick="feedbackfunc()" class="transition duration-200 ease-in-out hover:bg-gray-100 p-2 mr-2 rounded shadow"><i class="far fa-comments cursor-pointer float-left mt-1 mr-2"></i><p class="float-left" >Feedback</p></div><img onclick="supabase.auth.signOut(); location.reload()" src="' + supabase.auth.session().user.user_metadata.avatar_url + '" class="rounded-full mt-auto mb-auto" style="width:1.5%; height: 1.5%;">';
  }
  else {
    timesrun++;
    if (timesrun != 10) {
      setTimeout(waitForElement, 50);
    }
  }
}
waitForElement()

