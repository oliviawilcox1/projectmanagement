const express = require('express')
const Task = require('../models/task')
const Memo = require('../models/memo')

const router = express.Router()

router.use((req, res, next) => {
	if (req.session.loggedIn) {
		next()
	} else {
		res.redirect('/auth/login')
	}
})

router.get('/', (req, res) => {
	req.body.checked = req.body.checked === true ? false : false
	Task.find({})
		.populate('owner')
		.then(tasks => {
			const { username, userId, loggedIn } = req.session
			Task.updateMany({tasks}, req.body,{ new: true })
				.then((task) => {
				res.render('index', { tasks, username, loggedIn, userId })
		})
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

router.get('/new', (req, res) => {
    const { username, userId, loggedIn } = req.session
	Task.find({ owner: userId})
		.then(tasks => {
			res.render('create.liquid', { tasks, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

router.post('/new', (req,res)=> {
	const { username, userId, loggedIn } = req.session
	req.body.checked = req.body.checked === 'on' ? true : false
	req.body.owner = req.session.userId

	Task.create(req.body)
		.then(tasks => {
			res.redirect('/tasks/new')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

router.get('/show', (req, res) => {
	let order = req.query.order_number;
	let sku = req.query.sku;
	let setter = req.query.setter
	let date = req.query.date
	req.body.checked = req.body.checked === false ? false : true
	Task.find({ 
		$or: [
		{order_number: order, sku: sku, setter: setter, date: date}, 
		{order_number: order, sku: sku, date: date}, 
		{order_number: order, sku: sku},
		{order_number: order, date: date},
		{order_number: order, setter: setter, date: date},
		{order_number: order, setter: setter},
		{date: date, setter: setter},
		{sku: sku, date: date},
		{sku: sku, setter: setter},
		{setter: setter},
		{sku: sku},
		{order_number: order},
		{date: date}
	]
})
	.populate('owner')
		.then((tasks) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId
			Task.updateMany({	
				$or: [
				{order_number: order, sku: sku, setter: setter, date: date}, 
				{order_number: order, sku: sku, date: date}, 
				{order_number: order, sku: sku},
				{order_number: order, date: date},
				{order_number: order, setter: setter, date: date},
				{order_number: order, setter: setter},
				{date: date, setter: setter},
				{sku: sku, date: date},
				{sku: sku, setter: setter},
				{setter: setter},
				{sku: sku},
				{order_number: order},
				{date: date}
			]}, req.body, {new: true})
				.then((task) => {
					res.render('filter', {tasks, username, loggedIn, userId})
				})
			
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})	

router.delete('/:id', (req, res) => {
	const taskId = req.params.id
	Task.findByIdAndRemove(taskId)
		.then((task) => {
			res.redirect('/tasks')
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})




// *********************** MEMO ROUTES *************************************

router.post('/creatememo/', (req, res) => {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userId = req.session.userId

	Task.find({checked: true}).lean()
	.populate('owner')
	.then(tasks => {
	
		 Memo.create({task: tasks})
			.then(memo => {
			return memo.save()
			})
			.then(memos => {
				const { username, userId, loggedIn } = req.session
	
				res.redirect(`memos/${memos._id}`)
			})
	}) 
			.catch((err) => {
				console.log(err)
				res.redirect('/nojobsselected')
				res.json({ err })
				})
	})

router.get('/memos/:id', (req, res) => {
	const memoId = req.params.id
	Memo.findById(memoId)
		.populate('owner')
		.populate('task')
		.then((memos) => {
			const { username, userId, loggedIn } = req.session
			res.render('printmemo.liquid', { memos, newArr, username, loggedIn, userId })
		})
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})

module.exports = router

