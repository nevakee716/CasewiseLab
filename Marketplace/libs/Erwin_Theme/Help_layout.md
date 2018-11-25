## Description
This package is useful when you want to use the erwin colors for your evolve website.

## Installation  
[https://github.com/casewise/cpm/wiki](https://github.com/casewise/cpm/wiki)  

Note :  
Please open the file cwAccordion.less. On line 36, please change  
```
li.cw-accordion-container:hover{
    div.cw-accordion-header{
        background-color: @cwAccordionHeaderHoverBackgroundColor;
        a{
            color:@cwAccordionHeaderHoverTextColor;
        }
    }
    div.cw-accordion-content{
        border-color:@cwAccordionHeaderHoverBackgroundColor;
    }
}
```
by  
```
li.cw-accordion-container div.cw-accordion-header:hover{
    background-color: @cwAccordionHeaderHoverBackgroundColor;
    a{
        color:@cwAccordionHeaderHoverTextColor;
    }
    +div.cw-accordion-content{
        border-color:@cwAccordionHeaderHoverBackgroundColor;
    }
}
```