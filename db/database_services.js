// create-tables.js
const createTableQueries = [
  `CREATE TABLE IF NOT EXISTS classes (
    classCode varchar(255) NOT NULL,
    className varchar(255) NOT NULL,
    PRIMARY KEY (classCode)
  ) ENGINE=InnoDB;`,

  `CREATE TABLE IF NOT EXISTS students (
    regNo varchar(20) NOT NULL,
    firstname varchar(255) NOT NULL,
    lastname varchar(255) NOT NULL,
    gender varchar(10) DEFAULT NULL,
    email varchar(255) DEFAULT NULL,
    class varchar(255) DEFAULT NULL,
    PRIMARY KEY (regNo),
    KEY class (class),
    CONSTRAINT students_ibfk_1 FOREIGN KEY (class) REFERENCES classes (classCode)
  ) ENGINE=InnoDB;`,

  `CREATE TABLE IF NOT EXISTS modules (
    moduleCode varchar(255) NOT NULL,
    moduleName varchar(255) NOT NULL,
    PRIMARY KEY (moduleCode)
  ) ENGINE=InnoDB;`,

  `CREATE TABLE IF NOT EXISTS assessments (
    assessmentID int(11) NOT NULL AUTO_INCREMENT,
    assessmentName varchar(255) NOT NULL,
    moduleCode varchar(255) DEFAULT NULL,
    class varchar(255) DEFAULT NULL,
    PRIMARY KEY (assessmentID),
    KEY moduleCode (moduleCode),
    KEY fk_assessment_class (class),
    CONSTRAINT assessments_ibfk_1 FOREIGN KEY (moduleCode) REFERENCES modules (moduleCode),
    CONSTRAINT fk_assessment_class FOREIGN KEY (class) REFERENCES classes (classCode)
  ) ENGINE=InnoDB;`,

  
  `CREATE TABLE IF NOT EXISTS grades (
    gradeID int(11) NOT NULL AUTO_INCREMENT,
    regNo varchar(20) DEFAULT NULL,
    assessmentID int(11) DEFAULT NULL,
    score int(11) DEFAULT NULL,
    PRIMARY KEY (gradeID),
    UNIQUE KEY unique_grade (regNo,assessmentID),
    KEY assessmentID (assessmentID),
    CONSTRAINT grades_ibfk_1 FOREIGN KEY (regNo) REFERENCES students (regNo),
    CONSTRAINT grades_ibfk_2 FOREIGN KEY (assessmentID) REFERENCES assessments (assessmentID)
  ) ENGINE=InnoDB;`,
];

