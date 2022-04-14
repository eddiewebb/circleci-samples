
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

/* we'll try to asseble from sub-durectories, but can also define here
*/
mappings = {}
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
mappings['.circleci/*']=defaultJob;


let entries = Object.entries(mappings);
function ammendWorkflowFor(workflow, path){
  //1 can we find a circle config for it
  //2 does a job exist in map
  for(let [index, [key, value]] of entries.entries()){
    console.log(`COnsidering ${path} against ${key}`);
    const pathRegEx = RegExp(key);
    if(pathRegEx.test(path)){
      console.log("Matching job found in JS mappings");
      myConfig.addJob(value); //TODO dupe check if job shared
      myWorkflow.addJob(value);
    }
    //...
   }
  // 3 do nothing
  
}


lineReader.eachLine('.circleci/dynamic/changedpaths.txt', function(line, last) {
  console.log(`Line from file: ${line}`);


  ammendWorkflowFor(myWorkflow,line);


  if(last) {
    console.log('All paths considered, generating config.');
    // The `stringify()` function on `CircleCI.Config` will return the CircleCI YAML equivalent.
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
});






