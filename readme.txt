###############################################################################
    
    
    iDevUI Web 2.0 Framework
    
    Version: 1.1.1
    Build  : 120731.1
    
    Copyright 2012 Trakware Solutions Ltd, All rights reserved.
    
    *** Do not remove this copyright message ***
    
    License: MIT (see website for details http://www.idevui.com)
    
###############################################################################
    
The example application is designed for a mobile.
    
We have also provided phonegap.js if you wish to package your application using
their services. Though you may wish to check for updates.
    
Please be aware of PhoneGap's licensing aggreement.
    
Changelog
    
    - Fixed horizontal scrolling on a grid in IE8.
    - Fixed multiple divs with the same ID.
    - Fixed tooltip errors.
    - Added togglePassword method to TextField widget.
    - Fixed issues with onenter not firing on TextFields.
    - Fixed watermarking on password fields.
    - Added ability to use HTML5 input types with TextField.
    - Added ability to specify a tabindex on some widgets.
    - Removed some deprecated and unsupported HTML tags.
    - $delay now returns the delay so that it can be cancelled.
    - Fixed IE8 compatibility issues.
    - Fixed incorrect error trap being used.
    - Fixed idev.app.events erroring onResize if it isn't defined.
    - Fixed password field watermarking with default value specified.
    - Removed multiple blank lines in source code.
    - Fixed jQuery tag repetition.
    - Fixed use of deprecated jQuery method attr.
    - Fixed dateAdd method to use idev.errorHandler instead of throw().
    - Fixed issue with Raphael trying to use .prop()
    - Fixed issue with span being created for a button without any text.
    - Changed page's beforeHide to now pass back the current page instead.
    - Improved maxlength on TextField and TextArea.
    - Fixed ie9gradient not being applied properly.
    - Fixed focus causing issues in FireFox.
    - Fixed issue with messagebox title in IE9 & IE8.
    - Added fallback property to Object widget.
    - Fixed issues with draggable elements using .prop() instead of .attr()
    - Fixed issue with row layout.
    - Fixed issue with textarea being out of line in webkit.
    - Added ability to add an app-wide token to all ajax requests by specifying idev.app.token.
    - Added additional info to the 'update bind failed' error message to help developers find what is causing it.
    - Fixed password field watermarking issues on Android devices.
    - Added setValue method to radio buttons.
    - Added removeRec method to the Data Store.
    - Fixed showBusy().
    - Fixed composite resizing outside of toolbar.
    - Added a beforeRender event to the combobox.
    - Fixed some try catches silently failing.
    - Added some DatePicker UX changes.
    - Fixed errors in onClick when the widget ID contains an underscore.
    - Added showBusy() and hideBusy() to the base widget.
    - Added a try catch to loader to catch any intermittent issues.
    - Fixed IE problems with uploader UX.
    - Fixed issues with DataView and auto columns.
    - Changed objectLength() to objLen() as it is supposed to save time.
    - You can no longer drag windows off the screen.
    - Added idev.utils.closeAllWindows() method to close all windows.
    - Rewritten onClick() and onDblClick() to fix issues with underscores in IDs.
    - Removed zeroreturn property from TextArea.
    - Fixed showBusy and hideBusy to not require a mask ID.
    - Fixed issues with comboboxes and date pickers.
    - Added idev.utils.escapeStr() to escape characters for use in a jQuery selector.

Known Issues

    - file:// protocol make cause issues for iDevUI in IE10 (Due to IE's security restrictions)
    - Event after text change on an input widget doesn't catch backspace or delete (jQuery restriction)
    - Issues with BlackBerry and PhoneGap for files with non-alphanumeric characters in their name.