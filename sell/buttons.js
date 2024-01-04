let btn = (...args) => {
  if (args.length % 2 != 0)
    throw new Error("Odd number of arguments not valid");

  let buttons = [];
  for (let i = 0; i < args.length; i += 2) {
    buttons.push({ text: args[i], callback_data: args[i + 1] });
  }
  return buttons;
}

let btnh = (...args) => {
  return args.map(text => ({ text }));
};

let rpmh = (...args) => {
  return { keyboard: args,
         resize_keyboard: true,
         one_time_keyboard: true,
         selective: true }
}

let rpm = (...args) => {
  buttons = [];
  for (let i = 0; i < args.length; i++) {
    buttons.push(args[i])
  }
  return { inline_keyboard: buttons }
}

let sel = {
  main: rpm(btn("Details", "selDetails", "Edit", "selEdit", "Delete", "selDelete"),
    btn("Add Product", "selAddProduct", "Your Products", "selProducts")
  ),
  Edit: rpm(btn("Edit", "selEdit"), btn("DeleteId", "selDelete"))
}

utl = {
  cancel: rpm(btn("Cancel", "cancel")),
  back: rpm(btn("Back", "back")),
  main: rpm(btn("Main", "main")),
  mainBack: rpm(btn("Main", "main", "Back", "back")),
  mainCancel: rpm(btn("Main", "main", "Cancel", "cancel")),
  skipBack: rpm(btn("Skip", "skip", "Cancel", "cancel", "Back", "back")),
  skipCancel: rpm(btn("Skip", "skip", "Cancel", "cancel")),
  cancelBack: rpm(btn("Back", "back", "Cancel", "cancel")),
  cancelSubmit: rpm(btn("Submit", "submit", "Cancel", "cancel")),
  // cancelSubmit: rpm(btn("Approve", "approve", "Reject", "reject"))
}

adm = {
  approve: rpm(btn("Approve", "approve", "Deny", "deny"), btn("Sujjestion", "sujjetion")),
  main: rpm(btn("Edit", "edit", "Delete", "delete"))
}

let stu = {

}

module.exports = { rpm, sel, utl, btn, stu, btn, btnh, rpmh }