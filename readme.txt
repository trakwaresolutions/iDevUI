###############################################################################
    
    
    iDevUI Web 2.0 Framework
    
    Version: 1.1.1
    Build  : 120620.1
    
    Copyright 2012 Trakware Solutions Ltd, All rights reserved.
    
    *** Do not remove this copyright message ***
    
    License: MIT (see website for details http://www.idevui.com)
    
###############################################################################
    
The example application is designed for a mobile.
    
We have also provided phonegap.js if you wish to package your application using
their services. Though you may wish to check for updates.
    
Please be aware of PhoneGap's licensing aggreement.
    
Changelog
    
    - Fixed for loop inside of another for loop bug
    - Fixed IE10 Compatibility
    - Fixed sound widget not playing sound
    - Fixed draggable object "Dragging" window not moving with mouse
    - Fixed Code Editor not syntax highlighting
    - Fixed Tree View text disappearing on theme change
    - Fixed Pagination to work with other widgets in the BBar of a Grid.
    - Fixed Rich Text Editor so that all buttons now work
    - Fixed Combo Box scrolling issues.
    - Rewritten Data Store's sort method to be more efficient
    - Fixed bug with '>>' shortcut and jQuery trying to select it
    - Fixed Gauge causing Raphael to error
    - Fixed Signature UX not working in IE8
    - Fixed loading.css missing bug,
    - Fixed style attribute on a script tag bug.
    - Fixed Date Picker issues
    - Moved some inline styles to idevui.css
    - New UX: Tooltip. Can now give fancy tooltips on widgets.
    - Browser default tooltip (title attribute) has also been enabled for most widgets.
    - iDevUI no longer support IE versions less than 8. A friendly warning will apear if iDevUI is loaded in an unsupported browser.
    - Fixed: Rich text theme change issues.
    - Fixed: Form panel label text changes to white on theme change.
    - Added isIE10() utility method.
    - Fixed: Sound widget now works in IE8 and IE10
    - Fixed: Rich Text backspace and delete not working in IE8
    - Fixed: Grid Header mis-aligned in IE8
    - Fixed: Signature get and set not working in IE8
    - Fixed: iPad showing error with button widths.
    - Fixed: Code Editor not rendering properly
    - Fixed: Sound widget now works on iOS and Android devices
    - Fixed: Theme CSS issue with labels on a form layout.
    - Fixed: Android touch screen tapping issues.
    - Fixed: cssOpacity showing a filter inline CSS for IE9 on a button.
    - Fixed: idev.utils.parseJSON used eval?
    - Fixed: idev core init functions add styles for IE9, what about IE10?
    - Fixed: Fixed issue with resizing the screen when events not defined.
    - Added a brand new loader, with a preference of using your own splash screen image instead.
    - Added setDS method to the base widget.
    - Added setCM to the Grid widget.
    - Added removeAll method to panel to remove all widgets.
    - All new documentation now published on the iDevUI website in a completely new format.
    - Fixed Tree View not rendering.
    - Made replaceAll method more efficient
    - Fixed input box bugs on touch devices.

Known Issues

    - file:// protocol make cause issues for iDevUI in IE10 (Due to IE's security restrictions)
    - Event after text change on an input widget doesn't catch backspace or delete (jQuery restriction)
    - Issues with BlackBerry and PhoneGap for files with non-alphanumeric characters in their name.