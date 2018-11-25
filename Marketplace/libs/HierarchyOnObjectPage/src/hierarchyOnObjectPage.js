(function(cwApi, $) {
    "use strict";
    // config
    var removeDiagramPopOut = true,
        historyBrowser = true;



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

    cwCustomerSiteActions.breadCrumbHierarchy = {};
    cwCustomerSiteActions.breadCrumbHierarchy.history = [];
    if (historyBrowser) cwCustomerSiteActions.breadCrumbHierarchy.historyPages = [];


    cwCustomerSiteActions.breadCrumbHierarchy.left = {};
    cwCustomerSiteActions.breadCrumbHierarchy.left.views = {};

    cwCustomerSiteActions.breadCrumbHierarchy.right = {};
    cwCustomerSiteActions.breadCrumbHierarchy.right.views = {};

    cwCustomerSiteActions.breadCrumbHierarchy.create = function(rootNode) {
        var hierarchyListLeft = document.querySelectorAll('.cw-list.BreadcrumbHierarchyLeft')[0];
        var hierarchyLeft = document.createElement('div');
        var fragmentLeft = document.createElement('div');

        var hierarchyListRight = document.querySelectorAll('.cw-list.BreadcrumbHierarchyRight')[0];
        var hierarchyRight = document.createElement('div');
        var fragmentRight = document.createElement('div');

        var title = document.getElementsByClassName('page-title')[0];
        var titletxt = title.innerText;
        var listToHideLeft, listToHideRight, displayRight = true,
            displayLeft = true;

        // Store the hierarchy list for the view right side
        if (cwCustomerSiteActions.breadCrumbHierarchy.right.views.hasOwnProperty(cwAPI.getCurrentView().cwView + rootNode.object_id)) {
            hierarchyRight = cwCustomerSiteActions.breadCrumbHierarchy.right.views[cwAPI.getCurrentView().cwView + rootNode.object_id];
            // hide the list that may appear when use preview page function

            listToHideRight = document.getElementsByClassName('cw-list BreadcrumbHierarchyRight');
            if (listToHideRight && listToHideRight.hasOwnProperty(length) && listToHideRight !== []) {
                listToHideRight[0].style.display = "none";
            }
        } else if (hierarchyListRight) { // Create the hierachyList
            fragmentLeft.appendChild(hierarchyListRight);
            hierarchyRight = cwCustomerSiteActions.breadCrumbHierarchy.createElement(fragmentLeft, hierarchyRight, "right");
            cwCustomerSiteActions.breadCrumbHierarchy.right.views[cwAPI.getCurrentView().cwView + rootNode.object_id] = hierarchyRight;
        } else {
            displayRight = false;
        }

        // Store the hierarchy list for the view
        if (cwCustomerSiteActions.breadCrumbHierarchy.left.views.hasOwnProperty(cwAPI.getCurrentView().cwView + rootNode.object_id)) {
            hierarchyLeft = cwCustomerSiteActions.breadCrumbHierarchy.left.views[cwAPI.getCurrentView().cwView + rootNode.object_id];
            // hide the list that may appear when use preview page function
            listToHideLeft = document.getElementsByClassName('cw-list BreadcrumbHierarchyLeft');
            if (listToHideLeft && listToHideLeft.hasOwnProperty(length) && listToHideLeft !== []) {
                listToHideLeft[0].style.display = "none";
            }
        } else if (hierarchyListLeft) { // Create the hierachyList
            fragmentRight.appendChild(hierarchyListLeft);
            hierarchyLeft = cwCustomerSiteActions.breadCrumbHierarchy.createElement(fragmentRight, hierarchyLeft, "left");
            cwCustomerSiteActions.breadCrumbHierarchy.left.views[cwAPI.getCurrentView().cwView + rootNode.object_id] = hierarchyLeft;
        } else {
            displayLeft = false;
        }



        var htmlPagesHistory = cwCustomerSiteActions.breadCrumbHierarchy.historyPages;
        var samePage = false,
            historyAlreadyExist = false,
            pageHTML = {},
            i = 0;
        pageHTML.title = titletxt;
        pageHTML.html = window.location.hash;
        if (document.getElementsByClassName("HierarchyLink").length > 0) {
            historyAlreadyExist = true;
            samePage = true;
        }
        if (htmlPagesHistory && htmlPagesHistory.length > 1 && titletxt === htmlPagesHistory[htmlPagesHistory.length - 1].title) {
            samePage = true;
            i = 1;
        }

        if (displayLeft || displayLeft) {
            cwCustomerSiteActions.breadCrumbHierarchy.hideList();
            cwCustomerSiteActions.breadCrumbHierarchy.checkHistory(hierarchyRight);
            cwCustomerSiteActions.breadCrumbHierarchy.checkHistory(hierarchyLeft);
        } else {
            if (htmlPagesHistory && htmlPagesHistory.length > 0 && historyAlreadyExist === false) {
                if (htmlPagesHistory.length > (1 + i) && htmlPagesHistory[htmlPagesHistory.length - (2 + i)].html == pageHTML.html) {
                    hierarchyRight = cwCustomerSiteActions.breadCrumbHierarchy.createHistoryPageElement(htmlPagesHistory[htmlPagesHistory.length - (1 + i)], true);
                    if (htmlPagesHistory.length > (2 + i)) {
                        hierarchyLeft = cwCustomerSiteActions.breadCrumbHierarchy.createHistoryPageElement(htmlPagesHistory[htmlPagesHistory.length - (3 + i)]);
                    }
                    htmlPagesHistory.pop();
                    htmlPagesHistory.pop();
                } else {
                    hierarchyLeft = cwCustomerSiteActions.breadCrumbHierarchy.createHistoryPageElement(htmlPagesHistory[htmlPagesHistory.length - (1 + i)]);
                }
            }
        }

        if (samePage === false || historyAlreadyExist == false) cwCustomerSiteActions.breadCrumbHierarchy.historyPages.push(pageHTML);


        // put the hierarchy on the title
        if (title && hierarchyLeft) {
            title.insertBefore(hierarchyLeft, title.firstChild);
        }
        // put the hierarchy on the title
        if (title && hierarchyRight) {
            title.appendChild(hierarchyRight);
        }


        if (cwCustomerSiteActions.breadCrumbHierarchy.history.indexOf(titletxt) === -1) {
            cwCustomerSiteActions.breadCrumbHierarchy.history.push(titletxt);
        }
        if (removeDiagramPopOut == true) {
            $("div.page-title span.cdsEnhancedDiagramPopOutIcon").remove();
        }



    };

    cwCustomerSiteActions.breadCrumbHierarchy.createElement = function(elem, hierarchy, direction) {
        var childUl, childLi, bDirection = true;
        if (direction == "right") bDirection = false;
        if (elem) {
            if (elem.childElementCount === 0) {
                return hierarchy;
            } else if (elem && elem.childElementCount === 1) { // un seul node de hierarchy
                childUl = elem.children[0];
                if (childUl && childUl.childElementCount === 1) { // un seul node de hierarchy
                    childLi = childUl.children[0];
                    if (childLi && childLi.childElementCount === 2) { // un seul element parent
                        if (bDirection) hierarchy.insertBefore(childLi.firstChild, hierarchy.firstChild);
                        else hierarchy.appendChild(childLi.firstChild);
                        return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childLi.lastChild, hierarchy, direction);
                    } else {
                        childLi.hidden = true;
                        if (bDirection) {
                            hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" more than 2 elements in the hierarchy > "), hierarchy.firstChild);
                        } else {
                            hierarchy.appendChild(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" > more than 2 elements in the hierarchy"));
                        }
                        return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childLi.lastChild, hierarchy, direction);
                    }
                } else if (childUl && childUl.childElementCount === 0) { // fin de la liste
                    return hierarchy;
                } else {
                    childUl.hidden = true;
                    if (bDirection) {
                        hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createList(childUl, bDirection), hierarchy.firstChild);
                    } else hierarchy.appendChild(cwCustomerSiteActions.breadCrumbHierarchy.createList(childUl, bDirection));
                    return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childUl.firstChild.lastChild, hierarchy, direction);
                }
            } else {
                elem.hidden = true;
                if (bDirection) {
                    hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" more than 2 parents node in the hierarchy > "), hierarchy.firstChild);
                } else {
                    hierarchy.appendChild(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" > more than 2 parents node in the hierarchy"));
                }

                return hierarchy;
            }
        } else {
            if (bDirection) {
                hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" You have used edit mode please press F5 > "), hierarchy.firstChild);
            } else {
                hierarchy.appendChild(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" > You have used edit mode please press F5"));
            }

            return hierarchy;
        }

    };

    cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg = function(txt) {
        var div = document.createElement('div');
        div.innerText = txt;
        return div;
    };

    cwCustomerSiteActions.breadCrumbHierarchy.createHistoryPageElement = function(htmlPage, d) {
        var a = document.createElement('a');
        a.href = htmlPage.html;
        if (d === true) a.innerText = " > " + htmlPage.title;
        else a.innerText = htmlPage.title + " > ";

        a.className = "HierarchyLink";
        return a;
    };



    cwCustomerSiteActions.breadCrumbHierarchy.createList = function(childUl, bDirection) {
        var div = document.createElement('div');
        div.className = "breadCrumbHierarchyMultipleElement";

        var div1;

        if (bDirection) div1 = cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(childUl.childElementCount + " Objects > ");
        else div1 = cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" > " + childUl.childElementCount + " Objects");

        div1.className = "breadCrumbHierarchyMultipleElementHeader";

        var div2 = document.createElement('div');
        div2.className = "breadCrumbHierarchyMultipleElementListHidden";

        var element;
        for (var i = 0; i < childUl.childElementCount; i++) {
            element = document.createElement('div');
            element.className = "breadCrumbHierarchyMultipleElementCDS";

            childUl.children[i].firstChild.children[1].onclick = function() {
                div2.className = "breadCrumbHierarchyMultipleElementListHidden";
            };

            element.appendChild(childUl.children[i].firstChild.children[1]);



            element.appendChild(childUl.children[i].firstChild.lastChild);
            div2.appendChild(element);

        }

        div1.onclick = function() {
            if (div2.className === "breadCrumbHierarchyMultipleElementListVisible") {
                div2.className = "breadCrumbHierarchyMultipleElementListHidden";
            } else {
                div2.className = "breadCrumbHierarchyMultipleElementListVisible";
            }
        };


        div.appendChild(div1);
        div.appendChild(div2);
        return div;
    };

    cwCustomerSiteActions.breadCrumbHierarchy.hideList = function() {
        var lists = document.getElementsByClassName("breadCrumbHierarchyMultipleElementListVisible");
        for (var i = 0; i < lists.length; i++) {
            lists[i].className = "breadCrumbHierarchyMultipleElementListHidden";
        }
    };


    cwCustomerSiteActions.breadCrumbHierarchy.checkHistory = function(hierarchy, history) {
        if (history === undefined) {
            history = cwCustomerSiteActions.breadCrumbHierarchy.history.slice(0);
            var first = true;
        }
        var index, child;
        if (hierarchy) {
            for (var i = 0; i < hierarchy.children.length; i++) {
                child = hierarchy.children[i];
                if (child.tagName === "A") {
                    index = history.indexOf(child.innerText.replace(" >", ""));
                    if (index !== -1) {
                        child.className = "historyHierarchyLink";
                        history.splice(index, 1);
                    } else {
                        child.className = "HierarchyLink";
                    }
                }

                cwCustomerSiteActions.breadCrumbHierarchy.checkHistory(child, history);
            };
        }
        if (first) {
            cwCustomerSiteActions.breadCrumbHierarchy.history = cwCustomerSiteActions.breadCrumbHierarchy.history.filter(function(i) {
                return history.indexOf(i) < 0;
            });
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
    cwAPI.customLibs.doActionForSingle.breadCrumbHierarchy = cwCustomerSiteActions.breadCrumbHierarchy.create;
    cwAPI.customLibs.doActionForIndex.breadCrumbHierarchy = cwCustomerSiteActions.breadCrumbHierarchy.create;

}(cwAPI, jQuery));