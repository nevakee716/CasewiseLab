# Description
This layout allows you to manage the access rights at the property level in your Evolve website.  
Note : Still in beta  

# Installation  
[https://github.com/casewise/cpm/wiki](https://github.com/casewise/cpm/wiki)  

# How to set up
All the access rights should be set up in the **config.js** file.
## Read access rights  
The read access rights are managed thanks to the **configReadForbiddenPropertiesByViewAndRole** javascript variable. This object is composed of the name of the views and for each of them, you will need to define the object types where the access rights should apply, and also the id of the roles and the scriptname of the properties user **CANNOT** read.  
Example :  
```
var configReadForbiddenPropertiesByViewAndRole = {
  process: { // view name
    process : { // scriptname of object type
      1: ['type'] // id of cw_role is the key; the array contains the list of scriptnames of properties user should not have rights to read
    }
  }
};
```  

## Write access rights
The write access rights are managed thanks to the **configEditForbiddenPropertiesByViewAndRole** javascript variable. This object is composed of the name of the views and for each of them, you will need to define the id of the roles and the scriptname of the properties user **CANNOT**  edit  
Example :  
```
var configEditForbiddenPropertiesByViewAndRole = {
  process: { // view name
    1: ['name'] // id of cw_role; the array contains the list of scriptnames of properties user should not be able to edit
  }
};
```