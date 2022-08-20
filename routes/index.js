var express = require('express')
var router = express.Router()

const Task = require('../models/task')

const { body, validationResult } = require('express-validator')

/* GET all tasks. */
router.get('/tasks', function (req, res, next) {
  Task.find({}, function (err, result) {
    if (err) {
      return next(err)
    }

    res.json({ msg: 'All tasks', tasks: result })
  })
})

/* Post add new task. */
router.post('/task', [
  body('header')
    .isLength({ max: 50, min: 1 })
    .escape()
    .withMessage(
      'Task header cannot include more than 50 characters and it must exists.'
    ),
  body('description')
    .isLength({ max: 500 })
    .escape()
    .withMessage('Task description cannot include more than 500 characters.'),

  function (req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return next(errors.array())
    }

    const task = new Task({
      header: req.body.header,
      description: req.body.description || '',
    })

    task.save(function (err, result) {
      if (err) {
        return next(err)
      }

      res.json({ message: 'Successully saved the task.', task: result })
    })
  },
])

/* PUT update a task.. */
router.put('/task/update/:taskid', [
  body('header')
    .isLength({ max: 50, min: 1 })
    .escape()
    .withMessage(
      'Task header cannot include more than 50 characters and it must exists.'
    ),
  body('description')
    .isLength({ max: 500 })
    .escape()
    .withMessage('Task description cannot include more than 500 characters.'),
  function (req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return next(errors.array())
    }

    Task.findById(req.params.taskid, function (err, targetTask) {
      if (err) {
        return next(err)
      }
      const task = new Task({
        _id: targetTask._id,
        header: req.body.header || targetTask.header,
        description:
          req.body.description === ''
            ? ''
            : req.body.description || targetTask.description,
        isCompleted: targetTask.isCompleted,
        createdAt: targetTask.createdAt,
      })

      Task.findByIdAndUpdate(req.params.taskid, task, function (err, result) {
        if (err) {
          return next(err)
        }

        res.json({
          message: 'Successully updated the task.',
          task: result,
        })
      })
    })
  },
])

/* Delete remove a task. */
router.delete(
  '/task/:taskid',

  function (req, res, next) {
    Task.findByIdAndDelete(req.params.taskid, function (err, result) {
      if (err) {
        return next(err)
      }

      res.json({ message: 'Successully removed the task.', task: result })
    })
  }
)

/* PUT update task's status */
router.put('/task/status/:taskid', function (req, res, next) {
  Task.findById(req.params.taskid, function (err, targetTask) {
    if (err) {
      return next(err)
    }

    const task = new Task({
      _id: targetTask._id,
      header: targetTask.header,
      description: targetTask.description,
      isCompleted: req.body.isCompleted,
      createdAt: targetTask.createdAt,
    })

    Task.findByIdAndUpdate(req.params.taskid, task, function (err, result) {
      if (err) {
        return next(err)
      }

      res.json({
        message: 'Successully updated the task.',
        task: result,
      })
    })
  })
})

module.exports = router
