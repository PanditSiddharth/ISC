let btn = (...args) => {
  if (args.length % 2 != 0)
    throw new Error("Odd number of arguments not valid");

  let buttons = [];
  for (let i = 0; i < args.length; i += 2) {
    buttons.push({ text: args[i], callback_data: args[i + 1] });
  }
  return buttons;
}

let rpm = (...args) => {
  buttons = [];
  for (let i = 0; i < args.length; i++) {
    buttons.push(args[i])
  }
  return { inline_keyboard: buttons }
}

let sel = {
  main: rpm(btn("Details", "selDetails")),
  Edit: rpm(btn("Edit", "selEdit"), btn("DeleteId", "selDelete"))
}

utl = {
  cancel: rpm(btn("Cancel", "cancel")),
  back: rpm(btn("Back", "back")),
  main: rpm(btn("Main", "main")),
  mainBack: rpm(btn("Main", "main", "Back", "back")),
  mainCancel: rpm(btn("Main", "main", "Cancel", "cancel")),
  skipBack: rpm(btn("Skip", "skip", "Cancel", "cancel", "Back", "back")),
  skipCancel: rpm(btn("Skip", "skip", "Cancel", "cancel"))
}

adm = {
  approve: rpm(btn("Approve", "approve", "Deny", "deny"), btn("Sujjestion", "sujjetion")),
  main: rpm(btn("Edit", "edit", "Delete", "delete"))
}

let stu = {

}

module.exports = { rpm, sel, utl, btn, stu }