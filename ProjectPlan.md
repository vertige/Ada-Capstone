# Capstone Product Plan

## Components
### Personal Learning Goals
- How to connect several APIs to create an interactive experience.
- More about how to effectively implement a chatbot with NLP and complex dialogue trees for an interactive experience.
- More about angular.
- Possibly learn more about the UX of chatbot implementation to help better structure conversations.

### Problem Statement
There is a disconnect between yarn enthusiasts' purchase of project patterns via Ravelry.com and acquiring requisite supplies via The Weaving Works, a yarn store store transitioning from established local yarn shop to online retailer..


### Market Insights
- __The Competition__

  There are currently no marketed apps that perform this task. Currently, Ravelry.com offers a generic interface for sourcing from listed products (based on a retailers advertising with them). Ravelry.com's approach does not highlight or tailor sourcing to any individual retailer.

  Traditionally, this feat is accomplished through intensive customer service, where depending on the experience of the employee a wide range of considerations are made to varying degrees of success.

- __Users Need More__

  Many Weaving Works customers feel uncertain about the materials required for projects via Ravelry.com. In all honesty, the information is available, however it takes knowing where to look and how to analyze the project, materials and information to best assist. Many customers find using both Ravelry.com and searching online or Weavingworks.com together to be a disjointed experience.

- __An Idea, A Possible Solution__

  This is a very specific customer satisfaction proposal. As The Weaving Works transitions from brick and mortar to predominantly e-commerce, this could be an opportunity to offer a new service (perhaps similar to parts of in-store customer service) that allows their customers to feel confident and supported in their projects and purchase.

- __About The Users__
  - Ravelry.com users interested in purchasing supplies from Weavingworks.com.
  - Characteristics: Moderately comfortable with technology. Novice to intermediate knitters or crocheters who may feel indecisive, overwhelmed or insecure when choosing project materials and prefer some form of support. Those excited to learn new things and interact.

### Trello Board
Visit the [Trello Board](https://trello.com/b/Bp3ILvqb)


### Features
  - __MVP__: Chat that allows users to find a specific pattern on Ravelry.com and the corresponding suggested yarn, if available, on Weavingworks.com.
  - __Possible Additional Features__ (in no exact order):
    - Locate a pattern by designer or publication or other criteria (implement Ravelry search within Bot UI)
    - If the suggested yarn isn't available, suggest alternatives or the appropriate category.
    - Give yardage requirements for project (possibly even with yardage per size, possibly give number of required balls of yarn of specific yarn if on WeavingWorks.com)
    - Ask and give links to other required materials, tools and notions, such as needles.
    - Answer basic project planning questions, such as needle sizing, sizing, material choices.
    - Answer basic Ravelry questions.
    - Answer basic Weaving Works questions.
    - A better chatbot UI with stricter options/expected replies from user at certain points in the conversation, such as photo confirmation or "yes"/"no" buttons instead of input fields.
    - Chatbot may give disclaimers about outcomes of projects, or the limits of generic yarn matching (substitution know how).
    - Pass off to a contact form if the chatbot cannot satisfy the users queries.
    - Embed as widget in Weavingworks.com
  - __Extra Stretch Goals__:
    - Visual search of other Ravelers projects for same pattern to check for yarns and materials they used.
    - If a Weaving Works employee has done said project (known via Ravelry API), pull up project notes.
    - Allow users to query their own Ravelry Queues (requires another level of authentication)
    - Allow users to email the chat transcript to themselves.
    - Allow users to send us feedback and/or a transcript of their chat.
    - Email a shopping list to themselves or a friend.

### Technology
  - Front-end: Angular
  - Back-end: Dialogflow API, Ravelry API, Shopify Storefront API
  - Infrastructure - Deployment or Code: Firebase
