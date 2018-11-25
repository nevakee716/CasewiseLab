| **Name** | **Gantt** | **Version** | 
| --- | --- | --- |
| **Updated by** | Mathias PFAUWADEL | 1.0 |


## Patch Notes

* 1.0 : 1st version working

## To be Done

* More Options
* Add Translations i18n like Data/Common/i18n


## Description 
Allow you to display objects in a gantt Chart with Milestones and dependency

## Screen Shot
The layout will scan all of your hierarchy tree, and put it in a Gantt Chart

<img src="https://raw.githubusercontent.com/nevakee716/cwGantt/master/screen/1.jpg" alt="Drawing" style="width: 95%;"/>

## Custom Display String Enhanced

You can use the Custom Display String Enhanced specific to have the PopOut icon

## Node setup

<img src="https://raw.githubusercontent.com/nevakee716/cwGantt/master/screen/2.jpg" alt="Drawing" style="width: 95%;"/>

## Options in the evolve Designer

### Json Configuration : 

Describe your configuration in a json object, then mimify it on https://www.cleancss.com/json-minify/

Here is an exemple of a json configuration.

```
{
    "nodes": [{
        "nodeID": "projet_474185792",
        "startDate": "STARTDATE",
        "endDate": "ENDDATE",
        "completion": "PERCENTCOMPLETE",
        "finishToStart": [],
        "startToStart": [],
        "finishToFinish": [],
        "milestone" : [],
        "classStyle": "ggroupblack"
    }, {
        "nodeID": "projet_20027_205402790",
        "startDate": "STARTDATE",
        "endDate": "ENDDATE",
        "completion": "PERCENTCOMPLETE",
        "finishToStart": ["projet_20217_39247427"],
        "startToStart": ["projet_20218_858571321"],
        "finishToFinish": ["projet_20219_1725533778"],
        "milestone" : ["projet_20027_2109559671"],
        "classStyle": "gtaskred"
    }],
    "hiddenNodes": [""],
    "complementaryNode": [],
    "dateDisplayFormat": "mm/dd/yyyy",
    "scale": "month",
    "fixedColumnMap": {
        "startdate": {
            "hide":false,
            "scriptname": "startdate",
            "width": "70"
        },
        "enddate": {
            "hide":false,
            "scriptname": "enddate",
            "width": "70"
        },
        "duration": {
            "hide":false,
            "scriptname": "duration",
            "width": "70"
        },
        "pccomplete": {
            "hide":true,
            "scriptname": "pccomplete",
            "width": "50"
        },
        "taskname": {
            "hide":false,
            "scriptname": "taskname",
            "width": "400"
        }
    },
    "customColumnMap": [{
        "scriptname": "type",
        "label": "Category",
        "width": "70"
    }]
}

```

You can create your json easily by going on this site

