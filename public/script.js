// AJAX to replace them with dynamic data from GET https://json-server-ft3qa5--3000.local.webcontainer.io/api/v1/courses 
//https://jsonservernblldr-ufml--3000--f7aa08df.local-credentialless.webcontainer.io/api/v1/courses
//http://localhost:3000/courses'
fetch('../courses')
  .then(res => res.json())
  .then(data => {
    for (const options in data){
      console.log(data)
      var selection = document.getElementById("course");
      
      let option = document.createElement("option");
      
      option.setAttribute('value', data[options].id);

      let optionText = document.createTextNode(data[options].display);
      
      option.appendChild(optionText);
      selection.appendChild(option);
    }
  })

//If course ever becomes unselected, don't show the uvu id text input box
const selectElement = document.querySelector("#course");
selectElement.addEventListener("change", (event) => {
  uvu = document.getElementById("studentID");
  uvu.style.display = event.target.value === ""? "none" : "block";
})

//replace them with dynamic data by ajaxing GET https://json-server-ft3qa5--3000.local.webcontainer.io/logs?courseId=<courseID>&uvuId=<uvuID>

document.getElementById('uvuId').addEventListener('input', handleOnChange);

//let isPopulated = false;
function handleOnChange() {
  let str = document.getElementById('uvuId').value;
  //the str must be length 8 put up the log from server
  if (str.length === 8) {
    let listContainer = document.getElementById('unOrdered');
     
    let child = listContainer.lastElementChild;
    while (child){
      listContainer.removeChild(child);
      child = listContainer.lastElementChild;
    }
    fetch(//https://jsonserverbezxrx-sfe1--3000--33975f1d.local-credentialless.webcontainer.io/api/v1/logs
      '../logs'
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        for (const student in data) {
          if (str === data[student].uvuId) {
           
            var mainContainer = document.getElementById('uvuIdDisplay');
            mainContainer.innerHTML = 'Student Logs for ' + data[student].uvuId;
            // creating html tags
            var listContainer = document.getElementById('unOrdered');

            //new tags 
            var childContainer = document.createElement('li');
            var divContainer = document.createElement('div');
            var smallTag = document.createElement('small');
            var preTag = document.createElement('pre');
            var pTag = document.createElement('p');

            // //date info
            var studentInfo = listContainer
              .appendChild(childContainer)
              .appendChild(divContainer)
              .appendChild(smallTag);
            //text info
            var studentText = childContainer
              .appendChild(preTag)
              .appendChild(pTag);
            //date info displayed 
            //text info displayed
            studentInfo.innerHTML = data[student].date;
            studentText.innerHTML = data[student].text;
            console.log('reached then()', data[student].date);
            console.log('dates reached ', data[student].text);
          }        
        }
      })
      .catch((err) => {
        console.log('error1 ', err);
      });
  }
}

const logs = document.getElementById("unOrdered");
            
logs.addEventListener("click", logItem);

function logItem() {
  const item = document.querySelectorAll("pre");
  const textArray = Array.from(item);
  for(let i =0; i < textArray.length; i++){
    textArray[i].toggleAttribute("hidden");
  }
 
}

//Button should be disabled until the logs, if any, are displayed and there's text in the textarea

document.querySelector('#button').disabled = true;
document.querySelector('textarea').addEventListener("input", disableButton);

function disableButton() {
  const txtArea = document.getElementById('text');
  const button = document.getElementById('button');
  const unOrder = document.getElementById('unOrdered');
  console.log("txtfunc");
  if (txtArea.value === ""  && !unOrder.hasChildNodes()){
    console.log('textArea');
    button.disabled = true;
    //button.reset();
    console.log("disable");
    //document.getElementById("form1").reset();
  } else { // display is not empty button is active and 
    console.log('false');
    button.disabled = false;
    //Button should AJAX PUT the textarea value to json-server which will store it
    let txt = document.querySelector('textarea').value;
    if(txt.endsWith('.')){
      const date = new Date();
      let currentDate = date.toISOString().substring(0,10);

      const dbJson = {
        courseId: document.querySelector("option").value,
        uvuId: document.querySelector("input").value,
        date: currentDate,
        text: document.querySelector("textarea").value
      }
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(dbJson)
      }
      
      fetch('../logs', requestOptions)
      .then(response => response.json())
      .then(data => console.log("testing", data))
      .catch(err => console.log("log error", err))
    }
  } 
}








