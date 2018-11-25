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


    cwImprovedGantt.prototype.getItemDisplayString = function(item) {
        var l, getDisplayStringFromLayout = function(layout) {
            return layout.displayProperty.getDisplayString(item);
        };
        if (item.nodeID === this.nodeID) {
            return this.displayProperty.getDisplayString(item);
        }
        if (!this.layoutsByNodeId.hasOwnProperty(item.nodeID)) {
            if (this.viewSchema.NodesByID.hasOwnProperty(item.nodeID)) {
                var layoutOptions = this.viewSchema.NodesByID[item.nodeID].LayoutOptions;
                this.layoutsByNodeId[item.nodeID] = new cwApi.cwLayouts[item.layoutName](layoutOptions, this.viewSchema);
            } else {
                return item.name;
            }
        }
        return getDisplayStringFromLayout(this.layoutsByNodeId[item.nodeID]);
    };

    cwImprovedGantt.prototype.getCDSWithLink = function(item) {
        return cwAPI.getItemLinkWithName(item).replace(item.name, this.getItemDisplayString(item));
    };

    cwImprovedGantt.prototype.getCDSWithLinkAndPopOut = function(item) {
        let r = this.getCDSWithLink(item);
        let popOutText = '<i class="fa fa-external-link" aria-hidden="true"></i>';
        let popOutName = cwApi.replaceSpecialCharacters(item.objectTypeScriptName) + "_diagram_popout";
        if (cwAPI.ViewSchemaManager.pageExists(popOutName) === true && cwAPI.customFunction.openDiagramPopoutWithID) {
            let popoutElement = ' <span class="iGanttPopOutIcon" onclick="cwAPI.customFunction.openDiagramPopoutWithID(' + item.object_id + ',\'' + popOutName + '\');">' + popOutText + "</span>";
            r += popoutElement;
        }
        r = "<span>" + r + "</span>";
        return r;
    };

    cwImprovedGantt.prototype.parseNode = function(child, callback) {
        for (var associationNode in child.associations) {
            if (child.associations.hasOwnProperty(associationNode)) {
                for (var i = 0; i < child.associations[associationNode].length; i += 1) {
                    var nextChild = child.associations[associationNode][i];
                    callback(nextChild, associationNode);
                }
            }
        }
    };


    cwImprovedGantt.prototype.simplify = function(child, fatherID, fatherGanttId) {
        var childrenArray = [];
        var filterArray = [];
        var filtersGroup = [];
        var filteredFields = [];
        var groupFilter = {};
        var element, filterElement, groupFilter;
        var nextChild, config;
        var self = this;
        var l = 0;
        var hasChildren = false;
        this.parseNode(child, function(nextChild, associationNode) {
            if (self.removedNodes.indexOf(associationNode) !== -1) { // jumpAndMerge when hidden
            } else { // adding regular node
                element = {};
                element.label = self.getCDSWithLinkAndPopOut(nextChild);
                element.milestones = [];

                if (self.config.nodes && self.config.nodes.hasOwnProperty(nextChild.nodeID)) {
                    config = self.config.nodes[nextChild.nodeID];
                    element.ressource = self.getRessource(nextChild, config);
                    element.dependency = self.getDependency(nextChild, config);
                    element.milestones = self.getMilestone(nextChild, config);
                    element.startDate = moment(self.getProperty(nextChild, config, "startDate")).format("YYYY-MM-DD");
                    element.endDate = moment(self.getProperty(nextChild, config, "endDate")).format("YYYY-MM-DD");
                    element.completion = self.getProperty(nextChild, config, "completion");
                } else {
                    element.startDate = "";
                    element.endDate = "";
                    element.completion = "";
                    element.ressource = "";
                }

                if (fatherGanttId) element.fatherGanttId = fatherGanttId;
                else element.fatherGanttId = "";

                if (fatherID) element.id = nextChild.object_id + "_" + nextChild.objectTypeScriptName + "_" + child.object_id;
                else element.id = nextChild.object_id + "_" + nextChild.objectTypeScriptName;
                element.objectTypeScriptName = nextChild.objectTypeScriptName;


                if (self.objectTypeTable[nextChild.objectTypeScriptName] === undefined) {
                    self.objectTypeTable[nextChild.objectTypeScriptName] = Object.keys(self.objectTypeTable).length;
                    self.reverseobjectTypeTable[self.objectTypeTable[nextChild.objectTypeScriptName]] = nextChild.objectTypeScriptName;
                }

                
                if (self.idsTable[element.id] === undefined) {
                    hasChildren = true;
                    self.idsTable[element.id] = element;
                    element.ganttID = self.getGanttId(nextChild);
                    element.hasChildren = self.simplify(nextChild, child.object_id, element.ganttID);

                    self.reverseIdTable[element.ganttID] = element;
                    self.createMilestones(element, config);
                    self.createTask(element, config);
                    
                }
            }
        });
        return hasChildren;
    };

    cwImprovedGantt.prototype.getGanttId = function(child) {
        return this.objectTypeTable[child.objectTypeScriptName] * 10000 + child.object_id;
    };

    cwImprovedGantt.prototype.getProperty = function(child, config, property) {
        var result = "",
            self = this;
        if (child.properties && child.properties[config[property].toLowerCase()]) {
            return child.properties[config[property].toLowerCase()];
        }
        return "";
    };

    cwImprovedGantt.prototype.getMilestone = function(child, config) {
        var result = [],
            self = this,
            particule = "",
            init = true,
            idToHide = [];

        this.parseNode(child, function(nextChild, associationNode) {
            particule = "";
            if (config.milestone && config.milestone.indexOf(nextChild.nodeID) !== -1) {
                var milestone = {};
                milestone.date = moment(self.getProperty(nextChild, config, "startDate")).format("YYYY-MM-DD");
                milestone.label = self.getItemDisplayString(nextChild);
                milestone.id = self.getGanttId(nextChild) + 1000000 * self.getGanttId(child);

                if (self.config.fixedColumnMap.pccomplete.hide === true || milestone.date > moment(new Date())) milestone.done = 0;
                else milestone.done = 100;

                result.push(milestone);
                
                if(idToHide.indexOf(nextChild.nodeID) === -1) idToHide.push(nextChild.nodeID);
            }
            
        });
        self.removedNodes = self.removedNodes.concat(idToHide);
        return result;
    };

    cwImprovedGantt.prototype.getDependency = function(child, config) {
        var result = "",
            self = this,
            particule = "",
            init = true;

        this.parseNode(child, function(nextChild, associationNode) {
            particule = "";
            if (config.finishToStart && config.finishToStart.indexOf(nextChild.nodeID) !== -1) {
                particule = "FS";
                self.removedNodes.push(nextChild.nodeID);
            }
            if (config.finishToStart && config.startToStart.indexOf(nextChild.nodeID) !== -1) {
                particule = "SS";
                self.removedNodes.push(nextChild.nodeID);
            }
            if (config.finishToStart && config.finishToFinish.indexOf(nextChild.nodeID) !== -1) {
                particule = "FF";
                self.removedNodes.push(nextChild.nodeID);
            }
            if (particule !== "") {
                init = false;
                if (init) result += ",";
                result += self.getGanttId(nextChild) + particule;
            }
        });
        return result;
    };


    cwImprovedGantt.prototype.getRessource = function(child, config) {
        var result = {},
            self = this;

        this.config.customColumnMap.forEach(function(c) {
            if (child.properties[c.scriptname]) {
                result[c.scriptname] = child.properties[c.scriptname];
            }
        });

        return result;
    };

    cwImprovedGantt.prototype.createMilestones = function(element, config) {
        var type = 0,
            mile = 0,
            cMile = 0,
            classStyle = "gmilestone", //gmilestone
            self = this;


        if (element.milestones.length > 0) {
            element.milestones.forEach(function(m) {
                cMile += m.done;
            });

            cMile = cMile / element.milestones.length;
            self.g.AddTaskItem(new JSGantt.TaskItem(element.ganttID + 420000000, "Milestones", '', '', 'ggroupblack', '', 0, element.milestones[0].ressource, cMile, 2, element.ganttID, 1, null, '', element.description, self.g));

            element.milestones.forEach(function(m) {
                self.g.AddTaskItem(new JSGantt.TaskItem(m.id, m.label, m.date, m.date, classStyle, '', 0, element.ressource, m.done, type, element.ganttID + 420000000, 1, null, '', element.description, self.g));
            });
        }

    };

    cwImprovedGantt.prototype.createTask = function(element, config) {
        var type = 0,
            classStyle = "gtaskred";
        if (config !== undefined) classStyle = config.classStyle;
        if (element.hasChildren || element.milestones.length > 0) type = 1;
        this.g.AddTaskItem(new JSGantt.TaskItem(element.ganttID, element.label, element.startDate, element.endDate, classStyle, '', 0, element.ressource, element.completion, type, element.fatherGanttId, 1, element.dependency, '', element.description, this.g));
    };



    cwImprovedGantt.prototype.multiLine = function(name, size) {
        if (size !== "" && size > 0) {
            var nameSplit = name.split(" ");
            var carry = 0;
            var multiLineName = "";
            for (var i = 0; i < nameSplit.length - 1; i += 1) {
                if (nameSplit[i].length > size || carry + nameSplit[i].length > size) {
                    multiLineName += nameSplit[i] + "\n";
                    carry = 0;
                } else {
                    carry += nameSplit[i].length + 1;
                    multiLineName += nameSplit[i] + " ";
                }
            }
            multiLineName = multiLineName + nameSplit[nameSplit.length - 1];

            return multiLineName;
        } else {
            return name;
        }


    };

    // obligatoire appeler par le system
    cwImprovedGantt.prototype.drawAssociations = function(output, associationTitleText, object) {
        var cpyObj = $.extend({}, object);
        var assoNode = {};

        this.originalObject = $.extend({}, object);
        var simplifyObject, i, assoNode = {},
            isData = false;
        // keep the node of the layout
        assoNode[this.mmNode.NodeID] = object.associations[this.mmNode.NodeID];


        // complementary node
        this.config.complementaryNode.forEach(function(nodeID) {
            if (object.associations[nodeID]) {
                assoNode[nodeID] = object.associations[nodeID];
            }
        });

        cpyObj.associations = assoNode;
        
        // hidden node
        this.manageHiddenNodes(cpyObj);

        this.JSONobjects = cpyObj;
        output.push('<div class="cw-visible" id="cwImprovedGantt' + this.nodeID + '"></div>');

    };

    cwImprovedGantt.prototype.manageHiddenNodes = function(parent) {
        var childrenToRemove = [];
        var self = this;

        this.parseNode(parent, function(child, associationNode) {
            if(self.config.hiddenNodes.indexOf(associationNode) !== -1) { // jumpAndMerge when hidden
                childrenToRemove.push(associationNode);
                for (var nextassociationNode in child.associations) {
                    if (child.associations.hasOwnProperty(nextassociationNode)) {
                        if(!parent.associations.hasOwnProperty(nextassociationNode)) parent.associations[nextassociationNode] = [];
                        
                        for (var i = 0; i < child.associations[nextassociationNode].length; i += 1) {
                            var nextChild = child.associations[nextassociationNode][i];
                            parent.associations[nextassociationNode].push(nextChild);
                        }
                    }
                }
            } else {
                self.manageHiddenNodes(child);
            }
        });

        childrenToRemove.forEach(function(c) {
            delete parent.associations[c] ; 
        });
    };

    cwApi.cwLayouts.cwImprovedGantt = cwImprovedGantt;
}(cwAPI, jQuery));