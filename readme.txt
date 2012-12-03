###############################################################################
    
    
    iDevUI Web 2.0 Framework
    
    Version: 1.1.0
    Build  : 121203.1
    
    Copyright 2012 Trakware Solutions Ltd, All rights reserved.
    
    *** Do not remove this copyright message ***
    
    License: MIT (see website for details http://www.idevui.com)
    
###############################################################################
    
The example application is designed for a mobile.
    
We have also provided phonegap.js if you wish to package your application using
their services. Though you may wish to check for updates.
    
Please be aware of PhoneGap's licensing aggreement.
    
Changelog
    
    - Add down property to button widget when in toggle mode.
    - Made change to panel to allow borderStyle property to work better.
    - Moved afterRender event in button widget after the SVG is created
    - Fixed issue with combo widget drop down 1 pixel too high
    - Fixed issue with missing border on input widget in chrome (removed overflow:hidden in idevui.css for iu-element class)
    - Added ability to define a switch's width and height. (Bug #6)
    - Fixed issue with incorrectly calculated tbar height affecting widgets inside of it. (Bug #4)
    - Added emptyText property to widgetList to enable you to add some text to display when a list has no rows. (Enhancement #5)
    - Added clearSelection() method to widgetList to clear the selected list item. (Enhancement #7)
    - Fixed issues in ie8 with Quirks Mode.
    - Fixed widget Height for main app toolbar not being default height
    - Add css3pie as an options for modernising IE7 & IE8
    - Added a loader options when loading iDevUI to show progress
    - Added buttonBodyStyle to widgetButton to help date picker become square.
    - Date picker is now square (Separate widget)
    - widgetCombo is now square
    - Date picker and widgetCombo can now be made with rounded corners by settings roundCorners as true/false.
    - Stopped statusbar and column layout widgets from setting widget height the same as the statusbar
    - Fixed roundCorners on window widget
    - Added hover enter to dataview widget
    - Add fireEvent method to base widget
    - Remove DD_Roundies in favour of CSS and PIE.htc
    - Changed toolbar and statusbar widgets to extensions of the composite widget instead of panel
    - Remove top border style from default theme for toolbar and statusbar
    - Added ability to create hidden page to be shown loader hence giving the appearance of speed.
    - Added getFrame, getWindow, getDocument to iframe widget
    - Added stylesheet refresh function to idev.internal collection
    - Removed forcing no border radius if rouncCorner not true on input widget
    - Update date picker widget to allow css button and input class properly
    - Added beforeShowTab event to tabpanel widget.
    - Changed show and hide widget methods to notifiy child widgets and hence fire show and hide events  
    - Fixed bug with opacity in IE8 if opacity = 1
    - Changed toolbar and statusbar widgets so you can set the vertical columns alignment
    - Added header renderer option to grid column widget
    - Added click event to grid widget
    - Added formData method to idev.utils object to drill into a form panel and
      build and array of input values
    - Improved grid toolbar and statusbar code
    - Fixed bug with multiple widgets on a "fit" layout panel not hiding properly
    - Changed "fit" layout to take into consideration for toolbar and statusbar of parent panel
    - Fixed CodeEditor incorrectly highlighting Javascript
    - Added New CodeEditor theme 'Solarized'
    - Added setValue to checkbox widget
    - Added form object to idev.utils object with various methods to manipulate a form panel
    - Added setEditable and getEditable to textfield and textarea widgets
    - CSS3 Icons now detect colour chosen from iconColor on widgetButton.
    - Added CSS3 icons PNGs to /images/icons
    - Added svg property to widgetButton to force a button to render using SVG
    - Fixed Bug #9
    - Fixed Bug #10
    - Fixed iScroll refresh bug on widgetList (bug #11)
    - Changed delays in iScroll rendering on widgetList
    - Add clone to data record
    - Fixed bug if widget is hidden the form label is still visible
    - Added widget min width and height
    - Fixed frame layout not working correctly
    - Added defaultTitleHeight to idev object
    - Added textAlign and textVAlign to button widget
    - Added updateJSONObject method to utils object. This method updates a JSON
      object from either an array or JSON object but on where the names match
    - Fixed potential problem with form labels not hiding or showing properly
    - Improved the reliability of drag'n'drop
    - Fixed bug with click called twice if widget draggable
    - Added form panel widget and form window widget
    - Added dataRecord data binding to widget in particular new form panel
    - Added parent property to page fn object
    - Removed duplicate code for mobile detection
    - Removed duplicate fn definition to baseWidget object
    - Changed page object so if data not passed blank data object created
    - Changed the z-indexing on the panel render causing issue where modal window appeared below non-modal window.
    - Added switch theme method to utils object
    - Added buttonTextStyle to button widget
    - Fixed bug with column layout if no initial widgets listed and you want
      to dynamically add one using the addWidget method.
    - Fixed bug with close tab
    - Changed app toolbar and statusbar to a composite
    - Fixed main app resize and the resize of the widgets within it
    - Added anchor capabilities for widgets
    - Added auto columns on dataview widget
    - Removed forward and backward button widgets on the grounds they are too 
      specialised and can be create using other widgets
    - Added a renderer function to the dataview widget.
    - Added click event listeners to textarea widget
    - Modified the datastore updatebinds method to not fire the onload event when dynamically adding a record.
    - Fixed bug with data record getRecNo method not working
    - Fixed bug with window widget showing before the show method is called.
    - Added prehtml property to image widget to display come html before the image
    - Change spacer on YESNO message from 2 to 10 wide
    - Fixed bug where the borders would be zero if not rounded corners
    - Added a titleTextCls property to panel.
    - Added object widget
    - Added cls and style attributes to button widget image property
    - Added object widget
    - Fixed bug in combo widget not returning correct value if editable and has
      a selection that has been overwritten
    - Made button widget pure CSS and a added SVG button to keep backward compatibility
    - Update default theme.
    - Changed page hidding to visibility instead of display for speed.
    - Fixed the theming of iDevUI
    - Added set series to widgetchart to allow updating of chart info.
    - Fixed bug with combo boxes showing no icons
    - Reverted to old version of Raphael to fix positiong issues in IE8
    - Modified treeview extension - added in slate theme
    - Fixed bug in column renderer in grid passing wrong variables
    - Fixed resize issue for list on combobox.
    - Fixed listentry height in widgetcombobox
    - Fixed overflow on combobox
    - Fixed overflow on grid column
    - Added lock option to checkbox
    - Added boolean title attribute to label
    - Trimmed leading and trailing spaces from label text
    - Fixed bug on showpage not fully hiding old page.
    - Added parent to baseWidget fn
    - Create empty object for baseWidget data property if not set
    - Added ie9gradient to ui-cell
    - Added feature for composite widget to match parent width by parent
    - Fixed bug fade in showPage, not loading page.
    - Amended key to be defined inside each function that uses it, removing it from the global scope.
    - Fixed bugs on dark theme for treeview, codeeditor, label and plugin widgets
    - Fixed bug on active tab gradient overflowing border
    - Fixed bug on set height of content div.
    - Added ds unbind for base widget destroy.
    - Fixed dark theme bug, text not showing on richtext.