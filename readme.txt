###############################################################################
    
    
    iDevUI Web 2.0 Framework
    
    Version: 1.1.1
    Build  : 130307.1
    
    Copyright 2011-2013 Trakware Solutions Ltd, All rights reserved.
    
    *** Do not remove this copyright message ***
    
    License: MIT (see website for details http://www.idevui.com)
    
###############################################################################
    
The example application is designed for a mobile.
    
We have also provided cordova.js if you wish to package your application using
the phonegap services. Though you may wish to check for updates.
    
Please be aware of PhoneGap's licensing aggreement.
    
Changelog
    
    - Added maxlength to textfield and textarea widgets
    - Added a forcereload property to the config section of preferences. This 
      will add a timestamp to the script or css url, forcing the browser to
      re-download the file.
    - Added a messagebox function to the idev.ui object
    - Added fromUDateTime function to the idev.utils object to convert a
      string contains the date and time in YYYYMMDDHHNNSS format to a date 
    - Remove toolbar and statusbar padding from idevui.css and updated dark and
      default themes
    - Improved grid editing.
    - Grid dsFilter now passes the row number
    - Fix bug in replaceAll return and empty string if parameter is a number;
    - Fixed getTotal to work with local data sources
    - Made sure grid widget sets the CM column index for each column object.
    - Add an invalidchars property to the textfield and textarea widgets
      this prevents invalid characters from being entered.
    - Fixed bug in dbOpen and dbExecute not working because wrong function name
      used to check if local database is supported. 
    - Fixed duplicate widget id issue on idev.internal.add
    - Added enable and disabledCls to several widgets
    - Fixed comboBox dropdown unexpected close issue
    - Added stopPropagation and preventDefault after a button has been clicked 
    - Corrected bug where selected property in a number of widgets was being
      set by the internal onClick function to a string type. 
    - Fixed combo list onclick styling issue
    - Move idev.internal.add to the baseWidget
    - Added autoload to datasource
    - Amended pannel resize
    - Amended Grid editor
    - Fixed issue with scrollbars on widget drag
    - Fixed icon update on drag and drop
    - Fixed width calculation on spacer
    - Added Tooltip to button widget.
    - Added roundUp to utils
    - Added downloadURL to utils
    - Fixed Combobox list click event to pass correct data
    - Fixed TabPanel widget to render correctly on add tab
    - Added setTabTitle function to TabPanel
    - Added select function to WidgetList
    - Fixed composite layout
    - Fixed double click in WidgetList
    - Fixed unbind
    - Added cell double click to grid widget
    - Added title atribute to columns
    - Fixed missing id on grid cell
    - Amended column edit to work with tab
    - Amended data object to work using indexOf
    - Fixed resize function to fix jumping
    - Added keyboard navigation to grid
    - Amended inputType to support interger, currency and custom (custom uses regex for input)
    - Standardised getting of element ids to jquery
    - Performance tweaks to for loops
    - Removed isNumeric (use javascript isNaN)
    - Performance tweak to comboboxs
    - Fixed bug on panel resizing
    - Fixed bug on column find with custom attributes
    - Added keyboard for widget resizing
    - Fixed grid renderer issue
    - Fixed bug in Regex on input validation to account for hyphens
    - Fixed bug in input get value to account for hyphens
    - Fixed radio buttons (broken by changing widget array to object)
    - Fixed radio getValue() (broken by changing widget array to object)
    - Fixed idev.internal.remove() (broken by changing widget array to object)