(function (cwApi) {

    cwApi.CwTopBarManager = (function () {
        var transitionTime, topBarId, profileContainerClass, expandIcon, collapseIcon, showClass, mySitesId, myProfileId,
            load, registerEvents, outputLogo, outputPageTitle, outputProfile, showProfile, hideProfile, goToMySites;

        transitionTime = 200;

        topBarId = 'cw-top-bar';

        mySitesId = 'tb-my-sites';

        myProfileId = 'tb-my-profile';

        profileContainerClass = '.tb-profile-container';

        expandIcon = 'fa-chevron-down';

        collapseIcon = 'fa-chevron-up';

        showClass = 'show';

        load = function () {

            var html = [];

            outputLogo(html);

            outputPageTitle(html);


            if (cwApi.isLive()) {
                outputProfile(html);
            }

            $('#' + topBarId).html(html.join(''));

            registerEvents();
        };

        registerEvents = function () {

            var $profileContainer, $profileIcon, $pageWrap, $mySitesLink;

            $profileContainer = $(profileContainerClass);

            $profileIcon = $profileContainer.find('i');

            $pageWrap = $('.wrap');

            $mySitesLink = $('#' + mySitesId);

            $pageWrap.on('click', function () {

                hideProfile();

            });

            $profileContainer.on('click', function () {

                if ($profileIcon.hasClass(expandIcon)) {

                    showProfile();

                } else {

                    hideProfile();

                }
            });

            $mySitesLink.on('click', function (e) {

                e.preventDefault();

                $('.cwloading').show();

                setTimeout(function () {

                    goToMySites();

                }, transitionTime);
            });
        };

        outputLogo = function (html) {

            html.push('<div class="tb-left-container">' +
                        '<div class="logo-container"><a href="' + cwApi.getSingleViewHash("cw_user_home", cwApi.currentUser.ID) + '"><div class="logo"></div></a></div>' +
                      '</div>');

        };

        outputPageTitle = function (html) {

            html.push('<div class="page-title"></div>');
        };

        outputProfile = function (html) {

            var profilePageLink, profilePictureLink;

            profilePageLink = cwApi.getSingleViewHash("cw_user_home", cwApi.currentUser.ID);

            profilePictureLink = cwApi.cwUser.getUserPicturePathByUserName(cwApi.currentUser.Name);

            html.push('<div class="tb-profile-container">');
            html.push('<div class="tb-profile">');
            html.push('<div class="tb-username" title="', cwApi.currentUser.FullName, '">', cwApi.currentUser.FullName, '</div>');
            html.push('<i class="fa ', expandIcon, '"></i>');
            html.push('</div>');
            html.push('<div class="tb-profile-popout">');
            html.push('<table class="user">');
            html.push('<tr>');
            html.push('<td class="tb-avatar"><div style="background-repeat: no-repeat;background-image: url(\'', profilePictureLink, '\');" alt="Avatar"></td>');
            html.push('<td>');

            if (cwApi.isLive()) {
                html.push('<a id="', mySitesId, '" title="', $.i18n.prop('NavigationGoToEvolveSitesInModelPage'), '" href="#">', $.i18n.prop('NavigationGoToEvolveSitesInModelPage'), '</a>');
            }

            html.push('<a id="', myProfileId, '" title="', $.i18n.prop('user_profile'), '" href="', profilePageLink, '">', $.i18n.prop('user_profile'), '</a>');
            html.push('</td>');
            html.push('</tr>');

            if (cwApi.isLive() && !cwApi.isWindowsAuthentication() && !cwApi.isSamlAuthentication()) {
                html.push('<tr class="logout">');
                html.push('<td colspan=2><a title="', $.i18n.prop('user_logout'), '" href="#" class="cw-user-logout">', $.i18n.prop('user_logout'), '</a></td>');
                html.push('</tr>');
            }

            html.push('</table>');
            html.push('</div>');
            html.push('</div>');
        };

        showProfile = function () {

            var $profile, $profileIcon;

            $profile = $(profileContainerClass);

            $profileIcon = $profile.find('i');

            $profile.addClass(showClass);

            $profileIcon.removeClass(expandIcon);

            $profileIcon.addClass(collapseIcon);
        };

        hideProfile = function () {

            var $profile, $profileIcon;

            $profile = $(profileContainerClass);

            $profileIcon = $profile.find('i');

            $profile.removeClass(showClass);

            $profileIcon.removeClass(collapseIcon);

            $profileIcon.addClass(expandIcon);
        };

        goToMySites = function () {

            var modelSelectionPageLink = cwApi.getServerPath();

            window.location = modelSelectionPageLink;
        };

        return {
            load: load
        }

    })();

}(cwAPI));