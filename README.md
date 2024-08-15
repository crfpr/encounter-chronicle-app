# Welcome to your GPT Engineer project

## Project info

**Project**: encounter-chronicle 

**URL**: https://run.gptengineer.app/projects/d034b8c7-f358-43a9-b8e6-7a8d268edc64/improve

**Description**: I'm a dungeon master playing d&d 5e. I'd like to build an ecounter tracker that I can use to run combat encounters. 

It needs to have the following functionality:
- editable and saveable encounters
- editable encounter name
- a round counter that counts up from 1
- a turn button to advance from character to character (and a back button)
- a notes section with free text notes
- an editable list of participating characters

Rounds and turns
- encounters are divided into rounds
- each character gets one turn per round
- 

Each character needs:
- Editable intiative score tracker (numeric, 2 digit)
- Editable character name
- PC, NPC, or Enemy drop down selector
- current and max HP counter (persistent)
- action (check), bonus action (check), movement (numeric, 2 digit input), and reaction (check) tracker that resets at the top of each round
- an "add condition" button that ads a chip with an editable condition name, remaining round counter, and X for removing the condition

I've attached a quick sketch to show you a very rough idea
 

## Who is the owner of this repository?
By default, GPT Engineer projects are created with public GitHub repositories.

However, you can easily transfer the repository to your own GitHub account by navigating to your [GPT Engineer project](https://run.gptengineer.app/projects/d034b8c7-f358-43a9-b8e6-7a8d268edc64/improve) and selecting Settings -> GitHub. 

## How can I edit this code?
There are several ways of editing your application.

**Use GPT Engineer**

Simply visit the GPT Engineer project at [GPT Engineer](https://run.gptengineer.app/projects/d034b8c7-f358-43a9-b8e6-7a8d268edc64/improve) and start prompting.

Changes made via gptengineer.app will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in the GPT Engineer UI.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps: 

```sh
git clone https://github.com/GPT-Engineer-App/encounter-chronicle.git
cd encounter-chronicle
npm i

# This will run a dev server with auto reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

All GPT Engineer projects can be deployed directly via the GPT Engineer app. 

Simply visit your project at [GPT Engineer](https://run.gptengineer.app/projects/d034b8c7-f358-43a9-b8e6-7a8d268edc64/improve) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain, then we recommend GitHub Pages.

To use GitHub Pages you will need to follow these steps: 
- Deploy your project using GitHub Pages - instructions [here](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
- Configure a custom domain for your GitHub Pages site - instructions [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)