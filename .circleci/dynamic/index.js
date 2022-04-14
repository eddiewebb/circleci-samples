
const CircleCI = require("@circleci/circleci-config-sdk");
const fs = require('fs');
const lineReader = require('line-reader');


// Instantiate new Config
const myConfig = new CircleCI.Config();
// Create new Workflow
const myWorkflow = new CircleCI.Workflow('myWorkflow');
myConfig.addWorkflow(myWorkflow);

// Create an executor instance
// Executors are used directly in jobs
// and do not need to be added to the config separately
const nodeExecutor = new CircleCI.executor.DockerExecutor('cimg/node:lts');




lineReader.eachLine('changedpaths.txt', function(line, last) {
  console.log(`Line from file: ${line}`);

  // Create Job and add it to the config
  const nodeTestJob = new CircleCI.Job(`job-${line}`, nodeExecutor);
  myConfig.addJob(nodeTestJob);

  // Add steps to job
  nodeTestJob
  .addStep(new CircleCI.commands.Checkout())
  .addStep(
    new CircleCI.commands.Run({
      command: `echo ${line}`,
      name: `${line}`,
    }),
  )

  // Add Jobs to Workflow
  myWorkflow.addJob(nodeTestJob);



  if(last) {
    console.log('Last line printed.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    // The `stringify()` function on `CircleCI.Config` will return the CircleCI YAML equivalent.
    const MyYamlConfig = myConfig.stringify();
    
    fs.writeFile('./dynamicConfig.yml', MyYamlConfig, (err) => {
      if (err) {
        console.log(err);
        return
      }
    })
  }
});






