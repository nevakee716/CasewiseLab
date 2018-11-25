# Description
This layout allows you to execute configurations for the EvolveOnDemand **[Calculation Operation](https://github.com/JGrndn/ErwinTools---Fr---Documentation/wiki/Operation-Calculation-Engine)**.

# Installation  
[https://github.com/casewise/cpm/wiki](https://github.com/casewise/cpm/wiki)  

# How to set up
## Mapping url
All EvolveOnDemand operations might have different URL. As there is one single layout for multiple type of Operations, you need to inform the system what operation to use. This can be done automatically by setting the corresponding values in the **cwMappingTypeToOperation.js** file. The following structure is :  
```
var cwConfigurationExecuteMapping = {
	"Calculation engine" : "calculate"
};
```  
The key is the configuration category. The value is part of the URL to be used.
## Evolve structure
Create the following structure :

<img src="https://github.com/JGrndn/cwLayoutExecuteOperation/blob/master/screen/1.JPG" style="width:95%" />  

_Please make sure to select the Category property on the Object Type node._  

Set up the options :  
<img src="https://github.com/JGrndn/cwLayoutExecuteOperation/blob/master/screen/2.JPG" style="width:95%" />  
Make sure to fill correctly the field **Evolve on Demand URL**

## Result  
Below is a screenshot of what you get once your layout is deployed.  
When the operation executed correctly :  
<img src="https://github.com/JGrndn/cwLayoutExecuteOperation/blob/master/screen/3.JPG" style="width:95%" />  

When the operation failed :  
<img src="https://github.com/JGrndn/cwLayoutExecuteOperation/blob/master/screen/4.JPG" style="width:95%" /> 