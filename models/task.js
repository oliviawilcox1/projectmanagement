const mongoose = require('./connection')
// const Memo = require('./memo')
const User = require('./user')
const { Schema, model } = mongoose
const taskSchema = new Schema(
    {
        title: { type: String, required: true },
		description: { type: String, required: true },
		cost: { type: Number, required: true },
		completed: { type: Boolean, required: true },
        date: { type: String, required: true },
        assigned: { type: String, required: true},
		completed: {type: Boolean},
        owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
)

const Task = model('Task', taskSchema)

module.exports = Task