"use strict";

fetch('/api/v1/courses')
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
 let uvu = document.getElementById("studentID");
  uvu.style.display = event.target.value === ""? "none" : "block";
})



document.getElementById('uvuId').addEventListener('input', handleOnChange);

//let isPopulated = false;
function handleOnChange() {
  let str = document.getElementById('uvuId').value;
  let cor = document.getElementById('course').value
  //the str must be length 8 put up the log from server
  if (str.length === 8){
    let listContainer = document.getElementById('unOrdered');
     
    let child = listContainer.lastElementChild;
    while (child){
      listContainer.removeChild(child);
      child = listContainer.lastElementChild;
    }
    fetch(
      `/api/v1/logs/${str}/${cor}`
    )
      .then((response) => {
        return response.json();
      })
      .then((logs) => {
        console.log (cor,"uvuid")
        console.log(logs, 'data')
        for (const log of logs) {
          let uvuId = log[0]
          let date = log[1]
          let text = log[2]
          
           
            var mainContainer = document.getElementById('uvuIdDisplay');
            mainContainer.innerHTML = 'Student Logs for ' + uvuId;
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
            studentInfo.innerHTML = date;
            studentText.innerHTML = text;
            console.log('reached then()', date);
            console.log('dates reached ', text);
                 
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

// the button is disabled until the text ends with a '.'

function disableButton() {
  let txtArea = document.getElementById('text');
  const button = document.getElementById('button');
  const unOrder = document.getElementById('unOrdered');
  console.log("txtfunc");
  if (txtArea.value === ""  && !unOrder.hasChildNodes()){
    console.log('textArea');
    button.disabled = true;
    //button.reset();
    console.log("button is disable");
    //document.getElementById("form1").reset();
  } else { // display is not empty button is active and 
    console.log('textarea is not empty & button is not disabled');
    button.disabled = false;  
  } 
}

document.getElementById("button").addEventListener("click", newLogs);

function newLogs(event){

      const date = new Date();
      let currentDate = date.toLocaleString();
      const dbJson = {
        courseId: document.querySelector("select").value,
        uvuId: document.querySelector("input").value,
        date: currentDate,
        text: document.querySelector("textarea").value
      }
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(dbJson)
      }
      
      fetch('api/v1/logs', requestOptions)
      .then(response => response.json())
      .then(data => console.log("testing", data))
      .catch(err => console.log("log error", err))
      event.preventDefault();
}


