# JQ Filter File

# Calculate total credits spend for an org

def sum(f): reduce .[] as $row (0; . + ($row|f) );

def sumByKey:
  . as $in
  | reduce (.[0] | keys)[] as $key
    ( {}; . + {($key): ($in | sum(.[$key]))})
;

reduce .usage."os:linux"[] as $item (0; . += $item.credits)

#.usage."os:linux"[] | {"minutes":sumByKey(amount), "credits":sumByKey(credits)}