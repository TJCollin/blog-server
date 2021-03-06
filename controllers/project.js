import Project from '../models/project'

export const insertProject = async (project) => {
	try {
		let findOne = await Project.find({projectName: project.projectName})
		let res
		if (findOne.length > 0) {
			res = await Project.updateOne({_id: findOne[0]._doc._id}, project)
		} else {
			res = await (new Project(project)).save()
		}
		return res
	} catch (e) {
		return e
	}
}

export const deleteProject = async (id) => {
	let res = await Project.findByIdAndRemove(id)
	return res
}

export const getProjectListByPage = async (page = null) => {
	let pipelineArr = [
		{$skip: 0}
	]
	if (page) {
		pipelineArr.push(
			{$skip: 10 * (page - 1)},
			{$limit: 10}
		)
	}
	let res_limit = await Project.aggregate(pipelineArr)
	let total = await Project.countDocuments()
	// if (page > 0) {
	// 	res_limit = await Project.find().sort({"_id": 1}).skip(10 * (page - 1)).limit(10)
	// }
	return {total: total, res_limit: res_limit}
}