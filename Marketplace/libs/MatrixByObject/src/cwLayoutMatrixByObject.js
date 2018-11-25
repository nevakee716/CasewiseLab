/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */

/*global cwAPI, jQuery */
(function(cwApi, $) {
    "use strict";

    // constructor
    var cwLayoutMatrixByObject = function(options, viewSchema) {
        cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema); // heritage
        cwApi.registerLayoutForJSActions(this); // execute le applyJavaScript après drawAssociations
        this.policy = this.options.CustomOptions['connection-policy'];
        this.first_node = this.options.CustomOptions['first-node'];
        this.second_node = this.options.CustomOptions['second-node'];   
        this.title = this.options.CustomOptions['title'];      
    };

    // obligatoire appeler par le system
    cwLayoutMatrixByObject.prototype.drawAssociations = function(output, associationTitleText, object) {
        try {
            // body...
            var i, j, k;
            this.oRows = {};
            this.oColumms = {};
            this.oAssos = {};
            var lvlOneObjects;
            var name, object_id;
            var lvlZeroObjects = object.associations[this.nodeID];
            k = 0;
            // on parcours la liste d'objet à afficher, le premier représente les colonnes et le 2e les lignes
            if (lvlZeroObjects.length === 1) {
                // on ne fait que pour lorsqu'il n'y a qu'un objet concerner par le layout, exemple un process 
                // qui a un diagramme eclaté à qui on applique le layout matrice.

                lvlOneObjects = lvlZeroObjects[0].associations[this.first_node];
                
                if(this.policy) {
                    for (j = 0; j < lvlOneObjects.length; j += 1) {
                        name = lvlOneObjects[j].name;
                        object_id = lvlOneObjects[j].object_id;
                        // on ne prends en compte que les premiers
                        if (k === 0 && this.policy) {
                            this.oColumms[object_id] = name;
                        } else if ((k === 1 && this.policy) || (k === 0 && !this.policy)) {
                            //une fois qu'on a les colonnes on regarde les associations 
                            this.oRows[object_id] = name;
                            this.lookForAssociation(lvlOneObjects[j]);

                        }
                    }
                    lvlOneObjects = lvlZeroObjects[0].associations[this.second_node];
                } 


                for (j = 0; j < lvlOneObjects.length; j += 1) {
                    name = lvlOneObjects[j].name;
                    object_id = lvlOneObjects[j].object_id;
                    this.oRows[object_id] = name;
                    this.lookForAssociation(lvlOneObjects[j]);
                }
                

            }
        } catch (e) {
            console.log(e);
        }
     

        this.drawTable(output, this.sortObjectByValue(this.oRows), this.sortObjectByValue(this.oColumms));
    };

    // on regarde les asso et on les mets dans this.oAsso
    cwLayoutMatrixByObject.prototype.lookForAssociation = function(object) {
        var tempAssoName = "";
        var tempAssoContent = "";
        var i;
        for (i in object.associations) {
            if (object.associations.hasOwnProperty(i)) {
                object.associations[i].forEach(function(objectLvlOne) {
                	//on verifie que l'objet associé à notre ligne et bien présent dans les colonenes
                    if (this.oColumms.hasOwnProperty(objectLvlOne.object_id)) {
                        tempAssoName = objectLvlOne.object_id + "_" + object.object_id;
                        // on va lire les propriétés de l'associations
                        this.oAssos[tempAssoName] = this.readAssociationProperties(objectLvlOne);
                    } else if(!this.policy){
                        this.oColumms[objectLvlOne.object_id] = objectLvlOne.name;
                        tempAssoName = objectLvlOne.object_id + "_" + object.object_id;
                        // on va lire les propriétés de l'associations
                        this.oAssos[tempAssoName] = this.readAssociationProperties(objectLvlOne);
                    }
                }, this);
            }
        }
    };

    //Permet de trier les objects par valuede la 1ere propriété et de renvoyer une array
    cwLayoutMatrixByObject.prototype.sortObjectByValue = function(object) {
        var sortable = [];
        var sortedObject = {};
        for (var i in object) {
            if (object.hasOwnProperty(i)) {
                sortable.push([i, object[i]]);
            }
        }
        sortable.sort(
            function(a, b) {
                return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
            }
        );
        return sortable;
    };



    //permet de lire les propriétés de l'asso et de choisir quoi afficher en fonction du champs custom
    cwLayoutMatrixByObject.prototype.readAssociationProperties = function(object) {
        var tempTxt = "";
        var customProperty = this.options.CustomOptions['custom-association-properties-display'];
        // si rien dans custom property on affiche le nom d'association
        if (customProperty == "") {
            return object.iName;
        } else {
            var propertiesToDisplay = customProperty.split(",");
            for (var i in propertiesToDisplay) {
                if(propertiesToDisplay.hasOwnProperty(i)) {
                    var propertyToDisplay = propertiesToDisplay[i].split(":");
                    for (var j in object.iProperties) {
                        if (object.iProperties.hasOwnProperty(j) && j == propertyToDisplay[0].toLowerCase()) {
                            // cas property en checkbox
                            if (object.iProperties[j] === true) {
                                if (propertyToDisplay[1] && propertyToDisplay[1] != "") {
                                    tempTxt += propertyToDisplay[1];
                                } else {
                                    tempTxt += propertyToDisplay[0];
                                }
                            } else if (object.iProperties[j] !== false) { // property avec nom classique
                                tempTxt += propertyToDisplay;
                            }
                        }
                    }
                }
            }
        }
        return tempTxt;
    };

    cwLayoutMatrixByObject.prototype.drawTable = function(output, rows, columms) {
        var table = document.createElement('table');
        table.className = "matrix";
        
        // test if empty in tab 
        var visible = "";
        if(rows.length != 0 && columms.length != 0){
            visible = 'cw-visible';
        }
        output.push('<table class="matrix ' + visible + '"><tr><td class="matrixHeader">'+this.title+'</td>');

        // header row
        for (i = 0; i < columms.length; i += 1) {
            if (columms[i][1]) {
                output.push('<th class="matrixColummHeader"><div><div>', columms[i][1], '</div></div></th>');
            }
        }
        output.push('</tr>');

        var assoId = "";
        for (i = 0; i < rows.length; i += 1) {
            if (rows[i][1]) {
                output.push('<tr><td class="matrixRowHeader">', rows[i][1], '</td>');
                for (var j = 0; j < columms.length; j += 1) {
                    if (columms[j][1]) {
                        assoId = columms[j][0] + "_" + rows[i][0];
                        if (this.oAssos.hasOwnProperty(assoId)) {
                            output.push('<td class="cellChecked">', this.oAssos[assoId], '</td>');
                        } else {
                            output.push('<td class="cellNotChecked"></td>');
                        }
                    }
                }
                output.push('</tr>');
            }
        }
        output.push('</table>');


    };

    cwLayoutMatrixByObject.prototype.applyJavaScript = function() {
    };

    cwApi.cwLayouts.cwLayoutMatrixByObject = cwLayoutMatrixByObject;
}(cwAPI, jQuery));