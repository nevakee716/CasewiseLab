/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */

/*global cwAPI:true, jQuery:true*/
(function(cwApi, $) {
    'use strict';

    function getQueryStringValue(key) {  
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
    }; 
    
    var modelLoader = function() {

        /******************Part 1: Header @todo: set an available link for 'aide'**********************/
        // aide document on the top of this page
        var aideDocumentInHeader = {
            'id': "aide",
            "title": "Help",
            "titleFR": "Aide",
            "url": "https://erwininc-my.sharepoint.com/:v:/g/personal/nmontoya_erwin_com/EZTW0qJ2G_RPq9JWkIMO8t8Bf8uAmrq7bNQlzwBlE66jFg?e=bMqOrR",
            "urlFR": "https://erwininc-my.sharepoint.com/:v:/g/personal/nmontoya_erwin_com/EZTW0qJ2G_RPq9JWkIMO8t8Bf8uAmrq7bNQlzwBlE66jFg?e=bMqOrR"
        };

        var textCNIL = "Le service portail des processus dispose de moyens informatiques destinés à gérer plus facilement les processus et documents. Les informations enregistrées sont réservées à l’usage du service concerné et ne peuvent être communiquées qu’aux destinataires suivants : employés de Erwin. Conformément aux articles 39 et suivants de la loi « Informatique et Libertés », toute personne peut obtenir communication et, le cas échéant, rectification ou suppression des informations la concernant, en s’adressant au service Erwin Service Desk.[toute personne peut également, pour des motifs légitimes, s’opposer au traitement des données la concernant]";
        /*********************Part 2: Métier content @todo: once the site is activated from evolve
        replace "notActivated" bloc by site content
        **********************/
        // Left part => Métier
        var GDPR = {
            "id": "content-GDPR",
            "name": "metiers",
            "title": "GDPR",
            "titleFR": "RGPD",
            "webPartClassName": "metier",
            "blocClassName": "bloc-white",
            "blocContent": [{
                "type": "hash",
                "siteName": "gdpr",
                "siteNameFR": "rgdp",
                "hash" : "/index.html",
                "titleFR": "RGPD",
                "title": "GDPR"
            }]
        };


        /*********************Part 3: Pilotage content @todo: once the site is activated from evolve
        replace "notActivated" bloc by site content
        **********************/
        // Left part => Pilotage
        var EdgePlatforme = {
            "id": "content-edge-platforme",
            "name": "pilotage",
            "title": "Edge Platform",
            "titleFR": "Plate-forme Edge",
            "webPartClassName": "bloc-pilotage",
            "blocClassName": "bloc-orange",
            "blocContent": [            {
                "type": "url",
                "url": "https://myerwin.io/dg",
                "title": "DG",
                "color": {
                    "color" : "#FFFFFF",
                    "background" : "#ffc107",                    
                }
            }, {
                "type": "url",
                "url": "https://myerwin.io/ea",
                "title": "Agile",
                "color": {
                    "color" : "#FFFFFF",
                    "background" : "#3f51b5",                    
                }
            },             {
                "type": "url",
                "url": "https://myerwin.io/dm",
                "title": "DM NoSQL",
                "color": {
                    "color" : "#FFFFFF",
                    "background" : "#ef5350",                    
                }
            }]
        };
        /*********************Part 4: Appui content @todo: once the site is activated from evolve
        replace "notActivated" bloc by site content or diagram content
        **********************/
        // Left part => Appui
        var Architecture = {
            "id": "content-architecture",
            "name": "pilotage",
            "titleFR": "Architecture d'Entreprise",
            "title": "Erwin EA/BP",
            "webPartClassName": "bloc-support",
            "blocClassName": "bloc-orange",
            "blocContent": [            {
                "type": "hash",
                "siteName": "gdpr",
                "siteNameFR": "rgdp",
                "hash" : "/index.html#/cwtype=index&cwview=index_processus",
                "titleFR": "Métiers",
                "title": "Business"
            }, {
                "type": "hash",
                "siteName": "gdpr",
                "siteNameFR": "rgdp",
                "hash" : "/index.html#/cwtype=index&cwview=index_fonctionnalites&lang=en&cwtabid=tab1",
                "titleFR": "Fonctionnel",
                "title": "Functionnal"
            },{
                "type": "hash",
                "siteName": "gdpr",
                "siteNameFR": "rgdp",
                "hash" : "/index.html#/cwtype=index&cwview=index_portefeuilles_applicatifs&lang=en",
                "titleFR": "Applicatif",
                "title": "Application"
            }]
        };


        /***********************************************************************************************/
        var allSitesByName = {},
            webPartManager = [],
            BlocManager = {};
        BlocManager.loadBloc = function(blocClassName, blocContent, output) {
            var blocType = blocContent.type;
            var particule,title;
            particule = getQueryStringValue("lang").toUpperCase();
            if(particule === undefined || particule === "") {
                particule = "FR";
            } 
            if (!cwAPI.isUndefined(BlocManager['loadBloc_' + blocType])) {
                BlocManager['loadBloc_' + blocType](blocClassName, blocContent, output,particule);
            }
        };
        BlocManager.loadBloc_site = function(className, site, output,particule) {
            
            var m = allSitesByName[site.siteName];
            if(m === undefined) m = {};
            output.push('<a href="', cwApi.getServerPath(), 'sites/', m[SiteName + particule], '/index.html" title="', m.SiteDisplayName, '">');
            output.push('m.SiteDisplayName </a>');
        };

        BlocManager.getQueryStringValue = function(key) {  
          return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
        }; 
        //console.log(getQueryStringValue("name"));


        BlocManager.loadBloc_diagram = function(className, blocContent, output,particule) {
            var m = allSitesByName[blocContent["siteName" + particule]];
            if(m === undefined) m = {};
            output.push('<a class="modelLink" href="', cwApi.getServerPath(), 'sites/', m.SiteName, '/index.html#/cwtype=single&cwview=diagram&cwuuid=', blocContent.diagramUUID, '" title="', blocContent.title, '">');
            output.push('<div>' + blocContent.title + '</div></a>');
        };

        BlocManager.loadBloc_url = function(className, blocContent, output,particule) {
            var m = allSitesByName[blocContent["siteName" + particule]];
            if(m === undefined) m = {};
            var style = "";
            if(blocContent.color) {
                style = 'style="color: ' + blocContent.color.color + '; ';
                style += 'background-color: ' + blocContent.color.background + ';"';
            }
            output.push('<a target="_blank" class="modelLink" ',style,' href="',blocContent.url,  '">');
            output.push('<div>' + blocContent.title + '</div></a>');

        };

        BlocManager.loadBloc_hash = function(className, blocContent, output,particule) {
            var m = allSitesByName[blocContent["siteName" + particule]];
            if(m === undefined) m = {};
            var hash = blocContent.hash;
            if(hash.indexOf("{userID}") !== -1) {
            	hash =  hash.replace("{userID}",cwApi.currentUser.ID);
            }
            output.push('<a class="modelLink" href="', cwApi.getServerPath(), 'sites/', m.SiteName, hash, '">');
            output.push('<div>' + blocContent["title" + particule] + '</div></a>');
        };

        BlocManager.loadBloc_linksInBloc = function(className, blocContent, output,particule) {
            var m = allSitesByName[blocContent["siteName" + particule]];            
            if(m === undefined) m = {};
            output.push('<div class="bloc_a_sup modelLink">');
            var diagrams = blocContent.diagrams;
            for (var i = 0; i < diagrams.length; i++) {
                var diagram = diagrams[i];
                output.push('<a href="', cwApi.getServerPath(), 'sites/', diagram.siteName, '/index.html#/cwtype=single&cwview=diagram&cwuuid=', diagram.diagramUUID, '" title="', diagram.title, '">');
                //  output.push('<a href="', link.url, '" target="_blank">');
                output.push('<div>');
                output.push(diagram.title);
                output.push('</div>');
                output.push('</a>');
            }
            output.push('</div>');
        };
        BlocManager.loadBloc_notActivated = function(className, bloc, output) {
            output.push('<div class="modelLink" > <div class="text">', bloc.title, '</div> </div>');
        };

        BlocManager.loadBloc_circleLinks = function(className, blocContent, output,particule) {
            output.push('<div id="bloc-circle">');
            var links = blocContent.links;
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                output.push('<a class="link-circle" id="', link.id, '" href="', link.url.replace("#particule#",particule), '" target="_blank">');
                output.push('<span id="', link.cicleStyleId, '">');
                output.push('<center>', link.title, '</center>');
                output.push('</span></a>');
            }
            output.push('</div>');
        };
        BlocManager.loadBloc_organisationSite = function(className, bloc, output) {

            if (bloc.siteName in allSitesByName) {
                var organisation = allSitesByName[bloc.siteName];
                output.push(' <div id="bloc-organization">');
                output.push(' <div class="label_organisation">');
                output.push(' <a id="bloc-organization-link" href=', bloc.url,' ><i class="fa fa-download" aria-hidden="true"></i></a>');
                output.push('<a href="', cwApi.getServerPath(), 'sites/', organisation.SiteName, '/index.html#/cwtype=index&cwview=',bloc.cwview,'" title="', organisation.SiteDisplayName, '">' , organisation.SiteDisplayName, '</a>');
                output.push('</div>');
                output.push(' <img src="', cwApi.getCommonContentPath(), 'images/home/organization.png" alt="Organigramme" style="border:0px;"/>');
                output.push('</div>');
            } else {
                var organisation = {};
                // output.push(' <a href="organigramme/index.html">');
                output.push(' <div id="bloc-organization">');
                output.push(' <div class="label_organisation">');
                output.push('<a id="bloc-organization-link" href=', bloc.url,' ><i class="fa fa-download" aria-hidden="true"></i></a>');
                output.push('<a href="', cwApi.getServerPath(), 'sites/', organisation.SiteName, '/index.html#/cwtype=index&cwview=',bloc.cwview,'" title="', organisation.SiteDisplayName, '">' , "Organisation", '</a>');
                output.push('</div>');
                output.push(' <img src="', cwApi.getCommonContentPath(), 'images/home/organization.png" alt="Organigramme" style="border:0px;"/>');
                output.push('</div>');

            };
        };

        webPartManager.loadWebPart = function(webPart, output) {

            var particule;
            particule = getQueryStringValue("lang").toUpperCase();
            if(particule === undefined || particule === "") particule = "FR";
            output.push('<div id="', webPart.id, '" class="', webPart.webPartClassName, '">');
            output.push('<div id="label-metier" class="label">');
            output.push(webPart["title" + particule]);
            output.push('</div>');

            var blocs = webPart.blocContent;
            for (var i = 0; i < blocs.length; i++) {
                var bloc = blocs[i];
                BlocManager.loadBloc(webPart.blocClassName, bloc, output);
            }
            output.push('</div>');
        };

        webPartManager.loadLeftWebParts = function(output) {
            output.push('<div id="content-left">');
            webPartManager.loadWebPart(GDPR, output);
            //output.push('<div id="content-left-middle">');
            webPartManager.loadWebPart(Architecture, output);
           // output.push('</div><div id="content-left-right">');
            webPartManager.loadWebPart(EdgePlatforme, output);
            output.push('</div>');
        };

        webPartManager.loadRightWebParts = function(output) {
            output.push('<div id="content-right">');
            var blocs = rightWebPart.blocContent;
            for (var i = 0; i < blocs.length; i++) {
                var bloc = blocs[i];
                BlocManager.loadBloc(rightWebPart.blocClassName, bloc, output);
            }
            output.push('</div>');
        };

        webPartManager.loadCustomWebParts = function() {
            var output = [];
            output.push('<img id="backgroundHome" src="/evolve/Common/images/home/home-bg.jpg"></img>');
            outputHeader(output);
            output.push('<div id="page-content-home">');

            webPartManager.loadLeftWebParts(output);
            //webPartManager.loadRightWebParts(output);
            output.push('</div>');
            output.push('<div class="clear"></div>');
            outputFooter(output);

            $('#content').html(output.join(''));
        };

        function outputHeader(output) {
            var particule,title;
            particule = getQueryStringValue("lang").toUpperCase();
            if(particule === undefined || particule === "") { particule = "FR";}

            output.push('<div id="page-title">');
            output.push('<span class="erwin-logo"><img src="', cwApi.getCommonContentPath(), 'images/home/logo_erwin.png"></span>');
            output.push(' <div class="news"> <marquee direction="left" scrollamount="5" > </marquee></div>');
            output.push('<div class="aide"> ');
            output.push('<a href="#" data-tooltip data-tooltip-label="Conditions CNIL" data-tooltip-message="' + textCNIL + '">CNIL</a>');     
			output.push('</div>');
            output.push('<div class="aide"> <a href="', aideDocumentInHeader["url" + particule], '" target="_blank">', aideDocumentInHeader["title" + particule], '</a> </div>');
            output.push('</div>');



        };

        function outputFooter(output) {


        
            var particule,title;
            particule = getQueryStringValue("lang").toUpperCase();
            if(particule === "FR") {
                title = "Bienvenue sur la plate-forme de démonstration Erwin France";
            } else {
                title = "Welcome to the demonstration platform of Erwin";
                title = "Bienvenue sur la plate-forme de démonstration Erwin France";
            }

        };

        var loadModelToSelect = function(err, res, callback) {
            function getQueryStringValue(key) {  
                return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
            }; 
            /*jslint unparam:true, browser:true*/
            var o;
            if (cwApi.isModelSelectionPage() === true) {
                
                var particule,title;
                particule = getQueryStringValue("lang").toUpperCase();
                if(particule === "FR") {
                    title = "Bienvenue sur la plate-forme de démonstration Erwin France";
                } else {
                    title = "Welcome to the demonstration platform of Erwin";
                    title = "Bienvenue sur la plate-forme de démonstration Erwin France";
                }
    
                document.title = title;
                cwApi.updatePageTitle(title);

                //   cwApi.updatePageTitle($.i18n.prop('multiModel_mySites'));
                res.User.Sites.forEach(function(m) {
                    allSitesByName[m.SiteName] = m;

                });

                cwApi.cwMenuManager.loadMenu();
                cwApi.siteLoadingPageFinish();

                if (res.User.Sites.length === 0) {
                    o = ['<div class="cwEvolveSiteNoSiteLoaded">', $.i18n.prop('MultiModelNoSiteAvailable'), '</div>'];
                }

                webPartManager.loadCustomWebParts();

            }
            if (cwApi.isFunction(callback)) {
                return callback(err, res.User);
            }
        };
        return {
            loadModelToSelect: loadModelToSelect
        };
    };
    cwApi.modelLoader = modelLoader();
}(cwAPI, jQuery));