/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */

(function(cwApi) {
  "use strict";
  /*global cwAPI:true */

  var cwGroupBy = function(options, viewSchema) {
    cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema);
    this.drawOneMethod = this.drawOne;

    this.hasTooltip = true;
    cwApi.registerLayoutForJSActions(this);
  };

  cwGroupBy.drawOne = function(output, item, callback, nameOnly) {

    var itemDisplayName, cleanItemName, uid, canDelete, newObject;

    if (!cwApi.isUndefined(item.is_new) && item.is_new) {
      itemDisplayName = item.name;
      newObject = true;
    } else {
      itemDisplayName = this.getDisplayItem(item, nameOnly);
      newObject = false;
    }

    if (!cwApi.isUndefined(item.iProperties)) {
      uid = item.iProperties.uniqueidentifier;
      if (cwApi.isUndefined(uid)) {
        uid = item.iProperties.id;
      }
    } else {
      uid = 0;
    }

    if (!cwApi.isUndefined(item.iObjectAccessRights)) {
      canDelete = item.iObjectAccessRights.CanDeleteIntersection;
    } else {
      canDelete = true;
    }

    cleanItemName = cwApi.cwSearchEngine.removeSearchEngineZone(item.name);
    if (this.options.CustomOptions['both-levels-expandable']) {
      output.push("<li", cwApi.cwLayouts.cwLayoutList.addHtmlDataItems(uid, cleanItemName, item.object_id, canDelete, newObject), "class='cw-item  ", this.nodeID, " ", this.nodeID, "-", item.object_id, " ", this.options.NodeCSSClass, "'>", "<div class='", this.nodeID, " ", this.options.NodeCSSClass, "'>");
    } else {
      output.push("<li", cwApi.cwLayouts.cwLayoutList.addHtmlDataItems(uid, cleanItemName, item.object_id, canDelete, newObject), "class='cw-item  ", this.nodeID, "-", item.object_id, " ", this.options.NodeCSSClass, "'>", "<div class=' ", this.options.NodeCSSClass, "'>");

    }
    cwApi.cwEditProperties.outputAssociationDeleteItem(output, item.nodeID);
    output.push(itemDisplayName, "</div>");

    this.outputChildren(output, item);

    output.push("</li>");


  };


  cwGroupBy.prototype.firtLetterIsInterger = function(s) {
    var isInteger_re = /^\s*(\+|-)?\d+\s*$/;
    return String(s).search(isInteger_re) != -1
  }

  cwGroupBy.prototype.getObjectsByAlphabet = function(all_items) {

    //if the the definition page is in french, sort all the items by name's alphabetical order
    //var that = this;
    // all_items.sort(function(a, b) {
    //   var nameA = a.name.toLowerCase(),
    //     nameB = b.name.toLowerCase()
    //   if (nameA < nameB) // sort string ascending
    //     return -1
    //   if (nameA > nameB)
    //     return 1
    //   return 0 //default return value (no sorting)
    // });

    // function isInteger(s) {
    //   return String(s).search(isInteger_re) != -1
    // }
    var itemList = {};
    for (var i in all_items) {
      if (all_items.hasOwnProperty(i)) {
        var item = all_items[i];
        var itemDisplayName = this.displayProperty.getDisplayString(item);

        itemDisplayName = cwApi.cwSearchEngine.removeSearchEngineZone(itemDisplayName);
        var key = itemDisplayName.substring(0, 1).toUpperCase();
        //console.log("key:",key);
        if (this.firtLetterIsInterger(key)) {
          key = "0-9";
        }

        if (cwApi.isUndefined(itemList[key])) {
          itemList[key] = [];
        }
        itemList[key].push(item);
      }
    }
    return itemList;
  };


  cwGroupBy.prototype.drawAssociations = function(output, associationTitleText, object) {
    /*jslint unparam:true*/
    var i, s, child, associationTargetNode, objectId, sortedItems;
    if (cwApi.isUndefinedOrNull(object) || cwApi.isUndefined(object.associations)) {
      // Is a creation page therefore a real object does not exist
      if (!cwApi.isUndefined(this.mmNode.AssociationsTargetObjectTypes[this.nodeID])) {
        objectId = 0;
        associationTargetNode = this.mmNode.AssociationsTargetObjectTypes[this.nodeID];
      } else {
        return;
      }
    } else {
      if (!cwApi.isUndefined(object.associations[this.nodeID])) {
        objectId = object.object_id;
        associationTargetNode = object.associations[this.nodeID];
      } else {
        return;
      }
    }
    
    if (this.options.CustomOptions['group-by-alphabel']) {
      sortedItems = this.getObjectsByAlphabet(associationTargetNode);
    } else {
      sortedItems = this.getObjectsByLookup(associationTargetNode);
    }

    if (this.options && this.options.CustomOptions && this.options.CustomOptions['display-title'] === true && associationTargetNode.length > 0) {
      output.push('<h5 class="cw-list-title">', this.mmNode.NodeName, '</h5>');
    }

    //this.NodeID is used as Accordion selector
    output.push("<ul class='cw-list ", this.nodeID, "'>");
    for (s in sortedItems) {
      if (sortedItems.hasOwnProperty(s) && sortedItems[s]) {

        output.push("<li class='cw-item ", this.nodeID, "'>");

        output.push('<div class="cw-list-subtitle ', this.nodeID, '" data-sort="', s, '"><a></a>', s, '</div>');
        //children of each group
        output.push("<div class='cw-children'>");

        output.push('<ul class="cw-list  ', this.nodeID, '-', objectId, ' ', this.LayoutName, ' ', this.mmNode.LayoutDrawOne, ' ot-', this.mmNode.ObjectTypeScriptName.toLowerCase());
        if (sortedItems[s].length > 0) {
          output.push(' cw-visible ');
        }
        output.push('" data-association-key=' + this.nodeID + ' data-sort-property="' + s + '">');

        for (i = 0; i < sortedItems[s].length; i += 1) {
          child = sortedItems[s][i];
          this.drawOneMethod(output, child);
        }

        output.push('</ul>');
        output.push("</div></li>");
      }
    }
    output.push("</ul>");
  };

  cwGroupBy.prototype.getObjectsByLookup = function(allItems) {
    var groupData, sortedGroupData, filter, undefinedValue, undefinedText;
    filter = this.options.CustomOptions['group-by-property'].toLowerCase();

    // Group Objects By Type
    groupData = cwApi.groupBy(allItems, function(obj) {
      return obj.properties[filter];
    });
    sortedGroupData = this.sortObjectByKey(groupData);

    undefinedValue = cwApi.getLookupUndefinedValue();
    undefinedText = $.i18n.prop('global_undefined');
    //sortedGroupData.renameProperty(undefinedValue, undefinedText);
    cwApi.replacePropertyKey(sortedGroupData, undefinedValue, undefinedText);
        
    return sortedGroupData;
  };

  cwGroupBy.prototype.sortObjectByKey = function(groupData) {
    var sortedObj, keys;
    keys = Object.keys(groupData);
    keys.sort();
    sortedObj = this.setUndefinedAtBottom(keys, groupData);
    return sortedObj;
  };

  cwGroupBy.prototype.setUndefinedAtBottom = function(keys, groupData) {
    var sortedObj, i;
    sortedObj = {};
    // create new array based on Sorted Keys
    for (i = 0; i < keys.length; i += 1) {
      sortedObj[keys[i]] = groupData[keys[i]];
    }
    return sortedObj;
  };


  cwApi.cwLayouts.cwGroupBy = cwGroupBy;

}(cwAPI));