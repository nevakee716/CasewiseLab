 /*jslint browser:true*/
/*global cwAPI, jQuery, cwTabManager*/
(function(cwApi, $) {
  'use strict';

 var PsgDiagramSearchManager;

  PsgDiagramSearchManager = function() {
    this.PsgDiagramSearch = {};
  };

  PsgDiagramSearchManager.prototype.init = function(diagramViewer) {
    this.PsgDiagramSearch[diagramViewer.id] = new cwApi.customLibs.PsgDiagramSearch(diagramViewer); 
  };
 
  PsgDiagramSearchManager.prototype.setGlobalAlphaShape = function(diagramViewer,shape) {
    if(this.PsgDiagramSearch.hasOwnProperty(diagramViewer.id)) {
      this.PsgDiagramSearch[diagramViewer.id].setGlobalAlphaShape(diagramViewer,shape); 
    }
  };

  PsgDiagramSearchManager.prototype.setGlobalAlphaJoiner = function(diagramViewer,joiner) {
    if(this.PsgDiagramSearch.hasOwnProperty(diagramViewer.id)) {
      this.PsgDiagramSearch[diagramViewer.id].setGlobalAlphaJoiner(diagramViewer,joiner);  
    }
  };

  PsgDiagramSearchManager.prototype.setHighlightShape = function(diagramViewer,shape) {
    if(this.PsgDiagramSearch.hasOwnProperty(diagramViewer.id)) {
      this.PsgDiagramSearch[diagramViewer.id].setHighlightShape(diagramViewer,shape);  
    }
  };

  PsgDiagramSearchManager.prototype.setHighlightJoiner = function(diagramViewer,joiner) {
    if(this.PsgDiagramSearch.hasOwnProperty(diagramViewer.id)) {
      this.PsgDiagramSearch[diagramViewer.id].setHighlightJoiner(diagramViewer,joiner);  
    }
  };

  PsgDiagramSearchManager.prototype.resetGlobalAlpha = function(diagramViewer,shape) {
    if(this.PsgDiagramSearch.hasOwnProperty(diagramViewer.id)) {
      this.PsgDiagramSearch[diagramViewer.id].resetGlobalAlpha(diagramViewer,shape);  
    }
  };

  PsgDiagramSearchManager.prototype.register = function() {
    cwApi.pluginManager.register('CwDiagramViewer.initWhenDomReady', this.init.bind(this));
    cwApi.pluginManager.register('CwDiagramViewer.beforeDrawShape', this.setGlobalAlphaShape.bind(this));
    cwApi.pluginManager.register('CwDiagramViewer.beforeDrawJoiner', this.setGlobalAlphaJoiner.bind(this));
    cwApi.pluginManager.register('CwDiagramViewer.afterDrawShape', this.setHighlightShape.bind(this));
    cwApi.pluginManager.register('CwDiagramViewer.afterDrawJoiner', this.setHighlightJoiner.bind(this));
    cwApi.pluginManager.register('CwDiagramViewer.beforeDrawRegionJoiner', this.setGlobalAlphaJoiner.bind(this));
    cwApi.pluginManager.register('CwDiagramViewer.afterDrawRegionJoiner', this.resetGlobalAlpha.bind(this));
  };

  cwApi.CwPlugins.PsgDiagramSearch = PsgDiagramSearchManager;

  /********************************************************************************
  Activation
  *********************************************************************************/
  (new cwApi.CwPlugins.PsgDiagramSearch()).register(); 

}(cwAPI, jQuery));