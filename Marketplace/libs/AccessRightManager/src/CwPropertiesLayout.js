/* Copyright © 2012-2017 erwin, Inc. - All rights reserved */
/*global cwAPI */
(function (cwApi) {
    'use strict';

    function isReadAllowed(view, ot, property) {
        var rolesId = cwApi.currentUser.RolesId, i;
        if (configReadForbiddenPropertiesByViewAndRole.hasOwnProperty(view)) {
            var v = configReadForbiddenPropertiesByViewAndRole[view];
            if (v.hasOwnProperty(ot)){
                var res = true;
                for (i = 0; i < rolesId.length; i += 1) {
                    var r = rolesId[i];
                    if (v[ot].hasOwnProperty(r) && v[ot][r].indexOf(property) !== -1) {
                        res = false;
                    } else {
                        res = true;
                    }
                }
                return res;
            }
        }
        return true;
    }

    cwApi.cwPropertiesLayouts.CwPropertiesLayout.prototype.canDisplayProperty = function (objectTypeScriptName, propertyScriptName){
        if(this.propertyGroup.view === undefined) {
            var view = cwAPI.getCurrentView();
            if(view !== undefined) {
               view = view.cwView;
               this.propertyGroup.view = view; 
            }
        }
        return isReadAllowed(this.propertyGroup.view, objectTypeScriptName, propertyScriptName);
    };

    cwApi.cwPropertiesLayouts.CwPropertiesLayoutTable.prototype.outputTable = function (output, mainObject, objectTypeScriptName) {
        var i, propertyScriptName;
        this.outputHeader(output, mainObject);
        for (i = 0; i < this.propertyGroup.properties.length; i += 1) {
            propertyScriptName = this.propertyGroup.properties[i];
            if (this.canDisplayProperty(objectTypeScriptName, propertyScriptName)){
                output.push('<tr>');
                this.outputProperty(output, mainObject, propertyScriptName, objectTypeScriptName);
                output.push('</tr>');
            }
        }
        this.outputFooter(output);
    };

    cwApi.cwPropertiesLayouts.CwPropertiesLayoutFlatList.prototype.outputTable = function (output, mainObject, objectTypeScriptName) {
        var i, propertyScriptName, value, property;
        this.outputHeader(output, mainObject);
        output.push('<ul class="', this.customClass, '">');
        for (i = 0; i < this.propertyGroup.properties.length; i += 1) {
            propertyScriptName = this.propertyGroup.properties[i];
            if (this.canDisplayProperty(objectTypeScriptName, propertyScriptName)){
                property = cwApi.mm.getProperty(objectTypeScriptName, propertyScriptName);
                value = cwApi.cwPropertiesGroups.getPropertyValue(mainObject, property, 'properties', objectTypeScriptName);
                if (property.type === 'Memo') {
                    value = cwApi.cwEditProperties.cwEditPropertyMemo.replaceNewlinesWithBR(value);
                }
                if (value !== null) {
                    output.push('<li>');
                    output.push('<h5 class="CwPropertiesLayoutFlatListTitle">', cwApi.mm.getPropertyNameHTML(objectTypeScriptName, propertyScriptName), '</h5>');
                    output.push('<span class="CwPropertiesLayoutFlatListText">', value, "</span>");
                    output.push('</li>');
                }
            }
        }
        output.push('</ul>');
        this.outputFooter(output);
    };

    


}(cwAPI));