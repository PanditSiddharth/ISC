// document.getElementById("ctn").style.background = "green";
let inputt = document.getElementById("inn");
let string = "";

// Execute a function when the user presses a key on the keyboard
inputt.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("eq").click();
  }
});



function clickk(element){
    if(element.value == "=" || event.key == "Enter"){
    string = eval(string);
    inputt.value = string;
    }
    else if(element.value == "b"){
        string = inputt.value.slice(0,inputt.value.length-1);
        inputt.value = string;
    }
    else{
    console.log(element.value);
    string = string + element.value;
    inputt.value = string;
    }
    if(element.value == "c")
    cl();
}

setInterval(()=>{string = inputt.value;}, 100)

function cl(){
    string = inputt.value = "";
}