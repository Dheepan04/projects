import Joi from 'joi'
import yamljs from 'yamljs'
import fs from 'fs'
import path from 'path'

let projectsMap: UpdatePlatformProjectsProjectsMapType = {}

let filesToCheck: string[] = []
type UpdatePlatformProjectsProjectsMapType = Record<
	string,
	{
		spec: {
			name: string
			tags: string[]
			'starter-files': string
			type: string
			level: string
			'short-description': string
			'long-description': string
		}
		steps?: {
			stepId: string
			instructions: string
			name?: string
			stepBreakDown?: {
				text: string
			}[]
		}[]
	}
>

const updatePlatformProjectsProjectsMapSchema = Joi.object<UpdatePlatformProjectsProjectsMapType>()
	.pattern(
		Joi.string().required(),
		Joi.object()
			.keys({
				spec: Joi.object()
					.keys({
						name: Joi.string().required(),
						tags: Joi.array().items(Joi.string().required()).required(),
						'starter-files': Joi.string().required(),
						type: Joi.string().required(),
						level: Joi.string().required(),
						'short-description': Joi.string().required(),
						'long-description': Joi.string().required(),
					})
					.required(),
				steps: Joi.array()
					.items(
						Joi.object()
							.keys({
								stepId: Joi.string().required(),
								instructions: Joi.string().required(),
								name: Joi.string().required(),
								stepBreakDown: Joi.array()
									.items(
										Joi.object()
											.keys({
												text: Joi.string().required()
											})
											.required()
									)
									.optional()
							})
							.required()
					)
					.optional()
			})
			.required()
	)
	.required()

function addGuidedProjectProperty(
	projectName: string,
	stepName: string,
	value: NonNullable<UpdatePlatformProjectsProjectsMapType[number]['steps']>[number]
) {
	if (!projectsMap[projectName])
		projectsMap[projectName] = {} as UpdatePlatformProjectsProjectsMapType[number]

	if (projectsMap[projectName].steps) {
		const index = projectsMap[projectName].steps?.findIndex(s => s.stepId === stepName)
		if (index === -1) projectsMap[projectName].steps?.push(value)
		else {
			projectsMap[projectName].steps![index!] = {
				...projectsMap[projectName].steps![index!],
				...value
			}
		}
	} else {
		projectsMap[projectName].steps = [value]
	}
}

async function validateProjectSpecification(projectsMap: UpdatePlatformProjectsProjectsMapType) {
	const { error: projectsMapError } =
		updatePlatformProjectsProjectsMapSchema.validate(projectsMap)

	if (projectsMapError) {
		console.log('Joi Validation error before updatePlatformProjects', {
			projectsMapError: JSON.stringify(projectsMapError)
		})

		throw new Error(`Joi Validation error: ${projectsMapError.message}`)
	}
}

async function readDirs(dirPath: string) {
	const excludedDirs = ['node_modules', 'schemas', '.git', '.github', 'build']
	const dirContent = fs.readdirSync(dirPath)
	dirContent.map(fileOrFolder => {
		if (excludedDirs.includes(fileOrFolder)) return
		if (fs.lstatSync(path.resolve(dirPath, fileOrFolder)).isDirectory())
			readDirs(path.resolve(dirPath, fileOrFolder))
		else filesToCheck.push(path.resolve(dirPath, fileOrFolder))
	})
}

async function validate(): Promise<void> {
	await readDirs('./')

	try {
		filesToCheck?.map(async file => {
			if (file.endsWith('challenges.yml')) {
				const pathList = file.split('/')
				const projectName = pathList[pathList.length - 3]
				const stepName = pathList[pathList.length - 2]

				const fileContent = fs.readFileSync(file)
				addGuidedProjectProperty(
					projectName,
					stepName,
					yamljs.parse(fileContent.toString())
				)
			} else if (file.endsWith('Instructions.md')) {
				const pathList = file.split('/')
				const projectName = pathList[pathList.length - 3]
				const stepName = pathList[pathList.length - 2]
				const fileContent = fs.readFileSync(file)

				addGuidedProjectProperty(projectName, stepName, {
					stepId: stepName,
					instructions: fileContent.toString()
				})
			} else if (file.endsWith('spec.yml')) {
				// okay it's a spec
				// get project name
				const pathList = file.split('/')
				const projectName = pathList[pathList.length - 2]
				const fileContent = fs.readFileSync(file)

				projectsMap[projectName] = {
					spec: yamljs.parse(fileContent.toString())
				}
			} else {
			}
		})
		await validateProjectSpecification(projectsMap)
	} catch (error) {
		console.log('Error while validating the projects specifications: ', error)
		throw new Error(`Error while vallidating the project documents : 
${error}`)
	}
}

validate().then()
