/* Copyright (c) 2012-2016 Casewise Systems Ltd (UK) - All rights reserved */

/*global cwAPI, jQuery, cwConfigurationExecuteMapping */
(function (cwApi, $) {
    "use strict";
  
  var cwLayoutExecuteOperation;

  cwLayoutExecuteOperation = function (options, viewSchema) {
    cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema);
    this.drawOneMethod = this.drawOne.bind(this);
    cwApi.registerLayoutForJSActions(this);

  };

  cwLayoutExecuteOperation.prototype.applyJavaScript = function () {
    var that = this;
    if (this.options.CustomOptions['evod-url'] === ''){
      this.options.CustomOptions['evod-url'] = window.location.origin + '/evolveondemand/';
    }
    if (cwApi.isUndefined(this.mainObject.properties.type) || !cwConfigurationExecuteMapping[this.mainObject.properties.type]){
      cwApi.notificationManager.addError($.i18n.prop('execute_config_type_missing'));
      return;
    }
    $('.execute-operation-button').removeClass('cw-hidden');
    $('.execute-operation-button').click(function(){
      that.execute($(this).attr('data-object-id'), $(this).attr('data-object-type'));
    });
  };

  cwLayoutExecuteOperation.prototype.execute = function(objectId, queryString) {
    var url = this.options.CustomOptions['evod-url'],
     error = { 'status': 'Ko', "result": 'Impossible to contact Evolve On Demand' };
    if (!url[url.length - 1] === '/') {
      url += '/';
    }
    url += queryString + '/' + cwApi.cwConfigs.ModelFilename.toLowerCase() + '/' +objectId;
    $('.execute-result-' + objectId).addClass(' cw-hidden');
    $('.execute-pending-' + objectId).removeClass(' cw-hidden');

    cwApi.cwDoGETQuery(error, url, function (res) {
      if (cwApi.statusIsKo(res)) {
        var msg = cwApi.isUndefined(res.result) ? res : cwApi.isUndefined(res.result.Message) ? res.result : res.result.Message;
        cwApi.notificationManager.addError(msg);
        $('.execute-pending-' + objectId).addClass('cw-hidden');
        $('.icon-execute-result-ko-' + objectId).removeClass('cw-hidden');
        $('span.execute-result-' + objectId).removeClass('cw-hidden');
        $('span.execute-result-' + objectId).text(msg);
        return;
      }
      $('.execute-pending-' + objectId).addClass('cw-hidden');
      cwApi.notificationManager.addNotification(res.result);
      $('.icon-execute-result-ok-' + objectId).removeClass('cw-hidden');
    });
  };

  cwLayoutExecuteOperation.prototype.drawOne = function (output, item, callback, nameOnly) {
    var itemDisplayName, cleanItemName, uid, canDelete, newObject, type;
    this.mainObject = item;
    try {
      type = cwConfigurationExecuteMapping[item.properties.type];
    } catch (error) {
      
    }
    
    if (!cwApi.isUndefined(item.is_new) && item.is_new === true) {
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

    output.push("<li ", cwApi.cwLayouts.cwLayoutList.addHtmlDataItems(uid, cleanItemName, item.object_id, canDelete, newObject, item.objectTypeScriptName), "class='cw-item ", this.nodeID, " ", this.nodeID, "-", item.object_id, " ", this.options.NodeCSSClass, "'>", "<div class='", this.nodeID, " ", this.options.NodeCSSClass, "'>");
    cwApi.cwEditProperties.outputAssociationDeleteItem(output, item.nodeID);
    output.push(itemDisplayName, '<div class="execute-operation-container bootstrap-iso">');
    output.push('<button data-object-type="', type, '" data-object-id="', item.object_id, '" class="execute-operation-button cw-hidden">', $.i18n.prop('btn_execute_operation'), '</button>');
    output.push('<div class="execute-operation-result" id="execute-operation-result-', item.object_id, '">');
    output.push('<i class="execute-pending-', item.object_id, ' icon-pending-', item.object_id, ' fa fa-circle-o-notch fa-spin cw-hidden result-pending"></i>');
    output.push('<i class="execute-result-', item.object_id, ' icon-execute-result-ok-', item.object_id, ' fa fa-check cw-hidden result-ok"></i>');
    output.push('<i class="execute-result-', item.object_id, ' icon-execute-result-ko-', item.object_id, ' fa fa-times cw-hidden result-ko"></i>');
    output.push('<span class="execute-result-', item.object_id, ' cw-hidden execute-operation-result-message-error"></span></div>');
    output.push('</div></div>');

    this.outputChildren(output, item);

    output.push("</li>");
  };

  cwApi.cwLayouts.cwLayoutExecuteOperation = cwLayoutExecuteOperation;

}(cwAPI, jQuery));