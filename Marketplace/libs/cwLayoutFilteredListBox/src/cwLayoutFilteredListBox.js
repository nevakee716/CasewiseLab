/* Copyright � 2012-2017 erwin, Inc. - All rights reserved */
/*global cwAPI, jQuery*/

(function (cwApi, $) {
    'use strict';
    var cwLayoutFilteredListBox;

    cwLayoutFilteredListBox = function (options, viewSchema) {
        cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema);
        this.drawOneMethod = cwApi.cwLayouts.cwLayoutList.drawOne.bind(this);
        cwApi.registerLayoutForJSActions(this);
    };

    cwLayoutFilteredListBox.prototype.drawAssociations = function (output, associationTitleText, object) {
        var l, listBoxNameFromNode, associationTypeScriptName, associationTargetNode, objectId, canAddAssociation, ot, nodeSchema, layout;

        layout = this;
        nodeSchema = this.mmNode;

        if (cwApi.isNull(object)) {
            // Is a creation page therefor a real object does not exist
            if (!cwApi.isUndefined(layout.mmNode.AssociationsTargetObjectTypes[layout.nodeID])) {
                objectId = 0;
                associationTargetNode = layout.mmNode.AssociationsTargetObjectTypes[layout.nodeID];
                nodeSchema = cwApi.ViewSchemaManager.getNodeSchemaById(this.viewSchema.ViewName, associationTargetNode.nodeID);
            } else {
                return;
            }
        } else {
            if (!cwApi.isUndefined(object.associations[layout.nodeID])) {
                objectId = object.object_id;
                associationTargetNode = object.associations[layout.nodeID];
            } else {
                return;
            }
        }

        output.push("<div");
        listBoxNameFromNode = cwApi.mapToTranslation(nodeSchema.NodeName);
        associationTypeScriptName = nodeSchema.AssociationTypeScriptName;

        output.push(" data-association-scriptname='", associationTypeScriptName, "'");
        output.push(" data-target-scriptname='", nodeSchema.ObjectTypeScriptName.toLowerCase(), "'");
        output.push(" data-node-id='", nodeSchema.NodeID, "'");
        if (!cwApi.isUndefined(objectId)) {
            output.push(" data-source-id='", objectId, "'");
        }
        output.push(" class='property-box ", layout.nodeID, "-node-box property-box-asso ");
        if (associationTargetNode.length > 0 || cwApi.queryObject.isEditMode()) {
            output.push('cw-visible');
        } else {
            output.push('cw-hidden');
        }
        output.push("'>");
        output.push("<ul class='property-details ", layout.nodeID, "-details ", layout.nodeID, "-", objectId, "-details'>");
        output.push("<li class='property-details ", layout.nodeID, "-details property-title ", layout.nodeID, "-title ", layout.nodeID, "-", objectId, "-details'>");
        output.push('<div class="cw-property-details-left">');
        output.push('<label class="cw-property-title-displayname">', listBoxNameFromNode, '</label>');
        output.push('</div>');

        output.push('<div class="cw-property-details-right">');
        canAddAssociation = cwApi.cwEditProperties.canAddAssociationInput(layout.nodeID);

        if (canAddAssociation === true) {
            ot = cwApi.mm.getObjectType(nodeSchema.ObjectTypeScriptName.toLowerCase());
            if (cwApi.cwEditProperties.canAddAssociationInput(layout.nodeId)) {
                output.push('<a class="btn no-text cw-hidden cw-doc-action cw-associate-to-existing-item cw-associate-to-existing-item-filtered" id="cw-edit-mode-add-autocomplete-', layout.nodeID, '-', objectId, '"><i class="cw-association-associate-to-item fa fa-link" title="', $.i18n.prop('EditModeAssociateToOpenIconTooltip', ot.name), '"></i></a>');
            }
        }
        output.push('</div>');
        if (canAddAssociation === true) {
            cwApi.cwEditProperties.appendAssociationSelect(output, layout.nodeID, objectId, nodeSchema.ObjectTypeScriptName.toLowerCase());
        }

        output.push("</li>");
        output.push("<li id='", layout.nodeID, "-", objectId, "-value' class='property-details property-value ", layout.nodeID, "-details ", layout.nodeID, "-value ", layout.nodeID, "-", objectId, "-details'>");

        if (false && this.isUsingDirective()) { // ready-only working only so disable for the moment
            this.associationTargetNode = associationTargetNode;
            // create a hidden li so the ul don't get delete by the display manager
            output.push("<ul id='cw-layout-", this.layoutId, "'><li style='display:none;'></li></ul>");
        } else {
            l = cwApi.cwEditProperties.getLayoutWithTemplateOptions(this);
            l.drawAssociations(output, listBoxNameFromNode, object);
        }

        output.push("</li>");
        output.push("</ul>");
        output.push('</div>');
        this.layoutId = layout.nodeID;
        this.objectId = objectId;
    };

    var loadedItems = {};
    var loadingInProgress = {};
    var waitingForUpdates = {};

    function addToWaitingForUpdate(objectTypeScriptName, callback) {
        if (cwApi.isUndefined(waitingForUpdates[objectTypeScriptName])) {
            waitingForUpdates[objectTypeScriptName] = [callback];
        } else {
            waitingForUpdates[objectTypeScriptName].push(callback);
        }
    }

    function updateWaitingForUpdateList(objectTypeScriptName, json) {
        if (!cwApi.isUndefined(waitingForUpdates[objectTypeScriptName])) {
            for (var i = 0; i < waitingForUpdates[objectTypeScriptName].length; i++) {
                var callback = waitingForUpdates[objectTypeScriptName][i];
                callback(json);
            }
            delete waitingForUpdates[objectTypeScriptName];
        }
    }

    function getItems(assoToLoad, callback) {
        var otName = assoToLoad.targetObjectTypeScriptName;
        if (!cwApi.isUndefined(loadedItems[otName])) {
            return callback(loadedItems[otName]);
        }
        if (!cwApi.isUndefined(loadingInProgress[otName])) {
            return addToWaitingForUpdate(otName, callback);
        }
        var url = cwApi.getLiveServerURL() + "page/" + assoToLoad.targetViewName + '?' + Math.random();
        loadingInProgress[otName] = true;
        $.getJSON(url, function (json) {
            loadedItems[otName] = json[assoToLoad.nodeId];
            updateWaitingForUpdateList(otName, json);
            delete loadingInProgress[otName];
            return callback(json);
        });
    }

    function setOptionListToSelect($select, json, itemsById, alreadyAssociatedItems) {
        var o, list, i, item, markedForDeletion;
        o = ['<option></option>'];
        list = json[Object.keys(json)[0]];
        for (i = 0; i < list.length; i++) {
            item = list[i];
            itemsById[item.object_id] = item;
            markedForDeletion = cwApi.isObjectMarkedForDeletion(item) ? ' class="markedForDeletion"' : '';
            o.push('<option ', markedForDeletion, '" value="', item.object_id, '"');
            if (!cwApi.isUndefined(alreadyAssociatedItems[item.object_id])) {
                o.push(' selected');
            }
            o.push('>', item.name, '</option>');
        }
        $select.html(o.join(''));
    }

    function showDeleteIconsAndSetActions (mainContainer) {
        var deleteIcons, i, icon, canDelete, $li;

        if (!cwApi.isUndefined(mainContainer)) {
            deleteIcons = mainContainer.find('.cw-association-delete-item');
        } else {
            deleteIcons = $('.cw-association-delete-item');
        }

        function removeFirstItem() {
            var $e = $(this).parents(".cw-item:first");
            removeItem($e, true);
        }

        for (i = 0; i < deleteIcons.length; i += 1) {
            icon = $(deleteIcons[i]);
            canDelete = $(icon.parents('li')[0]).attr('data-intersection-candelete');

            $li = $(icon.parents('li')[0]);
            //Listbox - list box || Listbox - List
            if ($li.parents('.property-box').length > 1 || $li.parents('li.cw-item').length > 0) {
                canDelete = false;
            }

            if (canDelete === "true" || canDelete === "undefined") {
                icon.show();
                icon.off('click.delete');
                icon.on('click.delete', removeFirstItem);
            }
        }
    }

    function addOnChangeItem(schema, obj, itemId, showError) {
        var drawOneLayout;
        var itemOutput = [];
        if (schema.LayoutDrawOneOptions !== null) {
            drawOneLayout = new cwApi.cwLayouts[schema.LayoutDrawOne](schema.LayoutDrawOneOptions);
        } else {
            drawOneLayout = new cwApi.cwLayouts.cwLayoutList(schema.LayoutOptions);
        }

        var l = cwApi.cwEditProperties.getLayoutWithTemplateOptions(drawOneLayout);
        l.disableOutputChildren();

        l.drawOneMethod = drawOneLayout.drawOneMethod.bind(l);
        l.drawOneMethod(itemOutput, obj.itemsById[itemId], undefined, false);
        obj.$ulContainer.append(itemOutput.join(''));
        obj.$ulContainer.find("li").last().addClass("newly-added");
        if (showError) {
            var o = [];
            o.push('<i class="cw-association-filtered-item fa fa-exclamation" title="', $.i18n.prop('editProperties_gs_associate_filter_warning'), '"></i>');
            obj.$ulContainer.find("li").last().find('div').first().append(o.join(''));
        }
        var mainContainer = $('li.' + schema.nodeID + '-value');
        showDeleteIconsAndSetActions(mainContainer);
    }

    function onSelectChange(evt, params) {

        if (params.selected) {
            var extraPropertyNames = [];
            var itemId = params.selected;
            var schema = cwApi.ViewSchemaManager.getNodeSchemaByIdForCurrentView(this.assoToLoad.nodeId);
            var that = this;
            if (!cwApi.isObjectEmpty(schema.Filters)) {
                Object.keys(schema.Filters).forEach(function (key) {
                    extraPropertyNames.push(key);
                });
                cwApi.CwRest.Diagram.getExistingObject(
                    schema.ObjectTypeScriptName,
                    itemId,
                    extraPropertyNames,
                    function (isSuccess, completeObj) {
                        if (isSuccess) {
                            var showError = isWarning(schema.Filters, completeObj.properties);
                            if (showError) {
                                cwApi.notificationManager.addNotification($.i18n.prop('EditModeAssociateItemFiltered'), 'error');
                            }
                            addOnChangeItem(schema, that, itemId, showError);
                        }
                    });
            } else {
                addOnChangeItem(schema, this, itemId, false);
            }
        }
    }

    function execFilterEdit(layout){
        var $a = $('a#cw-edit-mode-add-autocomplete-' + layout.layoutId + '-' + layout.objectId);
        var $assoBox = $('div.property-box.' + layout.layoutId + '-node-box.property-box-asso');
        var assoToLoad = {
            nodeId: layout.layoutId,
            sourceId : layout.objectId,
            targetObjectTypeScriptName : layout.mmNode.ObjectTypeScriptName,
            targetViewName: layout.options.CustomOptions['filtered-view']
        };
        $a.off('click').on('click', function(){
            cwApi.CwPendingEventsManager.setEvent("SetActionsOnAddToExistingLink");
            var $select = $assoBox.find('select.cw-edit-mode-association-autocomplete');
            $select.toggleClass('cw-hidden');
            $select.next('div.chosen-container').toggleClass('cw-hidden');

            if (!$select.hasClass('cw-hidden')) {

                var $ulContainer = $("ul.cw-list." + assoToLoad.nodeId);
                var alreadyAssociatedItems = {};

                $ulContainer.children('.cw-item').each(function (i, li) {
                    alreadyAssociatedItems[$(li).attr('data-item-id')] = true;
                });

                // is no more hidden
                getItems(assoToLoad, function (json) {
                    var itemsById = {};
                    setOptionListToSelect($select, json, itemsById, alreadyAssociatedItems);
                    $select.removeAttr('disabled');
                    $select.chosen({
                        no_results_text: $.i18n.prop('EditModeAssociateNoItemFound'),
                        display_selected_options: false
                    });

                    $select.off('change');
                    $select.on('change', onSelectChange.bind({
                        $ulContainer: $ulContainer,
                        assoToLoad: assoToLoad,
                        itemsById: itemsById,
                        editAassociationManager: this
                    }));
                });
            }
            cwApi.CwPendingEventsManager.deleteEvent("SetActionsOnAddToExistingLink");
        });
    }

    cwLayoutFilteredListBox.prototype.applyJavaScript = function () {
        var that = this;
        setTimeout(function(){
            execFilterEdit(that);
        }, 3000)
    };

    cwApi.cwLayouts.cwLayoutFilteredListBox = cwLayoutFilteredListBox;

}(cwAPI, jQuery));