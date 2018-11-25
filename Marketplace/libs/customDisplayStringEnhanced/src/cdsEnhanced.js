 /*jslint browser:true*/
/*global cwAPI, jQuery, cwTabManager*/
(function(cwApi, $) {
  'use strict';

var popOutEnableByDefault = true;
var cdsEnhanced = {};

cdsEnhanced.getDisplayItem = function(item, nameOnly) {
    var itemDisplayName, titleOnMouseOver, link, itemLabel, markedForDeletion, linkTag, linkEndTag,popOutInfo,popOutSplit,popOutName,popOutText,popoutElement;


    // use the display property scriptname
    itemLabel = this.displayProperty.getDisplayString(item);
    link = !cwApi.isUndefined(this.defaultLinkView) ? this.singleLinkMethod(this.defaultLinkView, item) : "";
    titleOnMouseOver = this.hasTooltip && !cwApi.isUndefined(item.properties.description) ? cwApi.cwEditProperties.cwEditPropertyMemo.isHTMLContent(item.properties.description) ? $(item.properties.description).text() : item.properties.description : "";

    markedForDeletion = cwApi.isObjectMarkedForDeletion(item) ? ' markedForDeletion' : '';
    if (this.options.HasLink === false) {
        if (itemLabel.indexOf('<@') !== -1 && itemLabel.indexOf('\\<@') === -1) {
            itemLabel = itemLabel.replace(/<@/g, '').replace(/@>/g, '');
        }
        itemDisplayName = "<span class='" + this.nodeID + markedForDeletion + "' title=\"" + titleOnMouseOver + "\">" + itemLabel + "</span>";
    } else {
        linkTag = "<a class='" + this.nodeID + markedForDeletion + "' href='" + link + "'>";
        linkEndTag = "</a>";
        if (itemLabel.indexOf('<@') !== -1 && itemLabel.indexOf('\\<@') === -1) {
            itemDisplayName = itemLabel.replace(/<@/g, linkTag).replace(/@>/g, linkEndTag);
        } else {
            itemDisplayName = linkTag + itemLabel + linkEndTag;
        }
    }

    if(popOutEnableByDefault && itemDisplayName.indexOf('<#') === -1 && itemDisplayName.indexOf('<@') === -1 ) {
        popOutText = '<i class="fa fa-external-link" aria-hidden="true"></i>';
        popOutName = item.objectTypeScriptName + "_diagram_popout";
        if(cwAPI.ViewSchemaManager.pageExists(popOutName) === true) {
            popoutElement = ' <span class="cdsEnhancedDiagramPopOutIcon" onclick="cwAPI.customFunction.openDiagramPopoutWithID(' + item.object_id + ',\'' + popOutName + '\');">' + popOutText + "</span>";
            itemDisplayName = itemDisplayName + popoutElement;
        }

    } else {
        while(itemDisplayName.indexOf('<#') !== -1 && itemDisplayName.indexOf('#>') !== -1) {
            popOutInfo = itemDisplayName.split("<#")[1].split("#>")[0];
            if(popOutInfo.indexOf('#') === -1) {
                popOutName = popOutInfo;
                popOutText = '<i class="fa fa-external-link" aria-hidden="true"></i>';
            } else {
                popOutSplit = popOutInfo.split("#");
                popOutName = popOutSplit[1];
                popOutText = popOutSplit[0];   
            }

            popoutElement = '<span class="cdsEnhancedDiagramPopOutIcon" onclick="cwAPI.customFunction.openDiagramPopoutWithID(' + item.object_id + ',\'' + popOutName + '\');">' + popOutText + "</span>";
        itemDisplayName = itemDisplayName.replace('<#' + popOutInfo + '#>',popoutElement);
        }
    }

    


    $('span').attr('data-children-number');

    if (!cwApi.isUndefined(nameOnly) && nameOnly === true) {
        itemDisplayName = "<label class='" + this.nodeID + "'>" + itemLabel + "</label>";
    }
    return itemDisplayName;
};

if(cwAPI.customFunction === undefined) cwAPI.customFunction = {};
cwApi.customFunction.openDiagramPopoutWithID = function(id,popOutName) {
    var obj = {};
    obj.object_id = id;
    cwAPI.cwDiagramPopoutHelper.openDiagramPopout(obj,popOutName);

};

cwApi.cwLayouts.CwLayout.prototype.getDisplayItem = cdsEnhanced.getDisplayItem;


}(cwAPI, jQuery));