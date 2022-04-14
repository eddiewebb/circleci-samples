
const CircleCI = require("@circleci/circleci-config-sdk");
const fs = require('fs');
// Instantiate new Config
const myConfig = new CircleCI.Config();
// Create new Workflow
const myWorkflow = new CircleCI.Workflow('myWorkflow');
myConfig.addWorkflow(myWorkflow);

// Create an executor instance
// Executors are used directly in jobs
// and do not need to be added to the config separately
const nodeExecutor = new CircleCI.executor.DockerExecutor('cimg/node:lts');

// Create Job and add it to the config
const nodeTestJob = new CircleCI.Job('node-test', nodeExecutor);
myConfig.addJob(nodeTestJob);

// Add steps to job
nodeTestJob
  .addStep(new CircleCI.commands.Checkout())
  .addStep(
    new CircleCI.commands.Run({
      command: 'npm install',
      name: 'NPM Install',
    }),
  )
  .addStep(
    new CircleCI.commands.Run({
      command: 'npm run test',
      name: 'Run tests',
    }),
  );

// Add Jobs to Workflow
myWorkflow.addJob(nodeTestJob);

// The `stringify()` function on `CircleCI.Config` will return the CircleCI YAML equivalent.
const MyYamlConfig = myConfig.stringify();

fs.writeFile('./dynamicConfig.yml', MyYamlConfig, (err) => {
  if (err) {
    console.log(err);
    return
  }
})