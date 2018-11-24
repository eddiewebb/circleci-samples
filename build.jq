# JQ Filter File

# Calculate total credits for  build

# https://circleci.com/api/v1.1/project/github/eddiewebb/circleci-queue?filter=running

.[0].picard.resource_class.class as $size |
.[0].start_time as $start |
((now - ($start | split(".")[0] +"Z" | fromdate)) / 60) as $build_time |


[{"size":"small","credits":5},{"size":"medium","credits":10},{"size":"medium+","credits":15},{"size":"large","credits":20},{"size":"xlarge","credits":40}] |  .[] | select(.size == $size ) |  .credits * $build_time | floor
 


#reduce .[0].build_time_millis as $item (
#{"credits":0,"minutes":0}; 
#."credits" += $item.credits
#,."minutes" += $item.amount /1000/60
#) 