const dbQueries = {
  selectClasses: `SELECT * FROM classes;`,
  addNewClass: `INSERT INTO classes (classCode, className) VALUES (?, ?);`,
  deleteClass: `DELETE FROM classes WHERE classCode = ?;`,
  updateClass: `UPDATE classes SET className = ? WHERE classCode = ?;`,

  // STUDENTS QUERIES
  selectStudents: `SELECT * FROM students;`,
  addNewStudent: `INSERT INTO students (regNo, firstname, lastname, gender, email, class) VALUES (?, ?, ?, ?, ?, ?);`,
  deleteStudent: `DELETE FROM students WHERE regNo = ?;`,
  updateStudent: `UPDATE students SET firstname = ?, lastname = ?, gender = ?, email = ?, class = ? WHERE regNo = ?;`,

  // MODULES QUERIES
  selectModules: `SELECT * FROM modules;`,
  addNewModule: `INSERT INTO modules (moduleCode, moduleName) VALUES (?, ?);`,
  deleteModule: `DELETE FROM modules WHERE moduleCode = ?;`,
  updateModule: `UPDATE modules SET moduleName = ? WHERE moduleCode = ?;`,

  // ASSESSMENTS QUERIES
  selectAssessments: `SELECT * FROM assessments;`,
  addNewAssessment: `INSERT INTO assessments (assessmentName, moduleCode, class) VALUES (?, ?, ?);`,
  deleteAssessment: `DELETE FROM assessments WHERE assessmentID = ?;`,
  updateAssessment: `UPDATE assessments SET assessmentName = ?, moduleCode = ?, class = ? WHERE assessmentID = ?;`,

  // GRADES QUERIES
  selectAssessmentModules: `SELECT DISTINCT moduleCode FROM assessments WHERE class = ?;`,
  selectModuleAssessments: `SELECT assessmentID, assessmentName FROM assessments WHERE moduleCode = ? AND class = ?;`,
  getSpecificStudents: `SELECT * FROM students WHERE class = ?;`,
  addGrades: `INSERT INTO grades (regNo, assessmentID, score) VALUES (?, ?, ?)`,
  selectGrades: `SELECT g.gradeID AS 'gradeID', c.classCode AS 'classCode', m.moduleCode AS 'moduleCode', a.assessmentName AS 'assessmentName', s.regNo AS 'regNo', g.score AS 'score' FROM grades g JOIN students s ON g.regNo = s.regNo JOIN assessments a ON g.assessmentID = a.assessmentID JOIN classes c ON s.class = c.classCode JOIN modules m ON a.moduleCode = m.moduleCode;`,
  deleteGrade: `DELETE FROM grades WHERE gradeID = ?`,
  resetAutoIncrement: `ALTER TABLE grades AUTO_INCREMENT = 1`,
  updateGrade: `UPDATE grades SET score = ? WHERE gradeID = ?;`,

  // DASHBOARD QUERIES
  studentsPerClass: `SELECT class, COUNT(regNo) AS number_of_students FROM students GROUP BY class;`,
  assessmentsPerClassPerModule: `SELECT c.classCode AS class, m.moduleCode AS module, COUNT(a.assessmentID) AS totalAssessments FROM classes c INNER JOIN assessments a ON c.classCode = a.class INNER JOIN modules m ON a.moduleCode = m.moduleCode GROUP BY c.className, m.moduleName ORDER BY c.className, m.moduleName;`,
  performanceTrend: `SELECT m.moduleCode AS module, ROUND(AVG(g.score), 2) AS averagePerformance FROM modules m LEFT JOIN assessments a ON m.moduleCode = a.moduleCode LEFT JOIN grades g ON a.assessmentID = g.assessmentID WHERE g.score IS NOT NULL GROUP BY m.moduleCode ORDER BY module;`,
  topPerfomingClasses: `SELECT s.class AS class, AVG(g.score) AS averageScore FROM students s INNER JOIN grades g ON s.regNo = g.regNo GROUP BY s.class ORDER BY AVG(g.score) DESC LIMIT 5;`,
  genderPerformance: `SELECT s.gender, ROUND(AVG(g.score)) AS averagePerformance FROM students s INNER JOIN grades g ON s.regNo = g.regNo GROUP BY s.gender;`,
  topPerformingStudents: `SELECT s.regNo, AVG(g.score) AS averageScore FROM students s INNER JOIN  grades g ON s.regNo = g.regNo GROUP BY s.regNo ORDER BY averageScore DESC LIMIT 10;`
};

class DatabaseService {
  static instance = null; 
  
  constructor(connection) {
    this.connection = connection;
  }
  static getInstance(connection) {
    return this.instance ? this.instance : new DatabaseService(connection);
  }

