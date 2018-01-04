# Ada-Capstone
Work for Ada Developers Academy Capstone Project

### Installfest so far...
- need node and node package manager (npm)
- possibly typescript `$ npm install -g typescript@2.2.0
`, but not sure which version
- `npm install -g @angular/cli`
- for some reason it seems I need to make a new app via the angular CLI in a subfolder, so `ng new ravelbot`
- __dependency!__ API.ai Javascript SDK (Dialogflow was called API.ai until October 2017) `npm install api-ai-javascript --save-dev
`
-------
REVERTED THIS AWAY! Wednesday Jan 3
- also need to install firebase cli tools `npm install -g firebase-tools`, login `firebase login`, and initialize firebase in root folder (ravelbot) `firebase init`. Gives lots of options... this is what I chose:

  >? Which Firebase CLI features do you want to setup for this folder? Press Space to select features, the
  n Enter to confirm your choices.

  Functions: Configure and deploy Cloud Functions, Hosting: Configure an
  d deploy Firebase Hosting sites

  === Project Setup

  >First, let's associate this project directory with a Firebase project.
  You can create multiple project aliases by running firebase use --add,
  but for now we'll just set up a default project.
  ? Select a default Firebase project for this directory:

   RavelBot (ravelbot)

  === Functions Setup

  > A functions directory will be created in your project with a Node.js
  package pre-configured. Functions can be deployed with firebase deploy.

  >? What language would you like to use to write Cloud Functions?

  TypeScript
  >? Do you want to use TSLint to catch probable bugs and enforce style?

  Yes
  >✔  Wrote functions/package.json

  >✔  Wrote functions/tslint.json

  >✔  Wrote functions/tsconfig.json

  >✔  Wrote functions/src/index.ts

  >? Do you want to install dependencies with npm now? Yes

  > grpc@1.6.6 install /Users/jessicaowens/Dropbox/ada/Capstone/Ada-Capstone/ravelbot/functions/node_modules/firebase-admin/node_modules/grpc
  > node-pre-gyp install --fallback-to-build --library=static_library

  >[grpc] Success: "/Users/jessicaowens/Dropbox/ada/Capstone/Ada-Capstone/ravelbot/functions/node_modules/firebase-admin/node_modules/grpc/src/node/extension_binary/node-v57-darwin-x64/grpc_node.node" is installed via remote

  > protobufjs@6.8.0 postinstall /Users/jessicaowens/Dropbox/ada/Capstone/Ada-Capstone/ravelbot/functions/node_modules/firebase-admin/node_modules/google-gax/node_modules/protobufjs
  > node scripts/postinstall

  >npm notice created a lockfile as package-lock.json. You should commit this file.
  npm WARN firebase-functions@0.7.5 requires a peer of firebase-admin@~5.5.0 but none is installed. You must install peer dependencies yourself.

  >added 1057 packages in 35.604s

  === Hosting Setup

  >Your public directory is the folder (relative to your project directory) that
  will contain Hosting assets to be uploaded with firebase deploy. If you
  have a build process for your assets, use your build's output directory.

  >? What do you want to use as your public directory?

  dist
  >? Configure as a single-page app (rewrite all urls to /index.html)?

  Yes
  >✔  Wrote dist/index.html

  >i  Writing configuration info to firebase.json...

  >i  Writing project information to .firebaserc...

  >✔  Firebase initialization complete!`

- When committing Firebase functions, I changed ravelbot/functions/node_modules/@types/body-parser/LICENSE to LF from CRLF... Git wouldn't let me commit.

____
RESUME FROM REVERSION
### Notes
- Deleted leftover functions folder, wasn't showing in git but was showing in directory...
- api-ai-javascript package may be unnecessary (using apiai package instead)
- still has installed firebase cli tools and is logged in

### Branch: firebase-init
initialize firebase in root folder (ravelbot) `firebase init`. Gives lots of options... this is what I chose:
>? Which Firebase CLI features do you want to setup for this folder? Press Space to select features, then Enter to confirm your choices. __Functions__

>? Select a default Firebase project for this directory: __RavelBot__

>? What language would you like to use to write Cloud Functions? __JavaScript__

>? Do you want to install dependencies with npm now? __Y__

### Setup index.js for dialogflowProxy
- in functions `npm install apiai`
- `firebase deploy`
  - received url: https://us-central1-ravelbot.cloudfunctions.net/dialogflowProxy
