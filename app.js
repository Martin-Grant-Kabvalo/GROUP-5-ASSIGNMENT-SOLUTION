const express = require('express');
const dummy_data = require("./data/dummy_data");
const database_services = require('./db/database_services'); 
const mysql = require('mysql2');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
app.use(expressLayouts);
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.set('view engine', 'ejs');
app.set('views', 'views');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smis',
  }); 
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});
for (const query of database_services.createTableQueries) {
    connection.query(query, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Table created successfully.');
      }
    });
  }




app.get('/', (req, res) => {
    const data = {title: "Admin - Index"};
    res.render('index', data);
});
app.get('/dashboard', (req, res) => {
  const database = database_services.DatabaseService.getInstance(connection);
  
  // Call studentsPerClass and handle the Promise with .then
  database.studentsPerClass()
    .then((results) => {
      const dashboardData = [];
      const studentsPerClass = results;
      dashboardData.push(studentsPerClass);
      database.assessmentsPerClassPerModule()
        .then((results) => {
          const assessmentsPerClassPerModule = results
          dashboardData.push(assessmentsPerClassPerModule);
          database.performanceTrend()
          .then((results) => {
            const performanceTrend = results;
            dashboardData.push(performanceTrend);
            database.topPerfomingClasses()
            .then((results) => {
              const topPerfomingClasses = results;
              dashboardData.push(topPerfomingClasses);
              database.genderPerformance()
              .then((results) => {
                const genderPerformance = results;
                dashboardData.push(genderPerformance);
                database.topPerformingStudents()
                .then((results) => {
                  const topPerformingStudents = results;
                  dashboardData.push(topPerformingStudents);
                  const data = { title: "Admin - Dashboard", activeDashboard: true, dashboardData };
                  res.render('dashboard', data);
                })
                .catch((error) => {
                  console.log(error)
                })
              })
              .catch((error) => {
                console.log(error)
              })
            })
            .catch((error) => {
              console.log(error);
            })
          })
          .catch((error) => {
            console.log(error);
          })
          
        })
        .catch((error) => {
          console.log(error)
        })
       
    })
    .catch((error) => {
      console.error(error);
      // Handle errors appropriately
    });
});


// STUDENTS ===========================================================================================================================================================================
app.get('/students', (req, res) => {
    const data = {title: "Students", activeStudents: true};
    res.render('students', data);
})
app.get('/getStudents', (req, res) => {
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.getStudents();
  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));
})
app.delete('/deleteStudent/:id', (req, res) => {
  const encodedRegNo = req.params.id;
  const regNo = decodeURIComponent(encodedRegNo);
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.deleteStudent(regNo);
  results
  .then(data => res.json({success: data}))
  .catch(err => console.log(err));
})
app.post('/addStudent', (req, res) => {
  const regNO = req.body.regNO;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const gender = req.body.gender;
  const email = req.body.email;
  const studentClass = req.body.studentClass;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.addNewStudent(regNO, firstname, lastname, gender, email, studentClass);

  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));
})
app.patch('/updateStudent', (req, res) => {
  const data = req.body;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.editStudent(data.regNo, data.firstname, data.lastname, data.gender, data.email, data.studentClass);
  results
  .then(data => res.json({success: data}))
  .catch(err => console.log(err));
})
app.post('/sendEmail', (req, res) => {
  const { recipient, subject, message } = req.body;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'martinkabvalo@gmail.com', 
          pass: 'ldde yuce idah gorr'
      }
  });

  // Email data
  const mailOptions = {
      from: 'GROUP 5 <martinkabvalo@gmail.com>',
      to: recipient,
      subject: subject,
      text: message
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Email could not be sent' });
      } else {
          console.log('Email sent: ' + info.response);
          res.json({ success: true, message: 'Email sent successfully' });
      }
  });
});

// END OF STUDENTS SECTION ============================================================================================================================================================

// MODULES SECTION ====================================================================================================================================================================
app.get('/modules', (req, res) => {
    const data = {title: "Modules", activeModules: true};
    res.render('modules', data);
})
app.post('/addModule', (req, res) => {
  const moduleCode = req.body.moduleCode;
  const moduleName = req.body.moduleName;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.addNewModule(moduleCode, moduleName);

  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));
})
app.get('/getModules', (req, res) => {
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.getModules();
  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));

})
app.delete('/deleteModule/:id', (req, res) => {
  const moduleCode = req.params;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.deleteModule(moduleCode.id);
  results
  .then(data => res.json({success: data}))
  .catch(err => console.log(err));
})
app.patch('/updateModule', (req, res) => {
  const data = req.body;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.editModule(data.moduleCode, data.updatedModuleName);
  results
  .then(data => res.json({success: data}))
  .catch(err => console.log(err));

})
// END OF MODULES SECTION =============================================================================================================================================================