  async getClasses() {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.selectClasses, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async addNewClass(classCode, className) {
    if(classCode != "" && className != ""){
      try{
        const insertRow = await new Promise((resolve, reject) => {
          this.connection.query(dbQueries.addNewClass, [classCode, className], (err, result) => {
            if(err) reject(new Error(err.message));
            resolve();
          })
        });
        return {
          classCode: classCode,
          className: className
        }
      } catch(error){
        console.log(error)
      }
    }
    
  }

  async deleteClass(classCode) {
    try {
      classCode = classCode;
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.deleteClass, [classCode], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }

  async editClass(classCode, updatedClassName) {
    try {
      classCode = classCode;
      updatedClassName = updatedClassName
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.updateClass, [updatedClassName, classCode], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve();
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }

  // STUDENTS FUNCTIONS ===============================================================================================================================================================
  async getStudents() {
    try{

      const res = await new Promise((resolve, reject) => {
      this.connection.query(dbQueries.selectStudents, (err, results) => {
        if(err) reject(new Error(err.message));
        resolve(results);
      })
    });
    return res;
  }
  catch(error) {
    console.log(error);
  }
  }

  async addNewStudent(regNo, firstname, lastname, gender, email, studentClass) {
    if(regNo != "" && firstname != "" && lastname != "" && gender != "" && email != "" && studentClass != ""){
      try{
        const insertRow = await new Promise((resolve, reject) => {
          this.connection.query(dbQueries.addNewStudent, [regNo, firstname, lastname, gender, email, studentClass], (err, result) => {
            if(err) reject(new Error(err.message));
            resolve();
          })
        });
        return {
          regNO: regNo,
          studentClass: studentClass
        }
      } catch(error){
        console.log(error)
      }
    }
    
  }

  async deleteStudent(regNo) {
    try {
      regNo = regNo;
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.deleteStudent, [regNo], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve();
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }

  async editStudent(regNo, firstname, lastname, gender, email, studentClass) {
    try {
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.updateStudent, [firstname, lastname, gender, email, studentClass, regNo], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }
  // END OF STUDENT FUNCTIONS =========================================================================================================================================================


  // START OF MODULES FUNCTION ========================================================================================================================================================
  async getModules() {
    try{

        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.selectModules, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async addNewModule(moduleCode, moduleName) {
    if(moduleCode != "" && moduleName != ""){
      try{
        const insertRow = await new Promise((resolve, reject) => {
          this.connection.query(dbQueries.addNewModule, [moduleCode, moduleName], (err, result) => {
            if(err) reject(new Error(err.message));
            resolve();
          })
        });
        return {
          moduleCode: moduleCode,
          moduleName: moduleName
        }
      } catch(error){
        console.log(error)
      }
    }
    
  }

  async deleteModule(moduleCode) {
    try {
      moduleCode = moduleCode;
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.deleteModule, [moduleCode], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }

  async editModule(moduleCode, updatedModuleName) {
    try {
      moduleCode = moduleCode;
      updatedModuleName = updatedModuleName
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.updateModule, [updatedModuleName, moduleCode], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }
  // END OF MODULES FUNCTION ==========================================================================================================================================================

  //  START OF ASSESSMENT FUNCTIONS
  async getAssessments() {
    try{

        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.selectAssessments, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async addNewAssessment(assessmentName, studentClass, moduleCode) {
    if(assessmentName != "" && studentClass != "" && moduleCode != ""){
      try{
        const insertRow = await new Promise((resolve, reject) => {
          this.connection.query(dbQueries.addNewAssessment, [assessmentName, moduleCode, studentClass], (err, result) => {
            if(err) reject(new Error(err.message));
            resolve();
          })
        });
        return {
          assessmentName: assessmentName,
          moduleCode: moduleCode
        }
      } catch(error){
        console.log(error)
      }
    }
    
  }

  async deleteAssessment(assessmentID) {
    try {
      assessmentID = assessmentID;
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.deleteAssessment, [assessmentID], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }

  async editAssessment(assessmentID, assessmentName, studentClass, moduleCode) {
    try {
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.updateAssessment, [assessmentName, moduleCode, studentClass, assessmentID], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }
  // END OF ASSESSMENT FUNCTIONS ======================================================================================================================================================

  // START OF GRADES FUNCTIONS ========================================================================================================================================================
  async getAssessmentModules(classCode) {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.selectAssessmentModules, [classCode], (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async getModuleAssessments(classCode, moduleCode) {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.selectModuleAssessments, [moduleCode, classCode], (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async getSpecificStudents(classCode) {
    try{
      const res = await new Promise((resolve, reject) => {
      this.connection.query(dbQueries.getSpecificStudents, [classCode], (err, results) => {
        if(err) reject(new Error(err.message));
        resolve(results);
      })
    });
    return res;
  }
  catch(error) {
    console.log(error);
  }
  }

  async addGrades(grades) {
    for (const grade of grades) {
      try {
        const { regNo, assessmentID, score } = grade;
        await new Promise((resolve, reject) => {
          this.connection.query(dbQueries.addGrades, [regNo, assessmentID, score], (err, result) => {
              if (err) reject(new Error(err.message));
              resolve();
            }
          );
        });
        
      } catch (error) {
        await new Promise((resolve, reject) => {
          this.connection.query(dbQueries.resetAutoIncrement, (err, result) => {
              if (err) reject(new Error(err.message));
              //insertedRows += result.affectedRows;
              resolve();
            }
          );
        });
      }
    }
      
  }

  async getGrades() {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.selectGrades, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async deleteGrade(gradeID) {
    try {
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.deleteGrade, [gradeID], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }

  async editGrade(gradeID, score) {
    try {
      const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.updateGrade, [score, gradeID], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return res === 1 ? true : false;
    }
     catch(error){
      console.log(error);
      return false;
    }
  }
  // END OF GRADES FUNCTION


  // DASHBOARD QUERIES
  async studentsPerClass() {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.studentsPerClass, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async assessmentsPerClassPerModule() {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.assessmentsPerClassPerModule, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async performanceTrend() {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.performanceTrend, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async topPerfomingClasses() {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.topPerfomingClasses, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async genderPerformance() {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.genderPerformance, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

  async topPerformingStudents() {
    try{
        const res = await new Promise((resolve, reject) => {
        this.connection.query(dbQueries.topPerformingStudents, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return res;
    }
    catch(error) {
      console.log(error);
    }
  }

}

module.exports = {createTableQueries, DatabaseService};