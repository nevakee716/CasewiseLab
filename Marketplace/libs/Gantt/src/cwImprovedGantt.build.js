/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */



/*global cwAPI, jQuery */
(function(cwApi, $) {
    "use strict";
    if (cwApi && cwApi.cwLayouts && cwApi.cwLayouts.cwImprovedGantt) {
        var cwImprovedGantt = cwApi.cwLayouts.cwImprovedGantt;
    } else {
        // constructor
        var cwImprovedGantt = function(options, viewSchema) {
            cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema); // heritage
            cwApi.registerLayoutForJSActions(this); // execute le applyJavaScript après drawAssociations
            this.construct(options);
        };
    }

    cwImprovedGantt.prototype.applyJavaScript = function() {
        var self = this;
        var libToLoad = [];

        if (cwAPI.isDebugMode() === true) {
            self.createGantt();
        } else {
            libToLoad = ['modules/jsGanttImproved/jsGanttImproved.min.js'];
            // AsyncLoad
            cwApi.customLibs.aSyncLayoutLoader.loadUrls(libToLoad, function(error) {
                if (error === null) {
                    self.createGantt();
                } else {
                    cwAPI.Log.Error(error);
                }
            });
        }
    };


    // Building network
    cwImprovedGantt.prototype.createGantt = function() {
        function addStyleString(str) {
            var node = document.createElement('style');
            node.innerHTML = str;
            document.body.appendChild(node);
        }

        var GanttContainer = document.getElementById("cwImprovedGantt" + this.nodeID);
        var self = this,
            i = 0;

        this.g = new JSGantt.GanttChart(GanttContainer, this.config.scale);
        this.g.setDateTaskTableDisplayFormat(this.config.dateDisplayFormat);
        this.g.setUseToolTip(0);
        //this.g.setShowDur(0);
        this.simplify(this.JSONobjects, null);
 

        function createCSSSelector(e,t){if(document.styleSheets&&0!=document.getElementsByTagName("head").length){var s,l;if(document.styleSheets.length>0)for(var o=0,n=document.styleSheets.length;o<n;o++)if(!document.styleSheets[o].disabled){var r=document.styleSheets[o].media;if("string"===(l=typeof r)?""!==r&&-1===r.indexOf("screen")||(s=document.styleSheets[o]):"object"==l&&(""!==r.mediaText&&-1===r.mediaText.indexOf("screen")||(s=document.styleSheets[o])),void 0!==s)break}if(void 0===s){var c=document.createElement("style");for(c.type="text/css",document.getElementsByTagName("head")[0].appendChild(c),o=0;o<document.styleSheets.length;o++)document.styleSheets[o].disabled||(s=document.styleSheets[o]);l=typeof s.media}if("string"===l){for(o=0,n=s.rules.length;o<n;o++)if(s.rules[o].selectorText&&s.rules[o].selectorText.toLowerCase()==e.toLowerCase())return void(s.rules[o].style.cssText=t);s.addRule(e,t)}else if("object"===l){var d=s.cssRules?s.cssRules.length:0;for(o=0;o<d;o++)if(s.cssRules[o].selectorText&&s.cssRules[o].selectorText.toLowerCase()==e.toLowerCase())return void(s.cssRules[o].style.cssText=t);s.insertRule(e+"{"+t+"}",d)}}}

        let widthSum = 23;

        this.config.customColumnMap.forEach(function(c) {
            widthSum += parseInt(c.width) + 4;
            createCSSSelector(".g" + c.scriptname,"overflow:hidden; height: 18px; white-space: nowrap; border: #efefef 1px solid; text-align: center; min-width: " + c.width + "px; max-width: " + c.width + "px; width: " + c.width + "px; font-size: 12px;");
        });

        Object.keys(this.config.fixedColumnMap).map(function(objectKey, index) {
            var c = self.config.fixedColumnMap[objectKey];
            if(c.hide === false) {
                createCSSSelector(".g" + objectKey,"min-width: " + c.width + "px; max-width: " + c.width + "px; width: " + c.width + "px;");
                widthSum += parseInt(c.width) + 4;
            } else {
                self.g["setShow" + c.scriptname](0);
            }
        });


        this.g.Draw(this.config);

        createCSSSelector(".glistlbl","min-width: " + widthSum + "px; max-width: " + widthSum + "px; width: " + widthSum + "px;");
        createCSSSelector(".glistgrid","min-width: " + widthSum + "px; max-width: " + widthSum + "px; width: " + widthSum + "px;");
        
    };



    cwApi.cwLayouts.cwImprovedGantt = cwImprovedGantt;
}(cwAPI, jQuery));