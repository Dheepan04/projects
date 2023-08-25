import fs from 'node:fs'
import yaml from 'yaml'
import path from 'path'
import { z } from 'zod'

function readDirs(dirPath: string): string[] {
	const filesToCheck: string[] = []
	const excludedDirs = ['node_modules', 'schemas', '.git', '.github', 'assets', 'build']
	const excludedFiles = [
		'.gitignore',
		'.prettierignore',
		'.prettierrc.cjs',
		'package.json',
		'README.md',
		'tsconfig.json',
		'yarn.lock',
		'index.ts'
	]

	const dirContent = fs.readdirSync(dirPath)

	dirContent.forEach(fileOrFolder => {
		if (excludedDirs.includes(fileOrFolder)) return
		if (excludedFiles.includes(fileOrFolder)) return

		if (fs.statSync(path.resolve(dirPath, fileOrFolder)).isDirectory()) {
			filesToCheck.push(...readDirs(path.resolve(dirPath, fileOrFolder)))
		} else {
			filesToCheck.push(path.resolve(dirPath, fileOrFolder))
		}
	})

	return filesToCheck
}

const filesToCheck = readDirs('./')

for (const file of filesToCheck) {
	if (file.includes('challenges.yml')) {
		const challengesFileData = yaml.parse(fs.readFileSync(file, 'utf-8'))

		const challengeSchema = z.object({
			challenges: z.array(
				z.object({
					text: z.string()
				})
			)
		})

		const result = challengeSchema.safeParse(challengesFileData)

		if (!result.success) {
			console.log(challengesFileData)
			throw new Error(
				`Failed to parse challenges.yml for ${file}. Zod error => ${result.error.message}`
			)
		}
	} else if (file.includes('step-information.md')) {
		const stepInformationData = fs.readFileSync(file, 'utf-8')

		// TODO: Do any markdown level validation if required
	} else if (file.includes('spec.yml')) {
		const specFileData = yaml.parse(fs.readFileSync(file, 'utf-8'))

		const specSchema = z.object({
			name: z.string().min(1),
			tags: z.array(z.string().min(1)).min(1),
			'starter-files': z.string().min(1),
			type: z.string().min(1),
			level: z.string().min(1),
			'short-description': z.string().min(1),
			'long-description': z.object({
				text: z.string().optional(),
				images: z
					.array(
						z.object({
							label: z.string(),
							url: z.string()
						})
					)
					.optional()
			})
		})

		const result = specSchema.safeParse(specFileData)

		if (!result.success) {
			console.log(specFileData)
			throw new Error(
				`Failed to parse spec.yml for ${file}. Zod error => ${result.error.message}`
			)
		}
	} else {
		throw new Error(`Unsupported file found: ${file}`)
	}
}