// ASSESSMENTS SECTION ================================================================================================================================================================
app.get('/assessments', (req, res) => {
    const data = {title: "Assessments", activeAssessments: true};
    res.render('assessments', data);
})
app.post('/addAssessment', (req, res) => {
  const assessmentName = req.body.assessmentName;
  const studentClass = req.body.studentClass;
  const moduleCode = req.body.moduleCode;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.addNewAssessment(assessmentName, studentClass, moduleCode);

  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));
})
app.get('/getAssessments', (req, res) => {
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.getAssessments();
  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));

})
app.delete('/deleteAssessment/:id', (req, res) => {
  const assessmentID = req.params;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.deleteAssessment(assessmentID.id);
  results
  .then(data => res.json({success: data}))
  .catch(err => console.log(err));
})
app.patch('/updateAssessment', (req, res) => {
  const data = req.body;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.editAssessment(data.assessmentID, data.assessmentName, data.studentClass, data.moduleCode);
  results
  .then(data => res.json({success: data}))
  .catch(err => console.log(err));

})
// END OF ASSESSMENT SECTION ==========================================================================================================================================================


// START OF GRADES SECTION ============================================================================================================================================================
app.get('/grades', (req, res) => {
    const data = {title: "Grades", activeGrades: true};
    res.render('grades', data);
})
app.post('/addGrades', (req, res) => {
  const grades = req.body.grades;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.addGrades(grades);
  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));
})
app.get('/getAssessmentModules/:id', (req, res) => {
  const classCode = req.params;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.getAssessmentModules(classCode.id);
  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));

})
app.get('/getModuleAssessments/:classCode/:moduleCode', (req, res) => {
  const data = req.params;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.getModuleAssessments(data.classCode, data.moduleCode);
  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));

})
app.get('/getSpecificStudents/:classCode', (req, res) => {
  const data = req.params;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.getSpecificStudents(data.classCode);
  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));
})
app.get('/getGrades', (req, res) => {
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.getGrades();
  results
  .then(data => res.json({data: data}))
  .catch(err => console.log(err));

})
app.delete('/deleteGrade/:id', (req, res) => {
  const grade = req.params;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.deleteGrade(grade.id);
  results
  .then(data => res.json({success: data}))
  .catch(err => console.log(err));
})
app.patch('/updateGrade', (req, res) => {
  const data = req.body;
  const database = database_services.DatabaseService.getInstance(connection);
  const results = database.editGrade(data.gradeID, data.score);
  results
  .then(data => res.json({success: data}))
  .catch(err => console.log(err));

})
// END OF GRADES SECTION ==============================================================================================================================================================



// CLASSES SECTION ====================================================================================================================================================================
app.get('/classes', (req, res) => {
  const data = {title: "Classes", activeClasses: true};
  res.render('classes', data);
})
app.post('/addClass', (req, res) => {
    const classCode = req.body.classCode;
    const className = req.body.className;
    const database = database_services.DatabaseService.getInstance(connection);
    const results = database.addNewClass(classCode, className);

    results
    .then(data => res.json({data: data}))
    .catch(err => console.log(err));
})
app.get('/getClasses', (req, res) => {
    const database = database_services.DatabaseService.getInstance(connection);
    const results = database.getClasses();
    results
    .then(data => res.json({data: data}))
    .catch(err => console.log(err));

})
app.delete('/deleteClass/:id', (req, res) => {
    const classCode = req.params;
    const database = database_services.DatabaseService.getInstance(connection);
    const results = database.deleteClass(classCode.id);
    results
    .then(data => res.json({success: data}))
    .catch(err => console.log(err));
})
app.patch('/updateClass', (req, res) => {
    const data = req.body;
    const database = database_services.DatabaseService.getInstance(connection);
    const results = database.editClass(data.classCode, data.updatedClassName);
    results
    .then(data => res.json({success: data}))
    .catch(err => console.log(err));

})
// END OF CLASSES SECTION =============================================================================================================================================================

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
