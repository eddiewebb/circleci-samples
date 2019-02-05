# CircleCI 1.0 Samples

**NOTE**: 1.0 is being sunset August, 2018, it is paramount you actively migrate all plans to 2.0.


## Converting 2.1 to 2.0

This project uses 2.1 config on a 2.0 project. 

### Initial Setup
If cloning this repo for the first time, you must add the following as a precommit file and `chmod a+x` it

.git/hooks/pre-commit
```
#!/bin/sh

# transform 2.1 config to 2.0
echo "Convering 2.1 cnfig for 2.0"
circleci config process .circleci/config-2.1.yml > .circleci/config.yml

git add .circleci/config.yml

```


### Ongoing Commit

1. Make changes to [.circleci/config-2.1.yml]
2. Commit as usual, confirming you see the conversion message:
```
$ git commit -am"local"
Convering 2.1 cnfig for 2.0
```