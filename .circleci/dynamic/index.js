
const CircleCI = require("@circleci/circleci-config-sdk");
const fs = require('fs');
const lineReader = require('line-reader');

/*

[ module-a-job-1 ]---[ module-a-job-b ]-------\
[ module-b-only-job ]--------------------------`-----[ non-module-job-1]


*/




// Instantiate new Config
const myConfig = new CircleCI.Config();
// Create new Workflow that we'll pull jobs from 'sub-workflows', i.e. module-a
const theWorkflow = new CircleCI.Workflow('theWorkflow');
myConfig.addWorkflow(theWorkflow);

// Create an executor instance
// Executors are used directly in jobs
// and do not need to be added to the config separately
const nodeExecutor = new CircleCI.executor.DockerExecutor('cimg/node:lts');

/* we'll try to asseble from sub-durectories, but can also define here
*/
mappings = {}
addSubWorkflowForConfigJobs(mappings);
addSubWorkflowForDocs(mappings)

// track workflows added to avoid duplication
addedWorkflows = []


let entries = Object.entries(mappings);
function ammendWorkflowFor( path){
  //1 can we find a circle config for it
  //2 does a job exist in map
  for(let [index, [pathspec, subworkflow]] of entries.entries()){
    console.log(`COnsidering ${path} against ${pathspec}`);
    const pathRegEx = RegExp(pathspec);
    if(pathRegEx.test(path)){
      console.log("Matching job found in JS mappings");
      //console.log(value)
      //console.log(myWorkflow.jobs)
      if(addedWorkflows.includes(subworkflow)){
        console.log(`Subworkflow for ${pathspec} already captured`);
      }else{
        addedWorkflows.push(subworkflow);
        harvestConfigFromWorkflow(subworkflow)
      }
    }
    //...
   }
  // 3 do nothing
  
}


lineReader.eachLine('.circleci/dynamic/changedpaths.txt', function(line, last) {
  ammendWorkflowFor(line);

  if(last) {
    generateYaml();
  }
});


function addSubWorkflowForConfigJobs(mappings){

  const defaultJob = new CircleCI.Job(`default`, nodeExecutor);
  // Add steps to job
  defaultJob
  .addStep(new CircleCI.commands.Checkout())
  .addStep(
    new CircleCI.commands.Run({
      command: `echo defauklt job`,
      name: `Default Job`,
    }),
  )

 
  const subworkflow = new CircleCI.Workflow('subworkflow');
  subworkflow.addJob(defaultJob);
  mappings['.circleci/*']=subworkflow;
}

function addSubWorkflowForDocs(mappings){

  const defaultJob = new CircleCI.Job(`docs-build`, nodeExecutor);
  // Add steps to job
  defaultJob
  .addStep(new CircleCI.commands.Checkout())
  .addStep(
    new CircleCI.commands.Run({
      command: `echo defauklt job`,
      name: `Docs Step`,
    }),
  );

  const dependentJob = new CircleCI.Job(`docs-test`, nodeExecutor);
  dependentJob
  .addStep(new CircleCI.commands.Checkout())
  .addStep(
    new CircleCI.commands.Run({
      command: `echo defauklt job`,
      name: `Docs Step`,
    }),
  )

 
  const subworkflow = new CircleCI.Workflow('subworkflow');
  subworkflow.addJob(defaultJob);
  subworkflow.addJob(dependentJob,{requires:[defaultJob.name]});
  mappings['docs/*']=subworkflow;
}

function harvestConfigFromWorkflow(subWorkflow){
  //worklfows only contian jobs, loop
  subWorkflow.jobs.forEach(jobHolder => {
    myConfig.addJob(jobHolder.job);
    theWorkflow.addJob(jobHolder.job,jobHolder.parameters);
  });
}




function generateYaml(){
  console.log('All paths considered, generating config.');
    // The `stringify()` function on `CircleCI.Config` will return the CircleCI YAML equivalent.
    appendFinallyWorkflow()
    const MyYamlConfig = myConfig.stringify();
    fs.writeFile('./dynamicConfig.yml', MyYamlConfig, (err) => {
      if (err) {
        console.log(err);
        return
      }
    })
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}

function appendFinallyWorkflow(){
  //if e2e condition...
  
  requires = [];
  const finallyJob = new CircleCI.Job(`e2e-tests`, nodeExecutor);
  // Add steps to job
  finallyJob
  .addStep(new CircleCI.commands.Checkout())
  .addStep(
    new CircleCI.commands.Run({
      command: `echo defauklt job`,
      name: `Finally Job - E2E`,
    }),
  )

  addedWorkflows.forEach(workflow => {
    console.log(workflow.jobs[workflow.jobs.length-1])
    requires.push(workflow.jobs[workflow.jobs.length-1].job.name)
  });

  myConfig.addJob(finallyJob);
  theWorkflow.addJob(finallyJob,{requires:requires});
}