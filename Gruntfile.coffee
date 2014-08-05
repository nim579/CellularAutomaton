module.exports = (grunt)->
	grunt.initConfig
		coffee:
			app:
				files: [
					expand: true
					cwd: './src'
					src: ['**/*.coffee']
					dest: './src'
					ext: '.js'
				]

		concat:
			app:
				src: ['./src/**/*.js']
				dest: './CellularAutomaton.js'

		docco:
			app:
				src: ['./src/**/*.coffee']
				options:
					output: './docs/'

		watch:
			app:
				files: ['./src/**/*.coffee']
				tasks: ['coffee:app', 'concat:app', 'docco:app']

		srv:
			test:
				port: 8001
				root: './'
				index: './CellularAutomaton.html'

	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-docco')
	grunt.loadNpmTasks('node-srv')