[Json Editor](http://jeremydorn.com/json-editor/?schema=N4IgJAzgxgFgpgWwIYgFwhgF0wB1QenwCsIB7AOwFpp5kA6UgJwHN8ATRpAM00oAYALPhqIkAYhAAaEEjZsAlpnkUkAGwAKjUjjiMlcCGkyMArnGlLMquGhBQA7gHEk5bAAIAwjCR7PFLvLMJpxKFFIgbHAB5IrK5IaooFCkCAhwrmiglta2HilprugWAJ46thDG8uTM4VxMyJi2mHAAHpg+cCjSkVxIJqqN6CAAvtLFBuSkmRFRfQO244YlZegVjFU10ukmCGgA2iCL4ZMgALrDoyCYpTbopABGRHBQjdLaofHTChBI99YA+slVKokDgILdjGZuvIfn84P84ApMP8SGFUL1VODobCATgtDo9PIDEZTOY7KRgaDwWw0BisRh5HJ0rS1ODLj05phNNpdPoEgdJpElgymeQAHKkIXhZIIHDWArtRjFCWRcJsJDNAAiMLlSGKADF6hrwtA1DZpAEWoi8qoduQALKg6UmCopG12x04M7SPE8wnExIgQUBrI3Ww+TjFcLZW4gFXE7oGKDrHAfWwAQTkbkw8DcwYAkpq3PYYPJYG5kq4kFUIG4Hk8XrWcxri/JgW57nA3C6u1Vs7nnK5MJ5vHpakbBldfsL3nEEqBvr8AUCQWDbnSyYu4f8I3qd3IWZjNzCl/Dd8V/pFrM1D/StwDz/9GHAmJFGLfjzj4b6CXySVDyUpNcaXRVkyVLUUP0uRREHnK4wzuR5nleK5FBydB4xnVM5y+E9txXKkIVJbFTwRJEUTIch/0/Uif15IkEkhMkCOAj9pAgyIqNAo9Ljo/04ILTVpmuFYQDWDZozQ2N40LNVZn6SdfSeZEBAAdgEABGAAOABWVSAE4ACZx0YBomlaRpLgqHxME1DVblDUTxOqSSrFjABlRVhzs5o3G5X9ijcdzk3kVNyCQNI5N6BTbHcgAVdMACU4s1dM4oAURMsz0GaNoRi2cg2B8hz4KcyoXIsKTbHSwq3GKvz8V5QLgpTTBwsixNovmdB0rFTVUoyrLjRyiz8vJWVrziYSELE8rNlQtzchSOU4A+Bq/WuIKQrCiLzRmLrJ3UdLEo8Xq4o8AB5e11AAGXSwaLQncy8suaIYRgOLSE8mzptE89XPQkB9Sqd63E+oKvLcdMIDIKB5A1OI3EwtxC2FIVtrTdA4tzazfFILh+y7doIAAazrAmcxhPNJS7ew21UDsifWZhmF0DtApzLt0jYcnCezJBSdrPtOfBNwBdh+G1vjIbJ3aOFwlnCg4PveEWPBaiSO3R9ZBAjdNYfRhI0vOBr3XMD9bPQ292fV9dDYiI8NxRr+I1wDV2pe2OOZbi2WkGCEDgkTY2c+aYwzeMUaEt5sKV3Cv0BCl3aIgCVbIxQKLRJiLf+Pi/1QLO3cI3XzZFTioIuaRccwT7vrHQMg/DK2o0qxb0Fr4dwfbqGYdIOGEYoJGadrVG5OgVqpqxnHIfxvnibJmfKdrYNW3bTts2Z1nGHZvmq95zn+cFtxhfgUXxd7yXEelx7TOGqd5ejj5lcd1XE8I13U+1g8fZorWm+N037Yfz/jbRgb5AHPxzs7POBc1aIk9oyMu39oLNADr9YOc0AaxnTBHWSD8cKBlTrA9+EDETp1RFxAuqdc4MVdrA4uR52IIO9huC4r0QYQA+qQYGMQOFoMbpGTBthuGg3BsIjh3cJb93IIPIUkc0ZJnHmiEA2Mua1QXrmOee9SxLxpivBma9KgszZvcDmuZuZaKJgLEmQtpEiy7GfPuUsaYyyaKeBWMdPgEIgUQ/OxEHbx0/vQu8EDHxXlWmbBh/jSKPhAWA7+2dqEBhga/Vi8TS7MLAsg2CfDVgYJboDbBujcEgEVp4hc3iUnq18SnEh5FyHEPjokxifi6HwMgkgiuIAEBtgMJgCgJUG7oH+vk2M9oemunIAYCR58pEyKmSPRMY9QqY2UWYtRFMNFWK0VTZedNV5M0CJvbe+9zHqMsYfY+Bh7E90cZfZx19sp3xyHg2OXj44+MoSEv+OtwEBL/mEm8aSgFG1iXbIFECmm0MqXAtJXsuIsL9igwOM0Q6CPQIUyIkd3GPzjqRD5fjU6kORPU6pP8nYbRoaS6QrTYVMPhZkzpUAQQw08sUdCjl0HrAqgtQGHhmW1lZc8/anJbAsy0CYHAfwkBQBJi4kaeUXllJANsBA/wYz8hAAAIRBDKtwjhxVemkNqsw4REpwOkPquAzJpAAE0TaqFIPYcI6hggrWdVUWV5wCo7H2CAMVpAJVSpleEZgc8/gmukKGqxz4aSRrnswZ81q/Vz3GMCR1Ia544FdUKqNpMcAerOKwy4cLMI5JkE3NFIAAASdK5nD01MKOoN9ZZuMVU/d50KGnRO+V/PWUTf5GwBRE4JfyQUvlAWCvtVCoGUuSUBD2tL2kIpAP7QOVUMJFKjqVTlElGXLXlOkRUypnH1xmsMnlsY8gTUQIenwgUcFsEbU9HKraSkePbXiztVL+0GyNj88Fo69xDt+d2sdtt3wAdojOpJLToVBPAnSqCiLsn13XXGTd0YUUYM6eqLUOoQQGmfRy8oeSL22HqtqCAupAqGmbVFEV6BUjsDYPgYobHm4gCbY83KKFSlwTheXSuUAzRltRSM2KwmhUchioxigOY5VXFGm26YKq1VSQ1XZDjAB1K1srpD2jkzAcIABFEwNk7ZeuVeQH1qADjqg4/YXT4QECGfCAARzM3oCzbCrRsHdAgB0TpT2iXrMhSt/npGargN4AAbsoYICmE2Mmxfg8pHb53DrJZbP9X9PmAYvMB79wLrbjriXl0iRKM4UIJRC6DzSAI0oLgJpBPo6vTCrrhgZM1QsvErRDGydV7IKbllhHFbzP0Za7duSrJLyvbkhd+mlfbmvLoW6AJZO1IrBZ3dysObcMbtT2lx2+PH6MydmjZTrKXXmgGa0xTpEEuuiXuKQCknQqLifQDWyCnUGPLrpmweT22SNctDmhrTjJ5MPNvtZhAnZ3y/Zk6pPgrCCpyCG8DxCDYUJ7ZAG4GqPN6oReG6+vjuL8JfrmwCGblEpvkt/LO2DGX4OMKXZk1rFKQxiQO7tUTpHcctWWYd4bSnhXne5ld5TgY7ukge4yJ7sYXtvZcJW77ZdEfdX+5DozmPZqg8rRDwHRmNeDGR9DycsP4cjBw8EKRZaes47Q3VW3a1ifm9cfcUbqWf0v0m0V2pZDaf+8aW1xbcG2mINW6H9bPOtvEdyfrz7IBBebaO8+xTCqxfdQiC7qaUvbuIdJXL1UuulfWBV0ntXSbpOa/ZyAAHQP4964kknw3UPOPp8t3bE3aBkeo5ADgKAMoVqAqbw7vrV6R95473Rl9nvrtKsIZTmr8caeZxX1Bzn9XmLh8XZHuva3uetWF7rsTZH9vH95+7+VKEa+KSH/u8JC/+OF/u8W+XZay/vdV4hnvLX6/a586J7n4gBt7G4z6PJd4I5Z6DA6Qo6dJzwn5j5IS9ZJ5gxWIk7z754+4Jx+5U7whr7VY1Ih5b5QrM4R4ZI8Qc4M5c4bZtS86n785oYp70EdQQEnai65zFAXQToQYaR8B/5TikzC7YEy5mDF4K62Bf4V4gFV4fYwH2xk7S6v6y6XAN465N5n645gEKZQFnbdQCB8DwH95QAuh9IIARaehlrnq44eBmEpB+C2gBZuCej5rcrHYtpYFvpjZpYTZJx07ZZ7j/pTpfKDomxP6QYDolbgYgbzah5zpJws7pL0pUErpIrTDwCyC6BxSIC6iAogDADABuDgiqBcB0AgidgMwXCYYhYoGO6twgDP7k7LjL7EEVZ1JB74GQKkFh7kF76UG+wwH+T0QBgHB0EiEgAVEmzhDqHegD7R5H5C4MGaFMENEsETEeHPSWTSBTGqBAEt4gE3S/DTHX4Z7bEAFG77G7bg6AGnF6FFoXBAAAA&value=N4Igdg9gJgpgziAXAbVJWBJAIkkAHAJwgCsYAXAfQBYB2KgRgA4BWGgTgCYQAaEOMgIYEyWAWRi4AygBUAggCVpWWdICiPEDDBRR43KoByWZWo0BjCAFs8AG3IBLCGFwAFVfIDCh6R4DyAWRcAGVVTXgAzezB7OAALaQhJQWEkZABdXn4hMgSk7NSMkEjouISAMSiY2ILeS3s7ficJFEKzGwE4OCSATztcAHN+ogBXPAAjdrMAaxAAX240aBhsXEIScgoOAAYtjhpNreYqXfYtjSzhXWaQGQUlFXVeLR0xa8NjB/MrWwcnV3cvAYfAFgqFHkVKqVEskyKl8ERSJRthx6PsAMycWhUPYgQoXHLQ/IoeHrJG7JgUFgsGj0NEo3ERSHxCAVErVYlrREHFFsCiojjMZhotE0GiMBkgOoNMhNOGcjbbE6behbNiCtgANhpEraHS6ZF6136gjgUwIMCgc0KsXsUFgYAMSwQxJ13zsli0yW6jtgNRAUFeWBitgE3TKEAIljEuEslgA9Ha491k91zmYBH1EJKnGRqoyAB4WjwQGzDSxgfwCPBIUD4gN6RC1swEex4MhgAQe3B114aG2+xDhDNwGC8ADuttzuBoZ3mmm09eaTZbbY7Xazz0XfdtzSHNhH48n7JAM7mvCgwwIYkczkbfGbrfbneuF6vZBv24He4PIAnUCnWannOeBmBY1h2A2y6Pmu1wgWBPx6Lw/bNGQBDDKOv5HrgzCzrwJpTDBNb3iuT7riA+GEUhO5IN+GF/gBIDHLOc5mMMjSWMWpblpW1YoFBq7PrgBp4BIvDtGMMA2LgHivP0Eapoe/7HkBaSzEAAA=&theme=bootstrap2&iconlib=fontawesome4&object_layout=normal&show_errors=interaction)

## Nodes 

List here all the node that will be use in the gantt chart.
Structure of the object

```
"nodeID": "projet_20027_205402790",              // node ID in evolve                                                               
"startDate": "STARTDATE",                        // Scriptname of the property containing the startDate                                
"endDate": "ENDDATE",                            // Scriptname of the property containing the endDate                            
"completion": "PERCENTCOMPLETE",                 // Scriptname of the property containing the completion pourcentage                                       
"finishToStart": ["projet_20217_39247427"],      // The start of the task of this node will be trigger by the end of the tasks in these association Node                                                 
"startToStart": ["projet_20218_858571321"],      // The start of the task of this node will be trigger by the start of the tasks in these association Node                                                 
"finishToFinish": ["projet_20219_1725533778"],   // The end of the task of this node will be trigger by the end of the tasks in these association Node                                                  
"milestone" : ["projet_20027_2109559671"],       // The task of this node will has as milestone the child object in these association Node                                                
"classStyle": "gtaskred"                         // Choose the style of your task, ggroupblack, gtaskblue, gtaskred, gtaskgreen, gtaskyellow, gtaskpurple, gtaskpink
```

## Hidden Nodes 

Set the ID of the nodes you don't want to appear in the gantt, the children will be display instead. 

## Complementary Node :

If you want to add a side Node, use this option.

<img src="https://raw.githubusercontent.com/nevakee716/cwNetwork/master/screen/ComplementaryNode.png" alt="Drawing" style="width: 95%;"/>

## Date Display Format : 

Select the format of display of your dates :

h:	Hour (1-12)

hh:	Hour (01-12)

pm:	am/pm indicator

PM:	AM/PM indicator

H:	Hour (0-23)

HH:	Hour (01-23)

mi:	Minutes (1-59)

MI:	Minutes (01-59)

d:	Day (1-31)

dd:	Day (01-31)

day:	Abbreviated day of week

DAY:	Day of week

m:	Month (1-12)

mm:	Month (01-12)

mon:	Abbreviated month text

month:	Full month text

yy:	Year, excluding century

yyyy:	Year

q:	Quarter (1-4)

qq:	Quarter (Q1-Q4)

w:	ISO Week number (1-53)

ww:	ISO Week number (01-53)

week:	Full ISO Week date format

separated by one of the following characters: "/\-.,'<space>:

## Scale

Default scale when you arrived on the gantt, can be changed via buttons : 
"day","week","month","quarter"

## Fixed Column Map

Set the option for the different default column of the gantt chart, you can choose the width or if it's hidden or not

don't modify the scriptname
```
{
    "startdate": {
        "hide":false,
        "scriptname": "startdate",
        "width": "70"
    },
    "enddate": {
        "hide":false,
        "scriptname": "enddate",
        "width": "70"
    },
    "duration": {
        "hide":false,
        "scriptname": "duration",
        "width": "70"
    },
    "pccomplete": {
        "hide":true,
        "scriptname": "pccomplete",
        "width": "50"
    },
    "taskname": {
        "hide":false,
        "scriptname": "taskname",
        "width": "400"
    }
}

```

## Custom Column Map

You can add a property to be display in the column.
Choose the width, the label and the casewise scriptname

```
"customColumnMap": [{
    "scriptname": "type",
    "label": "Category",
    "width": "70"
}]
```
