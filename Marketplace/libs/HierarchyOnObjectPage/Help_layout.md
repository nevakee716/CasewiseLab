| **Name** | **cwHierarchyOnObjectPage** | **Version** | 
| --- | --- | --- |
| **Updated by** | Mathias PFAUWADEL | 4.0 |


## Patch Notes

* 4.0 : By default adding the previous page 
* 3.0 : Adding the possibility to display right association (need config change compare to previous version)
* 2.0 : Adding history feature, and list multiple element
* 1.0 : 1st version working

## Description 
Allow you to display hierarchy in an objectPage. This is a specific not a layout, but the installation procedure is the same than cpm layout. https://github.com/casewise/cpm


## Screen Shot
Here we have a hierarchy of process related with the association type (is child of/is parent of). With this specific we can display the hierachy in the title of the process

<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/1.jpg" alt="Drawing" style="width: 95%;"/>

## Setup

### History by Default

By default, it will show the previous page on the top bar, if you want to deactivate it please open this file
cwHierarchyOnObjectPage\src\hierarchyOnObjectPage.js
and comment this line
````
cwCustomerSiteActions.breadCrumbHierarchy.historyPages = []; // comment this line if you want to deactivate the history
````

### Node in Evolve

<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/2.jpg" alt="Drawing" style="width: 95%;"/>
<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/2bis.jpg" alt="Drawing" style="width: 95%;"/>
We will use the node configuration to define the association that we will use to define our hierarchy.

This node configuration need to be done for EACH view where you want to display the hierarchy.
For good naming convention, you should use BreadcrumbHierarchy{direction} {nameOfTheView}. The hierarchy will apply as long as the node id start with BreadcrumbHierarchy{direction}. Remember the node id need to be unique. The node can be placed in any tab of the view.

<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/3.jpg" alt="Drawing" style="width: 95%;"/>

Use the custom Display string on all layout list of the BreadcrumbHierarchy node to define the separator between the differents elements of the hierarchy


## Behaviour

Be carefull, the layout doesn't jump and merge, so if you have multiple element at one stage, on the stage after if will only display the association of the first element

## Multiple elements

If an element has multiple parent, the specific will display the number of parents
<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/5.jpg" alt="Drawing" style="width: 95%;"/>

You can click on the multiple elements to display all the element of the list

## History Functionnality

The hierarchy as a built-in history, he will store on which Page you pass, and will display in red (can be change by CSS) the link of the hierarchy where you have been before.

So, if you go to CONSULT, then CONSULTATION and Initiate
On the Initiate Page, you have this
<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/6.jpg" alt="Drawing" style="width: 95%;"/>

You can modify the CSS here \Evolve\Site\bin\webDesigner\custom\Marketplace\libs\cwHierarchyOnObjectPage\src\hierarchyOnObjectPage.less 

```
div.page-title a.HierarchyLink { //other Objects

}

div.page-title a.historyHierarchyLink { // Object where we pass
	color: red;
}

```

## main.js

By default, the standard main.js can disabled this specific, you create one a custom node, then deploy on this node
https://help.casewise.com/evolve/v2016-1/main/#Evolve 4.X/customization/Custom-CSS-Javascript.htm?Highlight=main.js
your custom main.js can be empty.


## Cohabitation with other specific

Here is a list of all the specific and the function they modified. If you have other personnal specific that use the same function, you will need to merge them in to the main.js
https://docs.google.com/spreadsheets/d/19Mi3LsdQlRuTGFAZiGtLFPGcLhrScWZFTSsm-qQ_BiY/edit#gid=0




