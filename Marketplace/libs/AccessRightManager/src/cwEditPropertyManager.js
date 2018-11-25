/* Copyright © 2012-2017 erwin, Inc. - All rights reserved */

/*global cwAPI:true, jQuery:true*/

(function (cwApi, $) {
    'use strict';

    function isEditAllowed(view, property){
        var rolesId = cwApi.currentUser.RolesId, i;
        if (configEditForbiddenPropertiesByViewAndRole.hasOwnProperty(view)){
            var v = configEditForbiddenPropertiesByViewAndRole[view];
            var res = true;
            for(i=0; i<rolesId.length; i+=1){
                var r = rolesId[i];
                if (v.hasOwnProperty(r) && v[r].indexOf(property) !== -1){
                    res = false;
                } else {
                    res = true;
                }
            }
            return res;
        }
        return true;
    }

    // public
    cwApi.cwEditProperties.cwEditPropertyManager.prototype.setPropertiesEditMode = function () {
        var i, property, view = cwApi.getCurrentView().cwView;
        for (i = 0; i < this.properties.length; i += 1) {
            property = this.properties[i];
            if (isEditAllowed(view, property.p.scriptName) && property.p.readOnly === false && property.canBeEdited() && (property.exportflag === "false" || property.p.scriptName === "exportflag")) {
                property.setEditModeInDOM(this.item);
                property.doJSAction();
            }
        }
    };


}(cwAPI, jQuery));