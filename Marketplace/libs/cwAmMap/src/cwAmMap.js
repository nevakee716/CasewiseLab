/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */
/*global cwAPI, jQuery, AmCharts */
(function(cwApi, $) {
  "use strict";

  var MAX_REGION_COLOR = '#004488',
    AmMap;

  AmMap = function(options, viewSchema) {
    cwApi.extend(this, cwApi.cwLayouts.CwLayout, options, viewSchema);
    this.hasTooltip = true;
    cwApi.registerLayoutForJSActions(this);
    this.init = true;
  };

  function getInialMap(object, layout) {
    var m, resolution, mapFound = false,
      selectedMap, staticMap = layout.options.CustomOptions['initial-map'],
      mapPt = layout.options.CustomOptions['initial-map-scriptname'];
    if (object.properties && object.properties.hasOwnProperty(mapPt)) {
      if (object.properties[mapPt] !== '') {
        selectedMap = object.properties[mapPt].toLowerCase();
        mapFound = true;
      }
    }
    if (!mapFound) {
      selectedMap = staticMap;
    }
    resolution = (layout.options.CustomOptions['low-resolution']) ? 'Low' : 'High';
    for (m in AmCharts.maps) {
      if (AmCharts.maps.hasOwnProperty(m)) {
        if (m.toLowerCase() === (selectedMap + resolution).toLowerCase()) {
          return m;
        }
      }
    }
    return '';
  }

  AmMap.prototype.drawAssociations = function(output, associationTitleText, object) {
    /*jslint unparam: true*/
    var objectId, associationTargetNode, res, i, item,
      regions = [],
      markers = [],
      content,
      isocode, latlng, latlngArray,
      isoProperty = this.options.CustomOptions['iso-code-pt'],
      latlngProperty = this.options.CustomOptions['lat-lng-pt'];

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
    res = {};
    content = associationTargetNode;

    for (i = 0; i < content.length; i += 1) {
      item = content[i];
      if (isoProperty !== '') {
        isocode = item.properties[isoProperty];
        if (isocode !== '') {
          isocode = isocode.toUpperCase();
          regions.push({
            id: isocode,
            showAsSelected: true,
            cwobject: item,
            title: this.getDisplayItem(item, false),
            selectable: true
          });
        }
      }

      if (latlngProperty !== '') {
        latlng = item.properties[latlngProperty];
        if (latlng !== '') {
          latlngArray = latlng.split(',');
          markers.push({
            latitude: parseFloat(latlngArray[0]),
            longitude: parseFloat(latlngArray[1]),
            cwobject: item,
            type: 'circle',
            title: this.getDisplayItem(item, false),
            selectable: true
          });
        }
      }
    }


    res.regions = regions;
    res.markers = markers;
    output.push('<div class="AmMap cw-visible AmMap-', this.nodeID, ' cw-jvector-map cw-ammap cw-ammap-', objectId, '" id="cw-map-', this.nodeID, '"></div>');
    this.data = res;
    this.mainObject = object;
  };

  AmMap.prototype.applyJavaScript = function() {
    var that = this,
      libsToLoad;
    if (cwApi.isUndefined(this.data)) {
      return;
    }
    if (this.init) {
      $('#cw-map-' + this.nodeID).parents('.popout').toggleClass('popout-cw-map');
      this.init = false;
      if (!cwApi.isDebugMode()) {
        libsToLoad = ['modules/ammap/ammap.min.js'];
        // AsyncLoad
        cwApi.customLibs.aSyncLayoutLoader.loadUrls(libsToLoad, function(error) {
          if (error === null) {
            that.createMap();
          } else {
            cwAPI.Log.Error(error);
          }
        });
      } else {
        this.createMap();
      }
    }
  };

  AmMap.prototype.createMap = function() {
    var that = this,
      map, goToPage, handleClick, handleDrawn;

    goToPage = function(item) {
      if (!cwApi.isUndefined(item)) {
        var hash;
        if (that.options.HasLink === true) {
          hash = cwApi.getSingleViewHash(item.objectTypeScriptName, item.object_id);
          cwApi.updateURLHash(hash);
        }
      }
    };

    handleClick = function(e){
      goToPage(e.mapObject.cwobject);
    };

    handleDrawn = function(){
      $('#cw-map-'+that.nodeID).find('path[fill="' + MAX_REGION_COLOR + '"]').attr('cw-selected-zone', true).css('cursor', 'pointer');
    };

    $('#cw-map-' + this.nodeID).css('height', cwApi.getFullScreenHeight());

    this.intialMap = getInialMap(this.mainObject, this);
    if (this.intialMap === '') {
      cwApi.notificationManager.addError($.i18n.prop('anmap_missing_map'));
      return;
    }
    map = AmCharts.makeChart('cw-map-' + this.nodeID, {
      'type': 'map',
      'dataProvider': {
        'map': that.intialMap,
        'getAreasFromMap': true,
        'areas': that.data.regions,
        'images': that.data.markers
      },
      'areasSettings': {
        'selectedColor': MAX_REGION_COLOR
      },
      'language': cwApi.getSelectedLanguage(),
      'addClassNames': true,
      'mouseWheelZoomEnabled': true,
      'listeners': [{
        'event': 'clickMapObject',
        'method': handleClick
      }, {
        'event': 'drawn',
        'method': handleDrawn
      }]
    });

  };


  cwApi.cwLayouts.CwAmMap = AmMap;
}(cwAPI, jQuery));