const mongoose = require('./connection')

const User = require('./user')
const Task = require('./task')


const { Schema, model } = mongoose
const memoSchema = new Schema(
    {
        owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		task: [{
	}],
},
	{ timestamps: true }
)

const Memo = model('Memo', memoSchema)

module.exports = Memo