const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const baseDirectory = '/Users/pranav/codedamn/projects'

const globalTags = [
	'JavaScript',
	'Markdown',
	'Github-Actions',
	'YAML',
	'Node',
	'Bash',
	'HTML/CSS',
	'React',
	'Web Socket',
	'ReactJS',
	'Socket.io',
	'Web3',
	'Solidity',
	'Next.js',
	'TailwindCSS',
	'Quotable',
	'Tailwind',
	'HTML',
	'CSS',
	'Tailwind CSS',
	'MongoDB',
	'Redux',
	'Node.js',
	'Express',
	'Nodejs',
	'Javascript',
	'Regex',
	'GraphQL',
	'Websockets',
	'Express.js',
	'EJS',
	'YouTube Data API'
]

// Function to recursively search for spec.yml files in all folders
function findSpecFiles(directory) {
	const specFiles = []

	// Read all directory contents
	const files = fs.readdirSync(directory)

	// Iterate over each file/directory
	files.forEach(file => {
		const filePath = path.join(directory, file)

		// If it's a directory, recursively search for spec.yml files
		if (fs.lstatSync(filePath).isDirectory()) {
			specFiles.push(...findSpecFiles(filePath))
		}
		// If it's a spec.yml file, add it to the list
		else if (file === 'spec.yml') {
			specFiles.push(filePath)
		}
	})

	return specFiles
}

let globalTagsList = []
// Function to modify the contents of a YAML file
function modifyYamlFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8')
		const obj = yaml.load(content)

		if (obj.tags.indexOf('Web Sockets') != -1) {
			obj.tags.splice(obj.tags.indexOf('Web Sockets'), 1)
			obj.tags.push('WebSocket')

			console.log('Tag Changed')
		}

		globalTagsList.push(...obj.tags)

		// Convert the modified object back to YAML
		const modifiedContent = yaml.dump(obj)

		// Write the modified YAML back to the file
		fs.writeFileSync(filePath, modifiedContent, 'utf8')

		console.log(`Successfully modified ${filePath}`)
	} catch (error) {
		console.error(`Error modifying ${filePath}: ${error}`)
	}
}

function onlyUnique(value, index, array) {
	return array.indexOf(value) === index
}

// Call the function to find all spec.yml files
const specFiles = findSpecFiles(baseDirectory)

// Iterate over each spec.yml file and modify it
specFiles.forEach(filePath => modifyYamlFile(filePath))

globalTagsList = globalTagsList.filter(onlyUnique)
console.log(globalTagsList)
