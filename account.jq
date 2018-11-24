# JQ Filter File

# Calculate total credits spend for an org


reduce .usage."os:linux"[] as $item (
{"credits":0,"minutes":0}; 
."credits" += $item.credits
,."minutes" += $item.amount /1000/60
) 

