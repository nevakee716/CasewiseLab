| **Name** | **Html5DiagramHighlight** | **Version** | 
| --- | --- | --- |
| **Updated by** | Mathias PFAUWADEL | 1.4 | 

## Patch Notes

* 1.4 : Add possiblity to highlight with different color according to the step 
* 1.3 : Correct wrong arrow association direction
* 1.2 : Option for width
* 1.1 : Allow to change title, and mask some filter
* 1.0 : 1st version working

## TBD

* More Options

## Description 
Allow you to hightlight object on diagram depending on property region or association region. Once installed, this will apply to all diagram of your evolve site.

## Screen Shot
Here we want to highlight only the Process with the category Task

<img src="https://raw.githubusercontent.com/nevakee716/cwHtml5DiagramHighlight/master/screen/1.jpg" alt="Drawing" style="width: 95%;"/>

## Highlight Algorithm

* IF a Shape is selected by the different filter it will be highlighted.
* If a Joiner is between to 2 highlights shapes it will be highlighted
* If a connectorObject (xor, or) is connected to at least 1 highlight shape in each direction, it will be highlighted

## Step

You can use step to define a range between to properties for exemple startDate and endDate, if the date you select is between the shape will be highlight according to the color you select



## Evolve Configuration
This is a specific so no layout to configure on Evolve

## Options 

(to be configure in C:\Casewise\Evolve\Site\bin\webDesigner\custom\Marketplace\libs\cwHtml5DiagramHighlight\src\PsgDiagramSearch.js)
<img src="https://raw.githubusercontent.com/nevakee716/cwHtml5DiagramHighlight/master/screen/2.jpg" alt="Drawing" style="width: 95%;"/>

### Opacity (0 to 1) : 
You can change the opacity of the non selected objects with the value of this.globalAlpha.

### ConnectorObject:

List the object(scriptname) that you want to be considered as connector object with the value of this.connectorObject

### highlightColour:

Choose the highlight colour with the value of this.highlightColour

### Width:

Choose the width of a shape and connectorSet with the value of this.Width (in pixel)

### Titles:

You can change the titles, with variable this.title1 and this.title2.
If you want to display the template of the diagram, put this.title2 = diagramViewer.json.properties.type;

<img src="https://raw.githubusercontent.com/nevakee716/cwHtml5DiagramHighlight/master/screen/4.jpg" alt="Drawing" style="width: 95%;"/>

### Masking some menu

(to be configure in C:\Casewise\Evolve\Site\bin\webDesigner\custom\Marketplace\libs\cwHtml5DiagramHighlight\src\config.js)
<img src="https://raw.githubusercontent.com/nevakee716/cwHtml5DiagramHighlight/master/screen/3.jpg" alt="Drawing" style="width: 95%;"/>

You can mask some filter, by default all filter are displayed. If you want to only show certain filter, fill the configuration object PsgDiagramSearchConfig.
  
```
  var PsgDiagramSearchConfig = {
    {EvolveView}: {
      {template} : {
        {objectType1} : [{ScriptName of Object Property or Scriptname of the association}],
        {objectType2} : [{ScriptName of Object Property or Scriptname of the association}]
      }
    },
    default : { 
      {template} : {
        {objectType} : [{ScriptName of Object Property or Scriptname of the association}]
      }
    }
  };   
```

The ScriptName of Object Property need to be in lowerCase  
The ScriptName of the association need to be in UpperCase

## Image
You can save your diagram once filtered by right clicking on the diagram, and click on save the image. 

## Cohabitation with other specific

Here is a list of all the specific and the function they modified. If you have other personnal specific that use the same function, you will need to merge them in to the main.js
https://docs.google.com/spreadsheets/d/19Mi3LsdQlRuTGFAZiGtLFPGcLhrScWZFTSsm-qQ_BiY/edit#gid=0



