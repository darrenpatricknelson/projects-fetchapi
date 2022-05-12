// requires
const express = require("express");
const router = express.Router();
const fs = require("fs");

// create a global variable for the content being read
const content = JSON.parse(fs.readFileSync("./db.json"));
// I'm going to go one step further and sort these out
// i noticed that if task 18 exist in the array
// and i add task 17
// task 17 will appear after task 18
// this is not numerically correct
// there for, I have created a function to sort
// I will be sorting them by their id since their id's are their task numbers
// this function will be called when writing the new content back to the file
const organizeArray = (a, b) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
};

// ====>
// ====>
// ====>

// GET
router.get("/", (req, res) => {
  res.json(content);
});

// ====>
// ====>
// =====>

// POST
router.post("/create", (req, res) => {
  // we will use the request body to assign a new object
  const newTask = Object.assign(req.body);

  // I'm going to do a couple of tests on the inputs
  // firstly, we need an ID
  // Since we working with tasks, we will use the task number as the ID
  // the test is to check if an ID was given, if not we will send an explicit request for one
  if (!newTask.id) {
    return res.json({
      message: `Please add the number of your task as your ID`,
      content,
      success: false,
    });
  } else {
    //   in this test, I'm just making sure that the ID in our databas does not exist yet
    for (const task of content) {
      if (task.id === newTask.id) {
        //   if the ID does exist, We will send back an object will a message and the specific task
        return res.json({
          message: `This task number already exists. Please enter a different task.`,
          content,
          success: false,
        });
      }
    }
  }

  //   Just like with the ID, we need a title
  if (!newTask.title) {
    return res.json({
      message: `Please add the title of your task`,
      content,
      success: false,
    });
  }

  // this test is more for a personal factor
  // since this app is for me to record and view my HYperionDev task progress
  // I've added this test for progress
  if (!newTask.progress) {
    return res.json({
      message: `Please add the progress of your task. This could be: "Not started", "In progress", "Submitted", "Reviewed". If your task has been reviewed, please also add your grade.`,
      content,
      success: false,
    });
  } else if (newTask.progress === "Reviewed") {
    if (!newTask.grade) {
      return res.json({
        message: `Your task has been reviewed, please add the grade.`,
        content,
        success: false,
      });
    }
  }

  //   again, since it's personal app, I want to record my grades
  // if no grade was given, it will be an empty string
  if (!newTask.grade) {
    newTask.grade = "";
  }

  //   push the newTask to the content variable we created above
  content.push(newTask);

  //   write it to the file
  fs.writeFileSync(
    "./db.json",
    JSON.stringify(content.sort(organizeArray), null, 2),
    err => {
      if (err) {
        res.send("Failed to create new project", err);
        return;
      }
    },
  );

  //   send a json response with a positive message and the existing content
  return res.json({
    message: `New project added. Task ${newTask.id} has been added to your database`,
    content,
    success: true,
  });
});

// ====>
// ====>
// ====>

// PUT
router.put("/update/:id", (req, res) => {
  // create a numbered id variable since it returns a string from the request
  const id = Number(req.params.id);
  const newTask = Object.assign(req.body);

  //   loop over existing array
  for (let i = 0; i < content.length; i++) {
    // check if the ID matches and existing ID
    if (content[i].id === id) {
      // this is going to get a bit ugly but what I'm doing is checking if an entry field exists
      // if it exists, then update the field
      // if it does exist, then do nothing
      if (typeof newTask.title !== "undefined") {
        content[i].title = newTask.title;
      }
      if (typeof newTask.progress !== "undefined") {
        content[i].progress = newTask.progress;
      }
      if (typeof newTask.grade !== "undefined") {
        content[i].grade = newTask.grade;
      }
    }
  }

  //   write it to the file
  fs.writeFileSync(
    "./db.json",
    JSON.stringify(content.sort(organizeArray), null, 2),
    err => {
      if (err) {
        res.send("Failed to create new project", err);
        return;
      }
    },
  );

  //   in my response, I want to return JUST the object that was updated
  // So I'm going to created a function to do just that
  const updatedTask = () => {
    //   loop over existing array
    for (let i = 0; i < content.length; i++) {
      // check if the ID matches and existing ID
      if (content[i].id === id) {
        return content[i];
      }
    }
  };

  //   send a json response with a positive message and the existing content
  return res.json({
    message: `Task ${id} has been updated in your database`,
    content: updatedTask(),
  });
});

// ====>
// ====>
// ====>

// DELETE
router.delete("/delete/:id", (req, res) => {
  // create the ID
  const id = Number(req.params.id);

  //   loop over existing array
  for (let i = 0; i < content.length; i++) {
    // check if the ID matches and existing ID
    if (content[i].id === id) {
      // if the ID exists, delete it
      content.splice(i, 1);
    }
  }

  const deleted = JSON.stringify(content.sort(organizeArray), null, 2);

  //   write it to the file
  fs.writeFileSync("./db.json", deleted, err => {
    if (err) {
      res.send("Failed to create new project", err);
      return;
    }
  });

  //   send a json response with a positive message and the existing content
  return res.json({
    message: `Task ${id} has been deleted from your database`,
    content: JSON.parse(deleted),
  });
});

// ====>
// ====>
// =====>

// export
module.exports = router;
