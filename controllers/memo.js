const express = require('express')
const Memo = require('../models/memo')
const Task = require('../models/task')

const router = express.Router()

router.use((req, res, next) => {

	if (req.session.loggedIn) {
		next()
	} else {
		res.redirect('/auth/login')
	}
})

router.get('/', (req, res) => {
	Memo.find({})
	    .populate('owner')
		.populate('task')
		.then(memos => {
			const { username, userId, loggedIn } = req.session
			res.render('indexmemos', { memos, username, loggedIn, userId })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

router.get('/previewmemo', (req,res)=> {
	const { username, userId, loggedIn } = req.session
	Task.find({checked: true})
	.populate('owner')
			.then((tasks) => {		
			res.render('previewpage.liquid', { tasks,  username, loggedIn, userId })
			})

			.catch((err) => {
			console.log(err)
			res.json({ err })
			})

})

router.get('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
	const memoId = req.params.id
	Memo.findByIdAndRemove(memoId)
		.then((memo) => {
			res.redirect('back')
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

module.exports = router