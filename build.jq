# JQ Filter File

# Calculate total credits for  build

# Get all the pieces needed, use of vars should not affect actual body


{"small":5,"medium":10,"medium+":15,"large":20} as $classes |
.[] |
{
	"class":.picard.resource_class.class,
	"start":.start_time,
	"build_name": .build_parameters.CIRCLE_JOB,
	"build_num": .build_num,
	"build_time_minutes": (.build_time_millis / 1000 / 60),
	"credits": ($classes[.picard.resource_class.class] * (.build_time_millis / 1000 / 60) | floor) 

}


# use for active builds that dont yet gave stop/run time 
#((now - ($start | split(".")[] +"Z" | fromdate)) / 60) as $build_time |
