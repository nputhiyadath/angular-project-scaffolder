# Angular Project Scaffolder

A CLI tool for scaffolding Angular projects with customizable dependencies.

## Installation

### NPM Global Installation
```bash
npm install -g @nidhish/angular-project-scaffolder
```

### Using Docker
```bash
# Build and run using regular Docker
docker build -t angular-scaffolder .
docker run -it -v $(pwd):/workspace angular-scaffolder create my-project
```

### Using Docker Compose
```bash
# Start the CLI container
docker-compose up -d

# Enter the container shell
docker-compose exec cli sh

# Now you can run multiple commands:
ng-scaffold create my-project-1
ng-scaffold create my-project-2

# Exit the container when done
exit

# Stop the container
docker-compose down
```

All generated projects will be available in the `workspace` directory.

## Usage

### Direct Usage
```bash
ng-scaffold create my-project
```

### Docker Usage
```bash
docker run -it -v $(pwd):/workspace angular-scaffolder create my-project
```

## Features

- Interactive project creation
- Customizable dependencies
- Multiple styling preprocessor options (CSS, SCSS, SASS, Less)
- Docker support for containerized usage

## Requirements

- Node.js >= 14.0.0
- npm or Docker

## License

ISC

# angular-project-scaffolder
