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
    Opr();
    }
    if(element.value == "c")
    cl();
}

function ud(){string = inputt.value;}

let val = 0;
let v = 0;
let str = ["........","Kaisa laga calculator....", "YouTube button par....","Click karke use subscribe karlo....","Ye seekhne ke liye...."];

setInterval(()=>{
if(val == str[v].length-1){
  v = (v + 1)%str.length; 
  val = 0;
  // console.log(v);
}
val = (val + 1)%str[v].length;
}, 100);

setInterval(()=>{
}, 100);


setInterval(()=>{
  inputt.placeholder = str[v].substr(0, val);
}, 100);

function cl(){
    string = inputt.value = "";
}

let op = ['+', '-', '*','/','.'];

function Opr(){
for(let i=0; i<op.length; i++){
  for(let j=0; j<op.length; j++){
    if(inputt.value.charAt(inputt.value.length-1) == op[i] && inputt.value.charAt(inputt.value.length-2) == op[j])
    {
      inputt.value = inputt.value.substr(0, inputt.value.length-2)+op[i];
    }
  }
}
}

function chng(){
ud();
Opr();
}