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

    cwImprovedGantt.prototype.construct = function(options) {
        this.scale = "month";
        this.idsTable = {};
        this.reverseIdTable = {};
        this.layoutsByNodeId = {};
        this.objectTypeTable = {};
        this.reverseobjectTypeTable = {};
        this.removedNodes = [];
        this.config = JSON.parse(this.options.CustomOptions['JsonConfiguration']);
       
        var nodesObj = {};
        this.config.nodes.forEach(function(n) {
            nodesObj[n.nodeID] = n;
        });

        this.config.nodes = nodesObj;
    };



    cwApi.cwLayouts.cwImprovedGantt = cwImprovedGantt;
}(cwAPI, jQuery));