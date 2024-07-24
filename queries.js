//Created and Switched to Your Database "coding_platform".
//Created collections for "users", "comany_drives", "mentors", "topics".

//uploaded the json file in the respective collections and performed the below given queries

//1. Find all the topics and tasks which are taught in the month of October

db.topics.find({
    "date_covered": { $gte: "2020-10-01", $lte: "2020-10-31" }
  });

//2. Find all the company drives which appeared between 15 Oct 2020 and 31 Oct 2020

db.company_drives.find({
    "date_conducted": { $gte: "2020-10-15", $lte: "2020-10-31" }
  });

//3. Find all the company drives and students who appeared for the placement

db.company_drives.find({}, { "company_name": 1, "date_conducted": 1, "students_appeared": 1 });

//4. Find the number of problems solved by each user in codekata

db.users.find({}, { "full_name": 1, "codekata_problems_solved": 1 });

//5. Find all the mentors with mentee count more than 15

db.mentors.find({ "mentee_count": { $gt: 15 } });

//6.1. Find the Number of Users Who Are Absent Between 15 Oct 2020 and 31 Oct 2020

db.users.find({
    "attendance": {
      $elemMatch: { "date": { $gte: "2020-10-15", $lte: "2020-10-31" }, "status": "absent" }
    }
  }).count()

// 6.2. Find the Number of Users Who Have Not Submitted Tasks Assigned Between 15 Oct 2020 and 31 Oct 2020

const tasksAssigned = db.topics.aggregate([
    { $unwind: "$tasks" },
    { $match: { "tasks.date_assigned": { $gte: "2020-10-15", $lte: "2020-10-31" } } },
    { $project: { "tasks.task_id": 1, _id: 0 } }
  ]).toArray().map(task => task.tasks.task_id);
  
  db.users.find({
    $and: [
      { "tasks.task_id": { $in: tasksAssigned } },
      { "attendance": { $elemMatch: { "date": { $gte: "2020-10-15", $lte: "2020-10-31" }, "status": "absent" } } }
    ]
  }).count()
  
