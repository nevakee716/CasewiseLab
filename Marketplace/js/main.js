 /*jslint browser:true*/
/*global cwAPI, jQuery, cwTabManager*/
(function(cwApi, $) {
  'use strict';

  	if(cwApi.CwHomePage === undefined) cwApi.CwHomePage = {};
    cwApi.CwHomePage.outputHomePageCustom = function () {
        cwApi.updateURLHash(cwApi.getSingleViewHash("cw_user_home", cwApi.currentUser.ID));
        return undefined;
    };


  function hideEmptyMenu(){
    var $menus = $('ul#main_menu > li.cw-menu-zone').not('.list-tasks, .list-notifications, .list-favourites');
    $menus.each(function (i, item) {
      var $submenus = $(item).children('ul.sub-level').children('li.cw-menu-zone');
      if ($submenus.length === 0) {
        $(item).hide();
      }
    });
  }


    /********************************************************************************
    Custom Action for Single and Index Page : See Impact here http://bit.ly/2qy5bvB
    *********************************************************************************/
    cwCustomerSiteActions.doActionsForSingle_Custom = function(rootNode) {
        var currentView, url, i, cwView;
        currentView = cwAPI.getCurrentView();

        if (currentView) cwView = currentView.cwView;
        for (i in cwAPI.customLibs.doActionForSingle) {
            if (cwAPI.customLibs.doActionForSingle.hasOwnProperty(i)) {
                if (typeof(cwAPI.customLibs.doActionForSingle[i]) === "function") {
                    cwAPI.customLibs.doActionForSingle[i](rootNode, cwView);
                }
            }
        }
    };

    cwCustomerSiteActions.doActionsForIndex_Custom = function(rootNode) {
        var currentView, url, i, cwView;
        currentView = cwAPI.getCurrentView();

        if (currentView) cwView = currentView.cwView;
        for (i in cwAPI.customLibs.doActionForIndex) {
            if (cwAPI.customLibs.doActionForIndex.hasOwnProperty(i)) {
                if (typeof(cwAPI.customLibs.doActionForIndex[i]) === "function") {
                    cwAPI.customLibs.doActionForIndex[i](rootNode, cwView);
                }
            }
        }
    };


    if(cwApi.CwHomePage === undefined) cwApi.CwHomePage = {};
    cwApi.CwHomePage.outputHomePageCustom = function () {
       	cwApi.updateURLHash(cwApi.getSingleViewHash("cw_user_home", cwApi.currentUser.ID));
       	hideEmptyMenu();
       	return undefined;
   	};

    cwCustomerSiteActions.piwikTrackerIndex = function(rootNode) {
    	var piwikTracker,currentView,cwView;
    	currentView = cwAPI.getCurrentView();
    	if (currentView) cwView = currentView.name;
    	else cwView = "unknown";
        try {
        	if(cwApi.customLibs.piwikTracker === undefined) {
        		piwikTracker = Piwik.getTracker("http://casewise-lab.westeurope.cloudapp.azure.com/piwik/piwik.php",3);
        		cwApi.customLibs.piwikTracker = piwikTracker;
        		piwikTracker.setUserId(cwAPI.currentUser.FirstName + " "  + cwAPI.currentUser.LastName);
        		piwikTracker.setSiteId('1');
        		piwikTracker.enableLinkTracking();
        	} else {
        		piwikTracker = cwApi.customLibs.piwikTracker;
        	}
        	piwikTracker.setCustomDimension(2, currentView.cwView);
        	piwikTracker.setDocumentTitle(cwView);
        	piwikTracker.trackPageView();
        } catch(e) {
        	console.log(e);
        }
    };

    cwCustomerSiteActions.piwikTrackerSingle = function(rootNode) {
    	var piwikTracker,currentView,cwView;
    	currentView = cwAPI.getCurrentView();
    	if (currentView) cwView = currentView.cwView;
    	else cwView = "unknown";
        try {
        	if(cwApi.customLibs.piwikTracker === undefined) {
        		piwikTracker = Piwik.getTracker("http://casewise-lab.westeurope.cloudapp.azure.com/piwik/piwik.php",3);
        		cwApi.customLibs.piwikTracker = piwikTracker;
        		piwikTracker.setUserId(cwAPI.currentUser.FirstName + " "  + cwAPI.currentUser.LastName);
        		piwikTracker.setSiteId('1');
        		piwikTracker.enableLinkTracking();
        	} else {
        		piwikTracker = cwApi.customLibs.piwikTracker;
        	}
        	piwikTracker.setCustomDimension(2, cwView);

        	piwikTracker.setDocumentTitle(cwAPI.mm.getObjectType(rootNode.objectTypeScriptName).name + " / " + rootNode.properties.name.replace("/","-"));
        	piwikTracker.trackPageView();

        } catch(e) {
        	console.log(e);
        }
    };




    /********************************************************************************
    Configs : add trigger for single page
    *********************************************************************************/
    if (cwAPI.customLibs === undefined) {
        cwAPI.customLibs = {};
    }
    if (cwAPI.customLibs.doActionForSingle === undefined) {
        cwAPI.customLibs.doActionForSingle = {};
    }
    if (cwAPI.customLibs.doActionForIndex === undefined) {
        cwAPI.customLibs.doActionForIndex = {};
    }
    cwAPI.customLibs.doActionForIndex.hideEmptyMenu = hideEmptyMenu;
    cwAPI.customLibs.doActionForSingle.hideEmptyMenu = hideEmptyMenu;
    cwAPI.customLibs.doActionForIndex.piwik = cwCustomerSiteActions.piwikTrackerIndex; 
    cwAPI.customLibs.doActionForSingle.piwik = cwCustomerSiteActions.piwikTrackerSingle;

}(cwAPI, jQuery));



