###############################################################################


    iDevUI Web 2.0 Framework
    
    Version: 1.0.1
    Build  : 120605.1
    
    Copyright 2012 Trakware Solutions Ltd, All rights reserved.

    *** Do not remove this copyright message ***
    
    License: MIT (see website for details http://www.idevui.com)

###############################################################################

The example application is designed for a mobile.

We have also provided phonegap.js if you wish to package your application using
their services. Though you may wish to check for updates.

Please be aware of PhoneGap's liensing aggreement.

    120705.1

Changelog

    - Fixed scroll bug in richtext widget
    - Fixed for tbar & bbar widgets which were not getting the page property set 
    - Added cls property to dataview widget
    - Added itemCls to list widget
    - Added ie9gradient styling to remove filter CSS if using IE9  
    - Updates all widgets to add ie9gradient if the cls properties are passed
    - Fixed issued with round corners in Chrome when a gradient is apply to panel
      title and bottom bar.
    - Added $round macro function
    - Added some ui message defaults properties to the idev object. These and then
      be overwritten by the application
    - Added the ability to add a new record to top of data store
    - Added cls property to composite widget
    - Updated uploader widget to allow button image
    - Added autoFocus and focusID properties to panel widget and window widget
    - Added data array to list widget for custom data in template
    - Added beforeRefresh and afterRefresh to list, dataview and grid widgets
    - Added title option to icon widget for popup tooltip
    - Added autoClose property to widgetWindow. Allowing the user to set the outside of the area as closable onClick.
    - Added beforeClose and afterClose events to windows. Allowing the user to detect when a window gets closed.
    - Fixed richtext crash bug on deletion.