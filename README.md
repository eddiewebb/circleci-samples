# CircleCI Samples

This is mostly a dumping ground for eddie to run POC and explorations of CCI config.


## Branche notes

### Useful revision ranges

ab378c2c3380ba131bf07866a57a127958ff2869 -> added project a

d5b2d646265f69a989ac5a7b79fc66944da32c21 -> added project b


### CIRCLE_COMPARE_URL
https://github.com/eddiewebb/circleci-samples/compare/ab378c2c3380...d5b2d646265f


### Command pieces
No magic, uses a few common tools to put this togehter

```
#Remove evertyhing before revision
echo ${CIRCLE_COMPARE_URL##http*/}

#remove git log verbosity, just filename changes
git log --format="" --name-only ${CIRCLE_COMPARE_URL##http*/}

# trim to directory name, and eliminate duplicates
cut -d "/" -f1 | sort -u

# If you need to go multiple layers deep (i.e. cookbooks/book1, cookbooks/book2)
grep "parent-dir" | cut -d "/" -f2 | sort -u
```
