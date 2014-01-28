###############################################################################
    
    
    iDevUI Web 2.0 Framework
    
    Version: 1.2
    Build  : 140124.1
    
    Copyright 2012 Trakware Solutions Ltd, All rights reserved.
    
    *** Do not remove this copyright message ***
    
    License: MIT (see website for details http://www.idevui.com)
    
###############################################################################
    
The example application is designed for a mobile.
    
We have also provided phonegap.js if you wish to package your application using
their services. Though you may wish to check for updates.
    
Please be aware of PhoneGap's licensing aggreement.
    
Changelog

    - Loader is now more efficient.
    - Code Editor UX fixed to support multiple code editors with different syntaxes on the same page.
    - Fixed issue with pageManager not removing pages correctly.
    - Added new preference called legacyLoader allowing you to force usage of the old iDevUI loading bar.
    - Loader now attempts to load jQuery 20 times before erroring instead of infinitely.
    - JSON2String() has been renamed to toJSONString(). JSON2String() has been deprecated.
    - Added proper deprecation to objLen() for backward compatibility
    - Fixed bug with non-editable inputs and touch devices.
    - Fixed error firing from idev.utils.urldecode when passed a certain string.
    - Local Storage now has support for namespacing by specifiy _preferences.localNamespace.
    - matchany now defaults to false in Data Store's find method.
    - Fixed issues with loader trying to load jQuery multiple times.
    - Fixed issues with fromUDateTime on Android.
    - Fixed issues with loading multiple code editors at once onto a page.
    - Added dsFilter option to Combobox widget.
    - Added autoScroll property to sidemenu UX.
    - Fixed bug with idev.utils.ellipsis adding ... for no reason.
    - Fixed bug with Button theming in default theme.
    - Added _preferences.loaderText preference to allow you to change the text on the loader for the application.
    - Added load event to DataStore to match documentation.
    - Added insertAt method to DataStore to allow you to insert records into a DataStore.
    - Fixed issue with Date Picker UX when setting the date to a date object.
    - Fixed dblclick event on a List widget not firing.
    - Added getTabTitle, getActiveTab and getTab methods to the TabPanel widget.
    - Fixed webkit bug with Uploader UX. Clicking where uploader doesn't exist still triggers uploading.
    - Fixed setSrc on an image not actually setting the src property on the widget.
    - Removed cellpadding adjustment for chrome to fix windows with form layout.
    - Fixed DataStore load method to stop blank records being added.
    - Set default charset to UTF-8 in index.html.
    - Added beforeload event to the DataStore.
    - Fixed issues with collapsing side panels.
    - Fixed idev.utils.replaceall() issues with special characters.
    - Removed ui-tab-content from panels in new tabs in a TabPanel.
    - Added tabindex property to TextField, Image and Icon widgets.
    - Fixed Radio button widget setValue() method not working.
    - Fixed default theme class ui-button-text not being able to be overridden.
    - Added idev.isIE11() helper method.
    - Fixed tabindexing with an SVG element.
    - You can no longer highlight (select) elements on the page except for inputs and textareas.
    - Added selectable and unselectable CSS classes to enable / disable elements from being selectable in the browser.
    - Added proper deprecation of JSON2String as JSON2string.
    - Fixed panel padding issue.
    - Fixed doLayout on resize for a child in a composite.
    - Fixed autoFocus on a textfield in a window not working.
    - Added force flag to tabPanel method closeTab.
    - Fixed sHTML being in global scope.
    - Fixed grid data height issues.
    - Fixed sID being in global scope.
    - Fixed cls being in global scope.
    - Fixed toJSONString so that it now uses JSON.Stringify().
    - Fixed issues with expandable panels in a frame layout.
    - Removed the ability to resize textareas in the browser unintentionally.
    - General code cleanup.
    - jQuery performance optimisation.

Known Issues

    - file:// protocol make cause issues for iDevUI in IE10 (Due to IE's security restrictions)
    - Event after text change on an input widget doesn't catch backspace or delete (jQuery restriction)
    - Issues with BlackBerry and PhoneGap for files with non-alphanumeric characters in their name.