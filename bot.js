const dotenv = require('dotenv');
const builder = require('botbuilder');
const restify = require('restify');

dotenv.config();

const botServer = restify.createServer();
botServer.listen(process.env.PORT || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', botServer.name, botServer.url); 
});

// const connector = new builder.ConsoleConnector().listen();

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

botServer.post('/api/v1/messages', connector.listen());

const bot = new builder.UniversalBot(connector);
const intents = new builder.IntentDialog();

console.log(`Welcome to the  bot service enter 'begin' to continue`);

const startSession = (session, questions, next) => {
  session.beginDialog('/setOne');
};

bot.dialog('/setOne', [
    (session) => builder.Prompts.text(session, 'What Are Accentures Travel Requirements?'),
    (session, results, next) => {
        session.userData.travel = results.response;
        builder.Prompts.text(session, 'What Cities Can I Work In?');
    },
    (session, results, next) => {
        session.userData.workCities = results.response;
        builder.Prompts.text(session, 'What Type Of Project Will I Work On?');
    },
    (session, results, next) => {
        session.userData.projects = results.response;
        builder.Prompts.text(session, 'What Technologies Will I work With?');
    },
    (session, results, next) => {
        session.userData.technologies = results.response;
        session.beginDialog('/setTwo');
    }
]);


bot.dialog('/setTwo', [
    (session) => builder.Prompts.choice(session, 'Have you ever built a virtual agent?', 'yes|no'),
    (session, results) => {
        session.userData.virtualAgent = results.response;
        if (results.response.entity === 'yes') {
          //begin virtual agent dialog
          session.endDialog();
          session.beginDialog('/virtual');
        } else {
          session.endDialog();
          session.beginDialog('/machine');
        }
    }
]);

bot.dialog('/virtual', [
  (session) => builder.Prompts.text(session, 'If so, what technologies did you use?'),
  (session, results) => {
    session.userData.virtualTechnologies = results.response;
    builder.Prompts.text(session, 'What use cases did the agent handle?');
  },
  (session, results) => {
    session.userData.virtualTechnologies = results.response;
    builder.Prompts.text(session, 'How did you deal with ambigous intents?');
  },
  (session, results) => {
    session.userData.virtualTechnologies = results.response;
    session.endDialog();
    session.beginDialog('/machine');
  }
]);

bot.dialog('/machine', [
  (session) => builder.Prompts.text(session, 'If so, have you built linear regressions?'),
  (session, results) => {
    session.userData.regressions = results.response;
    builder.Prompts.text(session, 'When would you want to use a decision model?');
  },
  (session, results) => {
    session.userData.decisionModel = results.response;
    builder.Prompts.text(session, 'When would you want to use a support vector machine?');
  },
  (session, results) => {
    session.userData.vectorMachine = results.response;
    builder.Prompts.text(session, 'What is an example of a classifier you have built?');
  }
  ,
  (session, results) => {
    session.userData.classifier = results.response;
    session.endDialog();
    session.beginDialog('/classifier');
  }
]);

bot.dialog('/classifier', [
  (session) => builder.Prompts.text(session, 'What data did you use to train the model?'),
  (session, results) => {
    session.userData.dataClassifier = results.response;
    builder.Prompts.text(session, 'What model did you use?');
  },
  (session, results) => {
    session.userData.modelClassifier = results.response;
    builder.Prompts.text(session, 'What tool did you use to train the model?');
  },
  (session, results) => {
    session.userData.toolsClassifier = results.response;
    session.endDialog('thank you for your response');
    session.clearDialogStack();
  }
]);

bot.dialog('/', intents);

intents.matches(/^begin/i, [startSession]);