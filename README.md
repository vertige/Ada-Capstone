# RavelBot
#### Capstone Project for Ada Developers Academy Cohort 8
Visit deployed app at https://ravelbot.firebaseapp.com/

## Demo Video

[![Link to YouTube Demo of RavelBot](https://img.youtube.com/vi/IwsECsYnndE/0.jpg)](https://www.youtube.com/watch?v=IwsECsYnndE)


## Overview
This is the beginning of a chatbot (RavelBot) who will help bridge the gap between yarn enthusiasts' purchase of project patterns via Ravelry.com and acquiring requisite supplies via The Weaving Works, a yarn store store transitioning from established local yarn shop to online retailer.

Many Weaving Works customers feel uncertain about the materials required for projects via Ravelry.com. As The Weaving Works transitions from brick and mortar to predominantly e-commerce, RavelBot could be an opportunity to offer a new service (perhaps similar to parts of in-store customer service) that allows  customers to feel confident and supported in their projects and purchase.

__TLDR; User profile:__ A Weaving Works customer interested in making a project found on Ravelry.com

## Personal Learning
#### My goals were to learn more about the following:
- How to connect several APIs to create an interactive experience.
- Effectively implementing a chatbot with NLP (Natural Language Processing) and complex dialogue trees for an interactive experience.
- Implementing thoughtful chatbot UI to help better structure conversation flow and make the UX more streamlined.

#### What I learned
- I did manage to integrate 3 APIs to create RavelBot.
  - Dialogflow (formerly API.ai) for chat functionality and NLP.
  - Ravelry.com API for pattern search and details.
  - Shopify Admin API for searching for corresponding products on Weavingworks.com.
- The implementation of complex dialog trees is something that could be developed forever, and in the scope of the project for Capstone was kept limited.
- There are further UI elements that could be pursued. For the purpose of this Capstone and the new technologies at hand, I kept the interface as simple as I could while still trying to lead an effective conversation.

#### Also, I learned
- It's OK to work on one issue for 15 hours to however long it takes.
- That I truly enjoy and appreciate pair programming. (This was not a pair programming project.)
- It is unwise to use a version of a robust framework that has come out the month before you are trying to use it the first time.
- Working with live commercial websites has it's own host of considerations that require additional considerations.

## Project Status & Possible Future Enhancements
RavelBot is currently in a MVP state-- It performs pattern and yarn searches simply. There are almost infinite improvements that could be made.

#### The more immediate list (if I'd had another week before code freeze):
- Pagination (A 'More' button for additional results)
- Better styling with more Ravelry.com links in result listings
- Additional knitting, crochet and weaving conversation and recommendations
- Additional Weaving Works specific conversation
- Better UI elements such as a pattern carousel
- Ability to tell the user exactly how much is needed for their size
- Ability to list other required tools and notions and direct a customer to such items on Weavingworks.com

#### Future Possibilities (if this project were to continue IRL):
- Implementation as a widget on Weavingworks.com
- Ability to actually pass off to a real customer service agent
- Ability to e-mail transcript of conversation
- Ability to have RavelBot login to the users personal Ravelry.com account and suggest yarns for patterns within their own project queues

## Installation & Setup
So you really want to do this?

#### You will need
__API keys, authentication information and accounts from:__
- Ravelry.com [link to come]
- Dialogflow [link to come]
- Your own Shopify.com website populated with some yarns along with a Private App key and password. Alternatively, should you want to use OAuth with a Developers key, you would need to convert the authentification process yourself and request Weavingworks.com to install your app, which they won't, sorry.
- Google Cloud Firebase credentials. Create an App, so you can host your functions (functions/index.js) on their FAAS as well as host your RavelBot. You will need to provide a CC... (WAIT! DO I let users use my own proxy functions?)


__RavelBot uses Angular__
```
Angular CLI: 1.6.3
Node: 8.9.1
OS: darwin x64
Angular: 5.1.3
... animations, common, compiler, compiler-cli, core, forms
... http, language-service, platform-browser
... platform-browser-dynamic, router

@angular/cli: 1.6.3
@angular-devkit/build-optimizer: 0.0.36
@angular-devkit/core: 0.0.22
@angular-devkit/schematics: 0.0.42
@ngtools/json-schema: 1.1.0
@ngtools/webpack: 1.9.3
@schematics/angular: 0.1.11
@schematics/schematics: 0.0.11
typescript: 2.4.2
webpack: 3.10.0

```

__How I got there__

Done in bash.
- First install Node and npm (Node Package Manager)[use this link to download and follow their instructions](https://docs.npmjs.com/getting-started/installing-node)
- Clone this repo
- Install typescript `$ npm install -g typescript`
- Install Angular CLI `$ npm install -g @angular/cli`
- You will need to install the Google Cloud Firebase CLI Tools `$ npm install -g firebase-tools`
- Log in to Firebase `$ firebase login`
- Navigate to the ravelbot folder and initialize firebase `$ firebase init`
  - This gets intense, you will have to make appropriate decisions at this point, and the menu of options may change. You will need to choose both functions and hosting.
  - Functions: you don't want to override what is included when you clone this repo.
  - Hosting: You will need to change the default build folder from 'public' to 'dist' when prompted.

__Other Dependencies__

You will need to install the following dependencies:
- apiai v4.0.3
- cors v2.8.4
- firebase-functions v0.7.1
- request v2.83.0
- requestify v0.2.5

There may be some other dependencies depending on what your Angular package shipped with.

__To Deploy__
- Build the production files `$ ng build --prod`
- Deploy via Firebase hosting `$ firebase deploy --only hosting`
