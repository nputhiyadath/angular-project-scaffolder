#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import shell from 'shelljs';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

// NPM Registry configurations
const DEFAULT_NPM_CONFIG = {
  registry: 'https://registry.npmjs.org/',
  'strict-ssl': true,
  'save-exact': true,
  'package-lock': true,
  'audit': true,
  'fund': false,
  'progress': false
};

// Default dependencies
const DEFAULT_DEPENDENCIES = [
  'angular/core',
  'angular/forms',
  'angular/router',
  'angular/common',
  'rxjs'
];

// Optional additional dependencies
const OPTIONAL_DEPENDENCIES = [
  'angular/material',
  'ngrx/store',
  'angular/animations',
  'angular/http',
  'bootstrap',
  'tailwindcss'
];

// Function to gather npm configuration
const createNpmConfig = async () => {
  const npmrcPrompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'registry',
      message: 'NPM Registry URL:',
      default: DEFAULT_NPM_CONFIG.registry
    },
    {
      type: 'confirm',
      name: 'saveExact',
      message: 'Save exact versions in package.json?',
      default: DEFAULT_NPM_CONFIG['save-exact']
    },
    {
      type: 'confirm',
      name: 'audit',
      message: 'Enable npm audit?',
      default: DEFAULT_NPM_CONFIG.audit
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Organization scope (optional, without @):',
      default: ''
    }
  ]);

  const npmrcContent = [
    `registry=${npmrcPrompt.registry}`,
    `save-exact=${npmrcPrompt.saveExact}`,
    `audit=${npmrcPrompt.audit}`,
    'strict-ssl=true',
    'package-lock=true',
    'fund=false',
    'progress=false'
  ];

  // Add scope-specific configuration if provided
  if (npmrcPrompt.scope) {
    npmrcContent.push(`@${npmrcPrompt.scope}:registry=${npmrcPrompt.registry}`);
  }

  return npmrcContent;
};

program
  .version('1.0.0')
  .description('Angular Project Scaffolder CLI');

program
  .command('create <projectName>')
  .description('Create a new Angular project')
  .action(async (projectName) => {
    try {
      // Prompt for project configuration
      const projectConfig = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useDefaultDeps',
          message: 'Use default Angular dependencies?',
          default: true
        },
        {
          type: 'checkbox',
          name: 'additionalDeps',
          message: 'Select additional dependencies:',
          choices: OPTIONAL_DEPENDENCIES,
          when: (answers) => !answers.useDefaultDeps
        },
        {
          type: 'list',
          name: 'styling',
          message: 'Choose styling preprocessor:',
          choices: ['CSS', 'SCSS', 'SASS', 'Less']
        }
      ]);

      // Determine final dependencies
      const dependencies = projectConfig.useDefaultDeps 
        ? DEFAULT_DEPENDENCIES 
        : [...DEFAULT_DEPENDENCIES, ...projectConfig.additionalDeps];

      // Create Angular project
      console.log(`🚀 Creating Angular project: ${projectName}`);
      
      // Get npm configuration first
      const npmConfig = await createNpmConfig();
      
      // Use Angular CLI to generate project
      shell.exec(`npx @angular/cli@latest new ${projectName} --style=${projectConfig.styling.toLowerCase()} --routing=true`);
      
      // Change to project directory
      shell.cd(projectName);

      // Create .npmrc file with previously gathered config
      const npmrcPath = path.join(process.cwd(), '.npmrc');
      await fs.writeFile(npmrcPath, npmConfig.join('\n'));
      console.log('📝 Created .npmrc configuration');

      // Install additional dependencies
      if (!projectConfig.useDefaultDeps && projectConfig.additionalDeps.length > 0) {
        console.log('📦 Installing additional dependencies...');
        shell.exec(`npm install ${projectConfig.additionalDeps.join(' ')}`);
      }

      console.log(`✨ Project ${projectName} created successfully!`);
      console.log(`cd ${projectName} to get started`);
    } catch (error) {
      console.error('❌ Project creation failed:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
