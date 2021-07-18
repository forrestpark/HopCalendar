const app = require('./app.js');
const port = process.env.PORT || 3000;
const db = require('./models');

const Student = db.Student
const Instructor = db.Instructor
const Task = db.Task
const PotentialInstructor = db.PotentialInstructor
const Course = db.Course

console.log("process.env.PORT: ", process.env.PORT)


;(async function main() {
    try {
        // adding dummy data

        const admins = [1]
        const tasks1 = [1, 2]
        const tasks2 = [3, 4]
        const tasks3 = [5, 6]
        const tasks4 = [7, 8]
        const tasks5 = [9, 10]
        const tasks6 = [11, 12]
        const alltasks = [tasks1, tasks2, tasks3, tasks4, tasks5, tasks6]

        const hw1 = await Task.create({
            type: 'Homework',
            deadline: '11/9/2020',
            info: 'Submit on blackboard.',
        })
        const hw2 = await Task.create({
            type: 'Homework',
            deadline: '11/12/2020',
            info: 'Submit on blackboard.',
        })
        const hw3 = await Task.create({
            type: 'Homework',
            deadline: '11/21/2020',
            info: 'Submit on blackboard.',
        })
        const hw4 = await Task.create({
            type: 'Homework',
            deadline: '11/19/2020',
            info: 'Submit on blackboard.',
        })
        const hw5 = await Task.create({
            type: 'Homework',
            deadline: '11/29/2020',
            info: 'Submit on blackboard.',
        })
        const hw6 = await Task.create({
            type: 'Homework',
            deadline: '11/21/2020',
            info: 'Submit on blackboard.',
        })
        const hw7 = await Task.create({
            type: 'Homework',
            deadline: '11/9/2020',
            info: 'Submit on blackboard.',
        })
        const hw8 = await Task.create({
            type: 'Homework',
            deadline: '11/30/2020',
            info: 'Submit on blackboard.',
        })
        const hw9 = await Task.create({
            type: 'Homework',
            deadline: '11/25/2020',
            info: 'Submit on blackboard.',
        })
        const hw10 = await Task.create({
            type: 'Homework',
            deadline: '11/26/2020',
            info: 'Submit on blackboard.',
        })
        const hw11 = await Task.create({
            type: 'Homework',
            deadline: '11/29/2020',
            info: 'Submit on blackboard.',
        })
        const hw12 = await Task.create({
            type: 'Homework',
            deadline: '11/23/2020',
            info: 'Submit on blackboard.',
        })

        // creating dummy course objects
        const course1 = await Course.create({
            admins: 1,
            instructor: 1,
            classNumber: 502,
            tasks: alltasks.toString(),
            name: "design"
        })

        const course2 = await Course.create({
            admins: 1,
            instructor: 1,
            classNumber: 601,
            tasks: alltasks.toString(),
            name: "JAVA"
        })

        const jane = await Student.create({
            name: 'Jane',
            courses: course2.toString(),
            email: 'janedoe@jhu.edu',
            password: 'hellokitty',
            completedTasks: '',
        })
        const darvish = await Instructor.create({
            name: 'Darvish',
            courses: course1.toString(),
            email: 'darvish@jhu.edu',
            password: 'computer',
        })

        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
})()

app.get('/', async (req, res) => {
    try {
        res.send('Welcome to HopCalendar!')
    } catch (error) {
        res.send('failed')
    }
})

//endpoint login => find which student it is 
app.post('/login', async (req, res) => {
    //get email, password and role
    try {
        console.log("logging in")
        var userInfo = req.body
        console.log("user info: ", userInfo)
        var email = userInfo.email
        var pw = userInfo.password
        var role = userInfo.role
        let query = null
        if (role == 'Student' || role == 'student') {
            console.log("is a student")
            query = await Student.findAll({
                where: {
                    email: email,
                    password: pw,
                },
            })
            console.log("query: ", query)
        } else {
            query = await Instructor.findAll({
                where: {
                    email: email,
                    password: pw,
                },
            })
        }
        if (query.length == 0) {
            res.sendStatus(500)
        } else {
            //if succeeds send entire student/instructor object back to store on the frontend.
            res.status(200).send(query[0].dataValues)
        }
    } catch (error) {
        res.sendStatus(500)
    }
    
})

//endpoint create account 
app.post('/create_account', async (req, res) => {
    //first get email, password, role, name from front end
    try {
        var userInfo = req.body
        var reqName = userInfo.name
        var reqEmail = userInfo.email
        var reqPw = userInfo.password
        var role = userInfo.role
        var userCourses = ""
        if (role == "potentialinstructor") {
            userCourses = userInfo.courses
        }
        
        //create a new user based on the role
        if (role == 'Student' || role == 'student') {
            await Student.create({
                name: reqName,
                courses: '',
                email: reqEmail,
                password: reqPw,
            })
        } else {
            await Instructor.create({
                name: reqName,
                courses: userCourses,
                email: reqEmail,
                password: reqPw,
            })
        }
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
    
})

// get course IDs of the courses represented by the given course numbers
app.post('/getcourseids', async (req, res) => {
    try {
        const reqBody = req.body
        const courseNumbers = reqBody.courseNumbers
        const courseNumArray = courseNumbers.split(',')
        let courseIDArray = []
        for (let i = 0; i < courseNumArray.length; i++) {
            //for each coursenumber, find the corresponding course
            let courses = await Course.findAll({
                where: {
                    classNumber: courseNumArray[i]
                }
            })
            // for each course in courses array, push its courseid to courseidarray
            for (let i = 0; i < courses.length; i++) {
                courseIDArray.push(courses[i].id)
            }
        }
        res.send(courseIDArray.toString())
    } catch (error) {
        res.sendStatus(500)
    }
})

// check if given email already exists or not in the database 
app.post('/getEmailAddress', async (req, res) => {
    try {
        var validEmailAddress = false
        const reqBody = req.body
        const inputEmailAddress = reqBody.email
        const role = reqBody.role
        
        //var existingStudEmailAddress = null
        //var existingInstrEmailAddress = null
        /*if (role == "student") {
            existingStudEmailAddress = await Student.findAll({
                where: {
                    email: inputEmailAddress
                }
            })
        } else {
            existingInstrEmailAddress = await Instructor.findAll({
                where: {
                    email: inputEmailAddress
                }
            })
        }  */

        var existingStudEmailAddress = await Student.findAll({
            where: {
                email: inputEmailAddress
            }
        })
        var existingInstrEmailAddress = await Instructor.findAll({
            where: {
                email: inputEmailAddress
            }
        })
        if (existingStudEmailAddress.length == 0 && existingInstrEmailAddress.length == 0) {
            validEmailAddress = true
        }
        res.send(validEmailAddress)
    } catch (error) {
        res.sendStatus(500)
    }
})

// create potential instructor account that will either be approved or rejected by app admin
app.post('/createpotentialinstructor', async (req, res) => {
    try {
        const reqBody = req.body
        const password = reqBody.password
        const email = reqBody.email
        const name = reqBody.name
        const courses = reqBody.courses
        const courseNums = reqBody.courseNumbers
        await PotentialInstructor.create({
            password: password,
            email: email,
            name: name,
            courses: courses,
            courseNumbers: courseNums
        })
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

// get all potential instructors
app.post('/getpotentialinstructors', async (req, res) => {
    try {
        const array = []
        const potinstructors = await PotentialInstructor.findAll()
        potinstructors.forEach((potinst) => {
            array.push(potinst.dataValues)
        })
        res.send(array)
    } catch (error) {
        res.sendStatus(500)
    }
})

// delete the specified potential instructor
app.post('/removepotentialinstructor', async (req, res) => {
    try {
        const reqBody = req.body
        const email = reqBody.email
        await PotentialInstructor.destroy({
            where: {
                email: email
            }
        });
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

//endpoint delete account
app.get('/delete', async (req, res) => {
    res.send(backToObjJSON._name)
})

//endpoint get all courses
app.post('/AllCourses', async (req, res) => {
    try {
        const courses = await Course.findAll()
        const courseArray = []
        courses.forEach((course) => {
            courseArray.push(course.dataValues)
        })
        res.send(courseArray)
    } catch (error) {
        res.sendStatus(500)
    }
    
})

//endpoint add course for a user 
app.post('/add_course', async (req, res) => {
    try {
        const reqBody = req.body
        const role = reqBody.role
        const id = reqBody.id
        console.log("add course, id: ", id)
        const courseId = reqBody.courseId
        console.log("add course, course id", courseId)
        let user = null
        if (role == 'student' || role == 'Student') {
            user = await Student.findByPk(id)
        } else {
            user = await Instructor.findByPk(id)
        }

        const newCourseArray = []
        //find newCourse
        const newCourse = await Course.findByPk(courseId)
        let success = '0'
        if (newCourse == null) {
            return res.send({ success, user })
        }
        let courseArray = user.dataValues.courses.split(',')
        for (let i = 0; i < courseArray.length; i++) {
            if (courseArray[i] == '') {
                continue
            }
            newCourseArray.push(courseArray[i])
            if (courseArray[i] == courseId) {
                return res.send({ success, user })
            }
        }
        //add new course
        newCourseArray.push(newCourse.id)
        if (role == 'student' || role == 'Student') {
            await Student.update(
                { courses: newCourseArray.toString() },
                {
                    where: {
                        id: id,
                    },
                }
            )
        } else {
            await Instructor.update(
                { courses: newCourseArray.toString() },
                {
                    where: {
                        id: id,
                    },
                }
            )
        }
        success = '1'
        res.send({ success, user })
    } catch (error) {
        res.sendStatus(500)
    }
    
})

//endpoint delete course for a user 
app.post('/delete_course', async (req, res) => {
    try {
        const reqBody = req.body
        const role = reqBody.role
        const id = reqBody.id
        const courseId = reqBody.courseId
        let user = null
        if (role == 'student' || role == 'Student') {
            user = await Student.findByPk(id)
        } else {
            user = await Instructor.findByPk(id)
        }
        let courseArray = user.dataValues.courses.split(',')
        let newCourseArray = []
        //to get rid of null string in the beginning
        if (courseArray[0] == '') {
            for (let i = 1; i < courseArray.length; i++) {
                newCourseArray.push(courseArray[i])
            }
        } else {
            newCourseArray = courseArray
        }
        for (let i = 0; i < newCourseArray.length; i++) {
            if (newCourseArray[i] == courseId) {
                newCourseArray.splice(i, 1)
            }
        }
        if (role == 'student' || role == 'Student') {
            await Student.update(
                { courses: newCourseArray.toString() },
                {
                    where: {
                        id: id,
                    },
                }
            )
        } else {
            await Instructor.update(
                { courses: newCourseArray.toString() },
                {
                    where: {
                        id: id,
                    },
                }
            )
        }
        res.send(user.courses)
    } catch (error) {
        res.sendStatus(500)
    }
})

//endpoint add task for instructor
app.post('/add_task', async (req, res) => {
    try {
        const reqBody = req.body
        const courseId = reqBody.courseId
        const type = reqBody.type
        const deadline = reqBody.deadline
        const info = reqBody.info
        let course = await Course.findByPk(courseId)
        const newTask = await Task.create({
            type: type,
            deadline: deadline,
            info: info,
        })
        let taskId = newTask.dataValues.id
        let taskArray = course.dataValues.tasks.split(',')
        taskArray.push(`${taskId}`)
        await Course.update(
            { tasks: taskArray.toString() },
            {
                where: {
                    id: courseId,
                },
            }
        )
        res.send(course.tasks)
    } catch (error) {
        res.sendStatus(500)
    }
    
})

//endpoint delete task for instructor 
app.post('/delete_task', async (req, res) => {
    try {
        const reqBody = req.body
        const courseId = reqBody.courseId
        const taskId = reqBody.taskId
        let course = await Course.findByPk(courseId)
        let taskArray = course.dataValues.tasks.split(',')
        for (let i = 0; i < taskArray.length; i++) {
            if (taskArray[i] == taskId) {
                taskArray.splice(i, 1)
            }
        }
        await Course.update(
            { tasks: taskArray.toString() },
            {
                where: {
                    id: courseId,
                },
            }
        )
        res.send(course.tasks)
    } catch (error) {
        res.sendStatus(500)
    }
    
})

//endpoint edit task for instructor
app.post('/edit_task', async (req, res) => {
    try {
        const reqBody = req.body
        const taskId = reqBody.taskId

        const newType = reqBody.type
        const newDeadline = reqBody.deadline
        const newInfo = reqBody.info

        await Task.update(
            { type: newType },
            {
                where: {
                    id: taskId,
                },
            }
        )

        await Task.update(
            { deadline: newDeadline },
            {
                where: {
                    id: taskId,
                },
            }
        )

        await Task.update(
            { info: newInfo },
            {
                where: {
                    id: taskId,
                },
            }
        )
        let task = await Task.findByPk(taskId)
        res.send(task)
    } catch (error) {
        res.sendStatus(500)
    }
    
})

// mark task as being completed. this feature is only for students 
app.post('/mark_complete', async (req, res) => {
    try {
        const reqBody = req.body
        const taskId = reqBody.taskId
        const studentId = reqBody.studentId
        const student = await Student.findByPk(studentId)
        let complTasks = student.dataValues.completedTasks.split(',')
        if (complTasks[0] == '') {
            complTasks[0] = `${taskId}`
        } else {
            complTasks.push(`${taskId}`)
        }
    
        await Student.update({completedTasks: complTasks.toString()}, {
            where: {
                id: studentId,
            },
        })
    }
    catch (error) {
        res.sendStatus(500)
    }

})

// mark task as being incomplete. this feature is only for students 
app.post('/mark_incomplete', async (req, res) => {
    try {
        const reqBody = req.body
        const taskId = reqBody.taskId
        const studentId = reqBody.studentId

        const student = await Student.findByPk(studentId)
        let complTasks = student.dataValues.completedTasks.split(',')

        for (let i = 0; i < complTasks.length; i++) {
            if (complTasks[i] == taskId) {
                complTasks.splice(i, 1)
            }
        }

        await Student.update({completedTasks: complTasks.toString()}, {
            where: {
                id: studentId
            }
        })
    }
    catch (error) {
        res.sendStatus(500)
    }
})

// get the specified student's completed tasks
app.post('/getcompletedtasks', async (req, res) => {
    try {
        const reqBody = req.body
        const studentId = reqBody.id
        const student = await Student.findByPk(studentId)
        let array = student.completedTasks.split(',')
        res.send({array})
    }
    catch (error) {
        res.sendStatus(500)
    }
})

//endpoint get all courses and tasks associated with the student 
//expects student/instructor ID.
app.post('/getcourses', async (req, res) => {
    try {
        const reqBody = req.body
        const role = reqBody.role
        console.log("role: ", role)
        const id = parseInt(reqBody.id)
        let user = null
        if (role == 'student' || role == 'Student') {
            console.log("is a student")
            user = await Student.findByPk(id)
        } else {
            console.log("is not a student")
            user = await Instructor.findByPk(id)
        }
        console.log("user: ", user)
        const courses = user.dataValues.courses
        console.log("get courses, courses: ", courses)
        if (courses == '') {
            console.log("empty course array")
            res.send({ courseArray: [], taskArray: [] })
            return
        }
        const courseIds = courses.split(',')
        console.log("get courses, courseIds: ", courseIds)
        const courseArray = []
        for (let courseId of courseIds) {
            const course = await Course.findByPk(parseInt(courseId))
            console.log("get courses, courseId finding: ", courseId)
            console.log("get courses, course found: ", course)
            courseArray.push(course)
            console.log("get courses, courseArray: ", courseArray)
        }
        console.log("course array done")
        const taskArray = []
        for (let course of courseArray) {
            const taskIds = course.tasks.split(',')
            console.log("get courses, task ids: ", taskIds)
            for (let taskId of taskIds) {
                const task = await Task.findByPk(parseInt(taskId))
                console.log("get courses, task: ", task)
                taskArray.push(task)
            }
        }
        console.log("get courses, returning courseArray: ", courseArray)
        console.log("get courses, returning taskArray: ", taskArray)
        res.send({ courseArray, taskArray })
    } catch (error) {
        console.log("get courses, error")
        res.sendStatus(500)
    }
    
})

//get tasks for an individual class (both student and instructor)
app.post('/get_tasks', async (req, res) => {
    try {
        const reqBody = req.body
        const courseId = reqBody.courseId
        let course = await Course.findByPk(courseId)
        const tasks = course.dataValues.tasks
        //const taskArray = course.dataValues.tasks.split(',')
        if (tasks == '') {
            res.send({ taskArray: [] })
            return
        }
        const taskIds = tasks.split(',')
        const taskArray = []
        for (let taskId of taskIds) {
            const task = await Task.findByPk(parseInt(taskId))
            taskArray.push(task)
        }
        res.send({ taskArray })
    } catch (error) {
        res.sendStatus(500)
    }
    
})

app.listen( port, function() {
    console.log('Express listening on port', port);
});