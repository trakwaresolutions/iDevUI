// JavaScript Document
/*

    iDev UI Framework  copyright (c) 2012 Trakware Solutions Limited.

    Do not remove this copyright message

    version    : 1.1.1
    build      : 130307.1

    Started    : 5th March 2011

    Notes:

    Makes use of jquery

    History:
        1.0.0   2011-11-23  First release
        1.0.1   2012-04-04  Milestone release
        1.0.2   2012-08-01  Milestone release
        1.1.0   2012-11-30  Milestone release
		1.1.1	2013-03-07  Milestone release


    iDevUI is distributed under the terms of the MIT license
	
*/

///////////////////////////////////////////////////////////////////////////////
//  Base Object Declaration
//
// This section is curtesy of John Resig @ www.ejohn.org
///////////////////////////////////////////////////////////////////////////////
(function()
{
    var initializing = false;

    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop)
    {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop)
        {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" ?
            (function(name, fn)
            {
                return function()
                {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
        }
        // The dummy class constructor
        function Class()
        {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

///////////////////////////////////////////////////////////////////////////////
//  Date Object Formatting Declaration
//
// This section is curtesy of John Resig @ www.ejohn.org
///////////////////////////////////////////////////////////////////////////////

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    uDateTime:       "yyyymmddHHMMss"
};

dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};


///////////////////////////////////////////////////////////////////////////////
/*
    Language Object Declaration

    Designed to handle an text translation. Requires the "language".js file

    Example

_language.words = {
    "english":"foreign",
    ];

*/
///////////////////////////////////////////////////////////////////////////////
var _language = {
    sLanguage:"english",
    words:null,
    setLanguage : function(sLanguage)
    {
        this.sLanguage = sLanguage;
    },
    load : function()
    {
        if (this.sLanguage == "english") return;

        var el = document.createElement('script')
        el.type = 'text/javascript';
        el.src = _preferences.languagepath  + this.sLanguage +".js";
        if (navigator.userAgent.toLowerCase().indexOf("msie 7") == -1 ||
            navigator.userAgent.toLowerCase().indexOf("msie 8") == -1)
        {
            el.onreadystatechange= function ()
            {
                if (this.readyState == 'loaded')
                {
                    idev.errorHandler("Loaded:" + _language.sLanguage);
                }
            };
        }
        else
        {
            el.onload  = function()
            {
                $debug("Loaded:" + _language.sLanguage);
            }
        }
        document.getElementsByTagName('head')[0].appendChild(el);
    },
    translate : function(sWord)
    {
        var caps = false
        if (sWord == null) return "";
        if (this.words == null) return sWord;
        if (sWord == "") return "";
        if (this.sLanguage == "english") return sWord;
        if (sWord.charCodeAt(0) >= 65 && sWord.charCodeAt(0) <= 97) caps = true;
        sForeignWord = this.words[sWord.toLowerCase()];
        if (sForeignWord == null) sForeignWord = sWord;
        if (caps)
        {
            sForeignWord = idev.utils.ucwords(sForeignWord);
        }
        return sForeignWord;
    }
};

///////////////////////////////////////////////////////////////////////////////
//  Idev base class object
var idevObject = Class.extend({});

///////////////////////////////////////////////////////////////////////////////
/*
    Button widget color object

*/
///////////////////////////////////////////////////////////////////////////////
var idevColors = idevObject.extend({

    init: function()
    {
        this.colors = new Array();

        this.colors["blue"] = { startColor:"#000011", endColor:"#0099dd:45-#06c", borderColor:"#06c", fontColor:"#fff", border:true };
        this.colors["silver"] = { startColor:"#ccc", endColor:"#ededed:45-#ddd", borderColor:"#ddd", fontColor:"#222", border:true };
        this.colors["red"] = { startColor:"#440000", endColor:"#d00:45-#a00", borderColor:"#a00", fontColor:"#fff", border:true };
        this.colors["purple"] = { startColor:"#110000", endColor:"#aa0066:45-#550022", borderColor:"#550022", fontColor:"#fff", border:true };
        this.colors["black"] = { startColor:"#000", endColor:"#555:45-#333", borderColor:"#333", fontColor:"#fff", border:true };
        this.colors["green"] = { startColor:"#001100", endColor:"#00cc00:45-#090", borderColor:"#090", fontColor:"#fff", border:true };
        this.colors["orange"] = { startColor:"#551100", endColor:"#ff6600:45-#FF6600", borderColor:"#99aa00", fontColor:"#fff", border:true };
    },
    gradientColors : function(obj)
    {
        var c = this.colors[obj.color.toLowerCase()];

        if (c)
        {
            obj.startColor = c.startColor;
            obj.endColor = c.endColor;
            obj.borderColor = c.borderColor;
            obj.fontColor = c.fontColor;
            obj.border = c.border;
        }
    },
    addColor: function (name,details)
    {
        this.colors[name.toLowerCase()] = details;
    },
    removeColor: function (name)
    {
        this.colors[name.toLowerCase()] = null;
    }
});

///////////////////////////////////////////////////////////////////////////////
/*
    Widget resizing object

    Designed to allow every widget to be resized on the screen

*/
///////////////////////////////////////////////////////////////////////////////

var idevResize = idevObject.extend({
        init : function(widget)
        {
            this.widget = widget;
            this.resizable = true;
            this.resizing = false;
            this.rsw = 8;
            this.rsh = 8;
            this.resizeColor = '#000';
            this.handlers = "nw,n,ne,w,e,sw,s,se,"
        },
        isResizing: function() { return this.resizing },
        add: function()
        {
            if (this.resizing) return;
            this.widget.beforeResize();

            idev._isDraggable = this.widget.isDraggable();
            idev._resizeTarget = this.widget;
            var w = parseInt($("#" + this.widget.id).width()) - this.rsw;
            var h = parseInt($("#" + this.widget.id).height())- this.rsh;

            var sHTML = "<div id='" + this.widget.id + "-drframe' style='position:absolute;top:" + (this.rsh/2) + "px;left:" + (this.rsw/2) + "px;border:1px dashed " + this.resizeColor  + ";width:" + w + "px;height:" + h + "px;'></div>";

            if (this.resizable)
            {
                if (this.handlers.indexOf("nw,") != -1) sHTML += "<div id='" + this.widget.id + "-drhandlenw' style='position:absolute;top:0px;left:0px;width:" + this.rsw + "px;height:" + this.rsh + "px;border:1px solid #000;background-color:#fff;z-index:999;cursor:nw-resize;'></div>"
                if (this.handlers.indexOf("ne,") != -1) sHTML += "<div id='" + this.widget.id + "-drhandlene' style='position:absolute;top:0px;left:" + (w-2) + "px;width:" + this.rsw + "px;height:" + this.rsh + "px;border:1px solid #000;background-color:#fff;z-index:999;cursor:ne-resize;'></div>"
                if (this.handlers.indexOf("se,") != -1) sHTML += "<div id='" + this.widget.id + "-drhandlese' style='position:absolute;top:" + (h-2) + "px;left:" + (w-2) + "px;width:" + this.rsw + "px;height:" + this.rsh + "px;border:1px solid #000;background-color:#fff;z-index:999;cursor:se-resize;'></div>"
                if (this.handlers.indexOf("sw,") != -1) sHTML += "<div id='" + this.widget.id + "-drhandlesw' style='position:absolute;top:" + (h-2) + "px;left:0px;width:" + this.rsw + "px;height:" + this.rsh + "px;border:1px solid #000;background-color:#fff;z-index:999;cursor:sw-resize;'></div>"

                if (this.handlers.indexOf("n,") != -1) sHTML += "<div id='" + this.widget.id + "-drhandlen' style='position:absolute;top:0px;left:" + (w/2) + "px;width:" + this.rsw + "px;height:" + this.rsh + "px;border:1px solid #000;background-color:#fff;z-index:999;cursor:n-resize;'></div>"
                if (this.handlers.indexOf("w,") != -1) sHTML += "<div id='" + this.widget.id + "-drhandlew' style='position:absolute;top:" + (h/2) + "px;left:0px;width:" + this.rsw + "px;height:" + this.rsh + "px;border:1px solid #000;background-color:#fff;z-index:999;cursor:w-resize;'></div>"
                if (this.handlers.indexOf("e,") != -1) sHTML += "<div id='" + this.widget.id + "-drhandlee' style='position:absolute;top:" + (h/2) + "px;left:" + (w-2) + "px;width:" + this.rsw + "px;height:" + this.rsh + "px;border:1px solid #000;background-color:#fff;z-index:999;cursor:e-resize;'></div>"
                if (this.handlers.indexOf("s,") != -1) sHTML += "<div id='" + this.widget.id + "-drhandles' style='position:absolute;top:" + (h-2) + "px;left:" + (w/2) + "px;width:" + this.rsw + "px;height:" + this.rsh + "px;border:1px solid #000;background-color:#fff;z-index:999;cursor:s-resize;'></div>"
            }
            $("#" + this.widget.id).append(sHTML);
            $('#' + this.widget.id).attr("draggable","Y");
            $('#' + this.widget.id).attr("resizable","Y");
			// Keyboard Control for resizable pannels
			var wgt = this;
			var ctrl = false; // ctrl = resize
			var shift = false; // shift = faster
			$delay(0,function(){				
				$('#'+wgt.widget.id+'-drframe').focus();
				$('#'+wgt.widget.id+'-drframe').keydown(function(event){
					var key = event.keyCode;
					var parentDiv = $('#'+event.target.id).parent();
					var left = parseInt(parentDiv.css('left'));
					var top = parseInt(parentDiv.css('top'));
					var width = parseInt(parentDiv.css('width'));
					var height = parseInt(parentDiv.css('height'));
					var speed = 1;
					if(key==17){
						if(ctrl==false) ctrl = true;
					}
					if(key==16){
						if(shift==false) shift = true;
					}
					if(shift==true) {
						speed = 5;
					}
					if(key==37){ //left
						if(ctrl) {
							width-=speed;
							wgt.change(left,top,width,height);
						} else {
							left-=speed;
							wgt.change(left,top,width,height);
						}
					}
					if(key==38){ //up
						if(ctrl) {
							height-=speed;
							wgt.change(left,top,width,height);
						} else {
							top-=speed;
							wgt.change(left,top,width,height);
						}
					}
					if(key==39){ //right
						if(ctrl) {
							width+=speed;
							wgt.change(left,top,width,height);
						} else {
							left+=speed;
							wgt.change(left,top,width,height);
						}
					}
					if(key==40){ //down
						if(ctrl) {
							height+=speed;
							wgt.change(left,top,width,height);
						} else {
							top+=speed;
							wgt.change(left,top,width,height);
						}
					}
				});
				$('#'+wgt.widget.id+'-drframe').keyup(function(event){
					var key = event.keyCode
					if(key==17){
						ctrl = false
					}
					if(key==16){
						shift = false;
					}
				});
			});
            this.resizing = true;
        },
        remove: function()
        {
            if (!this.resizing) return;
            $('#' + this.widget.id + "-drframe").remove();
            if (this.resizable)
            {
                if (this.handlers.indexOf("nw,") != -1) $('#' + this.widget.id + "-drhandlenw").remove();
                if (this.handlers.indexOf("ne,") != -1) $('#' + this.widget.id + "-drhandlene").remove();
                if (this.handlers.indexOf("se,") != -1) $('#' + this.widget.id + "-drhandlese").remove();
                if (this.handlers.indexOf("sw,") != -1) $('#' + this.widget.id + "-drhandlesw").remove();
                if (this.handlers.indexOf("w,") != -1) $('#' + this.widget.id + "-drhandlew").remove();
                if (this.handlers.indexOf("e,") != -1) $('#' + this.widget.id + "-drhandlee").remove();
                if (this.handlers.indexOf("n,") != -1) $('#' + this.widget.id + "-drhandlen").remove();
                if (this.handlers.indexOf("s,") != -1) $('#' + this.widget.id + "-drhandles").remove();
            }
            $('#' + this.widget.id).attr("draggable","N");
            $('#' + this.widget.id).attr("resizable","N");
            this.widget.setDraggable(idev._isDraggable);
            this.resizing = false;
            this.widget.afterResize();
        },
        syncSize: function()
        {
            if (!this.resizable) return;
            var w = parseInt($("#" + this.widget.id).width())-this.rsw;
            var h = parseInt($("#" + this.widget.id).height())-this.rsh;
            $('#' + this.widget.id + "-drframe").width(w);
            $('#' + this.widget.id + "-drframe").height(h);

            $('#' + this.widget.id + "-drhandlene").css("left",(w-2));
            $('#' + this.widget.id + "-drhandlee").css("left",(w-2));
            $('#' + this.widget.id + "-drhandlee").css("top",h/2);
            $('#' + this.widget.id + "-drhandlew").css("top",h/2);
            $('#' + this.widget.id + "-drhandlese").css("left",(w-2));
            $('#' + this.widget.id + "-drhandlese").css("top",(h-2));
            $('#' + this.widget.id + "-drhandles").css("top",(h-2));
            $('#' + this.widget.id + "-drhandles").css("left",w/2);
            $('#' + this.widget.id + "-drhandlen").css("left",w/2);
            $('#' + this.widget.id + "-drhandlesw").css("top",(h-2));

        },
        change: function(left,top,width,height)
        {
            var wgt = $("#" + this.widget.id)
            $("#" + this.widget.id).css("left", left);
            $("#" + this.widget.id).css("top", top);
            if (!this.resizable) return;
            $("#" + this.widget.id).css("width", width);
            $("#" + this.widget.id).css("height", height);
            $("#" + this.widget.id).css("max-width", width);
            $("#" + this.widget.id).css("max-height", height);
            this.syncSize();
            this.widget.doLayout();
        }
    });

var idevDD = idevObject.extend({
        init : function(widget)
        {
            this.widget = widget;
            this.allowDrag = widget.config.allowDrag;
            this.allowDrop = widget.config.allowDrop;
            this.dragText = widget.config.dragText || "Dragging";
            this.tpl  = new idev.wTemplate(
                "<div id='{id}' style='position:absolute;left:{x}px;top:{y}px;width:{width}px;height:{height}px;z-index:999;{style}'>",
                "<img id='{id}-drag' src='{drag}' style='display:none;'/><img id='{id}-nodrop' src='{nodrop}' style='display:none;'/>",
                "{text}",
                "</div>");
            this.bShowDragTip = false;
        },
        startDD: function(ev)
        {
            if (this.widget.events.onDrag)
            {
                var sText = this.widget.events.onDrag(this.widget,ev);
                if (sText != null) this.dragText = sText;
            }
            this.tx =  ev.clientX;
            this.ty =  ev.clientY;
            this.bShowDragTip = true;
            idev.dropWidget = null;
        },
        move:function(ev)
        {
            if (this.bShowDragTip)
            {
                var style = "background:#fff;border:2px solid #ccc;cursor:pointer;font-size:10pt;font-family:sans_serif;";
                var data = new Array();
    
                data['id'] = this.widget.id + "-dd";
                data['x'] = this.tx + 2;
                data['y'] = this.ty + 2;
                data['width'] = 100;
                data['height'] = 20;
                data['style'] = style;
                data['text'] = this.dragText;
                data['drag'] = _preferences.libpath + "images/drag.png";
                data['nodrop'] = _preferences.libpath + "images/nodrop.png";
                var sHTML = this.tpl.render(data);
                $("#container").append(sHTML);
                if (this.allowDrop)
                    $("#"+this.widget.id+"-dd-drag").show();
                else
                    $("#"+this.widget.id+"-dd-nodrop").show();
            }
            this.bShowDragTip = false;
            var mousePos = idev.utils.mousePosition(ev);
            var dx = mousePos.x - idev._sX;
            var dy = mousePos.y - idev._sY;
            var el = $('#'+this.widget.id + "-dd");
            if (el)
            {
                idev._sX =  mousePos.x;
                idev._sY = mousePos.y;
                $delay(100,function()
                {
                    var top = parseInt(el.style.top.replace("px",""));
                    var left = parseInt(el.style.left.replace("px",""));
                    el.style.left = (left + dx) + 'px';
                    el.style.top = (top + dy) + 'px';
                },el);
            }
        },
        canDrop: function(widget)
        {
            if (widget == null)  return;
            var id = widget.id + "-dd";

            if (!this.widget.dd.allowDrop)
            {
                $("#"+id+"-drag").hide();
                $("#"+id+"-nodrop").show();
                idev.dropWidget = null;
            }
            if (this.widget.events.canDrop)
            {
                try
                {
                    if (this.widget.events.canDrop(widget,this.widget))
                    {
                        $("#"+id+"-drag").show();
                        $("#"+id+"-nodrop").hide();
                        idev.dropWidget = this.widget;
                    }
                    else
                    {
                        $("#"+id+"-drag").hide();
                        $("#"+id+"-nodrop").show();
                        idev.dropWidget = null;
                    }
                }
                catch(e)
                {
                    idev.errorHandler("CanDrop Error:"+e.message)
                    $("#"+id+"-drag").hide();
                    $("#"+id+"-nodrop").show();
                    idev.dropWidget = null;
                }
            }
            else if (this.widget.dd.allowDrop)
            {
                $("#"+id+"-drag").show();
                $("#"+id+"-nodrop").hide();
                idev.dropWidget = this.widget;
            }
            else
            {
                $("#"+id+"-drag").hide();
                $("#"+id+"-nodrop").show();
                idev.dropWidget = null;
            }
        },
        onDrop: function()
        {
            if (idev.dropWidget.events.onDrop)
            {
                try
                {
                    idev.dropWidget.events.onDrop(idev.dropWidget,this.widget);
                }
                catch(e)
                {
                    idev.errorHandler("onDrop Error:"+e.message)
                }
            }
        },
        endDD:function()
        {
            if (idev.dropWidget)
            {
                try
                {
                    this.onDrop();
                }
                catch(e)
                {
                    idev.errorHandler("onDrop Error:"+e.message)
                }
            }
            $("#" + this.widget.id + "-dd").css("cursor","default");
            $delay(100,function(widget)
            {
                $("#" + widget.id + "-dd").remove();
            },this.widget);
        }

    });
///////////////////////////////////////////////////////////////////////////////
/*
    Widget layout class

    This is the object used by panels that controls the layout

*/
///////////////////////////////////////////////////////////////////////////////
var idevLayoutManager = idevObject.extend({
        init : function(widget)
        {
            this.widget = widget;
            this.id = widget.id;
            this.layout = widget.layout;
            this.area = widget.area;
            this.events = widget.events;
            this.parent = widget.parent;
            this.title = widget.title;
            this.tbar = widget.tbar;
            this.bbar = widget.bbar;
        },
        collapseArea: function()
        {
            if (!this.widget.expanded) return;
            if (this.area == "west")
            {
                var dx = this.widget.width-18;

                if (this.events.collapsed) this.events.collapsed(this.widget);
                $('#'+this.id+"-expand").addClass("ui-panel-btn-expand-w");
                $('#'+this.id+"-expand").removeClass("ui-panel-btn-collapse-w");
                $("#"+this.parent.id+"-content-west").attr("width","18");
                $("#"+this.id).css("margin-left",0-dx);
                $("#"+this.id+"-filler").css("visibility","visible");
                for (var i = 0;i < this.parent.widgets.length;i++)
                {
                    var id =  this.parent.widgets[i].id;
                    var area = this.parent.widgets[i].area;
                    if (area == "center")
                    {
                        var w = $("#"+id).width() + dx;
                        $("#"+id).width(w);
                        $("#"+id).css("max-width",w);
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.doLayout();
                        }
                    }
                }
                this.widget.expanded = false;
            }
            else if (this.area == "east")
            {
                var dx = this.widget.width-18;

                if (this.events.collapsed) this.events.collapsed(this.widget);
                $('#'+this.id+"-expand").addClass("ui-panel-btn-collapse-e");
                $('#'+this.id+"-expand").removeClass("ui-panel-btn-expand-e");
                $("#"+this.parent.id+"-content-east").attr("width","18");
                $("#"+this.id+"-filler").css("visibility","visible");
                for (var i = 0;i < this.parent.widgets.length;i++)
                {
                    var id =  this.parent.widgets[i].id;
                    var area = this.parent.widgets[i].area;
                    if (area == "center")
                    {
                        var w = $("#"+id).width() + dx;
                        $("#"+id).width(w);
                        $("#"+id).css("max-width",w);
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.doLayout();
                        }
                    }
                }
                this.widget.expanded = false;
            }
            else if (this.area == "south")
            {
                var h = $("#" + this.id + "-title").height();
                var dy = $("#" + this.id).height() - h;
                $("#"+this.id).css("height",h);
                if (this.events.collapsed) this.events.collapsed(this.widget);
                $('#'+this.id+"-expand").removeClass("ui-panel-btn-expand");
                $('#'+this.id+"-expand").addClass("ui-panel-btn-collapse");
                $("#"+this.parent.id+"-content-row-south").attr("height",h);
                for (var i = 0;i < this.parent.widgets.length;i++)
                {
                    var id =  this.parent.widgets[i].id;
                    var area = this.parent.widgets[i].area;
                    if (area == "center" || area == "west" || area == "east")
                    {
                        var h = $("#"+id).height() + dy;
                        $("#"+id).css("height",h);
                        $("#"+id).css("max-height",h);
                        var h = $("#"+id+"-body").height() + dy;
                        $("#"+id+"-body").css("height",h);
                        $("#"+id+"-body").css("max-height",h);
                        if (area == "west" || area == "east")
                        {
                            var h = $("#"+id+"-filler").height() + dy;
                            $("#"+id+"-filler").css("height",h);
                        }
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.doLayout();
                        }
                        
                    }
                }
                this.widget.expanded = false;
            }
            else
            {
                var h = $("#" + this.id + "-title").height();
                var dx = this.widget.height - h;

                $("#"+this.id).css("height",h);
                if (this.events.collapsed) this.events.collapsed(this.widget);
                $('#'+this.id+"-expand").addClass("ui-panel-btn-expand");
                $('#'+this.id+"-expand").removeClass("ui-panel-btn-collapse");
                $("#"+this.parent.id+"-content-row-north").attr("height",h);
                this.widget.expanded = false;
                for (var i = 0;i < this.parent.widgets.length;i++)
                {
                    var id =  this.parent.widgets[i].id;
                    var area = this.parent.widgets[i].area;
                    if (area == "center" || area == "west" || area == "east")
                    {
                        var h = $("#"+id).height() + dx;
                        $("#"+id).css("height",h);
                        $("#"+id).css("max-height",h);
                        var h = $("#"+id+"-body").height() + dx;
                        $("#"+id+"-body").css("height",h);
                        $("#"+id+"-body").css("max-height",h);
                        if (area == "west" || area == "east")
                        {
                            var h = $("#"+id+"-filler").height() + dx;
                            $("#"+id+"-filler").css("height",h);
                        }
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.doLayout();
                        }
                    }
                }
            }

        },
        expandArea: function()
        {
            if (this.widget.expanded) return;
            if (this.area == "west")
            {
                var dx = this.widget.width-18;

                $("#"+this.parent.id+"-content-west").attr("width",this.widget.width);
                $("#"+this.id).css("margin-left",0);
                if (this.events.expanded) this.events.expanded(this.widget);
                $('#'+this.id+"-expand").addClass("ui-panel-btn-collapse-w");
                $('#'+this.id+"-expand").removeClass("ui-panel-btn-expand-w");
                $("#"+this.id+"-filler").css("visibility","hidden");
                for (var i = 0;i < this.parent.widgets.length;i++)
                {
                    var id =  this.parent.widgets[i].id;
                    var area = this.parent.widgets[i].area;
                    if (area == "center")
                    {
                        var w = $("#" +id ).width() - dx;
                        $("#"+id).width(w);
                        $("#"+id).css("max-width",w);
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.doLayout();
                        }
                    }
                }
                this.widget.expanded = true;
            }
            else if (this.area == "east")
            {
                var dx = this.widget.width - 18;

                $("#"+this.parent.id+"-content-east").attr("width",this.widget.width);
                if (this.events.expanded) this.events.expanded(this.widget);
                $('#'+this.id+"-expand").removeClass("ui-panel-btn-collapse-e");
                $('#'+this.id+"-expand").addClass("ui-panel-btn-expand-e");
                $("#"+this.id+"-filler").css("visibility","hidden");
                for (var i = 0;i < this.parent.widgets.length;i++)
                {
                    var id =  this.parent.widgets[i].id;
                    var area = this.parent.widgets[i].area;
                    if (area == "center")
                    {
                        var w = $("#" +id ).width() - dx;
                        $("#"+id).width(w);
                        $("#"+id).css("max-width",w);
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.doLayout();
                        }
                    }
                }
                this.widget.expanded = true;
            }
            else if (this.area == "south")
            {
                var h = $("#" + this.id + "-title").height();
                var ctrlHeight = this.widget.config.height;
                var dx = ctrlHeight - h;

                $("#"+this.id).css("height",ctrlHeight);
                if (this.events.collapsed) this.events.collapsed(this.widget);
                $('#'+this.id+"-expand").addClass("ui-panel-btn-expand");
                $('#'+this.id+"-expand").removeClass("ui-panel-btn-collapse");
                $("#"+this.parent.id+"-content-row-south").attr("height",this.height);
                for (var i = 0;i < this.parent.widgets.length;i++)
                {
                    var id =  this.parent.widgets[i].id;
                    var area = this.parent.widgets[i].area;
                    if (area == "center" || area == "west" || area == "east")
                    {
                        var h = $("#"+id).height() - dx;
                        $("#"+id).css("height",h);
                        $("#"+id).css("max-height",h);
                        var h = $("#"+id+"-body").height() - dx;
                        $("#"+id+"-body").css("height",h);
                        $("#"+id+"-body").css("max-height",h);
                        if (area == "west" || area == "east")
                        {
                            var h = $("#"+id+"-filler").height() - dx;
                            $("#"+id+"-filler").css("height",h);
                        }
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.doLayout();
                        }
                    }
                }
                this.widget.expanded = true;
            }
            else
            {
                var h = $("#" + this.id + "-title").height();
                var ctrlHeight = this.widget.config.height;
                var dx = ctrlHeight - h;

                $("#"+this.id).css("height",ctrlHeight);
                if (this.events.collapsed) this.events.collapsed(this.widget);
                $('#'+this.id+"-expand").removeClass("ui-panel-btn-expand");
                $('#'+this.id+"-expand").addClass("ui-panel-btn-collapse");
                $("#"+this.parent.id+"-content-row-north").attr("height",this.widget.height);
                for (var i = 0;i < this.parent.widgets.length;i++)
                {
                    var id =  this.parent.widgets[i].id;
                    var area = this.parent.widgets[i].area;
                    if (area == "center" || area == "west" || area == "east")
                    {
                        var h = $("#"+id).height() - dx;
                        $("#"+id).css("height",h);
                        $("#"+id).css("max-height",h);
                        var h = $("#"+id+"-body").height() - dx;
                        $("#"+id+"-body").css("height",h);
                        $("#"+id+"-body").css("max-height",h);
                        if (area == "west" || area == "east")
                        {
                            var h = $("#"+id+"-filler").height() - dx;
                            $("#"+id+"-filler").css("height",h);
                        }
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.doLayout();
                        }
                    }
                }
                this.widget.expanded = true;
            }
        },
        collapsePanel: function()
        {
            if (!this.widget.expanded) return;
            var h = $("#" + this.id + "-title").height();
            var dx = this.widget.height - h;
            $("#"+this.id).css("height",h);
            $("#"+this.id).css("max-height",h);
            if (this.events.collapsed) this.events.collapsed(this.widget);
            $('#'+this.id+"-expand").addClass("ui-panel-btn-plus");
            $('#'+this.id+"-expand").removeClass("ui-panel-btn-minus");
            this.widget.expanded = false;
        },
        expandPanel: function()
        {
            if (this.widget.expanded) return;
            // Height of parent accordion panel
            var h = $("#" + this.parent.id).height();
            var th = $("#" + this.parent.id + "-title").height();
            var panelheight = h - th;
            // Make panel height less othere collapsed panels in accordion
            panelheight -= (this.parent.widgets.length-1) * idev.defaultTitleHeight;
            // Set panel height
            $("#"+this.id).css("height",panelheight);
            $("#"+this.id).css("max-height",panelheight);
            if (this.events.collapsed) this.events.collapsed(this.widget);
            $('#'+this.id+"-expand").removeClass("ui-panel-btn-plus");
            $('#'+this.id+"-expand").addClass("ui-panel-btn-minus");
            for (var i = 0;i < this.parent.widgets.length;i++)
            {
                var wgt = $get(this.parent.widgets[i].id);
                if (wgt.expanded)
                {
                    wgt.layoutManager.collapsePanel();
                }
            }
            this.widget.expanded = true;
            this.widget.doLayout();
        },
        expand: function()
        {
            if (this.parent.layout == "frame")
                this.expandArea();
            else if (this.parent.layout == "accordion")
            {
                this.expandPanel();
            }
            else
                this.widget.expand();
        },
        collapse: function()
        {
            if (this.parent.layout == "frame")
                this.collapseArea();
            else if (this.parent.layout == "accordion")
            {
                this.collapsePanel();
            }
            else
                this.widget.collapse(this.widget.titleHeight);
        },
        resizePanel: function()
        {
            var bodyheight = this.widget.height;
            var w = this.widget.width;

            if (this.widget.title) bodyheight -= this.widget.titleHeight;
            if (this.widget.tbar) bodyheight -= this.widget.tbarHeight;
            if (this.widget.bbar) bodyheight -= this.widget.bbarHeight;

            $("#" + this.id + "-background").css("width",w);
            $("#" + this.id + "-background").css("max-width",w);
            $("#" + this.id + "-body").css("width",w);
            $("#" + this.id + "-body").css("max-width",w);
            $("#" + this.id + "-content").css("width",w);
            $("#" + this.id + "-content").css("max-width",w);
            if (this.widget.expanded)
            {
                $("#" + this.id + "-body").css("height",bodyheight);
                $("#" + this.id + "-content").css("height",bodyheight);
            }
            if (this.widget.title)
            {
                $("#" + this.id + "-title").css("width",w);
                $("#" + this.id + "-title").css("max-width",w);
            }
            if (this.widget.tbar)
            {
                $("#" + this.id + "-tbar").css("width",w);
                $("#" + this.id + "-tbar").css("max-width",w);
                this.widget.tbar.doLayout();
            }
            if (this.widget.bbar)
            {
                $("#" + this.id + "-bbar").css("width",w);
                $("#" + this.id + "-bbar").css("max-width",w);
                this.widget.bbar.doLayout();
            }
            if (this.widgetarea == "west" || this.widgetarea == "east")
            {
                $("#"+this.id+"-filler").css("height",bodyheight);
            }
            return bodyheight;
        },
        doLayout: function()
        {
            try
            {
                var pw = $("#" + this.id).width();
                var ph = $("#" + this.id).height();
    
                this.widget.width = pw;
                this.widget.height = ph;
                if (this.layout == "fit")
                {
                    var bodyheight = this.resizePanel();
                    for (var c = 0;c < this.widget.children.length;c++)      
                    {
                        this.widget.children[c].resize(pw,bodyheight);
                        this.widget.children[c].doLayout();
                    }
                    return;
                }
                else if (this.layout == "frame")
                {
                    var bodyheight = this.resizePanel();
                    var hcenter = ph, wcenter = pw;
                    if (this.widget.title) hcenter -= $("#"+this.id+"-title").height();  
                    for (var c = 0;c < this.widget.children.length;c++)
                    {
                        if (this.widget.children[c].area == "west")
                        {
                            var w = this.widget.children[c].getWidth();

                            if (!this.widget.children[c].expanded) w = 24;
                            wcenter -= w;
                        }
                        if (this.widget.children[c].area == "east")
                        {
                            var w = this.widget.children[c].getWidth();

                            if (!this.widget.children[c].expanded) w = 24;
                            wcenter -= w;
                        }
                        if (this.widget.children[c].area == "north")
                        {
                            var h = this.widget.children[c].getHeight();

                            if (!this.widget.children[c].expanded) h = $("#"+this.widget.children[c].id+"-title").height();
                            hcenter -= h;
                        }
                        if (this.widget.children[c].area == "south")
                        {
                            var h = this.widget.children[c].getHeight();

                            if (!this.widget.children[c].expanded) h = $("#"+this.widget.children[c].id+"-title").height();
                            hcenter -= h;
                        }
                    }
                    $("#" + this.id+"-content-table").attr("width",w)
                    for (var c = 0;c < this.widget.children.length;c++)
                    {
                        var id = this.widget.children[c].id;
                        if (this.widget.children[c].area == "south")
                        {
                            $("#"+id).css("width",pw);
                            $("#"+id).css("max-width",pw);
                            $("#"+id+"-body").css("width",pw);
                            $("#"+id+"-body").css("max-width",pw);
                            $("#"+id+"-background").css("width",pw);
                            $("#"+id+"-background").css("max-width",pw);
                        }
                        else if (this.widget.children[c].area == "north")
                        {
                            $("#"+id).css("width",pw);
                            $("#"+id).css("max-width",pw);
                            $("#"+id+"-body").css("width",pw);
                            $("#"+id+"-body").css("max-width",pw);
                            $("#"+id+"-background").css("width",pw);
                            $("#"+id+"-background").css("max-width",pw);
                        }
                        else if (this.widget.children[c].area == "west")
                        {
                            $("#"+id).css("height",hcenter);
                            $("#"+id).css("max-height",hcenter);
                            $("#"+id+"-body").css("height",hcenter);
                            $("#"+id+"-body").css("max-height",hcenter);
                            $("#"+id+"-background").css("height",hcenter);
                            $("#"+id+"-background").css("max-height",hcenter);
                            this.widget.children[c].doLayout();                            
                        }
                        else if (this.widget.children[c].area == "center")
                        {
                            $("#"+id).css("height",hcenter);
                            $("#"+id).css("max-height",hcenter);
                            $("#"+id+"-body").css("height",hcenter);
                            $("#"+id+"-body").css("max-height",hcenter);
                            $("#"+id+"-background").css("height",hcenter);
                            $("#"+id+"-background").css("max-height",hcenter);

                            $("#"+id).css("width",wcenter);
                            $("#"+id).css("max-width",wcenter);
                            $("#"+id+"-body").css("width",wcenter);
                            $("#"+id+"-body").css("max-width",wcenter);
                            $("#"+id+"-background").css("width",wcenter);
                            $("#"+id+"-background").css("max-width",wcenter);

                            this.widget.children[c].doLayout();                            
                        }
                        else if (this.widget.children[c].area == "east")
                        {
                            $("#"+id).css("height",hcenter);
                            $("#"+id).css("max-height",hcenter);
                            $("#"+id+"-body").css("height",hcenter);
                            $("#"+id+"-body").css("max-height",hcenter);
                            $("#"+id+"-background").css("height",hcenter);
                            $("#"+id+"-background").css("max-height",hcenter);
                            this.widget.children[c].doLayout();                            
                        }
                    }    
                    return;
                }
                else if (this.layout == "accordion")
                {
                    var bodyheight = this.resizePanel();
    
                    if (this.widget.children.length) bodyheight -= (this.widget.children.length-1) * idev.defaultTitleHeight;
                    for (var c = 0;c < this.widget.children.length;c++)
                    {
                        if (this.widget.children[c].expanded)
                        {
                            $("#" + this.widget.children[c].id).css("height",bodyheight);
                            $("#" + this.widget.children[c].id).css("max-height",bodyheight);
                        }
                        $("#" + this.widget.children[c].id).css("width",pw);
                        $("#" + this.widget.children[c].id).css("max-width",pw);
                        if (!this.widget.children[c].expanded)
                            this.widget.children[c].resize(pw,this.widget.children[c].titleHeight);
                        else
                            this.widget.children[c].resize(pw,bodyheight);
                    }
                    return;
                }
                this.resizePanel();
                for (var c = 0;c < this.widget.children.length;c++)
                {
                    try
                    {
                        this.widget.children[c].doLayout();
                    }
                    catch(e)
                    {
                        alert("DL Error:",e.description);
                        alert(this.widget.children[c].wtype)
                    }
                }
            }
            catch(e)
            {
                alert("LAYOUT Error:",e.description);
            }
        }
    });
///////////////////////////////////////////////////////////////////////////////
/*
    Base widget template class

    This is the base object from which every widget should be created

*/
///////////////////////////////////////////////////////////////////////////////
var baseWidget = idevObject.extend(
    {
        init: function(config)
        {
            if (config == null)
                this.config = {};
            else
                this.config = config;
            this.rendered = false;
            this.deferredRender = false;
            if (this.config.id != null)
            {
                if ($get(this.config.id)) 
                {
                    idev.errorHandler("Duplicate Widget ID : " + this.config.id);
                    this.config.id = null;
                    config.id = null;
                }
            }
            this.id           = this.config.id == null ? idev.internal.nextUIID() : this.config.id ;
            this.wtype        = this.config.wtype;
            this.page         = this.config.page;
            this.parent       = this.config.parent;
            this.tpl          = new idev.wTemplate();
            this.data         = this.config.data == null ? {} : this.config.data;
            this.dd           = new idevDD(this);
            this.renderTo     = this.config.renderTo;
            this.field        = this.config.field == null ? "" : this.config.field;
            this.cls          = this.config.cls == null ? "" : this.config.cls;
            this.style        = this.config.style == null ? "" : this.config.style;
            this.labelStyle   = this.config.labelStyle == null ? "" : this.config.labelStyle;
            this.x            = this.config.x;
            this.y            = this.config.y;
            this.right        = this.config.right;
            this.bottom       = this.config.bottom;
            this.width        = this.config.width;
            this.height       = this.config.height;
            this.minwidth     = this.config.minwidth;
            this.minheight    = this.config.minheight;
            this.autoDestroy  = this.config.autoDestroy == null ? false : this.config.autoDestroy;
            this.hidden       = this.config.hidden == null ? false : this.config.hidden;
            this.hideType     = this.config.hideType == null ? "display" : this.config.hideType;
			if(this.parent)
			{

				if(this.parent.id == "ui-toolbar")
				{

					this.hideType = 'visibility';
				}
			}


            this.enabled      = this.config.enabled == null ? true : this.config.enabled;
            this.padding      = this.config.padding == null ? 0 : this.config.padding;
            this.border       = this.config.border == null ? false : this.config.border;
            this.borderStyle  = this.config.borderStyle == null ? "" : this.config.borderStyle;
            this.borderColor  = this.config.borderColor == null ? "" : this.config.borderColor;
            this.ds           = this.config.ds;
            this.fn           = this.config.fn == null ? {} : this.config.fn;
			this.fn.parent	  = this;
            this.events       = this.config.events == null ? {} : this.config.events;
            this.widgets      = this.config.widgets || [];
            this.autoScroll   = this.config.autoScroll == null ? false : this.config.autoScroll;
            this.html         = this.config.html == null ? "" : this.config.html ;
            this.text         = this.config.text == null ? "" : this.config.text ;
            this.color        = this.config.color == null ? "" : this.config.color ;
            this.value        = this.config.value == null ? "" : this.config.value ;
            this.animSpeed    = this.config.animSpeed == null ? 1000 : this.config.animSpeed ;
            this.expandTime   = this.config.expandTime || 500;
            this.attr         = this.config.attr;
            this.nofloat      = this.config.nofloat;
            this.anchor       = this.config.anchor || "";
            this.anchorMargin = this.config.anchorMargin|| { left:0, top:0, right:0, bottom:0};
            this.radius       = idev.convertNulls(this.config.radius,4);
			this.disabledCls  = this.config.disabledCls || "";

            var dim = this.alignAchor();
            this.width = dim.width;
            this.height = dim.height;

            this.expanded     = true;
            if (this.parent && typeof this.x == "string")
            {
                if (this.x.substr(0,1) == "@")
                {
                    var w = $("#" + this.parent.id).width();
                    if (w == null)
                        this.x = parseInt(this.x.substr(1));
                    else
                        this.x = w - parseInt(this.x.substr(1));
                }
            }
            if (this.config.right)
            {
                var w = $("#" + this.parent.id).width();
                if (w == null)
                    this.x = this.config.right;
                else
                    this.x = w - this.config.right;
            }
            if (this.parent && typeof this.y == "string")
            {
                if (this.y.substr(0,1) == "@")
                {
                    var h = $("#" + this.parent.id).height();
                    if (h == null)
                        this.y = parseInt(this.y.substr(1));
                    else
                        this.y = h - parseInt(this.y.substr(1));
                }
            }
            if (this.config.bottom)
            {
                var h = $("#" + this.parent.id).height();
                if (h == null)
                    this.y = this.config.bottom;
                else
                    this.y = h - this.config.bottom;
            }
            if (this.border && this.borderStyle == "")
            {
                if (this.borderColor !== "")
                    this.borderStyle = "1px solid " + this.borderColor + ";";
                else if (this.wtype == 'panel')
                    this.config.panelCls += " ui-border";
                else
                    this.cls += " ui-border";
            }
            if (this.width != null) this.width = parseInt(this.width);
            if (this.minwidth != null) 
            {
                if (this.width < this.minwidth) this.width = this.minwidth;
            } 
            if (this.height != null) 
            {
                if (this.wtype != "listbox" && this.height == "auto") 
                    this.height = null;
                else 
                    if (this.height != "auto") this.height = parseInt(this.height);
            }
            if (this.minheight != null) 
            {
                if (this.height < this.minheight) this.height = this.minheight;
            } 
            if (this.x != null) this.x = parseInt(this.x);
            if (this.y != null) this.y = parseInt(this.y);
            if (this.right != null) this.right = parseInt(this.right);
            if (this.bottom != null) this.bottom = parseInt(this.bottom);

            if (this.wtype == "button" && this.height == null) this.height = 40;
            if (this.wtype == "button" && this.width== null) this.width = 80;
            this.calcElementStyle();
            this.roundCorners = this.config.roundCorners == null ? false : this.config.roundCorners;
            this.layout = this.config.layout == null ? "" : this.config.layout ;
            this.labelCls = this.config.labelCls || "";
            this.resizer = new idevResize(this);
            this.children = new Array();
            this.config.id = this.id;
            if (this.events.dblclick) this.events.dblclick = this.events.dblclick;
            if (this.events.afterRender) this.events.afterrender = this.events.afterRender;
            this.layoutConfig = this.config.layoutConfig;
            this.variable = this.config.variable;
            this.resizing = false;
            this.inLayout = false;
			idev.internal.add(this);
        },
        alignAchor:function()
        {
            var dim = { width: this.width, height: this.height};
            
            if (this.anchor != "")
            {
                if (this.rendered)
                {
                    dim.height = this.getHeight();
                    dim.width = this.getWidth();
                }
                var pos = $("#"+this.renderTo).position();
                if (pos)
                {
                    var h = this.parent.getInnerHeight();
                    var w = this.parent.getInnerWidth();
                    
                    if (pos.left == 0 &&  this.parent.labelWidth) pos.left =  this.parent.labelWidth
                    if (this.anchorMargin.left == null) this.anchorMargin.left = 0;
                    if (this.anchorMargin.top == null) this.anchorMargin.top = 0;
                    if (this.anchorMargin.right == null) this.anchorMargin.right = 0;
                    if (this.anchorMargin.bottom == null) this.anchorMargin.bottom = 0;
                    if (this.x == null && this.y == null)
                    {
                        h -=(this.anchorMargin.top + this.anchorMargin.bottom);
                        w -= (this.anchorMargin.left + this.anchorMargin.right);
                        if (this.parent.padding) w -= this.parent.padding * 2;
                    }
                    if (this.x != null) w -= this.x;
                    if (this.right != null) w -= this.right;
                    if (this.y != null) h -= this.y;
                    if (this.bottom != null) h -= this.bottom;
                    if (this.anchor.indexOf("top") !== -1) dim.height = h - pos.top;
                    if (this.anchor.indexOf("left") !== -1) dim.width = w - pos.left;
                }
                
            }
            return dim;
        },
        cssQuirks:function(css,modern)
        {
            return idev.internal.cssQuirks(css,modern);
        },
        calcElementStyle: function()
        {
            this.elementStyle = "";
            if (this.x != null || this.y != null) this.elementStyle += "position:absolute;";
            if (this.x != null) this.elementStyle += "left:" + this.x + "px;";
            if (this.y != null) this.elementStyle += "top:" + this.y + "px;";
            if (this.width != null) this.elementStyle += "max-width:" + this.width + "px;width:" + this.width + "px;";
            if (this.height != null) 
            {
                if (this.height == "auto")
                    this.elementStyle += "height:" + this.height + ";";
                else
                    this.elementStyle += "max-height:" + this.height + "px;height:" + this.height + "px;";
            }
            if (this.hidden && this.hideType == "visibility")
                this.elementStyle += "visibility:hidden;";
            else
                if (this.hidden) this.elementStyle += "display:none;";
            if (this.nofloat) this.elementStyle += "float:none;";
        },
        setDraggable: function(candrag)
        {
            if (candrag)
                $('#' + this.id).attr("draggable","Y");
            else
                $('#' + this.id).attr("draggable","N");
        },
        isDraggable: function()
        {
            return $('#' + this.id).attr("draggable") == "Y" ? true : false;
        },
        remove: function()
        {
            if (this.parent)
            {
                for (var i = 0;i < this.parent.widgets.length;i++ )
                {
                    if (this.parent.widgets[i].id == this.id)
                    {
                        this.parent.widgets.splice(i,1);
                    }
                }
            }
        },
        destroy : function(remove)
        {
            if (this.events.destroy)
            {
                this.events.destroy(this);
            }
			if(this.ds) this.ds.unbind(this);
            this.ondestroy();
            if (this.widgets)
            {
                for (var i = 0;i < this.widgets.length;i++ )
                {
                    var wgt = idev.get(this.widgets[i].id);
                    try{ wgt.destroy(); } catch(e) { }
                }
            }
            if (this.tpl) delete this.tpl;
            if (this.iScroll) delete this.iScroll;
            idev.internal.remove(this.id);
            $delay(100,function(wgt)
            {
                delete wgt;
            },this);
            if (remove) this.remove();
        },
        getPosition : function()
        {
            var pos = { x:0, y:0 };
            var p = $("#" + this.id).position();

            if (p)
            {
                pos.x = p.left;
                pos.y = p.top;
            }
            return pos;
        },
        css:function(prop,css)
        {
            return $("#" + this.id).css(prop,css);
        },
        attr:function(prop,attr)
        {
            return $("#" + this.id).attr(prop,attr);
        },
        bringForward:function()
        {
            var idx = $("#" + this.id).css("z-index");
            if (idx == "auto")
                idx = 0;
            else
                idx = parseInt(idx);
            $("#" + this.id).css("z-index",idx+1);
        },
        sendBack:function()
        {
            var idx = $("#" + this.id).css("z-index");
            if (idx == "auto")
                idx = 0;
            else
                idx = parseInt(idx);
            $("#" + this.id).css("z-index",idx-1);
        },
        hide : function()
        {
            this.hidden = true;
            if (this.hideType == "visibility")
            {
                $("#" + this.id).css("visibility","hidden");
            }
            else
            {
                $("#" + this.id).hide();
            }
            this.onhide();
        },
        show : function()
        {
            this.hidden = false;
            if (this.hideType == "visibility")
            {
                $("#" + this.id).css("visibility","visible"); 
                if (idev.isIE8() && this.wtype == "icon")
                {
                    this.refresh();
                }
            }
            else
            {
                $("#" + this.id).show();
            }
            this.onshow();
        },
        isVisible: function()
        {
            return $("#"+this.id).is(":visible");
        },
        fadeOut : function(animSpeed,easing,callback)
        {
            if (animSpeed == null) animSpeed = this.animSpeed;
            $("#" + this.id).fadeOut(animSpeed,easing,callback);
        },
        fadeIn : function(animSpeed,easing,callback)
        {
            if (animSpeed == null) animSpeed = this.animSpeed;
            $("#" + this.id).fadeIn(animSpeed,easing,callback);
        },
        fadeToggle : function(animSpeed,easing,callback)
        {
            if (animSpeed == null) animSpeed = this.animSpeed;
            $('#' + this.id).fadeToggle(speed,easing,callback);
        },
        moveTo : function(x,y,animSpeed,easing,callback)
        {
            var obj = this;
            if (easing == null) easing = "linear";
            if (animSpeed == null) animSpeed = "fast";
            $('#' + this.id).animate({
                left:x,
                top:y
            },
            animSpeed,
            easing,
            callback
            );
        },
        moveBy : function(x,y,animSpeed,easing,callback)
        {
            if (easing == null) easing = "linear";
            if (animSpeed == null) animSpeed = "fast";
            $('#' + this.id).animate({
                left:"+=" + x,
                top:"+=" + y
            },
            animSpeed,
            easing,
            callback
            );
        },
        animate : function(properties,animSpeed,easing,callback)
        {
            if (properties == null) return;
            if (easing == null) easing = "linear";
            if (animSpeed == null) animSpeed = "fast";
            $('#' + this.id).animate(properties, animSpeed, easing, callback );
        },
        focus : function()
        {
            if (this.wtype == "input" || this.wtype == "textarea" ||
               this.wtype == "combo")
            {
                $delay(100,function(id)
                {
                    var el = $('#' + id + "-input");
                    el.focus();
                    if (idev.isFF())
                    {
                        var pos = el.value.length;
                        el.focus();
                        el.setSelectionRange(pos, pos);
                    }
                    else
                        el.value = el.value; // Set cursor to the end

                },this.id);
            }
            else if (this.wtype == "button")
            {
                var el = $('#'+this.id);
                el.focus();
            }
        },
        widgetCount:function()
        {
            return this.widgets.length;
        },
        enable : function(bFlag)
        {
            this.enabled = bFlag;
            if(bFlag) $('#' + this.id).removeClass(this.disabledCls);
            else  $('#' + this.id).addClass(this.disabledCls);
            if (this.wtype == "button") this.enableButton(bFlag);
        },
        isEnabled : function()
        {
            return this.enabled;
        },
        getWidth : function()
        {
            return $("#"+this.id).width();
        },
        getHeight : function()
        {
            return $("#"+this.id).height();
        },
        getInnerWidth : function()
        {
            return $("#"+this.id).innerWidth();
        },
        getInnerHeight : function()
        {
            return $("#"+this.id).innerHeight();
        },
        getParent : function()
        {
            var pid = this.renderTo;
            var p = pid.indexOf("-",3);
            if (p != -1) pid = pid.substr(0,p);
            return idev.get(pid);
        },
        getWidget : function(index)
        {
            if (index < 0 || index >= this.widgets.length) return null;
            return this.children[index];
        },
        resize: function(w,h)
        {                     
            if (this.resizing) return;
            this.resizing = true;
            $("#" + this.id).css("width",w);
            $("#" + this.id).css("max-width",w);
            $("#" + this.id).css("height",h);
            $("#" + this.id).css("max-height",h);
            if (this.area == "west" || this.area == "east")
            {
                $("#"+this.id+"-filler").css("height",h);
            }
            this.width = w;
            this.height = h; 
            if (this.events.onResize) this.events.onResize(this);
            this.doLayout();
            this.resizing = false;
        },
        fireEvent:function(sEvent,params)
        {
            try{
                this.events[sEvent].call(this,this,params);
                return true;
            }
            catch(e)
            {
                return false;
            }
        },
        doResize : function(bResize)
        {
            if (bResize)
            {
                this.resizer.add();
            }
            else
            {
                this.resizer.remove();
            }

        },
        collapse : function(h)
        {
            $('#' + this.id).animate({height: h + 'px'},this.expandTime);
            this.expanded = false;
            $('#'+this.id+"-expand").addClass("ui-panel-btn-expand");
            $('#'+this.id+"-expand").removeClass("ui-panel-btn-collapse");
        },
        expand : function()
        {
            $('#' + this.id).animate({height: this.height + 'px'},this.expandTime);
            this.expanded = true;
            $('#'+this.id+"-expand").removeClass("ui-panel-btn-expand");
            $('#'+this.id+"-expand").addClass("ui-panel-btn-collapse");
        },
        collapseWidth : function(w)
        {
            $('#' + this.id).animate({width: w + 'px'},this.expandTime);
            this.expanded = false;
        },
        expandWidth : function()
        {
            $('#' + this.id).animate({width: this.width + 'px'},this.expandTime);
            this.expanded = true;
        },
        addEvent: function(sEvent,fn)
        {
            $('#' + this.id).bind(sEvent,fn);
        },
        removeEvent: function(sEvent)
        {
            $('#' + this.id).unbind(sEvent);
        },
        doLayout: function()
        {     
            if (this.inLayout) return;
            this.inLayout = true;
            if (this.bottom)
            {
                var y = 0;
                if (this.parent.wtype == "panel")
                    y = $('#' + this.parent.id + "-content").height() - this.bottom;
                else
                    y = $('#' + this.parent.id).height() - this.bottom;
                $("#"+this.id).css("top",y);
            }
            if (this.right) 
            {
                var x = 0;
                if (this.parent.wtype == "panel")
                    x = $('#' + this.parent.id + "-content").width() - this.right;
                else
                    x = $('#' + this.parent.id).width() - this.right;
                $("#"+this.id).css("left",x);
            }
            if (this.anchor != "")
            {
                var dim = this.alignAchor();
                $("#"+this.id).width(dim.width);
                $("#"+this.id).height(dim.height);
            }
            if (this.events.onLayout) this.events.onLayout(this);
            for (var c = 0;c < this.children.length;c++) this.children[c].doLayout();
            this.inLayout = false;
        },
        // Stub functions
        beforeResize: function()
        {
        },
        afterResize: function()
        {
        },
        ondestroy: function()
        {
        },
        onhide: function()
        {
            if (this.parent)
            {
                if (this.parent.layout == "form")
                {
                    $("#"+this.id+"-label").hide();
                }
            }
            if (this.events.hide) this.events.hide(this);
            for (var i = 0;i < this.widgets.length;i++ )
            {
                var wgt = idev.get(this.widgets[i].id);
                try{ wgt.onhide(); } catch(e) { }
            }
        },
        onshow: function()
        {
            if (this.parent) 
            {
                if (this.parent.layout == "form" && this.hidden !== true)
                {
                    $("#"+this.id+"-label").show();
                }
            }
            if (this.events.show) this.events.show(this);
            try{ 
                for (var i = 0;i < this.widgets.length;i++ )
                {
                    var wgt = idev.get(this.widgets[i].id);
                    wgt.onshow();
                }
            } catch(e) { }
        },
        refresh: function()
        {
        },
        setOpacity: function(op, suf)
        {
            if (isNaN(op)) return;
            var id = this;
            if(suf) id += "-" + suf;
            id.css("opacity",op);
        },
        getValue: function()
        {
          return "";
        },
        setValue: function()
        {
        }
    });

///////////////////////////////////////////////////////////////////////////////
/*
    Core iDevUI object

    All functionality of the framework stems from this object.

    All dependant file and stylesheets are loaded automatically by the core.

    The application _preferences object defines any additional information
*/
///////////////////////////////////////////////////////////////////////////////
var idevCore = idevObject.extend({

    ///////////////////////////////////////////////////////////////////////////
    // Intialisation Function
    //
    // NEVER call this function direct
    //
    ///////////////////////////////////////////////////////////////////////////
    init: function()
    {
        this.body = document.body;
        this.pageManager = new this.pageManagerClass();
        this.agent = navigator.userAgent.toLowerCase();
        this.widgets = new Array();
        this.plugins = new Array();
        this.pgWidth = null;
        this.pgHeight = null;
        this.heightadj = 0;
        this.body = "container";
        this.orient = "profile";
        this.geoposition = null;
        this.geoerror = null;
        this.app = null;
        this.sx = 0;
        this.ex = 0;
        this.sy = 0;
        this.ey = 0;
        this.controlHeight = 0;
        this.hasPopup = false;
        this.swipping = false;
        this.path = "js/idevui/";
        this.languagepath = "js/";
        this.blankimage = "images/s.gif";
        this.fadeOutTime = 1000;
        this.fadeInTime = 1000;
        this.animationTime = 500;
        this.uiid = 0;
        this.modals = 0;
        this.charWidth = 8;
        this._dragging = false;
        this.designMode = true;
        this.dependancy = new Array();
        this.loadedFiles = new Array();
        this.hideWidget = null;
        this.hideFN = null;
        
        // Configure for app preference
        
        _preferences.config = _preferences.config || {};
        _preferences.button = _preferences.button || {};
        _preferences.ux = _preferences.ux || [];
        _preferences.imports = _preferences.imports || [];
        _preferences.config.norightclick = _preferences.config.norightclick == null ? true : _preferences.config.norightclick;
        _preferences.config.fitDocument = _preferences.config.fitDocument == null ? true : _preferences.config.fitDocument;
        _preferences.config.pageFit = _preferences.config.pageFit == null ? true : _preferences.config.pageFit;
        _preferences.config.trapunload = _preferences.config.trapunload == null ? true : _preferences.config.trapunload;
		_preferences.config.unloadText = _preferences.config.unloadText == null ? false : _preferences.config.unloadText;
        _preferences.useCSS3 = _preferences.useCSS3 == null ? true : _preferences.useCSS3;
        _preferences.forcereload = _preferences.config.forcereload == null ? false : _preferences.config.forcereload;
         
        if (_preferences.meta)
        {
            for (var i = 0;i < _preferences.meta.length;i++)
            {
                this.dependancy.push(_preferences.meta[i]);
            }
        }
        this.dependancy.push(_preferences.libpath + "idevui.css");
        if (_preferences.theme)
        {
            if (_preferences.theme.indexOf("/") == -1)
                this.dependancy.push(_preferences.libpath + "themes/"+_preferences.theme+"/theme.css");
            else
                this.dependancy.push(_preferences.theme);
        }
        else
            this.dependancy.push(_preferences.libpath + "themes/default/theme.css");
        if (_preferences.styling) this.dependancy.push(_preferences.styling);
        this.dependancy.push(_preferences.libpath + "jquery17min.js");
        this.dependancy.push(_preferences.libpath + "jquerycookie.js");
        this.dependancy.push(_preferences.libpath + "raphaelmin.js");
        this.dependancy.push(_preferences.libpath + "iscroll.js");
        this.dependancy.push(_preferences.libpath + "icons.js");
        
        this.dependancy.push(_preferences.libpath + "jquery.animateshadow.js");
        if (_preferences.title) document.title = _preferences.title;
        this.colors = new idevColors();
        this.url = String(window.location);
        this.rawUrl = String(window.location);
        this.parameters = new Array();
        if (this.url.indexOf("?") > 0)
        {
            var p = this.url.indexOf("?");
            var sQuery = this.url.substr(p+1);
            this.url =  this.url.substr(0,p);
            var a = sQuery.split("&");

            for (var i in a)
            {
                if (typeof a[i] != "string") break;
                var b = a[i].split("=")
                this.parameters[b[0]] = b[1];
            }
        }
        this.standaloneOffset = 0;
        this.events = {
            onstartdrag:null,
            ondrag:null,
            onenddrag:null,
            onmousemove:null,
            onmousedown:null,
            onmouseup:null
        }
        // Shared data object to be used by widgets to share variables
        this.dataShare = {};
        // Set global functions and extensions to the idev object
        this.fn = {};
        this.rkey = 13;
        this.rAlphabet = "";
        while (this.rAlphabet.length < 93)
        {
            var c = String.fromCharCode(Math.floor((Math.random()*95)+1)+32);
            if (c == "%") continue;
            if (c == "*") continue;
            if (this.rAlphabet.indexOf(c) == -1)
            {
                this.rAlphabet += c;
            }
        }
        // ui message defaults
        this.defaultMWidth = 250;
        this.defaultMHeight = 150;
        this.defaultMPadding = 10;
        this.defaultMBtnWidth = 70;
        this.defaultMBtnHeight = 26;
        this.defaultMIconSize = 48;
        this.defaultMFontSize = 14; 
        this.defaultMBBarHeight = 34;
        this.defaultMBGCls = "ui-message-body";
        this.defaultMCls = "ui-message-content";
        this.defaultMTitleCls = "ui-message-title";
        this.defaultMTbarCls = "ui-message-tbar";
        this.defaultMBbarCls = "ui-message-bbar";
        this.defaultMShadow = false;
        this.defaultTitleHeight = 24;
        
        this.focusHighlight = false,
        this.highlightCSS = "0px 0px 8px #336699";
        if (this.isIE9())
        {
            this.internal.addStyle(".ie9gradient{filter:none !important;}");
        }
    },
    ///////////////////////////////////////////////////////////////////////////
    // Extend Functions Declaration
    //
    // This obejct is available for extended functions
    //
    ///////////////////////////////////////////////////////////////////////////
    funcs:  {

    },
    ///////////////////////////////////////////////////////////////////////////
    // Internal Functions Declaration
    //
    // These functions should not be accessed directly
    //
    ///////////////////////////////////////////////////////////////////////////
    internal:
    {
        cssQuirks:function(css,modern)
        {
            if (idev.isIE9()) css += " ie9gradient";
            if (idev.isIE8() && modern) css += " ui-modern";
            return css;
        },
        killBackSpace: function (e)
        {
            e = e? e : window.event;
            if((e.keyCode == 70 && e.ctrlKey) || e.keyCode == 114)
            {
                e.preventDefault();
                return false;
            }
            var t = e.target? e.target : e.srcElement? e.srcElement : null;
            if(t && t.tagName && (t.type && /(password)|(text)|(file)/.test(t.type.toLowerCase())) || t.tagName.toLowerCase() == 'textarea')
                return true;

            var k = e.keyCode? e.keyCode : e.which? e.which : null;
            if (k == 8 && e.target == null)
            {
                if (e.preventDefault)
                e.preventDefault();
                return false;
            };
            return true;
        },
        load: function(scope,s)
        {
            if (typeof idevLoader === "object") idevLoader.steps = idev.dependancy.length;
            if (typeof idevLoader === "object") idevLoader.step(idev.dependancyIndex);
            if (idev.dependancyIndex == idev.dependancy.length)
            {
                idev.internal.prepare();
                if (typeof idevLoader === "object") idevLoader.remove();
                return;
            }
            if (typeof idev.dependancy[idev.dependancyIndex] == "object")
            {
                idev.internal.addMeta(idev.dependancy[idev.dependancyIndex]);
                idev.dependancyIndex++;
                return;
            }
            var url = idev.dependancy[idev.dependancyIndex].toLowerCase();
            if (url == "")
            {
                idev.dependancyIndex++;
                idev.internal.load();
                return;
            }
            if (url.indexOf(".css") != -1)
            {
                idev.internal.addStyleSheet(idev.dependancy[idev.dependancyIndex],idev.internal.load);
            }
            else
            {
                idev.internal.addScript(idev.dependancy[idev.dependancyIndex],idev.internal.load);
            }
            idev.dependancyIndex++;
        },
        refreshCSS:function(sName)
        {
            var i, s;
            for( i = 0; ( s = document.getElementsByTagName("link")[i] ); i++ )
            {
                if( s.getAttribute("rel").indexOf("style") != -1 )
                {
                    if( s.getAttribute("href").indexOf(sName) != -1 )
                    {
                        var h=s.href.replace(/(&|\\?)forceReload=d /,'');
                        s.href=h+(h.indexOf('?')>=0?'&':'?')+'forceReload='+(new Date().valueOf());
                    }
                }
            }
        },
        callback:function()
        {
            // Stub function for any script load  that needs a callback function
        },
        loadDependants:function()
        {
            _language.setLanguage(_preferences.language);
            idev.dependancyIndex = 0;
            if (_preferences.language != "english") idev.dependancy.push(_preferences.languagepath  + _preferences.language +".js");
            if (idev.isIE7()) idev.dependancy.push(_preferences.libpath + "/charts/excanvasmin.js");
            if (idev.isIE8()) idev.dependancy.push(_preferences.libpath + "/charts/excanvasmin.js");
            if (_preferences.config.charts)
            {
                idev.dependancy.push(_preferences.libpath + "charts/jqueryflotmin.js");
                idev.dependancy.push(_preferences.libpath + "charts/jqueryflotaxislabels.js");
                idev.dependancy.push(_preferences.libpath + "charts/jqueryflotpiemin.js");
            }
            if (_preferences.ux)
            {
                for (var i = 0;i < _preferences.ux.length;i++)
                {
                    idev.dependancy.push(_preferences.libpath + "ux/" + _preferences.ux[i]);
                }
            }
            if (_preferences.imports)
            {
                for (var i = 0;i < _preferences.imports.length;i++)
                {
                    idev.dependancy.push(_preferences.apppath + _preferences.imports[i]);
                }
            }
            if (_preferences.events)
            {
                if (typeof _preferences.events.beforeLoad == "function") _preferences.events.beforeLoad();
                if (typeof _preferences.events.beforeload == "function") _preferences.events.beforeload();
            }
            idev.dependancy.push(_preferences.apppath + _preferences.app);
            idev.internal.load();
        },
        prepare: function()
        {
            idev.extensions();
            $(document).ready(function()
            {
                idev.dom = $;
                idev.pgHeight = $(document).height();
                idev.pgWidth = $(document).width();
                $("#container").html("");
                idev.internal.bind();
                if (idev.app.events)
                {
                    if (typeof idev.app.events.beforeRender == "function") idev.app.events.beforeRender();
                    if (typeof idev.app.events.beforerender == "function") idev.app.events.beforerender();
                }
                idev.internal.render();
                if (idev.app.events)
                {
                    if (idev.isTouch()) window.scrollTo(0, 1);
                    if (typeof idev.app.events.afterRender == "function") idev.app.events.afterRender();
                    if (typeof idev.app.events.afterrender == "function") idev.app.events.afterrender();
                }
                if (idev.app.width) $("#container").width(idev.app.width);
                if (idev.app.height) $("#container").height(idev.app.height);
                idev.callback();
                if (idev.isIPad()|| idev.isIPhone() || idev.isAndroid())
                {
                    if (_preferences.orientation == "portrait" || _preferences.orientation == "landscape")
                    {
                        if (_preferences.orientation == "landscape")
                            $("body").attr("orient","landscape");
                        else
                            $("body").attr("orient","profile");
                    }
                    else
                    {
                        idev.currentWidth = window.innerWidth;
                        setInterval(idev.internal.onUpdateLayout, 500);
                    }
                }
            });
        },
        isLoaded:function(s)
        {
            for (var i = 0;i < idev.loadedFiles.length;i++)
            {
                if (idev.loadedFiles[i] == s) return true
            }
            return false;
        },
        addStyle:function(css)
        {
            var datuURIs = document.createElement("link");
            css = encodeURIComponent(css).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
            document.head = document.head || document.getElementsByTagName('head'[0]);
            datuURIs.href = "data:text/css,"+css;
            datuURIs.rel = "stylesheet";
            document.head.appendChild(datuURIs);
        },
        addForceLoad: function(s)
        {
            if (_preferences.forcereload)
            {
                if (s.indexOf("?") == -1)
                    s += '?forceReload='+(new Date().valueOf());
                else
                    s += '&forceReload='+(new Date().valueOf());
            }
            return s
        }, 
        addStyleSheet: function(s,callback)
        {
            if (idev.internal.isLoaded(s))
            {
                if (callback) callback(s);
                return;
            }
            idev.loadedFiles.push(s);
            var el = document.createElement('link')
            el.rel = "stylesheet";
            el.href = idev.internal.addForceLoad(s);
            el.callback = callback
            $debug(el.href)
            if (idev.isIE7() || idev.isIE8())
            {
                el.onreadystatechange= function ()
                {
                    if (this.readyState == 'loaded' || this.readyState == 'complete')
                    {
                        idev.loadedFiles.push(s);
                        this.callback(s);
                    }
                };
            }
            else
            {
                $delay(200,function(callback)
                {
                    if (callback) callback(s);
                },callback);
            }
            document.getElementsByTagName('head')[0].appendChild(el);
        },
        addScript: function(s,callback,scope)
        {
            if (idev.internal.isLoaded(s))
            {
                idev.errorHandler("Already Loaded");
                if (callback) callback(scope);
                return;
            }
            idev.loadedFiles.push(s);
            var el = document.createElement('script')
            el.type = 'text/javascript';
            el.src = idev.internal.addForceLoad(s);
            el.callback = callback
            $debug(el.src)
            if (idev.isIE7() || idev.isIE8())
            {
                el.onreadystatechange= function ()
                {
                    if (this.readyState == 'loaded' || this.readyState == 'complete')
                    {
                        if(typeof $ != "undefined" && idev.pgWidth == null)
                        {
                            idev.pgHeight = $(document).height();
                            idev.pgWidth = $(document).width();
                        }
                        if (callback) this.callback(scope,s);
                    }
                };
            }
            else
            {
                el.onload  = function()
                {
                    if(typeof $ != "undefined" && idev.pgWidth == null)
                    {
                        idev.pgHeight = $(document).height();
                        if (window.navigator.standalone && idev.isIPad()) idev.pgHeight -= 20;
                        idev.pgWidth = $(document).width();
                    }
                    idev.loadedFiles.push(s);
                    if (callback)
                        this.callback(scope,s);
                }
                el.onerror = function()
                {
                    idev.errorHandler("Failed to load script '" + s + "'");
                    if (callback) this.callback(scope,s);
                }
            }
            document.getElementsByTagName('head')[0].appendChild(el);
        },
        addMeta: function(s,callback)
        {
            var el = document.createElement('meta')
            el.name = s.name;
            el.content = s.content;
            document.getElementsByTagName('head')[0].appendChild(el);
            if (callback)
            {
                idev.utils.delay(100,function(callback)
                {
                    callback(s);
                },callback);
            }
        },
        bind: function()  //This function binds the mouse and touch events
        {
            if(typeof document.addEventListener!='undefined')
                document.addEventListener('keydown', idev.internal.killBackSpace, false);
            else if(typeof document.attachEvent!='undefined')
                document.attachEvent('onkeydown', idev.internal.killBackSpace);
            else
            {
                if(document.onkeydown!=null)
                {
                    var oldOnkeydown=document.onkeydown;
                    document.onkeydown=function(e){
                    oldOnkeydown(e);
                    idev.internal.killBackSpace(e);
                };
            }
            else
                document.onkeydown = idev.internal.killBackSpace;
            }
            window.onerror = function(message, url, linenumber) 
            { 
                if(_preferences.verbose)
                {
                   alert("JavaScript error:\n\n" + message + "\n\nOn line " + linenumber + "\n\n" + url);
                }
                idev.errorHandler(message + "\n  On line " + linenumber + "\n  " + url)
                return true;
            }; 
            if (_preferences.config.trapunload)
            {
                // Prevent accidental closing of the app
                window.onbeforeunload = function (evt)
                {
                    if (_preferences.config.unloadText) {
						return _preferences.config.unloadText;
					} else {
						return "Are you sure that you wish to exit the application?";
					}

                }
            }
            $(window).resize(function(e)
            {
                idev.pageManager.syncSize(e);
                if (idev.app.events == null) return;
                if (typeof idev.events.onResize == "function") 
                    idev.app.events.onResize(e);
                else if (typeof idev.events.onresize == "function") 
                    idev.app.events.onresize(e);
            });

            if (_preferences.config.norightclick || _preferences.config.noRightClick)
                document.oncontextmenu = function(e)
                {
                    return false;
                };

            $(document).bind("mousedown",function(e)
            {
                var dragButton = 0;
                idev.mousedowntime = new Date();
                idev.mousemoved = false;
                idev.mousestartx = e.pageX;
                idev.mousestarty = e.pageY;
                idev.mouseendx = e.pageX;
                idev.mouseendy = e.pageY;
                if (e == null) e = window.event;
                if (idev.isIE7()) dragButton = 1;
                if (idev.isIE8()) dragButton = 1;
                if (idev.events.onmousedown) idev.events.onmousedown(e);
                if (idev.hideFN)
                {
                    idev.hideFN(idev.hideWidget,e);
                    idev.hideFN = null;
                    idev.hideWidget = null;
                }
                idev.orgEvent = e;
                if (idev.hideWidget)
                {
                    var target = e.target != null ? e.target : e.srcElement;

                    if (target)
                    {
                        if (target.id.substr(0,idev.hideWidget.id.length) != idev.hideWidget.id && target.parentElement && target.parentElement.id.substr(0,idev.hideWidget.id.length) != idev.hideWidget.id)
                        {
                            $delay(99,function()
                            {
                                if (idev.hideWidget)
                                {
                                    if (idev.hideWidget.parent) idev.hideWidget.parent.visible = false;
                                    idev.hideWidget.hide();
                                    idev.hideWidget = null;
                                }
                            });
                        }
                    }
                }
                if (e.button == dragButton)
                {
                    var target = e.target != null ? e.target : e.srcElement;
                    var titleFound = false;

                    if (target.id && target.id.indexOf("-wrapper") != -1) return;
                    idev.dd = false;
                    idev.widgetMoved = false;
                    idev._dragWidgetId = target.id;
                    while (target)
                    {
                        if (target.id && target.id.indexOf("-title") != -1) titleFound = true;
                        idev._dragWidget = idev.get(target.id);
                        if (idev._dragWidget)
                        {
                            if (idev._dragWidget.dd.allowDrag)
                            {
                                idev._dragWidget.dd.startDD(e);
                                idev.dd = true;
                                document.onselectstart = function () { return false; };
                                target.ondragstart = function() { return false; };
                                var mousePos = idev.utils.mousePosition(e);
                                idev._sX = mousePos.x;
                                idev._sY = mousePos.y;
                                return false;
                            }
                        }
                        var draggable = $("#" + target.id).attr("draggable");
                        if (draggable == "Y")
                        {
                            if (!titleFound && idev._dragWidget)
                            {
                                if (idev._dragWidget.wtype != "window")
                                {
                                    titleFound = true;
                                }
                            }
                            break;
                        }
                        if (idev._dragWidget)
                        {
                            if (idev._dragWidget.wtype == "button")
                            {
                                var draggable = $("#" + target.id).attr("draggable");
                                if (draggable != "Y")
                                {
                                    return;
                                }
                            }
                        }
                        target = target.parentNode;
                        if (target == null)
                        {
                            return;
                        }
                    }
                    if(idev._dragWidget.wtype == "window" && !titleFound)
                    {
                        return;
                    }
                    idev._resizable = false;
                    if (idev._dragWidgetId.indexOf("-drhandle") != -1)
                    {
                        idev._resizable = $("#" + target.id).attr("resizable") == "Y" ? true : false;
                    }
                    if (idev._dragWidget.events.beforedrag)
                    {
                        if (idev._dragWidget.events.beforedrag(idev._dragWidget) === false) return false;
                    }
                    if (!idev._dragWidget.resizer.isResizing())
                    {
                        if (idev._dragWidget.wtype == 'panel')
                        {
                            if (idev._dragWidget.title)
                            {
                                if (idev._dragWidgetId.indexOf("-titletext") == -1) return;
                            }
                            else
                            {
                                var div = $('#'+idev._dragWidgetId);
                                if (div)
                                {
                                    var hasVerticalScrollbar = div.scrollHeight>div.clientHeight;
                                    if (hasVerticalScrollbar)
                                    {
                                        var mousePos  = idev.utils.mousePosition(e);
                                        if (mousePos.x > $("#"+idev._dragWidgetId).width() - 20) 
                                            return;
                                    }
                                }
                            }
                        }
                    }
                    idev._cursor = null;
                    var mpos = idev.internal.getMouseOffset(target,e);
                    var mousePos = idev.utils.mousePosition(e);

                    idev._startX = mpos.x;
                    idev._startY = mpos.y;
                    idev._sX = mousePos.x;
                    idev._sY = mousePos.y;
                    idev._dragging = true;

                    idev._offsetX = 10;
                    idev._offsetY = 10;

                    // bring the clicked element to the front while it is being dragged
                    idev._oldZIndex = target.style.zIndex;
                    target.style.zIndex = 20000;
                    idev._dragElement = target;

                    document.onselectstart = function () { return false; };
                    target.ondragstart = function() { return false; };
                    if (idev._dragWidget.events.startdrag) idev._dragWidget.events.startdrag(idev._dragWidget,e);
                    if (idev.events.onstartdrag) idev.events.onstartdrag(idev._dragWidget,e);
                    return false;
                }
            });
            $(document).bind("mousemove",function(e)
            {
                if (e == null) e = window.event;

                idev.mousemoved = true;
                idev.mouseendx = e.pageX;
                idev.mouseendy = e.pageY;
                if(idev.dd)
                {
                    idev.dd = false;
                    idev._dragElement = e.target != null ? e.target : e.srcElement;
					var id = idev.findID(idev._dragElement).id;
					if (id.indexOf(idev._dragWidget.id) == 0)
					{

						idev._dragWidget.dd.move(e);
						idev.dd = true;
						idev.widgetMoved = true;
						e.preventDefault();
						return;
					}

					var dragid = idev._dragWidget.id + "-dd";
                    var pos = id.indexOf("-",3);                    
                    if (pos == -1)pos = id.indexOf("_",3);
                    if (pos != -1 && id != dragid)
                    {
                        id = id.substr(0,pos);
                        var wgt = $get(id);
                        if (wgt)
                        {
                            wgt.dd.canDrop(idev._dragWidget);
                        }
                    }
                    idev._dragWidget.dd.move(e);
                    idev.dd = true;
                    idev.widgetMoved = true;
                    e.preventDefault();
                }
                else if (idev._dragging)
                {
                    if (idev._cursor == null)
                    {
                        idev._cursor = $('#' + idev._dragElement.id).css("cursor");
                        $('#' + idev._dragElement.id).css("cursor","move");
                    }
                    var mousePos = idev.utils.mousePosition(e);
                    var left = parseInt(mousePos.x - idev._startX);
                    var top = parseInt(mousePos.y -  (idev._startY + idev.app.toolbar.height + idev._offsetY));
                    var dx = mousePos.x - idev._sX;
                    var dy = mousePos.y - idev._sY;
                    idev._sX =  mousePos.x;
                    idev._sY = mousePos.y;
                    if (idev._resizable)
                    {
						var left = parseInt(idev._dragElement.style.left.replace("px","")) + dx;
                        var top = parseInt(idev._dragElement.style.top.replace("px",""))+ dy;
                        var oldLeft = parseInt(idev._dragElement.style.left.replace("px",""));
                        var oldTop = parseInt(idev._dragElement.style.top.replace("px",""));
                        var oldWidth = parseInt(idev._dragElement.style.width.replace("px",""));
                        var oldHeight = parseInt(idev._dragElement.style.height.replace("px",""));
                        if (idev._dragWidgetId.indexOf("-drhandlenw") != -1)
                        {
                            idev._dragWidget.resizer.change(left,top,oldWidth-dx,oldHeight-dy);
                        }
                        else if (idev._dragWidgetId.indexOf("-drhandlene") != -1)
                        {
                            idev._dragWidget.resizer.change(oldLeft,top,(oldWidth+dx),(oldHeight-dy));
                        }
                        else if (idev._dragWidgetId.indexOf("-drhandlen") != -1)
                        {
                            idev._dragWidget.resizer.change(oldLeft,top,oldWidth,oldHeight-dy);
                        }
                        else if (idev._dragWidgetId.indexOf("-drhandlew") != -1)
                        {
                            idev._dragWidget.resizer.change(left,oldTop,oldWidth-dx,oldHeight);
                        }
                        else if (idev._dragWidgetId.indexOf("-drhandlese") != -1)
                        {
                            idev._dragWidget.resizer.change(oldLeft,oldTop,oldWidth+dx,oldHeight+dy);
                        }
                        else if (idev._dragWidgetId.indexOf("-drhandlesw") != -1)
                        {
                            idev._dragWidget.resizer.change(left,oldTop,oldWidth-dx,oldHeight+dy);
                        }
                        else if (idev._dragWidgetId.indexOf("-drhandles") != -1)
                        {
                            idev._dragWidget.resizer.change(oldLeft,oldTop,oldWidth,oldHeight+dy);
                        }
                        else if (idev._dragWidgetId.indexOf("-drhandlee") != -1)
                        {
                            idev._dragWidget.resizer.change(oldLeft,oldTop,oldWidth+dx,oldHeight);
                        }
                    }
                    else
                    {
                        var left = parseInt(idev._dragElement.style.left.replace("px",""));
                        var top = parseInt(idev._dragElement.style.top.replace("px",""));
                        idev._dragElement.style.left = (left + dx) + 'px';
                        idev._dragElement.style.top = (top + dy) + 'px';
                        e.preventDefault();
                        if (dx !=0 || dy != 0) idev.widgetMoved = true;
                        if (idev._dragWidget.events.ondrag) idev._dragWidget.events.ondrag(idev._dragWidget,e);
                        if (idev.events.ondrag) idev.events.ondrag(idev._dragWidget,e);
                    }
                }
                else
                {
                    if (idev.events.onmousemove) idev.events.onmousemove(e);
                }
            });
            $(document).bind("mouseup",function(e)
            {
                if (e == null) e = window.event;

                idev.mouseuptime = new Date();
                if (idev.events.onmouseup) idev.events.onmouseup(e);
                if(idev.dd)
                {
                    idev.dd = false;
                    if (idev._dragWidget) idev._dragWidget.dd.endDD();
                    if (idev._dragWidget.dd.allowDrag && !idev.widgetMoved)
                    {
                        if (idev._dragWidget.enabled)
                        {
                            if (idev._dragWidget.events.click)
                                idev._dragWidget.events.click(idev._dragWidget,idev.orgEvent);
                        }
                    }
                    document.onselectstart = null;
                    e.preventDefault();
                    return;
                }
                if (idev._dragging)
                {
                    idev._dragElement.style.zIndex = idev._oldZIndex;
                    idev._dragElement.ondragstart = function() { return true; };
                    if (idev._cursor != null)
                        $('#' + idev._dragElement.id).css("cursor",idev._cursor);
                    idev._dragElement = null;
                    idev._dragging = false;
                    document.onselectstart = null;
                    if (idev._dragWidget)
                    {
                        if (idev.widgetMoved)
                        {
                            if (idev._dragWidget.events.afterdrag) idev._dragWidget.events.afterdrag(idev._dragWidget,e);
                        }
                    }
                    if (idev.events.onenddrag) idev.events.onenddrag(idev._dragWidget,e);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
            if (idev.isTouch())
            {
                document.addEventListener("touchstart",function(e)
                {
                    var target = e.target != null ? e.target : e.srcElement;

                    idev.mousedowntime = new Date();
                    idev.mousemoved = false;
                    idev._swipping = false;
                    idev.widgetMoved = false;
                    var touch = e.touches[0];
                    idev.mousestartx = touch.pageX;
                    idev.mousestarty = touch.pageY;
                    idev.mouseendx = touch.pageX;
                    idev.mouseendy = touch.pageY;
                    while (target)
                    {
                        idev._dragWidget = idev.get(target.id);
                        var draggable = $("#" + target.id).attr("draggable");
                        if (draggable == "Y") break;
                        if (idev._dragWidget)
                        {
                            if (idev._dragWidget.wtype == "button")
                            {
                                var draggable = $("#" + target.id).attr("draggable");
                                if (draggable != "Y")
                                {
                                    return;
                                }
                            }
                        }
                        target = target.parentNode;
                        if (target == null)
                        {
                            if (idev.pageManager.animationType == "slide" && e.target.id.indexOf("-content") != -1)
                            {
                                idev._swipping = true;
                                idev._startX = touch.pageX;
                                idev._startY = touch.pageY;
                            }
                            return;

                        }
                    }
                    if (idev._dragWidget.events.beforedrag)
                    {
                        if (idev._dragWidget.events.beforedrag(idev._dragWidget) === false) return false;
                    }
                    var x = parseInt(target.style.left.replace("px",""));
                    var y = parseInt(target.style.top.replace("px",""));
                    idev._startX = touch.pageX - x;
                    idev._startY = touch.pageY - y;
                    idev._dragging = true;

                    // bring the clicked element to the front while it is being dragged
                    idev._oldZIndex = target.style.zIndex;
                    target.style.zIndex = 10000;
                    idev._dragElement = target;
                    if (idev._dragWidget.events.startdrag) idev._dragWidget.events.startdrag(idev._dragWidget);
                    if (idev.events.onstartdrag) idev.events.onstartdrag(idev._dragWidget,e);
                    return false;
                });
                document.addEventListener("touchmove",function(e)
                {
                    var touch = e.touches[0];
                    idev.mouseendx = touch.pageX;
                    idev.mouseendy = touch.pageY;
                    idev.mousemoved = true;
                    if (idev.events.onmousemove) idev.events.onmousemove(e);
                    idev.mousemoved = true;
                    if (idev._dragging)
                    {
                        idev._dragElement.style.left = (touch.pageX - idev._startX) + 'px';
                        idev._dragElement.style.top = (touch.pageY -  (idev._startY )) + 'px';
                        e.preventDefault();
                        idev.widgetMoved = true;
                        idev._endX = touch.pageX;
                        idev._endY = touch.pageY;
                        if (idev._dragWidget.events.ondrag) idev._dragWidget.events.ondrag(idev._dragWidget,e);
                    }
                    if (idev._swipping)
                    {
                        var touch = e.touches[0];
                        idev._endX = touch.pageX;
                        idev._endY = touch.pageY;
                    }
                    if (idev.events.onmousemove) idev.events.onmousemove(e);
                });
                document.addEventListener("touchend",function(e)
                {
                    idev.mouseuptime = new Date();
                    // Ignore small movements
                    if (idev.mouseendx - idev.mousestartx < 20 &&
                        idev.mouseendy - idev.mousestarty < 20 && !idev._dragging)
                        {
                            idev.mousemoved = false;
                        }
                    if (idev.events.onmouseup) idev.events.onmouseup(e);
                    if (idev._dragging)
                    {
                        idev._dragElement.style.zIndex = idev._oldZIndex;
                        idev._dragElement = null;
                        idev._dragging = false;
                        document.onselectstart = null;
                        if (idev._dragWidget)
                        {
                            if (idev._dragWidget.events.afterdrag) idev._dragWidget.events.afterdrag(idev._dragWidget);
                        }
                        if (idev.events.onenddrag) idev.events.onenddrag(idev._dragWidget,e);
                    }
                    if (idev._swipping)
                    {
                        var dx = idev._endX - idev._startX;
                        if (dx > 100) idev.prevPage();
                        if (dx < -100) idev.nextPage();
                        idev._swipping = false;
                    }
                });
            }
        },
        onUpdateLayout : function()
        {
            if (window.innerWidth != idev.currentWidth)
            {
                idev.currentWidth = window.innerWidth;
                var orient = (idev.currentWidth < $(document).width()) ? "profile" : "landscape";
                idev.orient = orient;
                if (idev.app.events)
                {
                    if (idev.app.events.onOrientation) idev.app.events.onOrientation(idev.orient);
                }
            }
        },
        onHoverIn : function (e)
        {
            if (e == null) e = window.event;
            var p = this.id.indexOf("_");
            if (p == -1)
            {
                var wgt = idev.get(this.id);
                if (wgt.events == null) return;
                if (wgt.events.click == null) return;
                if(wgt.resizer.resizing) return;
                if (wgt.enabled)
                {
                    wgt.events.hover(wgt,true,e);
                }
            }
            else
            {
                var id = this.id.substr(0,p);
                var dsIndex = this.id.substr(p+1);
                var wgt = idev.get(id);
                if (wgt.events == null) return;
                if (wgt.events.click == null) return;
                wgt.dsIndex = parseInt(dsIndex);
                if(wgt.resizer.resizing) return;
                if (wgt.enabled)
                {
                    wgt.events.hover(wgt,true,dsIndex,wgt.selected,e);
                }
            }
        },
        onHoverOut: function (e)
        {
            if (e == null) e = window.event;
            var p = this.id.indexOf("_");
            if (p == -1)
            {
                var wgt = idev.get(this.id);
                if (wgt.events == null) return;
                if (wgt.events.click == null) return;
                if(wgt.resizer.resizing) return;
                if (wgt.enabled)
                {
                    wgt.events.hover(wgt,false,e);
                }
            }
            else
            {
                var id = this.id.substr(0,p);
                var dsIndex = this.id.substr(p+1);
                var wgt = idev.get(id);
                if (wgt.events == null) return;
                if (wgt.events.click == null) return;
                wgt.dsIndex = parseInt(dsIndex);
                if(wgt.resizer.resizing) return;
                if (wgt.enabled)
                {
                    wgt.events.hover(wgt,false,dsIndex,wgt.selected,e);
                }
            }
        },
        onClick : function (e)
        {
            if (e == null) e = window.event;
            if (idev.widgetMoved) return;
            var p = this.id.indexOf("_",1);
            if (p == -1)
            {
                var wgt = idev.get(this.id);
                if (wgt.events == null) return;
                if (wgt.events.click == null) return;
                if(wgt.resizer.resizing) {
					e.preventDefault();
					e.stopPropagation();
					return;
                }
                if (wgt.enabled)
                {
                    try
                    {
                        wgt.events.click(wgt,e);
                    }
                    catch(e)
                    {
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            else
            {
                var id = this.id.substr(0,p);
                var dsIndex = this.id.substr(p+1);
                var wgt = idev.get(id);
                if (wgt.events == null) return;
                wgt.dsIndex = parseInt(dsIndex);
                if(wgt.resizer.resizing) return;
                if (wgt.enabled)
                {
                    if (wgt.autoSelect)
                    {
                        if (wgt.selected != -1)
                        {
                            $( '#' +  wgt.id + "_" + wgt.selected).removeClass(wgt.selectCls);
                            if (wgt.selectColor != "")
                                wgt.updateItem(wgt.selected,"background-color","");
                        }
                        if (wgt.selectCls != "")
                        {
                            $( '#' +  this.id).addClass(wgt.selectCls);
                        }
                        if (wgt.selectColor != "")
                            wgt.updateItem(dsIndex,"background-color",wgt.selectColor);
                    }
                    var oldselection = wgt.selected;
                    wgt.selected = parseInt(dsIndex);
                    if (wgt.events.click)
                    {
                        wgt.events.click(wgt,dsIndex,oldselection,e);
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }
            }
        },
        onDblClick : function (e)
        {
            if (e == null) e = window.event;
            var p = this.id.indexOf("_");
            if (p == -1)
            {
                var wgt = idev.get(this.id);
                if (wgt.events == null) return;
                if (wgt.events.dblclick == null) return;
                if(wgt.resizer.resizing) return;
                if (wgt.enabled)
                {
                    wgt.events.dblclick(wgt,e);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            else
            {
                var id = this.id.substr(0,p);
                var dsIndex = this.id.substr(p+1);
                var wgt = idev.get(id);
                if (wgt.events == null) return;
                if (wgt.events.dblclick == null) return;
                wgt.dsIndex = parseInt(dsIndex);
                if(wgt.resizer.resizing) return;
                if (wgt.enabled)
                {
                    wgt.events.dblclick(wgt,dsIndex,wgt.selected,e);
                    wgt.selected = dsIndex;
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

        },
        onContextMenu : function (e)
        {
            if (e == null) e = window.event;
            var wgt = idev.get(this.id);

            if (wgt.events.contextMenu)
                wgt.events.contextMenu(wgt,e);
            else  if (wgt.events.contextmenu)
                wgt.events.contextmenu(wgt,e);

        },
        onChange : function (e)
        {
            if (e == null) e = window.event;
            var wgt = idev.get(this.id);
            wgt.events.change(wgt,e);

        },
        onLostFocus: function(e)
        {
            if (e == null) e = window.event;
            var wgt = idev.get(this.id.replace("-input",""));

            if (wgt)
            {
                if (wgt.watermark != "" && wgt.watermark != null)
                {
                    var v = $('#'+wgt.id+"-input").val() || "";
                    if (v == "")
                    {
                        wgt.setValue("");
                    }
                }
                if (idev.focusHighlight) idev.dom("#"+wgt.id).css("box-shadow","");
                if (wgt.events.lostfocus) wgt.events.lostfocus(wgt,e);
            }
        },
        onFocus: function(e)
        {
            if (e == null) e = window.event;
            var wgt = idev.get(this.id.replace("-input",""));
            if (wgt)
            {
                if (wgt.watermark != "")
                {
                    if (wgt.watermark == $('#'+wgt.id+"-input").val())
                    {
                        $('#'+wgt.id+"-input").val("");
                        $('#'+wgt.id+"-input").css("color","");
                    }
                }
                if (idev.focusHighlight) idev.dom("#"+wgt.id).css("box-shadow",idev.highlightCSS);
                if (wgt.events.focus) wgt.events.focus(wgt,e);
            }
        },
        onKeypress: function (e)
        {
            var wgt = idev.get(this.id);

            if (wgt.events.keypress) wgt.events.keypress(wgt,e);

        },
        beforeRender: function(wgt)
        {
            if (wgt.events == null) return;
            if (typeof wgt.events.beforeRender == "function") 
                wgt.events.beforeRender(wgt);
            else if (typeof wgt.events.beforerender == "function") wgt.events.beforerender(wgt);
        },
        afterRender: function(wgt)
        {
            if (wgt.events == null) return;
            if (typeof wgt.events.afterRender == "function") 
                wgt.events.afterRender(wgt);
            else if (typeof wgt.events.afterrender == "function") wgt.events.afterrender(wgt);
        },
        remove : function (id)
        {
			var widget = idev.widgets[id];
			if (widget.id != null) {
				if (widget.parent) {
					if (widget.parent.children) {
						// Remove widget object from parent child list
						for (var c = 0;c < widget.parent.children.length;c++) {
							if(widget.parent.children[c] == widget) {
								widget.parent.children.splice(c,1);
								break;
							}
						}
					}
				}
				$('#' +  widget.id).remove();
				delete idev.widgets[id];
				return true;
			}
			return false;
        },
        nextUIID : function(prefix)
        {
            idev.uiid++;
            sID = idev.uiid.toString();
            while (sID.length < 6) sID = "0" + sID;
            if (prefix != null) return prefix + sID;
            return "ID" + sID;
        },
        renderWidget : function ( page, widget )
        {
            var wgt = null;

            widget.page = page;
            if (widget.renderTo == null)
                widget.renderTo = page.id;
            else if (widget.renderTo == "")
                widget.renderTo = page.id;
            if (widget.deferredRender)
            {
                return;
            }
            if (widget instanceof baseWidget)
            {
                widget.render();
                if (widget.parent) if (widget.parent.children) widget.parent.children.push(widget);
                return widget.id;
            }
            switch (widget.wtype)
            {
                case "checkbox" :
                    wgt = new idev.ui.widgetCheckbox(widget);
                    break;
                case "radio" :
                    wgt = new idev.ui.widgetRadio(widget);
                    break;
                case "element" :
                    wgt = new idev.ui.widgetElement(widget);
                    break;
                case "html" :
                    wgt = new idev.ui.widgetHTML(widget);
                    break;
                case "spacer" :
                    wgt = new idev.ui.widgetSpacer(widget);
                    break;
                case "image" :
                    wgt = new idev.ui.widgetImage(widget);
                    break;
                case "input" :
                case "textfield" :
                    wgt = new idev.ui.widgetTextField(widget);
                    break;
                case "textarea" :
                    wgt = new idev.ui.widgetTextArea(widget);
                    break;
                case "combo" :
                    wgt = new idev.ui.widgetComboBox(widget);
                    break;
                case "label" :
                    wgt = new idev.ui.widgetLabel(widget);
                    break;
                case "svgbutton" :
                    wgt = new idev.ui.widgetSVGButton(widget);
                    break;
                case "button" :
                    wgt = new idev.ui.widgetButton(widget);
                    break;
                case "switch" :
                    wgt = new idev.ui.widgetSwitch(widget);
                    break;
                case "icon" :
                    wgt = new idev.ui.widgetIcon(widget);
                    break;
                case "listbox" :
                    wgt = new idev.ui.widgetListbox(widget);
                    break;
                case "panel" :
                    wgt = new idev.ui.widgetPanel(widget);
                    break;
                case "list" :
                    wgt = new idev.ui.widgetList(widget);
                    break;
                case "dataview" :
                    wgt = new idev.ui.widgetDataView(widget);
                    break;
                case "canvas" :
                    wgt = new idev.ui.widgetCanvas(widget);
                    break;
                case "chart" :
                    wgt = new idev.ui.widgetChart(widget);
                    break;
                case "slider" :
                    wgt = new idev.ui.widgetSlider(widget);
                    break;
                case "progressbar" :
                    wgt = new idev.ui.widgetProgress(widget);
                    break;
                case "iframe" :
                    wgt = new idev.ui.widgetIFrame(widget);
                    break;
                case "object" :
                    wgt = new idev.ui.widgetObject(widget);
                    break;
                case "grid" :
                    wgt = new idev.ui.widgetGrid(widget);
                    break;
                case "tabpanel" :
                    wgt = new idev.ui.widgetTabPanel(widget);
                    break;
                case "sound" :
                    wgt = new idev.ui.widgetSound(widget);
                    break;
                case "composite" :
                    wgt = new idev.ui.widgetComposite(widget);
                    break;
                default:
                    var plugin =  idev.plugins[widget.wtype];
                    if (plugin)
                    {
                        wgt = new plugin(widget);
                    }
                    else
                        idev.errorHandler("NULL PLUGIN FOR:[" + widget.wtype + "]");
                    break;
            }
            if (wgt != null)
            {
                wgt.render();
                if (widget.parent) if (widget.parent.children) widget.parent.children.push(wgt);
                return wgt.id;
            }
            else
                idev.errorHandler("Unknown widget '" + widget.wtype + "'");
            return "";
        },
        renderWidgets : function(page, renderTo, widgets, layout, labelWidth, parent)
        {
            var tableID;

            if (widgets == null) return;
            if (labelWidth == null) labelWidth= 0;
            if (layout == "table")
            {
                var col = 0;
                var cell = 0;

                if (parent == null) return;
                if (parent.columns == null) return;
                if (parent.columns == 0) return;

                var w = $("#" + parent.id).width()-2;
                parent.attr = parent.attr == null ? " cellspacing=0 cellpadding=0" : parent.attr ;
                var sHTML = "<table class='ui-table' id='" + renderTo + "-table' " + parent.attr + " border=0 width='" + w + "px;'><tbody id='" + renderTo + "-body'></tbody></table>";

                $('#' + renderTo).append(sHTML);
                tableID = renderTo + "-body";

                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];

                    if (typeof widget == "undefined")
                    {
                        break;
                    }
                    if (widget.wtype != null)
                    {
                        widget.page = page;
                        widget.parent = parent;
                        if (col == 0)
                        {
                            var sHTML = "";
                            var sAttr = widget.attr || "";

                            sHTML = "<tr>";
                            if (parent.rowHeight > 0) sHTML = "<tr height=" + parent.rowHeight + " >"
                            for (var c = 0;c < parent.columns;c++)
                            {
                                var cellStyle = "";
                                var wgt = widgets[i+c];

                                if (wgt != null)
                                {
                                    if (wgt.wtype != null)
                                    {
                                        if (wgt.cellStyle) cellStyle = wgt.cellStyle;
                                    }
                                    renderTo = tableID + "-cell" + (cell + c);
                                    sHTML += "<td valign='top' id='" + renderTo + "' " + sAttr +" style='" + cellStyle + "'></td>";
                                    var cs = sAttr.toLowerCase().indexOf("colspan");
                                    if (cs != -1)
                                    {
                                        var s = sAttr.substr(cs+7);
                                        s = idev.utils.ltrim(s);
                                        s = s.replace("=","");
                                        try
                                        {
                                            var skip = parseIn(s);
                                            if (skip > 1) c += (skip-1);
                                        }
                                        catch(e)
                                        {
                                            c++;
                                        }
                                    }
                                }
                                else
                                {
                                    renderTo = tableID + "-cell" + (cell + c);
                                    sHTML += "<td valign='top' id='" + renderTo + "' " + sAttr +"></td>";
                                }
                            }
                            sHTML += "</tr>";
                            $('#' + tableID).append(sHTML);
                        }
                        renderTo = tableID + "-cell" + cell;
                        try
                        {
                            widget.wtype = widget.wtype.toLowerCase();
                            widget.renderTo = renderTo;
                            widget.id = idev.internal.renderWidget( page, widget );
                        }
                        catch(err)
                        {
                            alert("error0:" + err.message );
                        }
                        col++;
                        if (col == parent.columns) col = 0;
                        cell++;
                    }
                }
                return;
            }
            if (layout == "column")
            {
                var sWidth = "";
                var cell = 0;
                var spacer = 0;
                var spacerFound = false;
                var variableIDX = -1;
                var rowHeight = parent.rowHeight == null ? "" : parent.rowHeight;                
                
                parent.padding = parent.padding || 0;
                var fw = $('#' + parent.id).width();
                var fh = $('#' + parent.id + "-body").height();
                if (parent.wtype == "panel")
                {
                    fh = $('#' + parent.id + "-content").height() - (parent.padding * 2);;
                    fw = $('#' + parent.id + "-content").width() - (parent.padding * 2);;
                }
                if(fh == null)
                   fh = parent.height - parent.padding;
                if(fw == null)
                   fw = parent.width - (parent.padding * 2);
                if (parent.wtype == "composite" && parent.height)
                {
                    rowHeight = parent.height;
                }
                parent.attr = parent.attr == null ? " cellspacing=0 cellpadding=0" : parent.attr ;
                spacer = $("#" + parent.id).width();
                for (var i = 0;i < widgets.length;i++)
                {
                    
                    if (widgets[i] != ">>")
                    {
                        if (widgets[i].variable) 
                            variableIDX = i;
                    }
                    else if (widgets[i] === ">>")
                    {
                        spacerFound = true;
                    }
                }
                var sHTML = "<table class='ui-table' id='" + renderTo + "-table' border=0 " + parent.attr + "><tbody id='" + renderTo + "-body'></tbody></table>";
                if (parent)
                {
                    if (parent.wtype == "composite")
                    {
                        if (parent.width)
                        {
                             sHTML = "<table class='ui-table' id='" + renderTo + "-table' border=0  width=100% " + parent.attr + "><tbody id='" + renderTo + "-body'></tbody></table>";
                        }
                    }
                }
                $('#' + renderTo).append(sHTML);
                tableID = renderTo + "-body";

                var wHeight = null;
                if(renderTo=='ui-toolbar') wHeight=parent.height;
                if (widgets.length > 0)
                {
                    var sHTML = "";

                    sHTML = "<tr id='"+ renderTo +"-row' height='" + rowHeight+ "px'>";
                    if (parent.rowHeight > 0) 
                    {
                        sHTML = "<tr height=" + parent.rowHeight + " >";
                        wHeight = parent.rowHeight;
                    }
                    if (parent.layoutConfig)
                    {
                        wHeight = parent.height - (parent.padding * 2);
                        if (parent.wtype == "panel")
                        {
                            wHeight = parent.bodyheight - (parent.padding * 2);
                        }
                        if (parent.layoutConfig.fit) 
                        {
                            sHTML = "<tr height=" + wHeight + " >";
                        }
                    }
                    for (var c = 0;c <  widgets.length;c++)
                    {
                        var widget = widgets[c];
                        var cellStyle = "";
                        var sColumnAlign = "";

                        if (widget.wtype != null)
                        {
                            if (widget.cellStyle) cellStyle = widget.cellStyle;
                        }
                        renderTo = tableID + "-cell" + (cell + c);
                        if (parent.columnAlign != null) sColumnAlign = parent.columnAlign.toLowerCase();
                        if (sColumnAlign == "center")
                            sHTML += "<td valign='center' id='" + renderTo + "' style='" + cellStyle + "'></td>";
                        else if (sColumnAlign == "bottom")
                            sHTML += "<td valign='bottom' id='" + renderTo + "' style='" + cellStyle + "'></td>";
                        else
                            sHTML += "<td valign='top' id='" + renderTo + "' style='" + cellStyle + "'></td>";
                    }
                    sHTML += "</tr>";
                    $('#' + tableID).append(sHTML);
                }
                else
                {
                    var sHTML = "";

                    sHTML = "<tr id='"+ renderTo +"-row' height='" + rowHeight+ "px'>";
                    if (parent.rowHeight > 0) 
                    {
                        sHTML = "<tr height=" + parent.rowHeight + " >";
                        wHeight = parent.rowHeight;
                    }
                    if (parent.layoutConfig)
                    {
                        wHeight = parent.height - (parent.padding * 2);
                        if (parent.wtype == "panel")
                        {
                            wHeight = parent.bodyheight - (parent.padding * 2);
                        }
                        if (parent.layoutConfig.fit) 
                        {
                            sHTML = "<tr height=" + wHeight + " >";
                        }
                    }
                    sHTML += "</tr>";
                    $('#' + tableID).append(sHTML);                
                }
                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];

                    if (widget.wtype != null)
                    {
                        widget.page = page;
                        widget.parent = parent;
                        if (i == variableIDX && !spacerFound)
                        {
                            widget.width = 0;
                        }
                        if (parent.layoutConfig)
                        {
                            if (parent.layoutConfig.fit) 
                            {
                                widget.height = parent.bodyheight - (parent.padding * 2);
                            }
                        }
                        renderTo = tableID + "-cell" + cell;
                        try
                        {
                            widget.wtype = widget.wtype.toLowerCase();  
                            widget.renderTo = renderTo;
                            widget.id = idev.internal.renderWidget( page, widget );
                        }
                        catch(err)
                        {
                            alert("error 1:" + err.message );
                        }
                    }
                    else if (widget == ">>")
                    {
                        renderTo = tableID + "-cell" + cell;
                        var wgt = {
                            wtype:'spacer',
                            id: parent.id + "-spacer",
                            renderTo: renderTo,
                            width:0
                        }
                        idev.internal.renderWidget( page, wgt );
                    }
                    else
                    {
                        renderTo = tableID + "-cell" + cell;
                        if (typeof widget == "string")
                        {
                            var wgt = {
                                wtype:'html',
                                renderTo: renderTo,
                                html: widget
                            }
                            idev.internal.renderWidget( page, wgt );
                        }
                    }
                    cell++;
                }
				if(spacerFound || variableIDX!=-1)
				{

					$delay(0, function() {
						for (var i = 0;i < widgets.length;i++) {
							spacer -= $('#' + widgets[i].id).outerWidth(true);
						}

						if(spacer<0) spacer=0;
						if(spacerFound) var id = parent.id + "-spacer";
						else var id = widgets[variableIDX].id;
						$('#' + id).width(spacer);
						$('#' + id).css("max-width",spacer + "px");
					});
				}

				return;
            }
            if (layout == "frame")
            {
                var woffset = 0;
                var hoffset = 0;//idev.isIE() ? 8 : 6;

                parent.padding = parent.padding || 0;
                var fw = $('#' + parent.id).width();
                var fh = $('#' + parent.id + "-body").height();
                if (parent.wtype == "panel")
                {
                    fh = $('#' + parent.id + "-content").height() - (parent.padding * 2);;
                    fw = $('#' + parent.id + "-content").width() - (parent.padding * 2);;
                }
                if(fh == null)
                   fh = parent.height - parent.padding;
                if(fw == null)
                   fw = parent.width - (parent.padding * 2);
                fw = fw - woffset;
                fh = fh - hoffset;
                parent.attr = parent.attr == null ? " cellspacing=0 cellpadding=0" : parent.attr ;
                var sHTML = "<table class='ui-table' id='" + renderTo + "-table' border=0 " + parent.attr + " style='width:"+fw+"px;height:"+fh+"px;'><tbody id='" + renderTo + "-body'>";

                tableID = renderTo + "-body";
                var sNorth = "",sSouth = "",sWest = "",sCenter = "",sEast = "";
                var nNorth = 0,nSouth = 0,nCenter = 0,nWest = 0,nCenter = 0,nHCenter = 0,nEast = 0,cols= 0;
                for (var c = 0;c <  widgets.length;c++)
                {
                    if (widgets[c].area == "north" && sNorth == "")
                    {
                        nNorth = widgets[c].height || 0;
                        sNorth = "<tr id='" + renderTo + "-row-north' height='" + nNorth + "px'>";
                        sNorth += "<td id='" + renderTo + "-north' colspan='{CS}'></td></tr>";
                    }
                    if (widgets[c].area == "west" && sWest == "")
                    {
                        nWest = widgets[c].width || 0;
                        if (widgets[c].height > nHCenter) nHCenter = widgets[c].height;
                        sWest += "<td id='" + renderTo + "-west' width=" + nWest + "></td>";
                        cols++;
                    }
                    if (widgets[c].area == "center" && sCenter == "")
                    {
                        nCenter = widgets[c].width || 0;
                        if (widgets[c].height > nHCenter) nHCenter = widgets[c].height;
                        sCenter += "<td id='" + renderTo + "-center'></td>";
                        cols++;
                    }
                    if (widgets[c].area == "east" && sEast == "")
                    {
                        nEast = widgets[c].width || 0;
                        if (widgets[c].height > nHCenter) nHCenter = widgets[c].height;
                        sEast += "<td id='" + renderTo + "-east' width=" + nEast + "></td>";
                        cols++;
                    }
                    if (widgets[c].area == "south" && sSouth == "")
                    {
                        nSouth = widgets[c].height || 0;
                        sSouth = "<tr id='" + renderTo + "-row-south' height='" + nSouth + "px'>";
                        sSouth += "<td id='" + renderTo + "-south' colspan='{CS}'></td></tr>";
                    }
                }
                if (cols == 0) cols = 1;
                nHCenter = fh - (nNorth + nSouth);
                sHTML = sHTML.replace("{FH}",nNorth + nHCenter + nSouth);
                sNorth = sNorth.replace("{CS}",cols);
                sSouth = sSouth.replace("{CS}",cols);
                sHTML += sNorth;
                if (sWest != "" || sCenter != "" || sEast != "") sHTML += "<tr >" + sWest + sCenter + sEast + "</tr>";
                sHTML += sSouth;
                sHTML += "</tbody></table>";
                $('#' + renderTo).append(sHTML);
                sNorth = "",sSouth = "",sWest = "",sCenter = "",sEast = "";
                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];

                    widget.page = page;
                    widget.parent = parent;
                    if (widget.wtype != null)
                    {
                        try
                        {
                            if (widget.area == "north" && sNorth == "")
                            {
                                widget.wtype = widget.wtype.toLowerCase();
                                widget.width = fw;
                                widget.renderTo = renderTo + "-north";
                                widget.id = idev.internal.renderWidget( page, widget );
                                sNorth = widget.id;
                            }
                            if (widget.area == "south" && sSouth == "")
                            {
                                widget.wtype = widget.wtype.toLowerCase();
                                widget.width = fw;
                                widget.renderTo = renderTo + "-south";
                                widget.id = idev.internal.renderWidget( page, widget );
                                sSouth = widget.id;
                            }
                            if (widget.area == "west" && sWest == "")
                            {
                                widget.width = nWest;
                                if (widget.padding) widget.width -= 2;
                                widget.height = nHCenter;
                                widget.wtype = widget.wtype.toLowerCase();
                                widget.renderTo = renderTo + "-west";
                                widget.id = idev.internal.renderWidget( page, widget );
                                sWest = widget.id;
                            }
                            if (widget.area == "center" && sCenter == "")
                            {
                                widget.width = fw - (nWest + nEast);
                                if (widget.padding) widget.width -= 2;
                                widget.height = nHCenter;
                                widget.wtype = widget.wtype.toLowerCase();
                                widget.renderTo = renderTo + "-center";
                                widget.id = idev.internal.renderWidget( page, widget );
                                sCenter = widget.id;
                            }
                            if (widget.area == "east" && sEast == "")
                            {
                                widget.width = nEast;
                                if (widget.padding) widget.width -= 2;
                                widget.height = nHCenter;
                                widget.wtype = widget.wtype.toLowerCase();
                                widget.renderTo = renderTo + "-east";
                                widget.id = idev.internal.renderWidget( page, widget );
                                sEast = widget.id;
                            }
                        }
                        catch(err)
                        {
                            alert("error 1:" + err.message );
                        }
                    }
                }
                return;
            }
            else if (layout == "accordion")
            {
                parent.padding = parent.padding || 0;
                var fw = $('#' + parent.id).width();
                var fh = $('#' + parent.id + "-body").height();
                if (parent.wtype == "panel")
                {
                    fh = $('#' + parent.id + "-content").height() - (parent.padding * 2);;
                    fw = $('#' + parent.id + "-content").width() - (parent.padding * 2);;
                }
                if(fh == null)
                   fh = parent.height - parent.padding;
                if(fw == null)
                   fw = parent.width - (parent.padding * 2);

                parent.attr = parent.attr == null ? " cellspacing=0 cellpadding=0" : parent.attr ;
                var sHTML = "<table class='ui-table' id='" + renderTo + "-table' " + parent.attr + " border=0  style='width:"+fw+"px;table-layout:fixed;'><tbody id='" + renderTo + "-body'></tbody></table>";
                $('#' + renderTo).append(sHTML);
                tableID = renderTo + "-body";
                var panels = 0;

                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];

                    if (widget == null)
                    {
                        idev.errorHandler("NULL Width @ " + i + " for layout");
                        continue;
                    }
                    if (widget.wtype == "panel")
                    {
                        widget.titleHeight = idev.defaultTitleHeight;
                        panels++;
                    }
                }
                if (panels == 0)
                {
                    idev.errorHandler("No panels for accordion layout");
                    return;
                }
                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];

                    if (widget == null)
                    {
                        idev.errorHandler("NULL Width @ " + i + " For accordion layout");
                        continue;
                    }
                    widget.page = page;
                    widget.parent = parent;
                    if (widget.wtype == "panel")
                    {
                        var sHTML = "";
                        var cellStyle = "";

                        renderTo = tableID + "-cell" + i;
                        sHTML = "<tr>";
                        sHTML += "<td id='" + renderTo + "' style='" + cellStyle + "'></td>";
                        sHTML += "</tr>";
                        $('#' + tableID).append(sHTML);
                        try
                        {
                            widget.wtype = widget.wtype.toLowerCase();
                            if (widget.style == null) widget.style = "";
                            widget.style += "border:0px;"
                            widget.width = parent.width;
                            widget.height = parent.height - (panels-1) * idev.defaultTitleHeight;
                            if (i > 0)
                                widget.collaped = true;
                            else
                                widget.collaped = false;
                            widget.nofloat = true;
                            widget.expandable= true;
                            widget.renderTo = renderTo;
                            widget.id = idev.internal.renderWidget( page, widget );
                        }
                        catch(err)
                        {
                            alert("error2:" + err.message );
                        }
                    }
                }
            }
            else if (layout == "row")
            {
                parent.padding = parent.padding || 0;
                var fw = $('#' + parent.id).width();
                var fh = $('#' + parent.id + "-body").height();
                if (parent.wtype == "panel")
                {
                    fh = $('#' + parent.id + "-content").height() - (parent.padding * 2);;
                    fw = $('#' + parent.id + "-content").width() - (parent.padding * 2);;
                }
                if(fh == null)
                   fh = parent.height - parent.padding;
                if(fw == null)
                   fw = parent.width - (parent.padding * 2);

                parent.rowHeight = parent.rowHeight == null ? "" : parent.rowHeight;
                parent.center = parent.center || false;
                parent.attr = parent.attr == null ? " cellspacing=0 cellpadding=0" : parent.attr ;
                var sHTML = "<table class='ui-table' id='" + renderTo + "-table' " + parent.attr + " border=0  style='width:"+fw+"px;'><tbody id='" + renderTo + "-body'></tbody></table>";
                if (parent)
                {
                    if (parent.wtype == "composite")
                    {
                        if (parent.width)
                        {
                            sHTML = "<table class='ui-table' id='" + renderTo + "-table' " + parent.attr + " border=0 width='"+parent.width+"px'><tbody id='" + renderTo + "-body'></tbody></table>";
                        }
                    }
                }
                $('#' + renderTo).append(sHTML);
                tableID = renderTo + "-body";
                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];

                    if (widget == null)
                    {
                        idev.errorHandler("NULL Width @ " + i + " For row layout");
                        continue;
                    }
                    widget.page = page;
                    widget.parent = parent;
                    if (widget.wtype != null)
                    {
                        var sHTML = "";
                        var cellStyle = "";

                        if (widget.wtype != null)
                        {
                            if (widget.cellStyle) cellStyle = widget.cellStyle;
                        }
                        renderTo = tableID + "-cell" + i;
                        if (parent.rowHeight != "")
                            sHTML = "<tr style='height:" + parent.rowHeight + "px'>";
                        else
                            sHTML = "<tr>";
                        if (parent.config)
                        {
                            if (parent.config.center)
                                sHTML += "<td width='"+parent.width+"' style='" + cellStyle + "'><center><div id='" + renderTo + "'></div></center></td>";
                            else
                            {
                                if (parent.layoutConfig)
                                {                   
                                    if (parent.layoutConfig.fit) sHTML += "<td  id='" + renderTo + "' width='"+ (parent.width - (parent.padding * 2))+"' style='" + cellStyle + "'></td>";
                                }
                                else
                                    sHTML += "<td id='" + renderTo + "' style='" + cellStyle + "'></td>";
                            }
                        }
                        else if (parent.center)
                        {
                            sHTML += "<td width='"+parent.width+"' style='" + cellStyle + "'><center><div id='" + renderTo + "'></div></center></td>";
                        }
                        else
                            sHTML += "<td id='" + renderTo + "' style='" + cellStyle + "'></td>";
                        sHTML += "</tr>";
                        $('#' + tableID).append(sHTML);
                        try
                        {
                            widget.wtype = widget.wtype.toLowerCase();
                            if (widget.style == null) widget.style = "";
                            widget.nofloat = true;
                            widget.renderTo = renderTo;
                            widget.id = idev.internal.renderWidget( page, widget );
                        }
                        catch(err)
                        {
                            alert("error2:" + err.message );
                        }
                    }
                }
            }
            else if (layout == "form")
            {
                parent.padding = parent.padding || 0;
                var fw = $('#' + parent.id).width();
                var fh = $('#' + parent.id + "-body").height();
                if (parent.wtype == "panel")
                {
                    fh = $('#' + parent.id + "-content").height() - (parent.padding * 2);;
                    fw = $('#' + parent.id + "-content").width() - (parent.padding * 2);;
                }
                if(fh == null)
                   fh = parent.height - parent.padding;
                if(fw == null)
                   fw = parent.width - (parent.padding * 2);

                var sAttr = parent.attr == null ? "" : parent.attr ;
                if (idev.isChrome()) sAttr = "cellpadding=3 " + sAttr;
                var sHTML = "<table class='ui-table' id='" + renderTo + "-table'  " +  sAttr + " border=0 style=''><tbody id='" + renderTo + "-body'></tbody></table>";

                if (parent)
                {
                    if (parent.wtype == "composite")
                    {
                        if (parent.width)
                        {
                            sHTML = "<table class='ui-table' id='" + renderTo + "-table'" + sAttr + " border=0 width='"+parent.width+"px'><tbody id='" + renderTo + "-body'></tbody></table>";
                        }
                    }
                }
                $('#' + renderTo).append(sHTML);
                tableID = renderTo + "-body";
                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];

                    if (widget == null)
                    {
                        idev.errorHandler("NULL Width @ " + i + " For form layout");
                        continue;
                    }
                    widget.page = page;
                    widget.parent = parent;
                    if (widget.wtype == null)
                    {
                        if (typeof widget == "string")
                        {
                            var wgt = new idev.ui.widgetHTML( { renderTo:renderTo , html: widget });
                            wgt.render();
                        }
                    }
                    else
                    {
                        var sHTML = "";
                        var cellStyle = "";
                        var labelID;

                        if (widget.wtype != null)
                        {
                            if (widget.cellStyle) cellStyle = widget.cellStyle;
                        }
                        renderTo = tableID + "-cell" + i;
                        labelID = widget.id ? widget.id + "-label" : renderTo + "-label";  
                        if (widget.hidden)
                        {
                            sHTML = "<tr><td valign='top' width='"+labelWidth+"px' style='width:" + labelWidth + "px;" + cellStyle + "'><span  id='" + labelID + "' class='ui-labeltext " + parent.labelCls + "' style='" + widget.labelStyle + ";display:none;'>" + widget.label + "</span></td><td id='" + renderTo + "'></td></tr>";
                        }
                        else
                            sHTML = "<tr><td valign='top' width='"+labelWidth+"px' style='width:" + labelWidth + "px;" + cellStyle + "'><span  id='" + labelID + "' class='ui-labeltext " + parent.labelCls + "' style='" + widget.labelStyle + "'>" + widget.label + "</span></td><td id='" + renderTo + "'></td></tr>";
                        if (widget.label == null)
                            sHTML = "<tr><td id='" + renderTo + "' colspan=2></td><td></td></tr>";
                        $('#' + tableID).append(sHTML);
                        try
                        {
                            widget.wtype = widget.wtype.toLowerCase();
                            widget.renderTo = renderTo;
                            widget.id = idev.internal.renderWidget( page, widget );
                        }
                        catch(err)
                        {
                            alert("error3:" + err.message + "["+widget.wtype+"]");
                        }
                    }
                }
            }
            else if (layout == "fit")
            {
                var fw = $('#' + parent.id + "-content").width();
                var fh = $('#' + parent.id + "-content").height();
                var top = 0,bottom;
                var padding = parent.padding || 0;

                if(fh == null)  fh = parent.height;
                if(fw == null)  fw = parent.width;
                if (parent.wtype == "panel" || parent.wtype == "window")
                {
                    fh = $("#" + parent.id + "-body").height();
                }
                var cnt = 0;
                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];
                    
                    if (widget == null) continue;

                    if (widget == null)
                    {
                        idev.errorHandler("NULL Width @ " + i + " For form layout");
                        continue;
                    }
                    if (fw > 0)
                    {
                        widget.width = fw;
                        if (padding) widget.width -= (padding * 2);
                        widget.x = 0;
                        if (padding) widget.x = padding;
                    }
                    if (fh > 0)
                    {
                        widget.height = fh;
                        if (padding) widget.height -= (padding * 2);
                        widget.y = 0;
                        if (padding) widget.y = padding;
                    }
                    widget.page = page;
                    widget.parent = parent;
                    if (widget.wtype == null)
                    {
                        if (typeof widget == "string")
                        {
                            var wgt = new idev.ui.widgetHTML( { renderTo:renderTo , html: widget });
                            wgt.render();
                        }
                    }
                    else
                    {
                        try
                        {
                            widget.wtype = widget.wtype.toLowerCase();
                            if (cnt > 0 ) widget.hidden = true;
                            widget.renderTo = renderTo;
                            widget.id = idev.internal.renderWidget( page, widget );
                            cnt++;
                        }
                        catch(err)
                        {
                            alert("error4:" + err.message );
                        }
                    }
                }
            }
            else
            {
                for (var i = 0;i < widgets.length;i++)
                {
                    var widget = widgets[i];

                    if (widget == null)
                    {
                        idev.errorHandler("NULL Width @ " + i + " For form layout");
                        continue;
                    }
                    widget.page = page;
                    widget.parent = parent;
                    if (widget.wtype == null)
                    {
                        if (typeof widget == "string")
                        {
                            var wgt = new idev.ui.widgetHTML( { renderTo:renderTo , html: widget });
                            wgt.render();
                        }
                    }
                    else
                    {
                        try
                        {
                            widget.wtype = widget.wtype.toLowerCase();
                            widget.renderTo = renderTo;
                            widget.id = idev.internal.renderWidget( page, widget );
                       }
                        catch(err)
                        {
                            alert(widget.wtype)
                            alert("error5:" + err.message );
                        }
                    }
                }
            }
        },
        add : function (widget)
        {
            if (idev.widgets[widget.id] == null)
                idev.widgets[widget.id] = widget;


        },
        render : function()
        {
            if (window.navigator.standalone && idev.isIPhone())
            {
                document.body.style.marginTop = 30;
            }
            if (_preferences.config.fitDocument || _preferences.config.fitdocument)
            {
                var h = $(document).innerHeight();
                var w = $(document).innerWidth();
                if (window.navigator.standalone) h -= idev.standaloneOffset;
                $('#container').width(w);
                $('#container').height(h);
            }
            var sTheme = idev.app.theme == null ? "" : idev.app.theme;
            if (sTheme != "") sTheme = "-" + sTheme ;
            var cw = $('#container').width();
            if (idev.app.toolbar)
            {
                if (idev.app.toolbar.height == null) idev.app.toolbar.height = 40;
                idev.app.toolbar.visible = true;
                $('#container').append("<div id='ui-toolbar' class='ui-app-toolbar" + sTheme + "' style='overflow:hidden;height:" + idev.app.toolbar.height + "px;max-height:" + idev.app.toolbar.height + "px;'></div>");
                 if (idev.app.toolbar.widgets)
                {
                    idev.app.toolbar.id = "ui-toolbar";
                    idev.app.toolbar.children = [];
                    idev.app.toolbar.width = cw;
                    idev.app.toolbar.rowHeight = idev.app.toolbar.height;
                    idev.app.toolbar.proxy = {
                        wtype:'composite'
                    };
                    for(var key in idev.app.toolbar)
                    {
                        if (key != "id") idev.app.toolbar.proxy[key] = idev.app.toolbar[key];
                    }
                    idev.app.toolbar.proxy.renderTo = "ui-toolbar";
                    idev.app.toolbar.proxy.parent = idev.app.toolbar;                    
                    idev.internal.renderWidget(null,idev.app.toolbar.proxy);
                }
                // Get the actual height;
                idev.app.toolbar.height = $('#ui-toolbar').height();
            }
            else
                idev.app.toolbar = { height: 0 };				
            var h = $('#container').height();
            if (idev.app.statusbar)
            {
                if (idev.app.statusbar.height == null) idev.app.statusbar.height = 40;
                if (idev.app.toolbar) h -=  ($('#ui-toolbar').height() + idev.app.statusbar.height);
                $('#container').append("<div id='content' class='ui-body' style='width:" + cw + "px;height:" + h + "px;'></div>");
            }
            else
                $('#container').append("<div id='content' class='ui-body' style='width:" + cw + "px;height:" + h + "px;'></div>");
            if (idev.app.statusbar)
            {
                if (idev.app.statusbar.height == null) idev.app.statusbar.height = 40;
                idev.app.statusbar.visible = true;
                $('#container').append("<div id='ui-statusbar' class='ui-app-statusbar" + sTheme + "' style='height:" + idev.app.statusbar.height + "px;max-height:" + idev.app.statusbar.height + "px;z-index:10;'></div>");
                if ( idev.app.statusbar.widgets)
                {
                    idev.app.statusbar.id = "ui-statusbar";
                    idev.app.statusbar.children = [];
                    idev.app.statusbar.width = cw;
                    idev.app.statusbar.rowHeight = idev.app.toolbar.statusbar;
                    idev.app.statusbar.proxy = {
                        wtype:'composite'
                    };
                    for(var key in idev.app.statusbar)
                    {
                        if (key != "id") idev.app.statusbar.proxy[key] = idev.app.statusbar[key];
                    }
                    idev.app.statusbar.proxy.renderTo = "ui-statusbar";
                    idev.app.statusbar.proxy.parent = idev.app.statusbar;  
                    idev.internal.renderWidget(null,idev.app.statusbar.proxy);
                }
                // Get the actual height;
                idev.app.statusbar.height = $('#ui-statusbar').height();
            }
            else
                idev.app.statusbar = { height: 0 };

        },
        ExtractNumber : function(value)
        {
            var n = parseInt(value);

            return n == null || isNaN(n) ? 0 : n;
        },
        getPosition : function (e)
        {
            var left = 0;
            var top  = 0;
            if (e)
            {
                while (e.offsetParent)
                {
                    left += e.offsetLeft;
                    top  += e.offsetTop;
                    e     = e.offsetParent;
                }
                left += e.offsetLeft;
                top  += e.offsetTop;
            }
            return {x:left, y:top};
        },
        mouseMove :function (ev)
        {
            ev = ev || window.event;
            var mousePos = idev.utils.mousePosition(ev);
        },
        getMouseOffset : function (target, ev)
        {
            ev = ev || window.event;
            var docPos    = idev.internal.getPosition(target);
            var mousePos  = idev.utils.mousePosition(ev);
            return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
        }
    },
    ///////////////////////////////////////////////////////////////////////////
    //  General iDevUI Functions Declaration
    ///////////////////////////////////////////////////////////////////////////

    errorHandler:function(sErrDesc)
    {
        $debug("*******************************")
        $debug(sErrDesc)
        $debug("*******************************")
    },
    getParameter:function(param,def)
    {
        if (def == null) def = "";
        if (typeof param == "string")
            return idev.convertNulls(this.parameters[param],def);
        else if (param >= 0)
        {
            for (var key in idev.parameters)
            {
                if (param == 0) return idev.convertNulls(idev.parameters[key],def);
                param--;
            }
        }
        return def;
    },
    getParameterKey:function(param,def)
    {
        if (def == null) def = "";
        if (typeof param != "number") return def;
        if (param >= 0)
        {
            for (var key in idev.parameters)
            {
                if (param == 0) return key;
                param--;
            }
        }
        return def;
    },
    isIE : function() { return this.agent.indexOf("ie") != -1 ? true : false; },
    isIE7 : function() { return this.agent.indexOf("msie 7") != -1 ? true : false; },
    isIE8 : function() { return this.agent.indexOf("msie 8") != -1 ? true : false; },
    isIE9 : function() { return this.agent.indexOf("msie 9") != -1 ? true : false; },
    isWebkit : function() { return this.agent.indexOf("webkit") != -1 ? true : false; },
    isChrome : function() { return this.agent.indexOf("chrome") != -1 ? true : false; },
    isFF : function() { return this.agent.indexOf("firefox") != -1 ? true : false; },
    isIEMobile : function() { return this.agent.indexOf("iemobile") != -1 ? true : false; },
    isPalm : function() { return this.agent.indexOf("webos") != -1 ? true : false; },
    isBlackberry : function() { return this.agent.indexOf("blackberry") != -1 ? true : false; },
    isIPad : function() { return this.agent.indexOf("ipad") != -1 ? true : false; },
    isIPhone : function() { return this.agent.indexOf("iphone") != -1 ? true : false; },
    isAndroid : function() { return this.agent.indexOf("android") != -1 ? true : false; },
    isTouch : function() {
        if (this.agent.indexOf("ipad") != -1) return true;
        if (this.agent.indexOf("iphone") != -1) return true;
        if (this.agent.indexOf("android") != -1) return true;
        return false;
    },
    isMobile : function() {
        if (this.agent.indexOf("ipad") != -1) return true;
        if (this.agent.indexOf("iphone") != -1) return true;
        if (this.agent.indexOf("android") != -1) return true;
        if (this.agent.indexOf("iemobile") != -1) return true;
        if (this.agent.indexOf("blackberry") != -1) return true;
        return false;
    },
    isStandAlone : function() { return window.navigator.standalone; },isMobile : function() {
        if (this.agent.indexOf("ipad") != -1) return true;
        if (this.agent.indexOf("iphone") != -1) return true;
        if (this.agent.indexOf("android") != -1) return true;
        if (this.agent.indexOf("iemobile") != -1) return true;
        if (this.agent.indexOf("blackberry") != -1) return true;
        return false;
    },
    convertNulls : function(v,d) {
        if (v == null) return d;
        if (typeof v == "undefinded") return d;
        return v;
    },
    isClass : function(obj) {
        if (obj instanceof baseWidget) return true;
        return false;
    },
    hideToolbar : function()
    {
        if (idev.app.toolbar)
        {
            if (!idev.app.toolbar.visible) return;
            var h = idev.contentHeight + idev.app.toolbar.height;
            var ph = idev.pageHeight + idev.app.toolbar.height;
            $("#ui-toolbar").hide();
            $("#ui-toolbar").height(0);
            $("#content").height(h);
            if (this.pageManager.currentPage) this.pageManager.syncSize();
            idev.app.toolbar.visible = false;
        }
    },
    showToolbar : function()
    {
        if (idev.app.toolbar)
        {
            if (idev.app.toolbar.visible) return;
            $("#ui-toolbar").show();
            $("#ui-toolbar").height(idev.app.toolbar.height);
            $("#content").height(idev.contentHeight);
            if (this.pageManager.currentPage) this.pageManager.syncSize();
            idev.app.toolbar.visible = true;
        }
    },
    hideStatusbar : function()
    {
        if (idev.app.statusbar)
        {
            if (!idev.app.statusbar.visible) return;
            var h = idev.contentHeight + idev.app.statusbar.height;
            var ph = idev.pageHeight + idev.app.statusbar.height;
            $("#ui-statusbar").hide();
            $("#ui-statusbar").height(0);
            $("#content").height(h);
            
            if (this.pageManager.currentPage) this.pageManager.syncSize();
            idev.app.statusbar.visible = false;
        }
    },
    showStatusbar : function()
    {
        if (idev.app.statusbar)
        {
            if (idev.app.statusbar.visible) return;
            $("#ui-statusbar").show();
            $("#"+idev.app.statusbar.proxy.id).show();
            $("#ui-statusbar").height(idev.app.statusbar.height);
            $("#content").height(idev.contentHeight);
            if (this.pageManager.currentPage) this.pageManager.syncSize();
            idev.app.statusbar.visible = true;
        }
    },
    hideBars : function()
    {
        // Combines hideToolbar & hideStatusbar but only syncSize called once
        if (idev.app.statusbar.visible)
        {
            var ph = idev.pageHeight + idev.app.statusbar.height;
            $("#ui-statusbar").hide();
            $("#ui-statusbar").height(0);
            idev.app.statusbar.visible = false;
        }
        if (idev.app.toolbar.visible)
        {
            var ph = idev.pageHeight + idev.app.toolbar.height;
            $("#ui-toolbar").hide();
            $("#ui-toolbar").height(0);
            idev.app.toolbar.visible = false;
        }
        var h = idev.contentHeight + idev.app.toolbar.height + idev.app.statusbar.height;
        $("#content").height(h);            
        if (this.pageManager.currentPage) this.pageManager.syncSize();
    },
    showBars : function()
    {
        // Combines hideToolbar & hideStatusbar but only syncSize called once
        if (!idev.app.statusbar.visible)
        {
            $("#ui-statusbar").show();
            $("#"+idev.app.statusbar.proxy.id).show();
            $("#ui-statusbar").height(idev.app.statusbar.height);
            idev.app.statusbar.visible = true;
        }
        if (!idev.app.toolbar.visible)
        {
            $("#ui-toolbar").show();
            $("#"+idev.app.toolbar.proxy.id).show();
            idev.app.toolbar.children[0].show();
            $("#ui-toolbar").height(idev.app.toolbar.height);
            idev.app.toolbar.visible = true;
        }
        $("#content").height(idev.contentHeight);
        if (this.pageManager.currentPage) this.pageManager.syncSize();
    },
    addTouchScroll:function(id,options)
    {
        if (options == "H") options = { hScroll:true, bounce:true, momentum: true };
        return  new iScroll($('#'+id),options);
    },
    createWorker :function(sScript,onmessage)
    {
        if (typeof Worker == "undefined")
        {
            idev.ui.message("Worker Not Supported")
            return null;
        }
        var worker = new Worker(_preferences.apppath + sScript);
        if (worker != null)
        {
            worker.onmessage = onmessage;
        }
        return worker;
    },
    get : function (id)
    {
        if (id == "" || id == null) return null;
		return this.widgets[id];
    },
    lastPage : function()
    {
        return this.pageManager.lastPage;
    },

    currentPage : function()
    {
        return this.pageManager.currentPage;
    },

    currentPageName : function()
    {
        return this.pageManager.currentPage.name;
    },

    removePageWidgets : function (id)
    {
        for(var i = 0;i < this.widgets.length;i++)
        {
            var widget = this.widgets[i];

            if (widget.page)
            {
                if (widget.page.id == id)
                {
                    widget.destroy();
                    i--;
                }
            }
        }
        return null;
    },

    list : function (id)
    {
        var sText = "";
        for(var i = 0;i < this.widgets.length;i++)
        {
            var widget = this.widgets[i];

            sText += widget.id + "\r\n";
        }
        return sText
    },

    addWidgetToPageContent : function ( pageID, widget )
    {
        for(var i = 0;i < this.app.pages.length;i++)
        {
            var page = this.app.pages[i];

            if (page.id == pageID)
            {
                if (page.content == null) return false;
                if (page.content.widgets == null) return false;
                page.content.widgets.push(widget);
                return true;
            }
        }
        return false;
    },
    homePage : function()
    {
        this.pageManager.showPage(0);
        if (idev.contentHeight == null)
        {
            idev.contentHeight = $("#content").height();
            idev.pageHeight = $("#"+this.pageManager.currentPage.id).height();
        }
    },
    gotoPage : function(index)
    {
        this.pageManager.showPage(index);
        if (idev.contentHeight == null)
        {
            idev.contentHeight = $("#content").height();
            idev.pageHeight = $("#"+this.pageManager.currentPage.id).height();
        }
    },
    nextPage : function()
    {
        this.pageManager.nextPage();
        if (idev.contentHeight == null)
        {
            idev.contentHeight = $("#content").height();
            idev.pageHeight = $("#"+this.pageManager.currentPage.id).height();
        }
    },
    prevPage : function()
    {
        this.pageManager.prevPage();
        if (idev.contentHeight == null)
        {
            idev.contentHeight = $("#content").height();
            idev.pageHeight = $("#"+this.pageManager.currentPage.id).height();
        }
    },
    register : function (key,widget)  //Register plugins
    {
        if (widget == null)
        {
            idev.errorHandler("register null widget:"+key)
            return;
        }
        idev.plugins[key.toLowerCase()] = widget;
    },
    bodyHeight : function()
    {
        var h = idev.pgHeight;

        if ($("#ui-toolbar").height())
            h -= $("#ui-toolbar").height();
        else
        {
            if (!idev.isIE()) h += 17;
        }
        if ($("#ui-statusbar").height())
            h -= $("#ui-statusbar").height();
        else
        {
            if (!idev.isIE()) h += 17;
        }
        return h;
    },
    bodyWidth : function()
    {
        return idev.pgWidth;
    },
    autoHide : function(widget,callback)
    {
        if (arguments.length != 0)
        {
            if (callback == null) return;
            if (idev.hideFN)
            {
                idev.hideFN(idev.hideWidget,null);
            }
        }
        idev.hideFN = callback;
        idev.hideWidget = widget;
    },
    findID : function(target)
    {
        while (target.id == "")
        {
            if (target.parentNode == null) break;
            target = target.parentNode;
        }
        return target;
    },
    extractIndex : function(target)
    {
        while (target.id == "")
        {
            if (target.parentNode == null) break;
            target = target.parentNode;
        }
        var pos = target.id.lastIndexOf("_");
        if (pos == -1) return -1;      
        return parseInt(target.id.substr(pos+1));                                
    },
    ///////////////////////////////////////////////////////////////////////////
    //  iDevUI widget template Declaration
    /*
        All widgets are create on a template, this object calls is used to
        define the HTML to be injected into the web document.

        The render function is passed a data array with the variable data
        requird by the template. All varables are inserted by create a marker
        in the template text signified by the variable name surrounded by {}
        brackets.

        example:

        "<div style='width:{width}px;'></div>"

    */
    ///////////////////////////////////////////////////////////////////////////
    wTemplate : idevObject.extend(
    {
        init: function()
        {
            this.sTemplate = "";
            for (var i = 0;i < arguments.length;i++)
            {
                this.sTemplate +=  arguments[i];

            }
        },
        render : function(data)
        {
            var sHTML = this.sTemplate;

            try
            {
                if (typeof data != "object") return sHTML;
                if (!data.constructor == Array) return sHTML;
                for (var key in data)
                {
                    if (typeof data[key] == "string" || typeof data[key] == "number")
                        sHTML =  idev.utils.replaceAll(sHTML,"{" + key + "}",data[key]);
                }
                return sHTML;
            }
            catch(e)
            {
                idev.errorHandler("Template Data Error, data type" + typeof data);
            }
            return sHTML;
        },
        get : function()
        {
            return this.sTemplate;
        }
    }),
    ///////////////////////////////////////////////////////////////////////////////
    //  Load Browser Storage Functions Declaration
    ///////////////////////////////////////////////////////////////////////////////
    local:
    {
        successLocation : function(position)
        {
            this.position = position;
        },
        failedLocation : function(error)
        {
            switch(error.code) // Returns 0-3
            {
                case 0:
                    // Unknown error alert error message
                    alert(error.message);
                    break;

                case 1:
                    // Permission denied alert error message
                    alert(error.message);
                    break;
            }
            this.position = null;
        },
        currentLocation : function(success,failed)
        {
            try
            {
                if (success == null) success = this.successLocation;
                if (failed== null) success = this.failedLocation;

                navigator.geolocation.getCurrentPosition(function(position)
                    {
                        idev.geoposition = position;
                        idev.geoerror = null;
                        if (success != null) success(position);
                    },
                    function(error)
                    {
                        idev.geoposition = null;
                        idev.geoerror = error;
                        if (failed != null) failed();
                    }
                );
            }
            catch (e)
            {
                idev.geoposition = null;
                idev.geoerror = "Geo Location Not Supported";
                if (failed != null) failed();
            }
        },
        localSupport : function()
        {
            if (localStorage)
                return true;
            else
                return false;
        },
        storeLocal : function(key,value)
        {
            if (!this.localSupport()) return false;
            localStorage[key] = value;
            return true;
        },
        removeLocal : function(key)
        {
            if (!this.localSupport()) return false;
            localStorage.removeItem(key);
            return true;
        },
        countLocal : function()
        {
            if (!this.localSupport()) return 0;
            return localStorage.length;
        },
        clearLocal : function()
        {
            if (!this.localSupport()) return false;
            localStorage.clear();
            return true;
        },
        getLocal : function(key,vDefault)
        {
            if (!this.localSupport()) return vDefault;
            var value = localStorage[key];
            return value == null ? vDefault : value;
        },
        dbSupport : function()
        {
            if (window.openDatabase)
                return true;
            else
                return false;
        },
        dbOpen : function(dbName, dbSize, dbVersion)
        {
            if (!this.dbSupport()) return null;
            if (dbSize == null) dbSize = 100000;
            if (dbVersion == null) dbVersion = "1.0";
            return openDatabase(dbName, dbVersion, dbName, dbSize);
        },
        dbExecute : function(db,sSQL,success,failed)
        {
            if (!this.dbSupport()) return false;
            db.transaction(
                function(tx)
                {
                    tx.executeSql(sSQL, [], success, failed);
                }
            );
        }
    },
    ///////////////////////////////////////////////////////////////////////////////
    //  Data Object Declaration
    ///////////////////////////////////////////////////////////////////////////////
    data: {
        column : idevObject.extend(
        {
            init: function(config)
            {
                if (config == null) config = {};
                this.header = config.header == null ? "" : config.header;
                this.field = config.field;
                this.renderer = config.renderer;
                this.headerRenderer = config.headerRenderer;
                this.headerClick = config.headerClick;
                this.width = config.width || 30;
                this.tpl = config.tpl;
                this.cls = config.cls || "";
                this.style = config.style || "";
                this.events = config.events || {};
                this.editor = config.editor;
                this.editID = "";
				this.tooltip = config.tooltip || "";
                if (this.tpl == null)
                {
                    this.tpl = new idev.wTemplate(
                        "<div id='{id}-cell-{row}-{col}' class='ui-grid-cell {cls} ie9gradient' style='{style};width:{width}px;max-width:{width}px;height:{height}px;text-overflow: ellipsis; overflow: hidden;white-space: nowrap;' row='{row}' col='{col}' title='{tooltip}'>",
                        "{value}",
                        "</div>" );
                }
                this.cls = idev.internal.cssQuirks(this.cls,true);
            },
            render : function(data)
            {
                if (data['cls'] == null) data['cls'] = idev.internal.cssQuirks(this.cls);
                if (data['value'] == null) data['value'] = "";
                if (data['style'] == null || data['style'] == "") data['style'] = this.style;
                if (data['height'] == null) data['height'] = "";
				if(data['tooltip'] == null) data['tooltip'] = "";
                if (this.events != null)
                {
                    if (this.events.click)
                    {
                        data['style'] += ";cursor:pointer;";
                    }
                }
                return this.tpl.render(data);
            },
            setValue : function(value,row)
            {
                var rec = this.parent.ds.getAt(row);
                var id = this.parent.id + "_"+row+"_"+this.col;
                var data = new Array();
                var topoffset = $("#"+this.parent.id + "-data").scrollTop();
                var leftoffset = $("#"+this.parent.id + "-data").scrollLeft();
                rec.set(this.field,value);
                if (this.renderer != null) {
                    data['value'] = this.renderer(rec.get(this.field),rec,row,this.col,this);
                } else {
                    data['value'] = rec.get(this.field);
				}
                data['value'] = idev.utils.replaceAll(data['value'],"\n","<br/>");
                data['id'] = this.parent.id;
                data['style'] = this.style || "";
                data['cls'] = "";
				if (this.parent.autoSelect) data['cls'] = 'ui-grid-cell-select-active';
                if (row % 2) data['cls'] = " " + this.parent.altCls + ' ui-grid-cell-select-active';
                data['row'] = row;
                data['col'] = this.col;
                data['width'] = this.width-5;
                
                data['height'] = $("#"+id).parent().attr("height");
                var html = this.render(data, rec, row, this.col);
                $("#"+id).html(html);
				var cellid = this.parent.id + "-cell-" + row + "-" + this.col;
                $("#"+cellid).click(this.parent.cellClick);
				$("#"+cellid).dblclick(this.parent.cellDblClick);
                this.editID = "";
                if(topoffset > 0 || leftoffset > 0)
                {
                    $("#"+this.parent.id + "-data").scrollTop(topoffset);
                    $("#"+this.parent.id + "-data").scrollLeft(leftoffset);
                }
                if (this.parent.events.afterEdit)
                {
                    this.parent.events.afterEdit(this.parent,row,this.col,rec, this.field, this.value,value);
                }
            },
            edit : function(row,col,ev)
            {
                if (this.editor == null) return;
                this.editRow = parseInt(row);

				this.editCol = parseInt(col);
                var id = this.parent.id + "_"+row+"_"+col;
                var w = $("#"+id).width();
                var h = $("#"+id).height();
                var rec = this.parent.ds.getAt(row);
                if (this.parent.events.beforeEdit)
                {
                    if (this.parent.events.beforeEdit(this.parent,row,col,rec) === false) return;
                }
                if (typeof this.editor == "function")
                {
                    this.editor(this.parent,this,row,col,ev);    
                    return;
                }
                var sHTML = "<div id='" +id+ "-edit' style='height:"+(h-2)+"px;max-height:"+h+"px;background-color:#fff;color:#000;border:1px solid #ccc;'></div>";
				$("#"+id).html(sHTML);  
				$delay(0, function() {
					$('#'+id+'-edit').children().children().blur(function(){
						var parentID = id.substr(0,id.indexOf('_'));
						var currentPart = parentID + '-cell-' + row;
						if($('[id^=' + currentPart + '-]:focus').length == 0) {
							$('#'+currentPart+'-'+col).removeClass("ui-grid-cell-select");
							$('#'+currentPart+'-'+col).removeClass("ui-grid-cell-select-active");
							$('[id^=' + currentPart + '-]').removeClass("ui-grid-cell-select");		
						}
					});	
				});
                var value = idev.utils.replaceAll(rec.get(this.field),"<br/>","\n");
                if (this.editor.width == null) this.editor.width = w-2;
                if (this.editor.height == null) this.editor.height = h-2;
                this.editor.roundCorners = false;
                this.editor.renderTo = id+'-edit';
                this.editor.style = "background-color:#fff;color:#000;border:0px;border-radius:0px;-moz-border-radius:0px;-webkit-border-radius:0px;";
                this.editor.buttonStyle = "border-radius:0px;-moz-border-radius:0px;-webkit-border-radius:0px;";
                this.editor.data = {
                    col:this,
                    grid: this.parent
                };
                this.editor.delay = this.editor.delay || 100;

				this.parent.editCol = this;
                if (this.editor.events == null) this.editor.events = {};
                this.editor.events.lostfocus = function(wgt)
                    {
                        if (wgt.data.col.editor)
                        {
                            if (wgt.data.col.editor.wtype != "combo")
                            {
                                wgt.data.col.endEdit( wgt.data.col.editRow);
                                wgt.data.grid.editCol = null;
                            }
                        }
                    };
                this.editor.events.onenter = function(wgt)
                    {
                        var column = wgt.data.col;
						if (wgt.wtype == 'textarea') return;
                        if(column.editCol < column.cm.columns.length-1)
                        {
                            var row = wgt.data.col.editRow;
                            var col = column.editCol+1;
                            wgt.data.col.endEdit(row,col);
                            wgt.data.grid.editCol = null;
                            column = column.cm.getAt(col);
                            column.edit(row,col);
                        }    
                        if (column.parent.events.onenter)
                        {
                            column.parent.events.onenter(column);
                        }
                    };
                this.editor.events.ontab = function(wgt)
                    {
                        var column = wgt.data.col;
                        if(column.editCol < column.cm.columns.length-1)
                        {
                            var row = wgt.data.col.editRow;
                            var col = column.editCol+1;
                            wgt.data.col.endEdit(row);
                            wgt.data.grid.editCol = null;
                            column = column.cm.getAt(col);
                            column.edit(row,col);
                        }    
                        if (column.parent.events.ontab)
                        {
                            column.parent.events.ontab(column);
                        }
                    };
                this.editID = idev.internal.renderWidget(this.parent.page,this.editor);
                this.value = value;
                $delay(this.editor.delay,function(col)
                {
                    try{
                        $get(col.editID).setValue(col.value);
                        $get(col.editID).focus();
                    }
                    catch(e)
                    {
                    }
                },this);
            },
            endEdit : function(row,col)
            {
				if (this.editID == "") return;
                var wgt = $get(this.editID);
                var value = wgt.getValue();
                
                wgt.destroy();
                this.setValue(value,this.editRow); 
				if(col){
					var id = '#' + this.parent.id + "-cell-" + (row) + "-" + (col-1);
					$delay(0,function(){
						$(id).focus();
						$(id).click();
					});
				}
            }
        }),
        columnModel : idevObject.extend(
        {
            init: function(config)
            {
                this.columns = config.columns == null ? [] : config.columns;
                for (var i = 0;i < this.columns.length;i++)
                {
                    var c = this.columns[i];
                    if (c instanceof idev.data.column)
                    {
                    }
                    else
                    {
                        this.columns[i] = new idev.data.column(c);
                    }
                    this.columns[i].index = i;
                    this.columns[i].cm = this;
                    this.columns[i].col = i;
                }
            },
            getCount: function()
            {
                return this.columns.length;
            },
            getAt: function(index)
            {
                return this.columns[index];
            }
        }),
        dataRecord : idevObject.extend(
        {
            init: function(config)
            {
                this.fields = new Array();
                this.data = new Array();
                this.binds = new Array();
                this.modified = false;
                this.store = config.store;
                for(var i = 0;i < config.fields.length;i++)
                {
                    this.fields.push(config.fields[i]);
                }
            },
            clone:function()
            {
                if (this.store == null) return null;
                var rec = this.store.blankRec();
                rec.load(this.data);
                return rec;
            },
            getRecNo:function()
            {
                var recno = 0;
                
                if (this.store == null) return -1;
                while (this.store.records[recno] != this && recno < this.store.records.length) recno++;
                return recno == this.store.records.length ? -1 : recno;
            },
            load : function(record_data)
            {
                this.data = [];
                for(var i = 0;i < this.fields.length;i++)
                {
                    if(record_data instanceof Array) var v = record_data[i];
                    else var v = record_data[this.fields[i]];
                    if (v == null) v = "";
                    this.data.push(v);
                }
                this.updateBinds();
            },
            getStore : function()
            {
                return this.store;
            },
            loadText : function(record_data,separator)
            {
                if (typeof record_data != "string") return;
                if (separator == null) separator = ",";
                var ta = record_data.split(separator)
                this.data = [];
                for(var i = 0;i < this.fields.length && i < ta.length;i++)
                {
                    this.data.push(ta[i]);
                }
                this.updateBinds();
            },
            set : function(sField,value,nobind)
            {
                if (nobind == null) nobind = false;
                var i = $.inArray(sField,this.fields);
                if (i == -1) return false;
                this.data[i] = value;
                this.modified = true;
                if (this.store && !nobind)
                {
                    this.store.updateBinds();
                }
                if (!nobind) this.updateBinds();
                return true;
            },
            get : function(sField)
            {
                var i = $.inArray(sField,this.fields);
                if (i == -1) return "";
                return this.data[i] == null ? "" : this.data[i];
            },
            isModified : function()
            {
                return this.modified;
            },
            commit : function()
            {
                this.modified = false;
            },
            asString: function(type,separator)
            {
                type = type || "";
                separator = separator || ",";
                switch (type.toLowerCase())
                {
                    case "csv" :
                        var result = "";
                        for(var i in this.fields)
                        {
                            var v = this.data[i] == null ? "" : this.data[i];
                            if (i > 0 )  result += separator;
                            result += v;
                        }
                        return result;
                    default:
                        var result = "{";
                        for(var i in this.fields)
                        {
                            var v = this.data[i] == null ? "" : this.data[i];
                            if (i > 0 )  result += ",";
                            if(typeof v === "string") result += '"' + this.fields[i] + '":"' + v + '"';
                            else result += '"' + this.fields[i] + '":' + v;
                        }
                        result += "}";
                        return result;
                }
            },
            bind : function(widget)
            {
                // Check not already bound
                for (var i = 0;i < this.binds.length;i++)
                {
                    if (this.binds[i] == widget) return;
                }
                this.binds.push(widget)
            },
            updateBinds : function()
            {
                for (var i = 0;i < this.binds.length;i++)
                {
                    try
                    {
                        this.binds[i].setValues();
                    }
                    catch(e)
                    {
                        idev.errorHandler("DataRec binding update failed "+e.message)
                    }
                }
            }
        }),
        dataStore : idevObject.extend(
        {
            init: function(config)
            {
                this.records = new Array();
                this.fields = config.fields == null ? [] : config.fields;
                this.separator = config.separator == null ? "," : config.separator;
                this.binds = new Array();
                if (config.data)
                {
                    this.load(config.data);
                }
                this.url = config.url || "";
                this.params = config.params || {};
                this.results = config.results;
                this.autoDestroy = config.autoDestroy == null ? false : config.autoDestroy;
                this.events = config.events || {};
				if(config.autoLoad) this.fetch();
            },
            onload: function(func)
            {
                this.events.load = func;
            },
            load : function(data,nobind)
            {    
                this.records = [];
                if (typeof data == "string")
                {
                    try { recs = $.parseJSON(data); data = recs}
                    catch(e){ }
                }
                for(var i in data)
                {
                    var rec = new idev.data.dataRecord( { fields: this.fields, store: this });

                    if (typeof data[i] == "string")
                        rec.loadText(data[i],this.separator);
                    else
                        rec.load(data[i]);
                    this.records.push(rec);
                }
                if (nobind) return;
                this.updateBinds(true);
            },
            fetch: function(callback)
            {
                if (this.url)
                {
                    var ds = this;
                    idev.utils.ajax({
                        dataType:'json',
                        url:this.url,
                        params:this.params,
                        success:function(data,textStatus,jqXHR)
                        {
                            ds.jqXHR = jqXHR;
                            if(!data.success && ds.events.loadexception) ds.events.loadexception(ds,"Success False",data);
                            if(data.total && !isNaN(data.total)) ds.total = data.total;
                            if (ds.results)
                            {
                                ds.load(data[ds.results]);
                            }
                            else
                            {
                                ds.load(data.results);
                            }
                            if (callback) callback(ds);
                        },
                        error:function(jqXHR, textStatus, errorThrown)
                        {
                            ds.jqXHR = jqXHR;
                            if(ds.events.loadexception) ds.events.loadexception(ds, textStatus, errorThrown);
                        }
                    })
                }
            },
            updateBinds : function(fromload)
            {
                fromload = fromload || false;
                for (var i = 0;i < this.binds.length;i++)
                {
                    try
                    {
                        this.binds[i].refresh(fromload);
                    }
                    catch(e)
                    {
						idev.errorHandler("Update bind failed");
                    }
                }
                if (this.events == null) return;
                if(typeof this.events.load == "function" && fromload) this.events.load(this);
            },
            commitAll: function()
            {
                for (var i = 0;i < this.records.length;i++)
                {
                    this.records[i].commit();
                }
            },
            getModified: function()
            {
                var mods = new Array();
                for (var i = 0;i < this.records.length;i++)
                {
                    if (this.records[i].isModified()) mods.push(this.records[i]);
                }
                return mods;
            },
            getFieldName : function(index)
            {
                return this.fields[index];
            },
            fieldCount : function()
            {
                return  this.fields.length;
            },
            getAt : function(index)
            {
                return this.records[index];
            },
            blankRec: function()
            {
                return new idev.data.dataRecord( { fields: this.fields, store: null });
            },
            add : function(data,nobind,first)
            {
                if (data == null) return false;
                if (data instanceof idevObject)
                {
                    if (data.store != null) return false;
                    data.store = this;
                    if (first === true)
                        this.records.unshift(data);
                    else
                        this.records.push(data);
                }
                else
                {
                    var rec = new idev.data.dataRecord( { fields: this.fields, store: this });
                    if (typeof data == "string")
                        rec.loadText(data);
                    else
                        rec.load(data);
                    if (first === true)
                        this.records.unshift(rec);
                    else
                        this.records.push(rec);
                }
                if (nobind) return;
                this.updateBinds();
                return true;
            },
            removeAll : function()
            {
                for(var i in this.records)
                {
                    delete this.records[i];

                }
                this.records = [];
                this.updateBinds();
            },
            removeAt : function(index)
            {
                if (index < 0) return false;
                if (index >= this.records.length) return false
                this.records.splice(index,1);
                this.updateBinds();
                return true;
            },
            removeLast : function()
            {
                this.removeAt(this.records.length-1);
            },
            setParam:function(sParam,value)
            {
                this.params[sParam] = value;
            },
            getCount : function()
            {
                return this.records.length;
            },
            bind : function(widget)
            {
                // Check not already bound
                for (var i = 0;i < this.binds.length;i++)
                {
                    if (this.binds[i] == widget) return;
                }
                this.binds.push(widget)
            },
			unbind : function(widget)
            {
                for (var i = 0;i < this.binds.length;i++)
                {
                    if (this.binds[i] == widget) {
					this.binds.splice(i,1);
					return;
					}

                }
            },
            asString: function(type,separator)
            {
                type = type || "";
                switch (type.toLowerCase())
                {
                    case "csv" :
                        var result = "";
                        for(var i in this.records)
                        {
                            if (i > 0 )  result += "\r\n";
                            result += this.records[i].asString(type,separator);
                        }
                        return result;
                    case "json" :
                    default:
                        var result = "[";
                        for(var i in this.records)
                        {
                            if (i > 0 )  result += ",";
                            result += this.records[i].asString();
                        }
                        result += "]";
                        return result;
                }
            },
            sort: function(sField,assending)
            {
                if (assending == null) assending = true;
                this.records.sort(function(a,b)
                {
                    if (assending)
                        return a.get(sField) < b.get(sField) ? -1 : 0;
                    else
                        return a.get(sField) > b.get(sField) ? -1 : 0;
                });
                this.updateBinds();
            },
            find: function(sField,sValue,start,matchAny,caseSensitive)
            {
                var search = [];
                if (start == null) start = 0;
                if (matchAny == null) matchAny = true;
                if (caseSensitive == null) caseSensitive = true;
                if (typeof sField == "string")
                {
                    if (!caseSensitive) if (typeof sValue == "string") sValue = sValue.toLowerCase();
                    search.push ( { field:sField, value:sValue });    
                }
                else
                {
                    search = sField;
                }
                for(var i = start;i < this.records.length;i++)
                {
                    var pass = true;
                    for (var s = 0;s < search.length; s++)
                    {
                        var criteria = search[s];
                        var v = this.records[i].get(criteria.field);
                        sValue = criteria.value;
                        if (!caseSensitive) if (typeof v == "string") v = v.toLowerCase();
                        if (matchAny)
                        {
                            if (typeof v == "string")
                            {
                                if (v.indexOf(sValue) == -1) pass = false;
                            }
                            else
                            {
                                if (v != sValue) pass = false;
                            }
                        }
                        else
                        {
                            if (v != sValue) pass = false;
                        }
                    }
                    if (pass) return i;

                }
                return -1;
            },
            getTotal:function()
            {
                if (!this.url) {
                    this.total = this.records.length;
                    return this.total
                } else {
                    return this.total;
                }
            }
        })
    },
    ///////////////////////////////////////////////////////////////////////////////
    //  Page Creation Function
    ///////////////////////////////////////////////////////////////////////////////
    page : idevObject.extend({

        init: function(config)
        {
            if (config.id == null) 
            {
                config.id = idev.internal.nextUIID("pg");
                if ($("#"+config.id).length != 0) 
                {
                    idev.errorHandler("Duplicate Page ID : " + config.id + " ["+config.name+"]");
                    config.id = idev.internal.nextUIID("pg");
                }
            }
            config.events = config.events || {};
            
            this.name = config.name;
            this.id = config.id;
            this.data = config.data == null ? {} : config.data;
            this.fn = config.fn == null ? {} : config.fn;
			if(this.fn.parent == null) this.fn.parent=this;
            this.labelWidth = config.labelWidth || 70;
            this.orientation = config.orientation || '';
            this.target = config.target || '';
            this.header = config.header;
            this.content = config.content;
            this.footer = config.footer;

            if (config.pagestyle == null) config.pagestyle = "";
            if (config.cls == null) config.cls = "";
            if (config.style != null) config.pagestyle = config.style;

            if (config.cls != "") config.cls += "  ie9gradient";

            if (config.headerstyle == null) config.headerstyle = "";
            if (config.contentstyle == null) config.contentstyle = "";
            if (config.footerstyle == null) config.footerstyle = "";

            if (config.headerHTML == null) config.headerHTML = "Header";
            if (config.contentHTML == null) config.contentHTML = "Content";
            if (config.footerHTML == null) config.footerHTML = "Footer";

            if (config.height != null) config.pagestyle += "height:" + config.height + ";";

            if (config.header == null) config.header = { height:0, hidden:true, cls:"", style:"" };
            if (config.content == null) config.content = { height:0, hidden:true, cls:"", style:"" };
            if (config.footer == null) config.footer = { height:0, hidden:true, cls:"", style:"" };

            config.header.children = new Array();
            config.content.children = new Array();
            config.footer.children = new Array();

            if (config.header.cls == null) config.header.cls = "";
            if (config.content.cls == null) config.content.cls = "";
            if (config.footer.cls == null) config.footer.cls = "";

            if (config.header.cls != "") config.header.cls += "  ie9gradient";
            if (config.content.cls != "") config.content.cls += "  ie9gradient";
            if (config.footer.cls != "") config.footer.cls += "  ie9gradient";
            this.controlledContent = false;
            config.content.padding = 0;

            if (idev.controlHeight > 0)
            {
                config.content.height = idev.controlHeight - (idev.app.toolbar.height + idev.app.statusbar.height + config.header.height + config.footer.height);
                config.contentstyle += "overflow:auto;";
                controlledContent = true;
            }
            else if (_preferences.config.pageFit || _preferences.config.pagefit)
            {
                var tb = idev.convertNulls($('#ui-toolbar').height(),0);
                var sb = idev.convertNulls($('#ui-statusbar').height(),0);
                config.content.height = $("#container").height() - (tb + sb + config.header.height + config.footer.height);
                config.content.width = $("#container").width();
                if (idev.isIPad()) config.content.height += 10;
            }
            //-----------------------------------------------------------------
            // Header
            config.header.padding = 0;
            if (config.header.hidden == null) config.header.hidden = false;
            if (config.header.html == null)
                config.header.html = "";
            else if (config.data)
            {
                if (config.data.header != null)
                {
                    if (config.header.html != "")
                    {
                        var tpl = new idev.wTemplate(config.header.html);

                        config.content.html = tpl.render(config.data.header);
                    }
                }
            }
            if (config.header.height != null)
                config.headerstyle += "height:" + config.header.height + "px;";
            else
                config.header.height = 0;
            if (config.header.padding != null) config.headerstyle += "padding:" + config.header.padding + "px;";
            if (config.header.style != null) config.headerstyle += config.header.style;
            if (config.header.hidden) config.headerstyle += "display:none;";
            config.headerstyle += "padding:0;";
            //-----------------------------------------------------------------
            // Content
            if (config.content.layout == null) config.content.layout = "";

            config.content.layout = config.content.layout.toLowerCase();
            config.contentstyle += "position:relative;";
            if (config.content.padding) config.contentstyle += "padding:" + config.content.padding + "px;";
            if (config.content.html == null)
                config.content.html = "";
            else if (config.data)
            {
                if (config.data.content != null)
                {
                    if (config.content.html != "")
                    {
                        var tpl = new idev.wTemplate(config.content.html);

                        config.content.html = tpl.render(config.data.content);
                    }
                }
            }
            if (config.content.height != null)
            {
                config.contentstyle += "height:" + config.content.height + "px;max-height:" + config.content.height + "px;";
            }
            if (config.content.padding != null) config.contentstyle += "padding:" + config.content.padding + ";";
            if (config.content.style != null) config.contentstyle += config.content.style;
            config.contentstyle += "padding:0;";
            //-----------------------------------------------------------------
            // Footer
            config.footer.padding = 0;
            if (config.footer.hidden == null) config.footer.hidden = false;
            if (config.footer.html == null)
                config.footer.html = "";
            else   if (config.data)
            {
                if (config.data.footer != null)
                {
                    if (config.footer.html != "")
                    {
                        var tpl = new idev.wTemplate(config.footer.html);

                        config.footer.html = tpl.render(config.data.footer);
                    }
                }
            }
            config.footerstyle += "position:relative;";
            if (config.footer.height != null) config.footerstyle += "height:" + config.footer.height + "px;";
            if (config.footer.padding != null) config.footerstyle += "padding:" + config.footer.padding + "px;";
            if (config.footer.style != null) config.footerstyle += config.footer.style;
            if (config.footer.hidden) config.footerstyle += "display:none;";
            config.footerstyle += "padding:0;";
            this.config = config;
        },
        render : function()
        {
            var sHTML = "";
            var padding = this.config.content.padding || 0;

            if (!idev.isIE()) padding = 0;
            $("#container").css("overflow","hidden");
            var cw = $("#container").innerWidth() - padding;
            var ch = $("#content").height();
            ch += idev.app.toolbar.visible ? 0 : idev.app.toolbar.height;
            ch += idev.app.statusbar.visible ? 0 : idev.app.statusbar.height;
            sHTML += "<div id='" + this.config.id + "' class='ui-page " + this.config.cls + "' pageName='"+this.name+"' style='width:" + cw + "px;height:" + ch + "px;" + this.config.pagestyle + "'>";

            if (this.config.header != null)
            {
                sHTML += "<div id='" + this.config.id + "-header' class='ui-page-header " + this.config.header.cls + "' style='" + this.config.headerstyle +";width:" + cw + "px;'>";
                sHTML += this.config.header.html;
                sHTML += "</div>"
            }
            sHTML += "<div id='" + this.config.id + "-content' class='ui-page-content " + this.config.content.cls + "' style='" + this.config.contentstyle +";width:" + cw + "px;'>";
            if (this.controlledContent && idev.isTouch())
            {
                sHTML += "<div id='" + this.config.id + "-scroller'>";
            }
            sHTML += this.config.content.html;
            if (this.controlledContent && idev.isTouch())
           {
                sHTML += "</div>";
            }
            sHTML += "</div>";
            if (this.config.footer != null)
            {
                sHTML += "<div id='" + this.config.id + "-footer' class='ui-page-footer " + this.config.footer.cls + "' style='" + this.config.footerstyle +";width:" + cw + "px;'>" ;
                sHTML += this.config.footer.html;
                sHTML += "</div>" ;
            }
            sHTML += "</div>";
            $('#content').append(sHTML);

            if (this.controlledContent && idev.isTouch())
            {
                widget.iScroll = new iScroll($('#'+this.id + '-scroller'))
            }

            if (!idev.swipping) return;

            $('#' + this.config.id + "-content").mousedown(function()
            {
                idev.sx = -1;
                idev.sy = -1;
                idev.ex = -1;
                idev.ey = -1;
            });
            $('#' + this.config.id + "-content").mousemove(function(event)
            {
                if (idev.sx == -1)
                {
                    idev.sx = event.pageX;
                    idev.sy = event.pageY;
                }
                idev.ex = event.pageX;
                idev.ey = event.pageY;
            });
            $('#' + this.config.id + "-content").mouseup(function()
            {
                if (idev.sx > idev.ex)
                {
                    if (Math.abs(idev.sx - idev.ex) > 100 ) idev.nextPage();
                    idev.sx = -1;
                    idev.sy = -1;
                    idev.ex = -1;
                    return;
                }
                {
                    if (Math.abs(idev.ex - idev.sx) > 100 ) idev.prevPage();
                    idev.sx = -1;
                    idev.sy = -1;
                    idev.ex = -1;
                    return;
                }
            });
            var el = $('#' + this.config.id + '-content');

            el.ontouchstart = function()
            {
                idev.sx = -1;
                idev.sy = -1;
                idev.ex = -1;
                idev.ey = -1;
            };

            el.ontouchmove = function(event)
            {
                if (idev.sx == -1)
                {
                    idev.sx = event.changedTouches[0].pageX;
                    idev.sy = event.changedTouches[0].pageY;
                }
                idev.ex = event.changedTouches[0].pageX;
                idev.ey = event.changedTouches[0].pageY;
            };

            el.ontouchend = function()
            {
                if (idev.sx > idev.ex)
                {
                    if (Math.abs(idev.sx - idev.ex) > 100 ) idev.nextPage();
                    idev.sx = -1;
                    idev.sy = -1;
                    idev.ex = -1;
                    return;
                }
                {
                    if (Math.abs(idev.ex - idev.sx) > 100 ) idev.prevPage();
                    idev.sx = -1;
                    idev.sy = -1;
                    idev.ex = -1;
                    return;
                }
            };
        },
        getHeaderWidget : function( index )
        {
            if (index < 0) return null;
            if (this.header == null) return null;
            if (index >=  this.header.widgets.length) return null;
            return idev.get(this.header.widgets[index].id);
        },
        getContentWidget : function( index )
        {
            if (index < 0) return null;
            if (index >=  this.content.widgets.length) return null;
            return idev.get(this.content.widgets[index].id);
        },
        getFooterWidget : function( index )
        {
            if (index < 0) return null;
            if (this.footer == null) return null;
            if (index >=  this.footer.widgets.length) return null;
            return idev.get(this.footer.widgets[index].id);
        }
    }),
    ///////////////////////////////////////////////////////////////////////////////
    //  Page Management Class Declaration
    ///////////////////////////////////////////////////////////////////////////////
    pageManagerClass : idevObject.extend({
        init : function()
        {
            this.pages = new Array();
            this.activeIndex = -1;
            this.currentPage = null;
            this.lastPage = null;
            this.animation = true;
            this.animationType = "fade";
            this.canNavigate = true;
        },
        createWidgets: function(config, newpage)
        {
            if (config.header != null)
            {
                config.header.id = newpage.config.id + "-footer";
                if (config.header.widgets != null)
                {
                    config.header.id =  newpage.config.id + "-header";
                    idev.internal.renderWidgets(newpage, newpage.config.id + "-header", config.header.widgets, config.header.layout, config.header.labelWidth, config.header)
                }
            }
            if (config.content.widgets != null)
            {
                config.content.id =  newpage.config.id + "-content";
                idev.internal.renderWidgets(newpage, newpage.config.id + "-content", config.content.widgets, config.content.layout,  config.content.labelWidth, config.content)
            }
            if (config.footer != null)
            {
                config.footer.id = newpage.config.id + "-footer";
                if (config.footer.widgets != null)
                {
                    config.footer.id =  newpage.config.id + "-footer";
                    idev.internal.renderWidgets(newpage,newpage.config.id + "-footer", config.footer.widgets, config.footer.layout, config.footer.labelWidth, config.footer)
                }
            }
            if (config.events != null)
            {
                if (typeof config.events.afterRender == "function")
                {
                    config.events.afterRender(newpage);
                }
            }
        },
        addPage : function (config, index)
        {
            if (config == null) config = {};
            var newpage = new idev.page(config);
            if (newpage == null) alert("Failed To Create Page " + index);
            if (index == null)
            {
                newpage.pageindex = this.pages.length;
                this.pages.push( newpage );
            }
            else
            {
                this.pages[index] = newpage;
                newpage.pageindex = index;
            }
            newpage.name = config.name;
            newpage.events = config.events;
            if (newpage.events)
            {
                if (newpage.events.beforeRender) newpage.events.beforeRender(newpage);
                if (newpage.events.beforerender) newpage.events.beforerender(newpage);
            }
            newpage.render();
            return newpage;
        },
        add : function (config)
        {
            if (idev.app == null) return false;
            for(var i = 0;i < idev.app.pages.length;i++)
            {
                var page = idev.app.pages[i];
                if (page.name.toLowerCase() == config.name.toLowerCase())
                {
                    idev.errorHandler("Duplicate Page Name : " + config.name);
                    return;
                }
            }
            idev.app.pages.push(config);
            return true;
        },
        getPage : function (name)
        {
            for(var i = 0;i < this.pages.length;i++)
            {
                var page = this.pages[i];

                if (page)
                {
                    if (page.name.toLowerCase() == name.toLowerCase())
                    {
                        return page;
                    }
                }
            }
            return null;
        },
        pageCount : function()
        {
            return this.pages.length;
        },
        remove : function (index,force)
        {
            if (this.pages.length == 1) return false; //need 1 page
            if (typeof index == "string")
            {
                for(var i = 0;i < this.pages.length;i++)
                {
                    var page = this.pages[i];

                    if (page)
                    {
                        if (page.name.toLowerCase() == index.toLowerCase())
                        {
                            index = i;
                            break;
                        }
                    }
                }
                if (i == this.pages.length) return false
            }
            var pg = this.pages[index];
            if (pg == null) return false;
            if (pg.events.destroy) pg.events.destroy(pg);
            idev.removePageWidgets(pg.id);
            $('#' +  pg.id).remove();
            if (this.activeIndex == i) this.activeIndex = -1;
            this.pages[index] = null;
            this.pages.splice(index,1);
            if (pg.iScroll) delete pg.iScroll;
            var sName = pg.name;
            delete pg;
            if (force)
            {
                for(var i = 0;i < idev.app.pages.length;i++)
                {
                    var page = idev.app.pages[i];

                    if (page.name.toLowerCase() == sName)
                    {
                        idev.app.pages.splice(i,1)
                        break;
                    }
                }            
            }
            return true;
        },
        showPage : function (index)
        {
            if (idev.app == null) return false;
            if (index == null) return false;
            if (!this.canNavigate)  return false;
            if (typeof index == "number" && index == idev.pageManager.activeIndex) return false;
            var pg = this.createPage(index);
            if (pg == null) return false;
            if (pg.events.beforeShow) pg.events.beforeShow(this);
            if (idev.pageManager.currentPage != null)
            {
                if (idev.pageManager.currentPage.events.beforeHide) idev.pageManager.currentPage.events.beforeHide(this);
            }
            idev.pageManager.lastPage = idev.pageManager.currentPage;
            if (idev.pageManager.currentPage != null)
            {
                if (index == idev.pageManager.currentPage.name) return;
                if (index == idev.pageManager.activeIndex) return;
            }
            if (idev.pageManager.newPage && pg.config.hidden)
            {
                idev.pageManager.createWidgets(idev.app.pages[idev.pageManager.pageIndex], pg);
                idev.pageManager.canNavigate = true;
                if (idev.pageManager.animation)
                {
                    $("#" + pg.id).css("visibility","visible");
                    $("#" + pg.id).css("left",0-(idev.pgWidth+10));
                }
                else
                {
                    $("#" + pg.id).css("z-index",-10);
                    $("#" + pg.id).css("visibility","visible");
                }
                return true;
            }
            if (idev.pageManager.animation)
            {
                if (idev.pageManager.animationType == "fade")
                {
                    if (idev.pageManager.currentPage == null)
                    {
                        $("#" + pg.id).css("visibility","visible");
                        idev.pageManager.createWidgets(idev.app.pages[idev.pageManager.pageIndex], pg);
                        idev.pageManager.activeIndex = this.pageIndex;
                        idev.pageManager.currentPage = pg;
                        if (pg.events != null)
                        {
                            if (typeof pg.events.show == "function")
                            {
                                pg.events.show(pg);
                            }
                        }
                        return;
                    }
                    else if (idev.pageManager.newPage)
                    {
                        idev.pageManager.createWidgets(idev.app.pages[idev.pageManager.pageIndex], pg);
                    }
                    idev.pageManager.canNavigate = false;
					var p =idev.pageManager.currentPage;
                    $('#' + p.id).fadeOut(idev.fadeOutTime, function()
                    {
						$("#" + p.id).css("visibility","hidden");
						$("#" + p.id).css("display","block");
                        if (idev.pageManager.currentPage.events != null)
                        {
                            if (typeof idev.pageManager.currentPage.events.hide == "function")
                            {
                                idev.pageManager.currentPage.events.hide(pg);
                            }
                        }
                    });
                    idev.pageManager.activeIndex = idev.pageManager.pageIndex;
                    idev.pageManager.currentPage = pg;
					$('#' + pg.id).css('display','none');
					$('#' + pg.id).css('visibility','visible');
                    $('#' + pg.id).fadeIn(idev.fadeInTime, function()
                    {
                        if (idev.pageManager.activeIndex == idev.app.pages.length-1)
                        {
                            $('#idNext').css('visibility','hidden');
                        }
                        else
                        {
                            $('#idNext').css('visibility','visible');
                        }
                        if (idev.pageManager.activeIndex == 0)
                        {
                            $('#idBack').css('visibility','hidden');
                        }
                        else
                        {
                            $('#idBack').css('visibility','visible');
                        }
                        if (pg.events != null)
                        {
                            if (typeof pg.events.show == "function")
                            {
                                pg.events.show(pg);
                            }
                        }
                        idev.pageManager.canNavigate = true;
                    });
                    return true;
                }
                if (idev.pageManager.animationType == "slide")
                {
                    if (idev.pageManager.currentPage == null)
                    {
                        $("#" + pg.id).css("visibility","visible");
                        idev.pageManager.createWidgets(idev.app.pages[idev.pageManager.pageIndex], pg);
                        idev.pageManager.activeIndex = this.pageIndex;
                        idev.pageManager.currentPage = pg;
                        if (pg.events != null)
                        {
                            if (typeof pg.events.show == "function")
                            {
                                pg.events.show(pg);
                            }
                        }
                        return;
                    }
                    idev.pageManager.canNavigate = false;
                    if (idev.pageManager.newPage)
                    {
                        idev.pageManager.createWidgets(idev.app.pages[idev.pageManager.pageIndex], pg);
                    }
                    var l = $('#' + pg.id).css("left");
                    if (l=="auto") l=0;
                    if (idev.pageManager.pageIndex > idev.pageManager.activeIndex && l >= 0 )
                    {
                        // Make sure selected page is above and order preloaded pages
                        $('#' + pg.id).css("z-index",2);
                        $('#' + idev.pageManager.currentPage.id).css("z-index",10);
                        $('#' + pg.id).css("visibility","visible");
                        idev.utils.delay(100,function()
                        {
                            var x = 0-(idev.pgWidth+10);
                            $('#' + idev.pageManager.currentPage.id).animate({
                                    left:x
                                },
                                idev.animationTime,
                                "linear",
                                function()
                                {
                                    idev.pageManager.activeIndex = idev.pageManager.pageIndex;
                                    $('#' + idev.pageManager.currentPage.id).css("visibility","hidden");
                                    idev.pageManager.currentPage = pg;
                                    idev.pageManager.canNavigate = true;
                                    if (pg.events != null)
                                    {
                                        if (typeof pg.events.show == "function")
                                        {
                                            pg.events.show(pg);
                                        }
                                    }
                                }
                            );
                        })
                    }
                    else
                    {
                        $('#' + idev.pageManager.currentPage.id).css("z-index",0);
                        $('#' + pg.id).css("z-index",2);
                        $('#' + pg.id).css("visibility","visible");
                        idev.utils.delay(100,function()
                        {       
                            $('#' + pg.id).animate({
                                    left:0
                                },
                                idev.animationTime,
                                "linear",
                                function()
                                {
                                    var x = 0-(idev.pgWidth+10);
                                    $('#' + idev.pageManager.currentPage.id).css("left",x);
                                    $('#' + idev.pageManager.currentPage.id).css("visibility","hidden");
                                    idev.pageManager.activeIndex = idev.pageManager.pageIndex;
                                    idev.pageManager.currentPage = pg;
                                    idev.pageManager.canNavigate = true;
                                    if (pg.events != null)
                                    {
                                        if (typeof pg.events.show == "function")
                                        {
                                            pg.events.show(pg);
                                        }
                                    }
                                }
                            );
                        })
                    }
                    return true;
                }
            }
            else
            {
                if (this.currentPage == null)
                {
                    this.currentPage = pg;
                    this.activeIndex = this.pageIndex;
                    $("#" + pg.id).css("visibility","visible");
                    idev.pageManager.createWidgets(idev.app.pages[idev.pageManager.pageIndex], pg);
                    if (pg.events != null)
                    {
                        if (typeof pg.events.show == "function")
                        {
                            pg.events.show(pg);
                        }
                    }
                }
                else
                {
                    $("#" + this.currentPage.id).css("visibility","hidden");
                    $("#" + this.currentPage.id).css("z-index",-10);
                    this.currentPage = pg;
                    this.activeIndex = this.pageIndex;
                    $("#" + pg.id).css("z-index",0);
                    $("#" + pg.id).css("visibility","visible");
                    if (idev.pageManager.newPage)
                    {
                        idev.pageManager.createWidgets(idev.app.pages[idev.pageManager.pageIndex], pg);
                    }
                    if (pg.events != null)
                    {
                        if (typeof pg.events.show == "function")
                        {
                            pg.events.show(pg);
                        }
                    }
                }
            }
            return true;
        },
        createPage : function (index)
        {
            if (idev.app == null) return false;
            if (index == null) return false;
            idev.pageManager.newPage = false;
            if (typeof index == "string")
            {
                if (index == "") return false;
                index = index.toLowerCase();
                for(var i = 0;i < idev.app.pages.length;i++)
                {
                    var page = idev.app.pages[i];

                    if (page.name.toLowerCase() == index.toLowerCase())
                    {
                        var page = this.pages[i];
                        if (page == null)
                        {
                            page = idev.app.pages[i];
                            this.pageIndex = i;
                            this.newPage = true;
                            return idev.pageManager.addPage(page,i);
                        }
                        else
                        {
                            this.pageIndex = i;
                        }
                        return page;
                    }
                }
            }
            else
            {
                if (index < 0 || index >= idev.app.pages.length) return false;
                var page = this.pages[index];
                if (page == null)
                {
                    page = idev.app.pages[index];
                    this.pageIndex = index;
                    this.newPage = true;
                    return idev.pageManager.addPage(page,index);;
                }
                else
                    this.pageIndex = index;
                return page;
            }
            return null;
        },
        prevPage : function ()
        {
            if (idev.pageManager.activeIndex == 0) return;
            this.showPage(idev.pageManager.activeIndex-1) ;
        },
        nextPage : function ()
        {
            if (idev.pageManager.activeIndex == idev.app.pages.length-1) return;
            this.showPage(idev.pageManager.activeIndex+1);
        },
        syncSize:function(e)
        {      
            if (_preferences.config == null) return;
            if (_preferences.config.pageFit !== true) return;
            var w = $(window).width();
            var h = $(window).height();
            idev.pgWidth = w;
            idev.pgHeight = h;
            var ch = h - ($('#ui-toolbar').height() + $('#ui-statusbar').height());            
            $("#container").width(w);
            $("#container").height(h);
            $("#content").width(w);
            $("#content").height(ch);
            $("#ui-toolbar").width(w);
            $("#ui-statusbar").width(w);
            if (idev.app.toolbar)
            {
                if (idev.app.toolbar.children)
                {
                    for(var c = 0;c < idev.app.toolbar.children.length;c++)
                    {
                        idev.app.toolbar.children[c].doLayout();
                    }
                }
            }
            if (idev.app.statusbar)
            {
                if (idev.app.statusbar.children)
                {
                    for(var c = 0;c < idev.app.statusbar.children.length;c++)
                    {
                        idev.app.statusbar.children[c].doLayout();
                    }
                }
            }
            for(var i = 0;i < this.pages.length;i++)
            {
                var page = this.pages[i];
                
                if (page != null)
                {
                    var pch = ch - ($('#'+page.id+'-header').height() + $('#'+page.id+'-footer').height());            
                    $("#"+page.id).height(ch); 
                    $("#"+page.id).width(w);  

                    $("#"+page.id+'-header').width(w);  
                    $("#"+page.id+'-content').width(w);  
                    $("#"+page.id+'-content').height(pch);  
                    $("#"+page.id+'-footer').width(w);  

                    if (page.config.header)
                    {
                        for(var c = 0;c < page.config.header.children.length;c++)
                        {
                            page.config.header.children[c].doLayout();
                        }
                    }
                    if (page.config.content)
                    {
                        for(var c = 0;c < page.config.content.children.length;c++)
                        {
                            if (page.config.content.layout == "fit")
                            {
                                 page.config.content.children[c].resize(w,pch);
                            }
                            else
                                page.config.content.children[c].doLayout();
                        }
                    }
                    if (page.config.footer)
                    {
                        for(var c = 0;c < page.config.footer.children.length;c++)
                        {
                            page.config.footer.children[c].doLayout();
                        }
                    }
                }
            }
            if (idev.app.events.onResize) idev.app.events.onResize();       
        }

    }),

    ////////////////////////////////////////////////////////////////////////////
    //  iDevUI utility functions
    ////////////////////////////////////////////////////////////////////////////
    utils :
    {
        ajax : function( config )
        {
            try
            {
                if (config.url == null) return;
                if (config.dataType == null) config.dataType = 'json';
                if (config.type == null) config.type = 'POST';
                config.data = config.params;
                if (config.error)
                {
                    config.failed = config.error;
                    config.error = function(jqXHR, errText, err)
                    {
                        config.failed(jqXHR, errText, err)
                    }
                }
                $.ajax(config);
            }
            catch (e)
            {
                alert("AJAX Error")
                return null;
            }
        },
		downloadURL:function (url) 
		{

			var hiddenIFrameID = 'idevuihiddenDownloader',
				iframe = $('#' + hiddenIFrameID);
			if (iframe === null) {
				iframe = document.createElement('iframe');
				iframe.id = hiddenIFrameID;
				iframe.style.display = 'none';
				document.body.appendChild(iframe);
			}

			iframe.src = url;
		},
        switchTheme:function(theme,callback)
        {
            theme =  _preferences.libpath + "themes/" + theme + "/theme.css?forceReload="+(new Date().valueOf());
            idev.utils.loadCSS(theme,callback);
        },
        loadCSS: function(css,callback)
        {
            try
            {
                if (callback == null) callback = idev.internal.callback;
                idev.internal.addStyleSheet(css,callback);
            }
            catch(e)
            {
                idev.errorHandler(e.message);
            }
        },
        loader : function(url,callback,params)
        {
            try
            {
                var config = {};

                config.url = url;
                if (config.url == null) return;
                if (config.url == "") return;
                config.dataType = 'text';
                config.data = params;
                config.success  = function(data)
                {
                    $('head').append("<script type='text/javascript'>" + data + "</script>");
                    if (typeof callback == "function") callback();
                }
                if (config.error)
                {
                    config.failed = config.error;
                    config.error = function(jqXHR, errText, err)
                    {
                        config.failed(err)
                    }
                }
                $.ajax(config);
            }
            catch (e)
            {
                alert("AJAX Load Error")
            }
        },
        S4 : function () 
        {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },
        guid: function ()
        {
           return (idev.utils.S4()+idev.utils.S4()+"-"+idev.utils.S4()+"-"+idev.utils.S4()+"-"+idev.utils.S4()+"-"+idev.utils.S4()+idev.utils.S4()+idev.utils.S4()).toUpperCase();
        },
        json : function( sJSON )
        {
            try
            {
                return jQuery.parseJSON(sJSON);
            }
            catch (e)
            {
                alert("JSON Decode Error: " + sJSON)
                return null;
            }
        },
        eval : function(script,onerror)
        {
            try
            {
                var result = eval(script);

                if (result == null) return script;
                return result;
            }
            catch(e)
            {
                if (onerror) onerror(e);
                return script;
            }
        },
        parseJSON : function(script)
        {
            try
            {
                var tmp;
                var result = eval("tmp="+script);

                if (result == null) return script;
                return result;
            }
            catch(e)
            {
                return script;
            }
        },
        cssOpacity : function(opacity)
        {
            if (opacity == 1) return "";
            // 0 - 1
            return "filter:alpha(opacity="+(opacity*100)+");-moz-opacity:"+opacity+";-khtml-opacity: "+opacity+";opacity: "+opacity+";";
        },
        ellipsis : function (text,chars)
        {
            text += "...";
            while (text.length > chars && text.substr(text.length-3,1) != " ")
            {
                text = text.substr(0,text.length-4) + "...";
            }
            return text;
        },
        showBusy : function()
        {
            if ($("#_busy") == null)
            {
                $("#container").append("<div id='_busy' class='ui-busy'></div>");
            }
            var w = $("#container").width();
            var h = $("#container").height();
            var lw = $("#_busy").width();
            var lh = $("#_busy").height();
            $("#_busy").css("left",(w/2)- (lw/2));
            $("#_busy").css("top",(h/2)- (lh/2));
            $("#_busy").show();
        },
        hideBusy : function()
        {
            if ($("#_busy") != null)
            {
                $("#_busy").hide();
            }
        },
        delay : function(duration,callback,scope)
        {
            if (typeof callback == "function")
            {
                setTimeout(function()
                {
                    callback(scope)
                },duration);
            }
        },
        replaceAll : function(sText,sSubstr,sWith)
        {
            if (typeof sText != "string") return sText == null ? "" : sText;
            if (sSubstr != sWith && sSubstr != "")
            {
                while (sText.indexOf(sSubstr) != -1) sText = sText.replace(sSubstr,sWith);
            }
            return sText;
        },
        round : function (num, dec)
        {
			if(dec===null) dec=0;
			var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
            return result;
        },
        roundUp : function (num)
        {
            return Math.ceil(num);
        },
        ucwords : function (str)
        {
            return (str + '').replace(/^(.)|\s(.)/g, function ($1) {
                return $1.toUpperCase();    });
        },
        dateAdd : function (objDate, strInterval, intIncrement)
        {
            if(typeof(objDate) == "string")
            {
                objDate = new Date(objDate);

                if (isNaN(objDate))
                {
                    throw("DateAdd: Date is not a valid date");
                }
            }
            else if(typeof(objDate) != "object" || objDate.constructor.toString().indexOf("Date()") == -1)
            {
                throw("DateAdd: First parameter must be a date object");
            }

            if(
            strInterval != "M"
            && strInterval != "D"
            && strInterval != "Y"
            && strInterval != "h"
            && strInterval != "m"
            && strInterval != "uM"
            && strInterval != "uD"
            && strInterval != "uY"
            && strInterval != "uh"
            && strInterval != "um"
            && strInterval != "us"
            )
            {
                throw("DateAdd: Second parameter must be M, D, Y, h, m, uM, uD, uY, uh, um or us");
            }

            if(typeof(intIncrement) != "number")
            {
                throw("DateAdd: Third parameter must be a number");
            }

            switch(strInterval)
            {
                case "M":
                objDate.setMonth(parseInt(objDate.getMonth()) + parseInt(intIncrement));
                break;

                case "D":
                objDate.setDate(parseInt(objDate.getDate()) + parseInt(intIncrement));
                break;

                case "Y":
                objDate.setYear(parseInt(objDate.getYear()) + parseInt(intIncrement));
                break;

                case "h":
                objDate.setHours(parseInt(objDate.getHours()) + parseInt(intIncrement));
                break;

                case "m":
                objDate.setMinutes(parseInt(objDate.getMinutes()) + parseInt(intIncrement));
                break;

                case "s":
                objDate.setSeconds(parseInt(objDate.getSeconds()) + parseInt(intIncrement));
                break;

                case "uM":
                objDate.setUTCMonth(parseInt(objDate.getUTCMonth()) + parseInt(intIncrement));
                break;

                case "uD":
                objDate.setUTCDate(parseInt(objDate.getUTCDate()) + parseInt(intIncrement));
                break;

                case "uY":
                objDate.setUTCFullYear(parseInt(objDate.getUTCFullYear()) + parseInt(intIncrement));
                break;

                case "uh":
                objDate.setUTCHours(parseInt(objDate.getUTCHours()) + parseInt(intIncrement));
                break;

                case "um":
                objDate.setUTCMinutes(parseInt(objDate.getUTCMinutes()) + parseInt(intIncrement));
                break;

                case "us":
                objDate.setUTCSeconds(parseInt(objDate.getUTCSeconds()) + parseInt(intIncrement));
                break;
            }
            return objDate;
        },
        fromUDateTime: function(sDate)
        {
            var dateArray = [];
            dateArray[0] = parseInt(sDate.substr(0,4));    
            dateArray[1] = parseInt(sDate.substr(4,2));   
            dateArray[2] = parseInt(sDate.substr(6,2));   
            dateArray[3] = parseInt(sDate.substr(8,2));   
            dateArray[4] = parseInt(sDate.substr(10,2));   
            dateArray[5] = parseInt(sDate.substr(12,2));   
            return new Date(
                 dateArray[0],
                 dateArray[1]-1, // Careful, month starts at 0!
                 dateArray[2],
                 dateArray[3],
                 dateArray[4],
                 dateArray[5]
            );   
        },
        trim : function (str, chars)
        {
            if (str == null || typeof str != "string") return str;
            return this.ltrim(this.rtrim(str, chars), chars);
        },

        ltrim : function (str, chars)
        {
            if (str == null || typeof str != "string") return str;
            chars = chars || "\\s";
            return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
        },

        rtrim : function (str, chars)
        {
            if (str == null || typeof str != "string") return str;
            chars = chars || "\\s";
            return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
        },
		objectLength : function(obj)
		{
			var length = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) length++;
			}
			return length;
		},
        urldecode: function  (str)
        {
            return decodeURIComponent((str+'').replace(/\+/g, '%20'));
        },

        urlencode: function  (str)
        {
            return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
        },

        JSON2string: function(obj)
        {
            var t = typeof (obj);
            if (t != "object" || obj === null)
            {
                // simple data type
                if (t == "string") obj = '"'+obj+'"';
                return String(obj);
            }
            else
            {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);
                for (n in obj)
                {
                    v = obj[n]; t = typeof(v);
                    if (t == "string")
                        v = '"'+v+'"';
                    else
                        if (t == "object" && v !== null) v = idev.utils.JSON2string(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        },
        mousePos : function(ev)
        {
            return {
                x:ev.clientX + document.body.scrollLeft,
                y:ev.clientY + document.body.scrollTop - (idev.app.toolbar ? idev.app.toolbar.height : 0)
            };
        },
        mousePosition : function (ev)
        {
            if (idev.isTouch())
            {
                return {
                    x:idev._endX + document.body.scrollLeft - document.body.clientLeft,
                    y:idev._endY + document.body.scrollTop  - document.body.clientTop
                };
            }
            return {
                x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y:ev.clientY + document.body.scrollTop  - document.body.clientTop
            };
        },
        clone:function (o)
        {
            try
            {
                return $().extend(true, {}, o);
            }
            catch(e)
            {
                idev.errorHandler(e.message);
                return null;
            }
        },
        generatePassword:function(length, strength)
        {
            length = length || 9;
            strength = strength || 0;
            vowels = 'aeuy';
            constants = 'bdghjmnpqrstvz';
            if (strength & 1) {
                constants += 'BDGHJLMNPQRSTVWXZ';
            }
            if (strength & 2) {
                vowels += "AEUY";
            }
            if (strength & 4) {
                constants += '23456789';
            }
            if (strength & 8) {
                constants += '@#$!';
            }


            password = '';
            alt = new Date().getTime() % 2;
            for (var i = 0; i < length; i++)
            {
                if (alt == 1)
                {
                    p = parseInt((Math.random() * 327678) % constants.length);
                    password += constants[p];
                    alt = 0;


                }
                else
                {
                    p = parseInt((Math.random() * 327678) % vowels.length);
                    password += vowels[p];
                    alt = 1;
                }
            }
            return password;
        },
        findID : function (el)
        {
            while(el)
            {
                if (el.id != null) 
                {
                    if (el.id != "") return el.id;
                }    
                el = el.parentNode;
            }
            return "";
        },
        extractIndex : function(el)
        {
            while(el)
            {
                if (el.id != null) 
                {
                    if (el.id != "")
                    {
                        var pos = el.id.lastIndexOf("_");
                        if (pos == -1) return -1;      
                        return parseInt(el.id.substr(pos+1));                                
                    };
                }    
                el = el.parentNode;
            }
            return -1;
        },
        scrypt: function (input, key, encrypt) {
            var output = "";
            if (!encrypt) 
            {
                var tmp = "";
                for (var i = 0; i < input.length; i++) 
                {
                    var n = idev.rAlphabet.indexOf(input.substr(i,1))+32;
                    tmp += String.fromCharCode(n);
                }
                input = tmp;
            }
            for (var i = 0; i < input.length; i++) 
            {
                var c = input.charCodeAt(i);
                if      (c >= 65 && c <=  90) c = String.fromCharCode((c - 65 + key) % 26 + 65);  // Uppercase
                else if (c >= 97 && c <= 127) c = String.fromCharCode((c - 97 + key) % 26 + 97);  // Lowercase
                else                          c = input.charAt(i);  // Copy
                if (encrypt) c = idev.rAlphabet.substr(c.charCodeAt(0)-32,1);
                output += c;
            }
            return output;
        },
        updateJSONObject:function(json, data)
        {
            for(var key in json)
            {
                var f = data[key];
                if (typeof f === "string" || typeof f === "number" || typeof f === "boolean")
                {
                    json[key] = f;
                }
            }
        },
        css2JSON:function(sCSS)
        {
            if (sCSS == "" || sCSS == null) return {};
            sCSS += ";";
            sCSS = sCSS.replace(";;",";");
            sCSS = '{"'+sCSS;
            sCSS = idev.utils.replaceAll(sCSS,":","~");
            sCSS = idev.utils.replaceAll(sCSS,"~",'":"');
            sCSS = idev.utils.replaceAll(sCSS,";","~");
            sCSS = idev.utils.replaceAll(sCSS,"~",'","');
            sCSS = sCSS.substr(0,sCSS.length-2) + "}";
            return idev.utils.json(sCSS);
        },
        form:{
            getFieldWidget:function(panel,field)
            {
                if (panel == null) return null;
                if (!(panel instanceof baseWidget))
                {
                    panel = $get(panel.id); 
                    if (panel == null) return null;
                }
                var scope = {
                    action:3,
                    field:field,
                    widget:null
                };
                idev.utils.form.action(panel, scope);
                return scope.widget;
            },
            getFieldConfig:function(json,field,config)
            {
                if (typeof json !== "object") return null;
                if (field == null || field == "") return null;
                for (var i = 0;i < json.widgets.length;i++)
                {
                    var fld = json.widgets[i].field;
                    if (fld == field) 
                    {
                        config = json.widgets[i];
                        break;
                    }
                    if (json.widgets[i].widgets) 
                    {
                        config = idev.utils.form.getFieldConfig(json.widgets[i],field,config);
                        if (config != null) break;
                    }
                }
                return config;
            },
            getData:function(panel)
            {
                if (panel == null) return null;
                if (!(panel instanceof baseWidget))
                {
                    panel = $get(panel.id); 
                    if (panel == null) return null;
                }
                return  idev.utils.form.action(panel,{
                        action:0
                    });
            },
            clearData:function(panel)
            {
                if (panel == null) return null;
                if (!(panel instanceof baseWidget))
                {
                    panel = $get(panel.id); 
                    if (panel == null) return null;
                }
                return  idev.utils.form.action(panel,{
                        action:1
                    });
            },
            setData:function(panel,datarec)
            {
                if (panel == null) return null;
                if (!(panel instanceof baseWidget))
                {
                    panel = $get(panel.id); 
                    if (panel == null) return null;
                }
                return  idev.utils.form.action(panel,{
                        action:2,
                        rec:datarec
                    });
            },
            // None public method
            action:function(panel,scope)
            {
                if (scope.data == null) scope.data = new Array();
                
                for (var i = 0;i < panel.children.length;i++)
                {
                    var tp = panel.children[i].wtype;
                    
                    if (tp != "button" && 
                        tp != "icon" &&
                        tp != "image" &&
                        tp != "label" &&
                        tp != "spacer" &&
                        tp != "dataview" &&
                        tp != "tabpanel" &&
                        tp != "grid")
                        {
                            if (tp == "composite")
                            {
                                idev.utils.form.action(panel.children[i],scope); 
                            }
                            else if (tp == "panel")
                            {
                                idev.utils.form.action(panel.children[i],scope); 
                            }
                            else switch(scope.action)
                            {
                                case 0:
                                    scope.data.push(panel.children[i].getValue()); 
                                    if (typeof panel.children[i].field == "string" && panel.children[i].field != "")
                                        scope.data[panel.children[i].field] = panel.children[i].getValue();   
                                    break
                                case 1:
                                    panel.children[i].setValue("");    
                                    break
                                case 2:
                                    panel.children[i].setValue(scope.rec.get(panel.children[i].field));     
                                    break
                                case 3:
                                    if (panel.children[i].field == scope.field)
                                    {
                                        scope.widget = panel.children[i];
                                        return;
                                    }     
                                    break
                            }
                        }
                    else if (scope.action == 3 && panel.children[i].field == scope.field)
                    {
                        scope.widget = panel.children[i];
                        return;
                    }     
                    
                }
                return scope.data;
            }
        }
    },
    ////////////////////////////////////////////////////////////////////////////
    //  Widget Object Declaration
    ////////////////////////////////////////////////////////////////////////////

    ui :
    {
        addMask : function (id)
        {
            var w = $(document).width();
            var h = $(document).height();
            var zindex = 100;

            $('body').append("<div id='"+id+"' class='ui-mask' style='left:0px;top:0px;width:" + (w-1) + "px;height:" + (h-1) + "px;z-index:" + zindex + "'>&nbsp;</div>");
        },
        removeMask : function (id)
        {
            $('#'+id).remove();
        },
        addEvent: function(id,sEvent,fn)
        {
            $('#' + id).bind(sEvent,fn);
        },
        removeEvent: function(id,sEvent,fn)
        {
            $('#' + id).unbind(sEvent,fn);
        },
        message : function (config)
        {
            var bAutoClose = false;
            
            if (typeof config == "string")
            {
                var text = config;
                config = { text: text , type: "OK" };
            }
            else
            {
                if (config.type == null) config.type = "OK";

                config.type = config.type.toUpperCase();
            }
            if (config.text == null) return;
            if (typeof config.text == "object") config = config.text;
            if (config.text == null) return;
            if (config.iconsize == null) config.iconsize = idev.defaultMIconSize;
            if (config.width == null) config.width = idev.defaultMWidth;
            if (config.height == null) config.height = idev.defaultMHeight;
            if (config.bbarHeight == null) config.bbarHeight = idev.defaultMBBarHeight;
            if (config.padding == null) config.padding = idev.defaultMPadding;
            if (config.cls == null) config.cls = idev.defaultMCls;
            if (config.title == null) config.title = " ";
            config.btnWidth = config.btnWidth || idev.defaultMBtnWidth;
            config.btnHeight = config.btnHeight || idev.defaultMBtnHeight;
            config.closable = true;
            config.titleHeight = 22;
            config.bodyCls = "";
            if (config.shadow == null) config.shadow =  idev.defaultMShadow;
            if (config.shadowSize == null) config.shadowSize =  idev.defaultMShadowSize;
            if (config.shadowColor == null) config.shadowColor =  idev.defaultMShadowColor;
            if (config.titleCls == null) config.titleCls = idev.defaultMTitleCls;            
            if (config.tbarCls == null) config.tbarCls = idev.defaultMTbarCls;            
            if (config.bbarCls == null) config.bbarCls = idev.defaultMBbarCls;            
            if (config.backgroundCls == null) config.backgroundCls = idev.defaultMBGCls;            
            if (config.fontSize == null) config.fontSize = idev.defaultMFontSize;
            if (config.buttonYESColor == null) config.buttonYESColor = config.buttonColor;
            if (config.buttonNOColor == null) config.buttonNOColor = config.buttonColor;
            if (config.buttonCANCELColor == null) config.buttonCANCELColor = config.buttonColor;
            if(config.backgroundCls !== "") config.backgroundCls += " ie9gradient";
            config.padding = 0;
            if (config.icon != null)
            {
                config.icon = config.icon.toLowerCase();
                if (config.icon == "warning")
                {
                    config.tpl = new idev.wTemplate("<table width={width} cellpadding=5 cellspacing=0 style='width:{width}px;table-layout:fixed;'><tr><td width='{iconsize}px' valign=top><img src='{iconpath}warning.png' style='width:{iconsize}px;height:{iconsize}px;;'></td><td width='{textwidth}px' style='width:{textwidth}px;max-width:{textwidth}px;word-wrap: break-word;'>{text}</td></tr></table>");
                }
                else if (config.icon == "info" || config.icon == "information")
                {
                    config.tpl = new idev.wTemplate("<table width={width} cellpadding=5 cellspacing=0 style='width:{width}px;table-layout:fixed;'><tr><td width='{iconsize}px' valign=top><img src='{iconpath}information.png' style='width:{iconsize}px;height:{iconsize}px;'></td><td width='{textwidth}px' style='width:{textwidth}px;max-width:{textwidth}px;word-wrap: break-word;'>{text}</td></tr></table>");
                }
                else if (config.icon == "error")
                {
                    config.tpl = new idev.wTemplate("<table width={width} cellpadding=5 cellspacing=0 style='width:{width}px;table-layout:fixed;'><tr><td width='{iconsize}px' valign=top><img src='{iconpath}error.png' style='width:{iconsize}px;height:{iconsize}px;'></td><td width='{textwidth}px;word-wrap: break-word;'>{text}</td></tr></table>");
                }
                else if (config.icon == "question")
                {
                    config.tpl = new idev.wTemplate("<table width={width} cellpadding=5 cellspacing=0 style='width:{width}px;table-layout:fixed;'><tr><td width='{iconsize}px' valign=top><img src='{iconpath}question.png' style='width:{iconsize}px;height:{iconsize}px;'></td><td width='{textwidth}px' style='width:{textwidth}px;max-width:{textwidth}px;word-wrap: break-word;'>{text}</td></tr></table>");
                }
                else
                    if (config.tpl == null) config.tpl = new idev.wTemplate("<table width={width} cellpadding=5 cellspacing=0 style='width:{width}px;table-layout:fixed;'><tr><td width='{iconsize}px' valign=top><img src='{iconpath}question.png' style='width:{iconsize}px;height:{iconsize}px;'></td><td width='{textwidth}px' style='width:{textwidth}px;max-width:{textwidth}px;word-wrap: break-word;'>{text}</td></tr></table>");
            }
            else
                if (config.tpl == null) config.tpl =  new idev.wTemplate("<table width={width} cellpadding=5 cellspacing=0 style='width:{width}px;table-layout:fixed;'><tr><td><span style='word-wrap: break-word;'>{text}</span></td></tr></table>");
            if (config.data == null ) config.data = new Array();

            config.data['iconpath'] = _preferences.libpath + "images/";
            config.data['iconsize'] = config.iconsize;
            config.data['width'] = config.width - (10 + config.padding * 2);
            config.data['textwidth'] = config.width - (config.iconsize+20+(config.padding * 2));
            config.data['text'] = config.text;

            var bbar;
            if (config.type == "YESNO")
                bbar = [
                   '>>',
                    {
                        wtype:'button',
                        width:config.btnWidth,
                        height:config.btnHeight,
                        radius:4,
                        text:'YES',
                        cls:'ui-button-yes',
                        events : {
                            click: function(btn)
                            {
                                if (win.callback) win.callback("YES");
                                win.close();
                            }
                        }
                    },
                    {
                        wtype:'spacer',
                        width:4
                    },
                    {
                        wtype:'button',


                        width:config.btnWidth,
                        height:config.btnHeight,
                        radius:4,
                        text:'NO',
                        cls:'ui-button-no',
                        events : {
                            click: function(btn)
                            {
                                if (win.callback) win.callback("NO");
                                win.close();
                            },
                            afterRender:function(btn)
                            {
                                $delay(100,function(btn)
                                {
                                    $("#"+btn.id).focus();
                                },btn);
                            }
                        }
                    },
                    {
                        wtype:'spacer',
                        width:15
                    }
                ];
            else if (config.type == "OKCANCEL")
                bbar = [
                   '>>',
                    {
                        wtype:'button',
                        width:config.btnWidth,
                        height:config.btnHeight,
                        radius:4,
                        text:'OK',
                        cls:'ui-button-ok',
                        events : {
                            click: function(btn)
                            {
                                if (win.callback) win.callback("OK");
                                win.close();
                            }
                        }
                    },
                    {
                        wtype:'spacer',
                        width:4
                    },
                    {
                        wtype:'button',
                        width:config.btnWidth,
                        height:config.btnHeight,
                        radius:4,
                        text:'CANCEL',
                        cls:'ui-button-cancel',
                        events : {
                            click: function(btn)
                            {
                                if (win.callback) win.callback("CANCEL");
                                win.close();
                            },
                            afterRender:function(btn)
                            {
                                $delay(100,function(btn)
                                {
                                    $("#"+btn.id).focus();
                                },btn);
                            }
                        }
                    },
                    {
                        wtype:'spacer',
                        width:15
                    }
                ];
            else if (config.type == "OK")
            {
                bAutoClose = true;
                bbar = [
                   '>>',
                    {
                        wtype:'button',
                        width:config.btnWidth,
                        height:config.btnHeight,
                        radius:4,
                        text:'OK',
                        cls:'ui-button-ok',
                        events : {
                            click: function(btn)
                            {
                                if (win.callback) win.callback("OK");
                                win.close();
                            },
                            afterRender:function(btn)
                            {
                                $delay(100,function(btn)
                                {
                                    $("#"+btn.id).focus();
                                },btn);
                            }
                        }
                    },
                    {
                        wtype:'spacer',
                        width:20
                    }
                ];
            }
            else
            {
                bAutoClose = true;
                bbar = [
                    ];
            }
            var win = new idev.ui.widgetWindow({
                    title:config.title,
                    x:config.x,
                    y:config.y,
                    width:config.width,
                    height:config.height,
                    titleHeight:config.titleHeight,
                    titleStyle:config.titleStyle,
                    tbarCls:config.tbarCls,
                    bbarCls:config.bbarCls,
                    titleCls:config.titleCls,
                    bodyCls:config.bodyCls,
                    backgroundCls:config.backgroundCls,
                    shadow:config.shadow,
                    shadowSize:config.shadowSize,
                    shadowColor:config.shadowColor,
                    panelCls:'ui-message',
                    padding:config.padding,
                    closable:false,
                    cls:config.cls,
                    autoClose:bAutoClose,
                    style:config.style,
                    radius:config.radius,
                    modal:true,
                    hidden:true,
                    html:config.tpl.render(config.data),
                    bbar: bbar,
                    bbarHeight:config.bbarHeight
                });
            win.callback = config.callback;
            if (config.popup && !config.animate)
                config.animate = "moveto";
            if (config.animate)
            {
                if (config.animSpeed == null) config.animSpeed = 500;
                if (config.animate == "fadein")
                {
                    win.fadeIn(config.animSpeed);
                    if(config.delay)
                    {
                        $delay(config.delay,function()
                        {
                            win.fadeOut(config.animSpeed,null,function(){
                                win.close();
                            });
                        },config);
                    }
                }
                else if (config.animate == "moveto" && config.ax != null && config.ay != null)
                {
                    win.show();
                    win.moveTo(config.ax,config.ay,config.animSpeed);
                    if(config.delay)
                    {
                        $delay(config.delay,function()
                        {
                            win.moveTo(config.x,config.y,config.animSpeed, null, function(){
                                win.close();
                            });
                        },config);
                    }
                }
                else
                    win.show();
            }
            else
                win.show();
            return win;
        },
        messagebox:function(message, but, config)
        {
            var buttons = [];
            if (idev.msgwin != null) return;
            
            if (config == null) config = {};
            if (config.backgroundStyle == null) config.backgroundStyle = '';
            if (config.labelStyle == null) config.labelStyle = 'font-size:30px;font-family:Roboto, sans-serif;text-align:center;';
            if (config.borderColor == null) config.borderColor = '#777';
            if (config.buttonBorderColor == null) config.buttonBorderColor = '#545454';
            if (config.buttonCls == null) config.buttonCls = '';
               
            for(var i in but)
            {
                if(i%2)
                {
                    buttons.push(new idev.ui.widgetSpacer({
                        width:40
                    }));
                }
                
                buttons.push(new idev.ui.widgetButton({
                    width:160,
                    height:50,
                    text:but[i].text,
                    id:'messagewin-' + i,
                    cls:config.buttonCls,
                    border:true,
                    borderColor:config.buttonBorderColor,
                    events:{
                        click:function(btn)
                        {
                            var id = btn.id;
                            var n = id.replace("messagewin-","");
                            if(typeof(but[n].click)=='function')but[n].click(btn);
                            idev.msgwin.close();
                            idev.msgwin = null;
                        }
                    }
                }));
            }
            i = parseInt(i);
            buttons.unshift(new idev.ui.widgetSpacer({
                width: i>0 ? (600-160*(i+1)-40*i)/2 : 220
            }));
            idev.msgwin = new idev.ui.widgetWindow({
                width:600,
                height:220,
                x:(idev.pgWidth-600)/2,
                y:(idev.pgHeight-220)/2,
                modal:true,
                layout:'row',
                backgroundStyle:config.backgroundStyle,
                roundCorners:true,
                border:true,
                borderColor:config.borderColor,
                autoFocus:true,
                widgets:[
                    {
                        wtype:'spacer',
                        height:20
                    },
                    {
                        wtype:'label',
                        style:config.labelStyle,
                        text:message,
                        width:600,
                        height:100
                    },
                    {
                        wtype:'spacer',
                        height:30
                    },
                    {
                        wtype:'composite',
                        widgets:buttons
                    }
                ]
            });
            idev.msgwin.show();
        },
        //------------------------------------------------------------------
        widgetPanel : baseWidget.extend(
        {
            init: function(config)
            {
                config.panelCls = config.panelCls || "" ;

                this._super( config );

                this.wtype = "panel";
                this.labelWidth = this.config.labelWidth == null ? 70 : this.config.labelWidth ;
                this.columns = this.config.columns == null ? 1 : this.config.columns ;
                this.columnAlign = this. config.columnAlign == null ? "top" : this.config.columnAlign ;
                this.rowHeight = this.config.rowHeight == null ? 0 : this.config.rowHeight ;
                this.padding = this.config.padding == null ? 0 : this.config.padding ;
                this.hScroll = this.config.hScroll;
                this.title = this.config.title;
                this.frame = this.config.frame == null ? false : this.config.frame;
                this.modal = this.config.modal == null ? false : this.config.modal;
                this.draggable = this.config.draggable == null ? false : this.config.draggable;
                this.resizable = this.config.resizable == null ? false : this.config.resizable;
                this.closable = this.config.closable == null ? false : this.config.closable;
                this.minisable = this.config.minisable == null ? false : this.config.minisable;
                this.maxisable = this.config.maxisable == null ? false : this.config.maxisable;
                this.expandable = this.config.expandable == null ? false : this.config.expandable;
                this.collapsed = this.config.collapsed == null ? false : this.config.collapsed;

                this.bodyStyle = this.config.bodyStyle == null ? "" : this.config.bodyStyle;
                this.titleHeight = this.config.titleHeight || idev.defaultTitleHeight;
                this.titleStyle = this.config.titleStyle || "";
                this.titleCls = idev.convertNulls(this.config.titleCls,"");
                this.titleTextCls = idev.convertNulls(this.config.titleTextCls,"");

                this.tbar = this.config.tbar;
                this.tbarHeight = this.config.tbarHeight || 34;
                this.tbarCls = this.config.tbarCls || "";
                this.tbarStyle = this.config.tbarStyle || "";
                this.tbarConfig = this.config.tbarConfig || {};
                this.tbCreated = false;
                
                this.bbar = this.config.bbar;
                this.bbarHeight = this.config.bbarHeight || 34;
                this.bbarCls = this.config.bbarCls || "";
                this.bbarStyle = this.config.bbarStyle || "";
                this.bbarConfig = this.config.bbarConfig || {};
                this.bbCreated = false;

                this.shadow =  this.config.shadow;
                this.shadowSize =  this.config.shadowSize || 3;
                this.shadowColor =  this.config.shadowColor || "";
                this.autoFocus =  this.config.autoFocus;
                this.focusID =  this.config.focusID || "";

                this.bodyCls = this.config.bodyCls || "";
                this.panelCls = this.config.panelCls || "";
                this.icon = this.config.icon || "";
                this.area = this.config.area || "";
                this.collapsed = this.config.collapsed || false;
                this.layoutManager = new idevLayoutManager(this);
                this.backgroundStyle = this.config.backgroundStyle || "";
                this.backgroundCls = this.config.backgroundCls || "";
                this.contentStyle = this.config.contentStyle || "";

                if (this.layout == "accordion" ||this.layout == "frame" ) this.autoScroll = false;
                if (this.expandable && !this.title && this.area != "center")
                {
                    this.title = "   ";
                }
                else if (!this.title) this.expandable = false;
                if (this.title == null) this.titleHeight = 0;
                if (this.tbar == null) this.tbarHeight = 0;
                if (this.bbar == null) this.bbarHeight = 0;
                if (this.area == "center") this.expandable = false;
                if (this.tbar != null)
                {
                    if (this.tbar instanceof baseWidget)
                    {
                        this.tbCreated = false;
                    }
                    else
                    {
                        if (this.tbarConfig.cls == null) this.tbarConfig.cls = this.tbarCls;
                        if (this.tbarConfig.height == null) this.tbarConfig.height = this.tbarHeight;
                        this.tbarConfig.width = this.width;
                        var tb = new idev.ui.widgetToolbar(this.tbarConfig);
                        tb.widgets = this.tbar;
                        this.tbar = tb;
                        this.tbCreated = true;
                    }
                }
                if (this.bbar != null)
                {
                    if (this.bbar instanceof baseWidget)
                    {
                         this.bbCreated = false;
                    }
                    else
                    {
                        if (this.bbarConfig.cls == null) this.bbarConfig.cls = this.bbarCls;
                        if (this.bbarConfig.height == null) this.bbarConfig.height = this.bbarHeight;
                        this.bbarConfig.width = this.width;
                        var sb = new idev.ui.widgetStatusbar(this.bbarConfig);
                        sb.widgets = this.bbar;
                        this.bbar = sb;
                        this.bbCreated = true;
                    }
                }
                var sTitleHTML = "",sTBarHTML = "",sBBarHTML = "",sFiller = "";

                if (this.title)
                {
                    this.title = this.title;
                    if (this.parent)
                    {
                        if (this.parent.layout == 'frame')                    
                            sTitleHTML = "<div id='{id}-title' class='ui-panel-titlebar ui-panel-layout {titlecls}' style='max-width:{titlewidth}px;width:{titlewidth}px;height:{titleheight}px;max-height:{titleheight}px;{titlestyle}'>";
                        else
                            sTitleHTML = "<div id='{id}-title' class='ui-panel-titlebar {titlecls}' style='max-width:{titlewidth}px;width:{titlewidth}px;height:{titleheight}px;max-height:{titleheight}px;{titlestyle}'>";
                    }                    
                    else
                        sTitleHTML = "<div id='{id}-title' class='ui-panel-titlebar {titlecls}' style='max-width:{titlewidth}px;width:{titlewidth}px;height:{titleheight}px;max-height:{titleheight}px;{titlestyle}'>";
                    sTitleHTML += "<table width='100%' class='ui-panel-title  {titletextcls}'><tr height={titletextheight}><td width='{iconwidth}px' align='right' valign=top id='{id}-icon'>{icon}</td><td id='{id}-titletext' valign=center>{title}</td><td width='{buttonwidth}px' align='right' valign=top id='{id}-buttons'>{buttons}</td></tr></table>",
                    sTitleHTML += "</div>";                    
                    if (this.roundCorners)
                    {
                        this.titleStyle += ";border-top-left-radius:" + (this.radius-1) + "px;";
                        this.titleStyle += "border-top-right-radius:" + (this.radius-1) + "px;";
                        this.titleStyle += "-webkit-border-top-left-radius:" + (this.radius-1) + "px;";
                        this.titleStyle += "-webkit-border-top-right-radius:" + (this.radius-1) + "px;";
                        this.titleStyle += "-moz-border-top-left-radius:" + (this.radius-1) + "px;";
                        this.titleStyle += "-moz-border-top-right-radius:" + (this.radius-1) + "px;"; 
                    }
                }
                if (this.tbar)
                {
                    sTBarHTML = "<div id='{id}-tbar' class='ui-panel-tbar {tbarcls}' style='max-width:{tbarwidth}px;width:{tbarwidth}px;height:{tbarheight}px;{tbarstyle};'>";
                    sTBarHTML += "</div>";
                    if (this.roundCorners && this.title == null)
                    {
                        this.tbarStyle += ";border-top-left-radius:" + (this.radius-1) + "px;";
                        this.tbarStyle += "border-top-right-radius:" + (this.radius-1) + "px;";
                        this.tbarStyle += "-webkit-border-top-left-radius:" + (this.radius-1) + "px;";
                        this.tbarStyle += "-webkit-border-top-right-radius:" + (this.radius-1) + "px;";
                        this.tbarStyle += "-moz-border-top-left-radius:" + (this.radius-1) + "px;";
                        this.tbarStyle += "-moz-border-top-right-radius:" + (this.radius-1) + "px;";
                    }
                }
                if (this.bbar)
                {
                    sBBarHTML = "<div id='{id}-bbar' class='ui-panel-bbar {bbarcls}' style='max-width:{bbarwidth}px;width:{bbarwidth}px;height:{bbarheight}px;{bbarstyle};'>";
                    sBBarHTML += "</div>";
                    if (this.roundCorners)
                    {
                        this.bbarStyle += ";border-bottom-left-radius:" + (this.radius-1) + "px;";
                        this.bbarStyle += "border-bottom-right-radius:" + (this.radius-1) + "px;";
                        this.bbarStyle += "-webkit-border-bottom-left-radius:" + (this.radius-1) + "px;";
                        this.bbarStyle += "-webkit-border-bottom-right-radius:" + (this.radius-1) + "px;";
                        this.bbarStyle += "-moz-border-bottom-left-radius:" + (this.radius-1) + "px;";
                        this.bbarStyle += "-moz-border-bottom-right-radius:" +(this.radius-1) + "px;";
                    }
                }
                if (this.roundCorners)
                {
                    this.backgroundStyle += ";border-radius:" + (this.radius-1) + "px;";
                    this.backgroundStyle += "-webkit-border-radius:" + (this.radius-1) + "px;";
                    this.backgroundStyle += "-moz-border-radius:" + (this.radius-1) + "px;";

                    this.style += ";border-radius:" + (this.radius) + "px;";
                    this.style += "-webkit-border-radius:" + (this.radius) + "px;";
                    this.style += "-moz-border-radius:" + (this.radius) + "px;";                    
                }
                if (this.expandable && (this.area == "west" || this.area == "east")) sFiller = "<div id='{id}-filler' class='ui-panel-filler' style='visibility:hidden;position:absolute;left:{fillerleft}px;top:{titleheight}px;width:24px;height:{fillerheight}px;'></div>";

                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element ui-panel {panelcls}' style='overflow:hidden;background:transparent;{elementstyle}{style}'>",
                        "<div id='{id}-background' class='ui-panel-background {backgroundcls}' style='position:absolute;left:0px;top:0px;width:100%;height:100%;{backgroundstyle}'>",
                        "</div>",
                        "<div id='{id}-container' style='position:relative;left:0px;top:px;background:transparent;'>",
                        sTitleHTML,
                        sTBarHTML,
                        "<div id='{id}-body' class='{bodycls}' style='width:100%;{bodystyle};height:{bodyheight}px;'>",
                        "<div id='{id}-content' class='ui-panel-content {cls}' style='position:relative;{contentstyle}'>",
                        "{html}",
                        "</div>",
                        "</div>",
                        sBBarHTML,
                        sFiller,
                        "</div>",
                        "</div>"
                    );
           },
            render : function()
            {
                var style = this.style;
                var bodystyle = this.bodyStyle;
                var panelCls = this.panelCls;
                var contentstyle = "background:transparent;" 
                var buttons = "";
                var buttonWidth = 10;
                var iconWidth = 1;
                var sIcon = this.icon == "" ? "" : "<img src='" + this.icon + "' style='width:16px;height:16px;'/>";
                var zindex = 100;
                var fillerLeft = this.area == "west" ? this.width-19 : 0 ;
                var bModern = true;

                if (this.renderTo == null || typeof this.renderTo == "undefined") 
                {
                    idev.errorHandler("No Render To property set on panel. ID:"+this.id);
                    return;
                }
                if (this.draggable && idev.isIE8() && this.shadow) bModern = false;
                if (this.border) 
                {
                    if (this.borderStyle.indexOf("border") == -1)
                        style += "border:" + this.borderStyle + ";";
                    else
                        style += this.borderStyle + ";";
                }
                if (this.modal)
                {
                    zindex = 9999 + idev.modals * 10;
                    style += "z-index:" + (zindex + 1) + ";";

                }
                if (this.padding > 0) contentstyle += "padding:" + this.padding + "px;";
                if (this.autoScroll  && idev.isTouch() == false)
                {
                     bodystyle += "overflow:auto;";
                }
                if (this.wtype == "window") this.expandable = false;
                if (this.closable && this.title) { buttons += "<div id='" + this.id + "-close' class='ui-panel-btn-close'>&nbsp;</div>"; buttonWidth += 18; }
                if (this.maxisable && this.title) { buttons += "<div id='" + this.id + "-min' class='ui-panel-btn-max'>&nbsp;</div>"; buttonWidth += 18; }
                if (this.minisable && this.title) { buttons += "<div id='" + this.id + "-min' class='ui-panel-btn-min'>&nbsp;</div>"; buttonWidth += 18; }
                if (this.expandable)
                {
                    if (this.area == "west")
                    {
                        buttons += "<div id='" + this.id + "-expand' class='ui-panel-btn-collapse-w'>&nbsp;</div>";
                        buttonWidth += 16;
                    }
                    else if (this.area == "east")
                    {
                        sIcon += "<div id='" + this.id + "-expand' class='ui-panel-btn-expand-e'></div>";
                        iconWidth = 16;
                    }
                    else if (this.area == "south")
                    {
                        buttons += "<div id='" + this.id + "-expand' class='ui-panel-btn-expand'>&nbsp;</div>";
                        buttonWidth += 16;
                    }
                    else
                    {
                        var ok = false;
                        if (this.parent)
                            if (this.parent.layout == "accordion") ok = true;
                        if (ok)
                        {
                            buttons += "<div id='" + this.id + "-expand' class='ui-panel-btn-minus'>&nbsp;</div>";
                            buttonWidth += 16;
                        }
                        else
                        {
                            if (this.collapsed)
                                buttons += "<div id='" + this.id + "-expand' class='ui-panel-btn-expand'>&nbsp;</div>";
                            else
                                buttons += "<div id='" + this.id + "-expand' class='ui-panel-btn-collapse'>&nbsp;</div>";
                            buttonWidth += 16;
                        }
                    }
                }
                this.bodyheight = this.height;

                if (this.title) this.bodyheight = this.bodyheight - parseInt(this.titleHeight);
                if (this.tbar) this.bodyheight = this.bodyheight - (parseInt(this.tbarHeight));
                if (this.bbar) this.bodyheight = this.bodyheight - (parseInt(this.bbarHeight));
                if (!this.autoScroll)
                {
                    contentstyle += "overflow:hidden;width:" + this.width + "px;height:" + this.bodyheight + "px;";
                }
                if (this.shadow)
                {
                    if (this.shadowColor == "")
                        panelCls += " ui-panel-shadow";
                    else
                        style += "box-shadow: "+this.shadowSize +"px "+this.shadowSize +"px "+(this.shadowSize *2)+"px "+this.shadowColor+";";
                }
                // Removed 31/12/2012 to fix rendering issue in FF
                //   if (idev.isFF() && this.wtype == "window") contentstyle += "display: inline;";
                var sFullContent = "";
                
                if ((this.title == "" || this.title == null) && this.tbar == null) 
                {
                    sFullContent = " ui-panel-fit";
                }
                
                var data = new Array();
                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls + sFullContent);
                data['width'] = this.width;
                data['height'] = this.height;
                data['title'] = this.title == null ? "" : this.title;
                data['bodyheight'] = this.bodyheight;
                data['elementstyle'] = this.elementStyle;
                data['style'] = style;
                data['icon'] = sIcon;
                data['iconwidth'] = iconWidth;
                data['fillerleft'] = fillerLeft;
                data['fillerheight'] = this.height - this.titleHeight;
                data['buttons'] = buttons;
                data['buttonwidth'] = buttonWidth;
                data['bodystyle'] = bodystyle;
                data['backgroundstyle'] = this.backgroundStyle;
                data['backgroundcls'] = this.cssQuirks(this.backgroundCls,bModern);
                data['contentstyle'] = contentstyle + this.contentStyle;
                data['tbarwidth'] = this.width;
                data['titlewidth'] =  this.width;
                data['titleheight'] = this.titleHeight;
                data['titletextheight'] = this.titleHeight-4;
                data['titlestyle'] =  this.titleStyle;
                data['tbarcls'] = this.cssQuirks(this.tbarCls,bModern);
                data['tbarheight'] = this.tbarHeight;
                data['tbarstyle'] = this.tbarStyle;
                data['bbarwidth'] = this.width;
                data['bbarcls'] = this.cssQuirks(this.bbarCls,bModern);
                data['bbarheight'] = this.bbarHeight;
                data['bbarstyle'] = this.bbarStyle;
                data['panelcls'] = this.frame ? this.cssQuirks(panelCls,bModern) + " ui-panel-frame" : this.cssQuirks(panelCls,bModern);
                data['bodycls'] = this.cssQuirks(this.bodyCls,bModern);
                data['titlecls'] = this.cssQuirks(this.titleCls,bModern);
                data['titletextcls'] = this.titleTextCls;
                data['html'] = this.html;

                idev.internal.beforeRender(this);
                var  sHTML = this.tpl.render(data);

                if (this.modal)
                {
                    var w = $(document).width();
                    var h = $(document).height();

                    this.maskID = idev.internal.nextUIID();
                    this.maskCls = this.config.maskCls || 'ui-mask';

                    $('body').append("<div id='" + this.maskID + "' class='" + this.maskCls + "' style='left:0px;top:0px;width:" + (w-1) + "px;height:" + (h-1) + "px;z-index:" + zindex + ";display:none;'>&nbsp;</div>");
                    $("#" + this.renderTo).append(sHTML);
                    idev.modals++;
                }
                else
                    $("#" + this.renderTo).append(sHTML);
                if (this.autoScroll && idev.isTouch())
                {
                    idev.utils.delay(500,function(widget){
                        if (widget.hScroll)
                        {
                            widget.iScroll = new iScroll(widget.id + "-content", { hScroll:true, bounce:true, momentum: true } )
                        }
                        else
                            widget.iScroll = new iScroll(widget.id + "-content")
                    },this);
                }
                if (this.widgets)
                {
                    if (this.layout == "accordion")
                    {
                        for (var i = 0;i < this.widgets.length;i++) this.widgets[i].border = false;
                    }
                    idev.internal.renderWidgets( this.page, this.id + "-content", this.widgets, this.layout, this.labelWidth, this );
                }
                if (this.tbar)
                {
                    this.tbar.page = this.page;
                    this.tbar.parent = this;
                    this.tbar.rowHeight = this.tbarHeight - 2;
                    this.tbar.renderTo = this.id + "-tbar";
                    this.tbar.render();
                }
                if (this.bbar)
                {
                    this.bbar.page = this.page;
                    this.bbar.parent = this;
                    this.bbar.rowHeight = this.bbarHeight - 2;
                    this.bbar.renderTo = this.id + "-bbar";
                    this.bbar.render();
                }
                if (this.draggable)
                {
                    this.setDraggable(true);
                }
                if (this.minisable && this.title)
                {
                    $("#" + this.id + "-min" ).click( function()
                    {
                        var wgt = idev.get(this.id.replace("-min",""));
                        if (wgt.events.minimise) wgt.events.minimise(this);
                    });
                }
                if (this.maxisable && this.title)
                {
                    $("#" + this.id + "-max" ).click( function()
                    {
                        var wgt = idev.get(this.id.replace("-close",""));
                        if (wgt.events.maximise) wgt.events.maximise(this);
                    });
                }
                if (this.expandable)
                {
                    if (this.expandable && this.collapsed ) 
                    {
                        $('#' + this.id).css({height: this.titleHeight + 'px'});
                        this.expanded = false;
                    }
                    $("#" + this.id + "-expand" ).click( function()
                    {
                        var wgt = idev.get(this.id.replace("-expand",""));
                        if (wgt.expanded)
                        {
                            wgt.oncollapse();
                        }
                        else
                        {
                            wgt.onexpand();
                        }
                    });
                }
                if (this.closable && this.title)
                {
                    $("#" + this.id + "-close" ).click( function()
                    {
                        var wgt = idev.get(this.id.replace("-close",""));
                        if (wgt.events.close)
                        {
                            if (wgt.events.close(this) === false) return;
                            wgt.close();
                        }
                        else
                            wgt.close();
                    });
                }
                idev.internal.afterRender(this);
                this.rendered = true;
                if (this.config.collaped) $delay(100,function(wgt)
                    {
                       wgt.oncollapse()
                    },this);
                if (this.events.contextMenu || this.events.contextmenu) this.addEvent("contextmenu",idev.internal.onContextMenu);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
                if ((this.autoFocus || this.focusID !== "") && this.widgets)
                {
                    for(var i = 0;i < this.widgets.length;i++)
                    {
                        if (this.widgets[i].wtype == "input" || this.widgets[i].wtype == "textarea" || this.widgets[i].wtype == "button")
                        {
                            if (this.focusID == this.widgets[i].id)
                            {
                                $get(this.widgets[i].id).focus();
                                break;
                            }
                            else  if (this.autoFocus)
                            {
                                $get(this.widgets[i].id).focus();
                                break;
                            }
                        }
                        else  if (this.widgets[i].wtype == "composite")
                        {
                            for(var n = 0;n < this.widgets[i].widgets.length;n++)                                
                            {
                                var w = this.widgets[i].widgets[n];
                                if (w.wtype == "input" || w.wtype == "textarea" || w.wtype == "button")
                                {
                                    if (this.focusID == w.id)
                                    {
                                        $get(w.id).focus();
                                        break;
                                    }
                                    else  if (this.autoFocus)
                                    {
                                        $get(w.id).focus();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            onexpand : function()
            {
                this.layoutManager.expand()
            },
            oncollapse : function()
            {
                this.layoutManager.collapse()
            },
            innerHTML : function(sHTML)
            {
                $("#" + this.id + "-content").empty();
                $("#" + this.id + "-content").append(sHTML);
            },
            close : function()
            {
                if(this.events.beforeClose) 
                {
                    var ret = this.events.beforeClose(this);
                    if(ret === false)
                    {
                        return false;
                    } 
                }
                if (!this.autoDestroy)
                    this.hide();
                else
                {
                    this.hide();
                    this.destroy();
                }
                if (this.modal)
                {
                    $('#' + this.maskID).remove();
                    idev.modals--;
                }
                if(this.events.afterClose) 
                {
                    this.events.afterClose(this);
                }
                return true;
            },
            onhide:function()
            {
                this._super();
                if (this.maskID) $("#"+this.maskID).hide();
            },
            onshow:function()
            {
                this._super();
                if (this.maskID) $("#"+this.maskID).show();
                if (idev.isIE8())
                {
                    for (var i = 0;i < this.widgets.length;i++ )
                    {
                        var wgt = idev.get(this.widgets[i].id);
                        try{ if (wgt) wgt.onshow(); } catch(e) { }
                    }
                }
            },
            doLayout : function()
            {
                this.layoutManager.doLayout();
                this._super();
            },
            ondestroy: function()
            {
                if (this.tbCreated) this.tbar.destroy();
                if (this.bbCreated) this.bbar.destroy();
            },
            removeWidget: function(id,remove)
            {
                var tableID = this.id + "-content-body";
                var cell = 0;

                if (this.widgets.length == 0) return;
                if(typeof id == "string")
                {
                    for (var i = 0;i < this.widgets.length;i++)
                    {
                        if (this.widgets[i].id == id)
                        {
                            cell = i;
                            break;
                        }
                    }
                }
                else
                {
                    cell = id;
                    id = this.widgets[id].id;
                    tableID = this.id + "-content-body";
                }
                var wgt = $get(id);
                if (wgt == null) return;
                wgt.destroy(remove);
                if (this.layout == "row")
                {
                    $("#"+tableID + "-row" + cell).remove();
                    for (var i = cell+1;i <= this.widgets.length;i++)
                    {
                        var id1 = tableID + "-row" + i;
                        var id2 = tableID + "-row" + (i-1);
                        $("#"+id1).attr("id",id2);
                        id1 = tableID + "-cell" + i
                        id2 = tableID + "-cell" + (i-1);
                        $("#"+id1).attr("id",id2);
                    }
                }
                if (this.layout == "column")
                {
                    $("#"+tableID + "-cell" + cell).remove();
                    for (var i = cell+1;i <= this.widgets.length;i++)
                    {
                        var id1 = tableID + "-cell" + i;
                        var id2 = tableID + "-cell" + (i-1);
                        $("#"+id1).attr("id",id2);
                    }
                }
                if (this.layout == "form")
                {
                    $("#"+tableID + "-cell" + cell).parent().remove();
                    for (var i = cell+1;i <= this.widgets.length;i++)
                    {
                        var id1 = tableID + "-cell" + i;
                        var id2 = tableID + "-cell" + (i-1);
                        $("#"+id1).attr("id",id2);
                    }
                }
            },
            addWidget: function(wgt)
            {
                var renderTo = this.id;

                if (this.layout == "frame") return false;
                if (this.layout == "accordion") return false;
                if (wgt.wtype == null) return false;

                if(!this.widgets) this.widgets = [];
                if (this.layout == "column")
                {
                    var rowID = this.id + "-content-row";
                    var tableID = this.id + "-content-body";
                    var cellStyle = "";
                    var sHTML = "";
                    var cell = this.widgets.length;

                    if (wgt.cellStyle) cellStyle = wgt.cellStyle;
                    renderTo = tableID + "-cell" + cell;
                    if (this.columnAlign == "center")
                        sHTML += "<td valign='center' id='" + renderTo + "' style='" + cellStyle + "'></td>";
                    else if (parent.columnAlign == "bottom")
                        sHTML += "<td valign='bottom' id='" + renderTo + "' style='" + cellStyle + "'></td>";
                    else
                        sHTML += "<td valign='top' id='" + renderTo + "' style='" + cellStyle + "'></td>";

                    $("#"+rowID).append(sHTML);
                }
                else if (this.layout == "row")
                {
                    var sHTML = "";
                    var cellStyle = "";
                    var tableID = this.id + "-content-body";
                    var cell = this.widgets.length;

                    if (wgt.cellStyle) cellStyle = wgt.cellStyle;
                    renderTo = tableID + "-cell" + cell;
                    if (this.rowHeight != "")
                        sHTML = "<tr id='"+ tableID + "-row" + cell+"' style='height:" + this.rowHeight + "px'>";
                    else
                        sHTML = "<tr id='"+ tableID + "-row" + cell+"'>";
                    if (this.center)
                        sHTML += "<td style='" + cellStyle + "'><center><div id='" + renderTo + "'></div></center></td>";
                    else
                        sHTML += "<td id='" + renderTo + "' style='" + cellStyle + "'></td>";
                    sHTML += "</tr>";
                    $('#' + tableID).append(sHTML);
                }
                else if (this.layout == "form")
                {
                    var sHTML = "";
                    var cellStyle = "";
                    var tableID = this.id + "-content-body";
                    var cell = this.widgets.length;

                    if (wgt.cellStyle) cellStyle = wgt.cellStyle;
                    renderTo = tableID + "-cell" + cell;
                    sHTML = "<tr><td valign='top' width:'"+this.labelWidth+"px' style='width:" + this.labelWidth + "px;" + cellStyle + "'><span  id='" + renderTo + "-label' class='ui-labeltext' style='" + wgt.labelStyle + "'>" + wgt.label + "</span></td><td id='" + renderTo + "'></td></tr>";
                    if (wgt.label == null)
                        sHTML = "<tr><td id='" + renderTo + "' colspan=2></td><td></td></tr>";
                    $('#' + tableID).append(sHTML);
                }
                else if (this.layout == "table")
                {
                    var sHTML = "";
                    var tableID = this.id + "-content-body";
                    var cell = this.widgets.length;
                    var remainder =  this.widgets.length % this.columns;

                    if (remainder != 0)
                    {
                        renderTo = tableID + "-cell" + cell;
                    }
                    else
                    {
                        sHTML = "<tr>";
                        if (parent.rowHeight > 0) sHTML = "<tr height=" + parent.rowHeight + " >"
                        for (var c = 0;c < this.columns;c++)
                        {
                            if (wgt.cellStyle) cellStyle = wgt.cellStyle;
                            renderTo = tableID + "-cell" + (cell + c);
                            sHTML += "<td valign='top' id='" + renderTo + "' style='" + cellStyle + "'></td>";
                        }
                        sHTML += "</tr>";
                        $('#' + tableID).append(sHTML);
                        renderTo = tableID + "-cell" + cell;
                    }
                }
                else if (this.layout == "fit")
                {
                    if(this.widgets.length > 0)
                    {
                        wgt.hidden = true;
                    }
                    wgt.width = this.width - this.padding*2;
                    wgt.height = this.bodyheight;
                    if (idev.isIE()) wgt.height = this.bodyheight - this.padding*2;
                    renderTo = this.id + "-content";
                }
                else
                    renderTo = this.id + "-content";
                wgt.parent = this;
                wgt.page = this.page;
                this.widgets.push(wgt);
                if (!idev.isClass(wgt))
                {
                    wgt.renderTo = renderTo;
                    idev.internal.renderWidget( this.page, wgt );
                }
                else
                {
                    wgt.renderTo = renderTo;
                    wgt.render();
                }
                return true;
            },
            setTitle:function(sTitle)
            {
                if (this.title)
                {
                    $("#"+this.id+"-titletext").html(sTitle);
                }
            },
            getTitle:function()
            {
                if (this.title)
                {
                    return $("#"+this.id+"-titletext").html();
                }
                return "";
            }
        }),
        //------------------------------------------------------------------
        widgetTextField : baseWidget.extend(
        {
            init: function(config)
            {
                if (config.height < 22) config.height = 22;
                this._super( config );
                this.wtype = "input";
                this.inputType = config.inputType || "text";
                this.inputStyle = config.inputStyle || "";
                this.inputCls = config.inputCls || "";
                this.editable = config.editable == null ? true : config.editable;
                this.uppercase = config.uppercase == null ? false : config.uppercase;
                this.lowercase = config.lowercase == null ? false : config.lowercase;
                this.capitalize = config.capitalize == null ? false : config.capitalize;
                this.watermark = config.watermark || "";
                this.watermarkColor = config.watermarkColor || "#aaa";
				this.inputDisabledCls = config.inputDisabledCls || "";
                this.maxlength = config.maxlength || "";
				this.zeroreturn = config.zeroreturn == null ? true : config.zeroreturn;
                this.invalidchars = config.invalidchars || "";
				this.customregex = config.customregex || "";
                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element ui-textfield ui-frame {cls}' style='{elementstyle};{style};'>",
                        "<input id='{id}-input' type='{inputtype}' class='ui-input {inputcls}' style='width:{width}px;height:{height}px;max-width:{width}px;max-height:{height}px;{inputstyle}'  value='{value}'/>",
                        "</div>"
                    );
                if (this.inputCls != "") this.inputCls += "  ie9gradient";
            },
            enable:function(flag)
            {
                this._super(flag);
                if(flag) {
                    $('#' + this.id + "-input").removeClass(this.inputDisabledCls);
                    this.editable = true;
                } else {
                    $('#' + this.id + "-input").addClass(this.inputDisabledCls);
                    this.editable = false;
                }
            },
            setValue : function(value)
            {
                var v = $('#'+this.id+"-input").val();

                if (this.watermark == v)
                {
                    $('#'+this.id+"-input").val("");
                    $('#'+this.id+"-input").css("color","");
                }
                if (value == "" && this.watermark != "")
                {
                    $('#'+this.id+"-input").val(this.watermark);
                    $('#'+this.id+"-input").css("color",this.watermarkColor);
                }
                else
                    $('#'+this.id+"-input").val(value);
            },
            getValue : function()
            {
                var v = $('#'+this.id+"-input").val();

                if (this.watermark == v && this.watermark != "") v = "";
                if (this.inputType == "integer") 
                {
					if(v=="-") v="";
					if (v == "") 
                    {
                        if (this.zeroreturn) return 0;
                        return '';
                    }
                    return parseInt(v);
                }
				if (this.inputType == "number") 
                {
					if(v=="-") v="";
					if (v == "") 
                    {
                        if (this.zeroreturn) return 0;
                        return '';
                    }
                    return parseFloat(v);
                }
				if (this.inputType == "currency") 
                {
					if(v=="-") v="";
					if (v == "") 
                    {
                        if (this.zeroreturn) return 0;
                        return '';
                    }
                    return parseFloat(v).toFixed(2);
                }
                return v;
            },
            setEditable:function(canedit)
            {
                this.editable = canedit;
            },
            getEditable:function()
            {
                return this.editable;
            },
            render : function()
            {
                if (this.renderTo == null) return;
                var text = this.value;
                var inputstyle = this.inputStyle;
                var style = this.style;

                if (this.watermark != "" && text == "")
                {
                    text = this.watermark;
                    inputstyle += "color:" + this.watermarkColor + ";";
                }
                if (this.borderStyle != "") style += ";border:" + this.borderStyle;
                if (this.uppercase) inputstyle += ";text-transform:uppercase;"; 
                if (this.lowercase) inputstyle += ";text-transform:lowercase;"; 
                if (this.capitalize) inputstyle += ";text-transform:capitalize;"; 
                var data = new Array();
                 
                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls);
                data['elementstyle'] = this.elementStyle;
                data['style'] = style;
                data['value'] = text;
                data['width'] = this.width - 4;
                data['height'] = this.height - 4;
                data['inputcls'] = this.inputCls;
                data['inputstyle'] = inputstyle;
                if (this.autoScroll)
                {
                    data['inputstyle'] = this.style+";overflow:auto;";
                }
                data['inputtype'] = this.inputType == "password" ? "password" : "text"; //uses text for number for pre HTML5 compatibility

                var  sHTML = this.tpl.render(data);

                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                }
                if (this.hidden) this.onhide();
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
                $( '#' +  this.id + "-input").blur(idev.internal.onLostFocus);
                $( '#' +  this.id + "-input").focus(idev.internal.onFocus);
                if (this.events.change)
                {
                    $( '#' +  this.id ).change(idev.internal.onChange);
                }
				$('#' +  this.id).keyup({ widget: this },function(event){
					var wgt = event.data.widget;
					var v = $('#'+wgt.id+"-input").val();
					if(event.keyCode == 8) {
						wgt.value = v;
						return;
					}
					if(wgt.maxlength !='') 
					{
						if (v.length > wgt.maxlength) {
							$('#'+wgt.id+"-input").val(wgt.value);
							return;
						}
					}
					if (wgt.inputType == "number")
                    {
						if (!(v.match(/^-{0,1}\d+\.{0,1}\d*$|^-{0,1}\d*$/))) $('#'+wgt.id+"-input").val(wgt.value);
						else wgt.value = v;
                    }
					if (wgt.inputType == "integer")
                    {
						if (!(v.match(/^-{0,1}\d*$/))) $('#'+wgt.id+"-input").val(wgt.value);
						else wgt.value = v;
                    }
					if (wgt.inputType == "text")
                    {
						wgt.value = v;
                    }
					if (wgt.inputType == "currency")
                    {
						if (!(v.match(/^-{0,1}\d+\.{0,1}\d{0,2}$|^-{0,1}\d*$/))) $('#'+wgt.id+"-input").val(wgt.value);
						else wgt.value = v;
                    }
					if (wgt.inputType == "custom" && wgt.customregex != "")
                    {
						if (!(v.match(wgt.customregex))) $('#'+wgt.id+"-input").val(wgt.value);
						else wgt.value = v;
                    }
				})
                $( '#' +  this.id ).keypress({ widget: this },function(event)
                {
                    var wgt = event.data.widget;
                    if (wgt.invalidchars != "")
                    {
                        var key = event.keyCode;
                        if (wgt.invalidchars.indexOf(String.fromCharCode(event.keyCode)) != -1)
                        {
                            event.preventDefault();
                            return false;
                        }
                    }
                });
                $( '#' +  this.id ).keyup({ widget: this },function(event)
                {
                    var wgt = event.data.widget;
                    if (wgt.wtype == "input")
                    {
                        if (event.keyCode == 13 && wgt.events.onenter)
                        {
                            wgt.events.onenter(wgt);
                            event.preventDefault();
                            return false;
                        }
                    }
                    if(wgt.events.keyup) wgt.events.keyup(wgt,event);
                });
                if (this.events.keypress) $( '#' +  this.id ).keypress(idev.internal.onKeypress);
                this.rendered = true;
            },
            doLayout: function()
            {
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id + "-input").width(w-4)
                $("#" + this.id + "-input").height(h-4)

                this._super();
            }
        }),
        //------------------------------------------------------------------
        widgetTextArea : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );

                this.wtype = "textarea";
                this.editable = config.editable == null ? true : config.editable;
                this.watermark = config.watermark || "";
                this.inputCls = config.inputCls || "";
                this.inputStyle = config.inputStyle || "";
                this.watermarkColor = config.watermarkColor || "#aaa";
				this.maxlength = config.maxlength || "";
				this.zeroreturn = config.zeroreturn == null ? true : config.zeroreturn;
                this.invalidchars = config.invalidchars || "";
                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element ui-textfield ui-frame {cls}' style='{elementstyle};{style}'>",
                        "<textarea id='{id}-input' class='ui-textarea {inputcls}'  style='width:{width}px;height:{height}px;{inputstyle};'>{value}</textarea>",
                        "</div>"
                    );
                if (this.inputCls != "") this.inputCls += "  ie9gradient";
            },
            setValue : function(value)
            {
                var v = $('#'+this.id+"-input").val();

                if (this.watermark == v)
                {
                    $('#'+this.id+"-input").val("");
                    $('#'+this.id+"-input").css("color","");
                }

                if (value == "" && this.watermark)
                {
                    $('#'+this.id+"-input").val(this.watermark);
                    $('#'+this.id+"-input").css("color",this.watermarkColor);
                }
                else
                    $('#'+this.id+"-input").val(value);
            },
            getValue : function()
            {
                var v = $('#'+this.id+"-input").val();

                if (this.watermark == v) v = "";
				if (v == "") 
				{
					if (this.zeroreturn) return 0;
					return '';
				}
				return parseInt(v);
            },
            setEditable:function(canedit)
            {
                this.editable = canedit;
            },
            getEditable:function()
            {
                return this.editable;
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var text = this.value;
                var inputstyle = this.inputStyle;
                var style = this.style;

                if (this.watermark != "" && text == "")
                {
                    text = this.watermark;
                    inputstyle += "color:" + this.watermarkColor + ";";
                }
                if (this.autoScroll)
                {
                    inputstyle += ";overflow:auto;";
                }
                if (this.borderStyle != "") style += ";border:" + this.borderStyle;
                var data = new Array();

                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls);
                data['elementstyle'] = this.elementStyle;
                data['style'] = style;
                data['inputstyle'] = inputstyle;
                data['inputcls'] = this.inputCls;
                data['width'] = this.width-2;
                data['height'] = this.height-2;
                data['value'] = text;

                var  sHTML = this.tpl.render(data);

                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                    $("#" + this.id).css("-o-border-radius",this.radius + "px");
                }
                idev.internal.afterRender(this);
                $( '#' +  this.id + "-input" ).blur(idev.internal.onLostFocus);
                $( '#' +  this.id + "-input" ).focus(idev.internal.onFocus);
				if (this.events.click)
				{

					$( '#' +  this.id ).click(idev.internal.onClick);
				}

                if (this.events.change)
                {
                    $( '#' +  this.id ).change(idev.internal.onChange);
                }
                $( '#' +  this.id ).keydown({ widget: this },function(event)
                {
                    var wgt = event.data.widget;
                    if (!wgt.editable)
                    {
                        event.preventDefault();
                        return false;
                    }
                    if (wgt.watermark != "")
                    {
                        var v = $('#'+wgt.id+"-input").val();

                        if (v == wgt.watermark )
                        {
                            $('#'+wgt.id+"-input").val("");
                            $('#'+wgt.id+"-input").css("color","");
                        }
                    }
                    if (wgt.maxlength > 0)
                    {
                        var v = $('#'+wgt.id+"-input").val();

                        if (v.length >= wgt.maxlength)
                        {
                            if ( event.keyCode == 46 || event.keyCode == 13 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 190)
                            {
                                // Do nothing
                            }
                            else
                            {
                                event.preventDefault();
                                return false;
                            }
                        }
                    }
                    if (event.keyCode == 9 && wgt.events.ontab)
                    {
                        wgt.events.ontab(wgt);
                        event.preventDefault();
                        return false;
                    }
                });
                $( '#' +  this.id ).keypress({ widget: this },function(event)
                {
                    var wgt = event.data.widget;
                    if (wgt.invalidchars != "")
                    {
                        var key = event.keyCode;
                        if (wgt.invalidchars.indexOf(String.fromCharCode(event.keyCode)) != -1)
                        {
                            event.preventDefault();
                            return false;
                        }
                    }
                });
                $( '#' +  this.id ).keyup({ widget: this },function(event)
                {
                    var wgt = event.data.widget;
                    if (wgt.wtype == "textarea")
                    {
                        if (event.keyCode == 13 && wgt.events.onenter)
                        {
                            wgt.events.onenter(wgt);
                            event.preventDefault();
                            return false;
                        }
                    }
                });
                if (this.events.keypress)  $( '#' +  this.id ).keypress(idev.internal.onKeypress);
                this.rendered = true;
            },
            doLayout: function()
            {
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id + "-input").width(w-10)
                $("#" + this.id + "-input").height(h-10)

                this._super();

            }
        }) ,
        //------------------------------------------------------------------
        widgetComboBox : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "combo";
                this.inputType = config.inputType;
                this.editable = config.editable == null ? true : config.editable;
                this.height = config.height == null ? 22 : config.height;
                this.width = config.width == null ? 150 : config.width;
                if (this.inputType == null) this.inputType = "text";
                if (this.inputStyle == null) this.inputStyle = "";
                this.watermark = config.watermark || "";
                this.watermarkColor = config.watermarkColor || "#aaa";
                this.buttonCls = config.buttonCls || "ui-combo-button";
                this.buttonStyle = config.buttonStyle || "";
                this.ds = config.ds;
                this.listTpl = config.listTpl;
                this.displayField = config.displayField || "";
                this.inputStyle = config.inputStyle || "";
                this.valueField = config.valueField || "";
                this.listEntryHeight = config.listEntryHeight || 18;
                this.visibleEntrys = config.visibleEntrys || 4;
                this.listHeight = (this.listEntryHeight + 4 ) * this.visibleEntrys;
                this.iconColor = config.iconColor;
                this.selectColor = config.selectColor || "";
                this.selectCls = config.selectCls || "ui-list-select";
                this.inputDisabledCls = config.inputDisabledCls || "";
                this.buttonDisabledCls = config.buttonDisabledCls || "";
                var rc = this.roundCorners;
                if (idev.isIE8()) rc = false;
                this.dropWidth = config.dropWidth == null ? (this.width-(rc ? 6 : 0)) : config.dropWidth;
				this.autoSelect = config.autoSelect == null ? true : config.autoSelect;
                if (this.ds != null)
                {
                    if (this.visibleEntrys > this.ds.getCount())
                    {
                        var ent = this.ds.getCount() || 1;
                        this.listHeight = (this.listEntryHeight + 4 ) * ent;
                    }
                    this.ds.bind(this);
                }
                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element ui-combo {cls}' style='{elementstyle};{style};overflow:hidden;'>",
                        "<input id='{id}-input' type='{inputtype}' class='ui-combo-input' style='float:left;width:{width}px;height:{inputheight}px;{inputstyle}'  value='{value}'/>",
                        "<div id='{id}-button' style='float:right;max-width:{buttonwidth}px;'></div>",
                        "<div id='{id}-list' style='z-index:9999;'></div>",
                        "</div>"
                    );
                if (this.displayField != "" && this.valueField == "") this.valueField = this.displayField;
                if (this.displayField == "") this.displayField = this.ds.getFieldName(0);
                if (this.valueField == "") this.valueField = this.ds.getFieldName(0);
                if (this.listTpl == null) this.listTpl = new idev.wTemplate(
                        "<div style='max-height:{entryheight}px;height:{entryheight}px;padding:2px;font-size:10pt;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;'>{" + this.displayField + "}</div>"
                    );
                this.inpStyle = {};
                if (this.inputStyle != "")
                {
                    this.inpStyle = idev.utils.css2JSON(this.inputStyle);
                }
            },
            enable:function(flag)
            {
                this._super(flag);
                this.btn.enable(flag);
                if(flag) {
                    $('#' + this.id + "-input").removeClass(this.inputDisabledCls);
                    this.editable = true;
                } else {
                    $('#' + this.id + "-input").addClass(this.inputDisabledCls);
                    this.editable = false;
                }
            },
            setInputValue : function(value)
            {
                var v = $('#'+this.id+"-input").val();
                          
                if (this.watermark == v)
                {
                    $('#'+this.id+"-input").val("");
                    if (this.inpStyle.color == null)
                        $('#'+this.id+"-input").css("color","");
                    else
                        $('#'+this.id+"-input").css(this.inpStyle);
                }
                if (value == "" && this.watermark != "")
                {
                    $('#'+this.id+"-input").val(this.watermark);
                    $('#'+this.id+"-input").css("color",this.watermarkColor);
                }
                else
                    $('#'+this.id+"-input").val(value);
            },
            setValue : function(value,fromclick)
            {
                if(value == '')
                {
                    this.setInputValue(value);
                    if (this.list) this.list.selected = -1;
                    return;
                }
                if (this.ds == null)  return;
                if (this.editable)
                {
                    this.setInputValue(value);
                }
                var match = this.ds.find(this.valueField,value,0,false,false);
                if (match == -1) return;
                var rec = this.ds.getAt(match);
                value = rec.get(this.displayField);
                this.setInputValue(value);
                var wgt = this.list;
                if (this.list == null)  return;
                if (wgt.autoSelect && !fromclick)
                {
                    if (wgt.selected != -1)
                    {
                        $( '#' +  wgt.id + "_" + wgt.selected).addClass(wgt.entryCls);
						$( '#' +  wgt.id + "_" + wgt.selected).removeClass(wgt.selectCls);
                        if (this.selectColor != "")
                            wgt.updateItem(wgt.selected,"background-color","");
                    }
                    if (wgt.selectCls != "")
                    {
                        $( '#' +  wgt.id + "_" + wgt.selected).removeClass(wgt.entryCls);
						$( '#' +  wgt.id + "_" + wgt.selected).addClass(wgt.selectCls);
                    }
                    if (this.selectColor != "")
                        wgt.updateItem(match,"background-color",this.selectColor);
                }
                this.list.selected = match;
            },
            getInputValue : function()
            {
                var v = $('#'+this.id+"-input").val();

                if (this.watermark == v) v = "";
                return v;
            },
            getValue : function()
            {
                if (this.editable)
                {
                    var value = this.getInputValue();
                    if (this.list.getSelected() == -1)  
                    {
                        return value;
                    }
                    if (this.ds)
                    {
                        var idx = this.ds.find(this.displayField,value);
                        if (idx == -1)
                            return value
                    }
                }
                if (this.ds == null) 
                {
                    if (this.editable) return this.getInputValue();
                    return "";
                }
                var rec = this.ds.getAt(this.list.getSelected());
                return rec == null ? "" : rec.get(this.valueField);
            },
            getSelected:function()
            {
                return this.list.getSelected();
            },
            getStore:function()
            {
                return this.ds;
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.ds == null) { idev.errorHandler("No Combo DS"); return; }
                var text = "";
                var inputstyle = this.inputStyle;
                var style = this.style;

                this.btnWidth = this.height+3;
                if (idev.isIPad())
                {
                    btnWidth += 12;
                }
                if (this.watermark != "" )
                {
                    text = this.watermark;
                    inputstyle += "color:" + this.watermarkColor + ";";
                }
                if (this.borderStyle != "") style += ";border:" + this.borderStyle;
                var data = new Array();

                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls);
                data['elementstyle'] = this.elementStyle;
                data['style'] = style;
                data['value'] = text;
                data['width'] = this.width - this.btnWidth - 3;
                data['height'] = this.height;
                data['inputheight'] = this.height - 4;
                data['buttonwidth'] = this.height;
                data['inputstyle'] = inputstyle;
				if (this.autoScroll)
                {
                    data['inputstyle'] = this.style+";overflow:auto;";
                }
                data['inputtype'] = this.inputType == "number" ? "text" : this.inputType;

                var  sHTML = this.tpl.render(data);

                $("#" + this.renderTo).append(sHTML);
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                }
                $delay(100,function(widget)
                {
                    cls = widget.buttonCls;
                    style = widget.buttonStyle;
                    widget.btn = new idev.ui.widgetButton({
                        parent:widget,
                        renderTo:widget.id + "-button",
                        width:widget.height,
                        height:widget.height,
                        icon:{
                            src:'_arrow'
                        },
                        cls:widget.cssQuirks(cls),
						disabledCls:widget.buttonDisabledCls,
                        style:style,
                        border:false, 
                        events: {
                            click:function(btn)
                            {
                                if (btn.parent.visible)
								{

									btn.parent.list.hide();
								}

                                else
                                {
                                    if (idev.hideWidget)
                                    {
										idev.hideWidget.parent.visible = false;
                                        idev.hideWidget.hide();
                                    }
                                    var h =  $("#" + btn.parent.id).height();
                                    var pos = $("#" + btn.parent.id).offset();
                                    var x =  pos.left;
                                    var y =  pos.top + h + 1;
                                    if (btn.parent.roundCorners && !idev.isIE8()) x += 4;
                                    
                                    var pos = btn.parent.list.getScrollPos();
                                    $("#"+btn.parent.list.id).css("left",x);
                                    $("#"+btn.parent.list.id).css("top",y);
                                    btn.parent.list.show();
                                    btn.parent.list.setScrollPos(pos);
                                    idev.hideWidget = btn.parent.list;
                                }
                                btn.parent.visible = btn.parent.visible ? false : true ;
                            }
                        }
                    });
                    var data = new Array();

                    data['entryheight'] = widget.listEntryHeight;

                    widget.btn.render();
                    var h =  $("#" + widget.id).height();
                    var pos = $("#" + widget.id).offset();
                    var x =  pos.left;
                    var y =  pos.top + h + 1;
                    var rc = widget.roundCorners;
                    
                    if (idev.isIE8()) 
                    {
                        rc = false;
                        widget.dropWidth += 1;
                    }
                    widget.list = new idev.ui.widgetList({
                        parent:widget,
                        renderTo:"container",
                        x:x+(rc ? 4 : 0),
                        y:y,
                        width:widget.dropWidth,
                        height:widget.listHeight,
                        listEntryHeight:widget.listEntryHeight,
                        hidden:true,
                        visible:false,
                        cls:'ui-combo-droplist',
                        autoScroll:true,
                        autoSelect:true,
                        selectCls:widget.selectCls,
                        selectColors:widget.selectCls,
                        ds:widget.ds,
                        border:true,
                        tpl:widget.listTpl,
                        itemStyle:'border:0px;',
                        metaData: data,
                        events:{
                            click:function(wgt,index,oldIndex)
                            {
                                var ds = wgt.getStore();
                                var rec = ds.getAt(index);
                                var sValue = rec.get(wgt.parent.valueField);
                                wgt.hide();
                                wgt.parent.setValue(sValue,true);
								wgt.parent.visible = false;
                                idev.hideWidget = null;
                                if (wgt.parent.events.selected) wgt.parent.events.selected(wgt.parent,index,oldIndex);
                                if (wgt.parent.events.change && index != oldIndex) wgt.parent.events.change(wgt.parent);
                            },
                            hover:function(enter,wgt,index,selected)
                            {
                                if (wgt.parent.events.hover) wgt.parent.events.hover(enter,this,index.selected);
                            }
                        }

                    });
                    widget.list.render();
                    idev.internal.afterRender(widget);
                    if (widget.events.click)
                    {
                        $( '#' +  widget.id ).click(idev.internal.onClick);
                    }
                    if (widget.events.dblclick)
                    {
                        $( '#' +  widget.id ).dblclick(idev.internal.onDblClick);
                    }
                    $( '#' +  widget.id + "-input").blur(idev.internal.onLostFocus);
                    $( '#' +  widget.id + "-input").focus(idev.internal.onFocus);
                    if (widget.events.change)
                    {
                        $( '#' +  widget.id ).change(idev.internal.onChange);
                    }
                    $( '#' +  widget.id ).keydown(function(event)
                    {
                        var wgt = idev.get(widget.id);
                        if (!wgt.editable)
                        {
                            event.preventDefault();
                            return false;
                        }
                        if (wgt.watermark != "")
                        {
                            var v = $('#'+wgt.id+"-input").val();

                            if (v == wgt.watermark )
                            {
                                $('#'+wgt.id+"-input").val("");
                                if (wgt.inpStyle.color == null)
                                    $('#'+wgt.id+"-input").css("color","");
                                else
                                  $('#'+wgt.id+"-input").css(wgt.inpStyle);
                            }
                        }
                        if (event.keyCode == 9 && wgt.events.ontab)
                        {
                            wgt.events.ontab(wgt);
                            event.preventDefault();
                            return false;
                        }
                    });
                    $( '#' +  widget.id ).keyup(function(event)
                    {
                        var wgt = idev.get(widget.id);
                        if (wgt.wtype == "combo")
                        {
                            if (wgt.watermark != "")
                            {
                                var v = $('#'+wgt.id+"-input").val();
                                if (v == "")
                                {
                                    var el =  $('#'+wgt.id+"-input");

                                    $('#'+wgt.id+"-input").val(wgt.watermark);
                                    $('#'+wgt.id+"-input").css("color",wgt.watermarkColor);
                                    if(el.createTextRange)
                                    {
                                        var range = el.createTextRange();
                                        range.move('character', 0);
                                        range.select();
                                    }
                                    else
                                    {
                                        if(el.selectionStart)
                                        {
                                            el.focus();
                                            el.setSelectionRange(0, 0);
                                        }
                                        else
                                            el.focus();
                                    }
                                }
                            }
                            if (event.keyCode == 13 && wgt.events.onenter)
                            {
                                wgt.events.onenter(wgt);
                                event.preventDefault();
                                return false;
                            }
                        }
                    });
                    $( '#' +  widget.id ).keypress(idev.internal.onKeypress);
                    widget.setValue(widget.value)
                    widget.rendered = true;

                },this);
            },
            refresh:function()
            {
                if (this.visibleEntrys > this.ds.getCount())
                {
                    var ent =  this.ds.getCount() || 1;
                    this.listHeight = (this.listEntryHeight + 4 ) * ent;
                    $("#" + this.list.id).height(this.listHeight);
                    $("#" + this.list.id).css('max-height', this.listHeight + 'px');
					$get(this.list.id).doLayout();
                }
                else if(this.ds.getCount() > 1)
                {
                    this.listHeight = (this.listEntryHeight + 4 ) * this.visibleEntrys;
                    $("#" + this.list.id).height(this.listHeight);
                    $("#" + this.list.id).css('max-height', this.listHeight + 'px');
                    $("#" + this.list.id + "-wrapper").height(this.listHeight);
                    $("#" + this.list.id + "-wrapper").css('max-height', this.listHeight + 'px');
					$get(this.list.id).doLayout();
                }
            },
            onshow:function()
            {
                this._super();
                if (idev.isIE8())
                {
                    this.btn.onshow();
                }
            },
            ondestroy:function()
            {
                this.btn.destroy();
                this.list.destroy();
            },
            doLayout: function()
            {
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id + "-input").width(w - this.btnWidth -4);
                $("#" + this.id + "-input").height(h -4);

                this._super();

            }
        }),
        //------------------------------------------------------------------
        widgetCheckbox : baseWidget.extend(
        {
            init: function(config)
            {
                if (config.width < 22) config.width = 22;
                if (config.height < 22) config.height = 22;
                this._super( config );
                this.wtype = "checkbox";
                this.checked = config.checked == null ? false : config.checked ;
                this.text = config.text || "";
                this.textStyle = config.textStyle || "";
                this.align = config.align || "left";
                this.resizer.handlers = "n,s,w,e,"
                this.nvalue = config.nvalue === null ? "" : config.nvalue;
				this.lock = config.lock === null ? false : config.lock

                this.resizer.resizeColor = "#fff";
                if (this.align == "right")
                    this.tpl = new idev.wTemplate(
                            "<div id='{id}' class='ui-element' style='{elementstyle}'>",
                            "<table width=100% style='{style}'>",
                            "<tr>",
                            "<td width='20px'>",
                            "<button id='{id}-input' class='ui-checkbox {cls}' style='width:20px;height:20px;border:0px;' >&nbsp;&nbsp;&nbsp;&nbsp;",
                            "</button>",
                            "</td>",
                            "<td id='{id}-text'>",
                            "<span style='{textStyle}'>{text}</span>",
                            "</td>",
                            "</tr>",
                            "</table>",
                            "</div>"
                        );
                else
                    this.tpl = new idev.wTemplate(
                            "<div id='{id}' class='ui-element' style='{elementstyle}'>",
                            "<table width=100% style='{style}'>",
                            "<tr>",
                            this.text == ""? "" : "<td id='{id}-text'><span style='{textStyle}'>{text}</span></td>",
                            "<td width='22px'>",
                            "<button id='{id}-input' style='width:20px;height:20px;border:0px;' class='ui-checkbox {cls}'>&nbsp;&nbsp;&nbsp;&nbsp;",
                            "</button>",
                            "</td>",
                            "</tr>",
                            "</table>",
                            "</div>"
                        );
            },
			lock:function()
			{
				this.lock = true;
			},
			unlock:function()
			{
				this.lock = false;
			},
            isChecked : function()
            {
                return $('#'+this.id+"-input").hasClass("ui-checkbox-on");
            },
            setValue : function(value)
            {
                if (value == this.value) {
                    this.check(true)
                } else {
                    this.check(false)
				}
            },
            getValue : function()
            {
                return this.isChecked() ? this.value : this.nvalue;
            },
            check : function(checked)
            {
                var isChecked = isChecked();
                if (checked && !isChecked) {
                   $('#'+this.id+"-input").toggleClass("ui-checkbox-on");
                }
                if (!checked && isChecked) {
                   $('#'+this.id+"-input").toggleClass("ui-checkbox-on");
                }
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var style =  this.elementStyle;

                var data = new Array();

                data['id'] = this.id;
                if (this.checked)
                    data['cls'] = "ui-checkbox-on";
                else
                    data['cls'] = "";
                data['elementstyle'] = this.elementStyle;
                data['textStyle'] = this.textStyle;
                data['text'] = this.text;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);

                idev.internal.afterRender(this);
                $( '#' + this.id +"-input").click(function()
                {
                    var widget = idev.get(this.id.replace("-input",""));
                    if (widget.resizer.isResizing()) return;
					if (widget.lock) return;
					$(this).toggleClass("ui-checkbox-on");
                    if (widget.events.change)
                    {
                        widget.events.change(widget);
                    }
                });
                $( '#' +  this.id + "-input").blur(idev.internal.onLostFocus);
                this.rendered = true;
            }
        }),
        //------------------------------------------------------------------
        widgetSwitch : baseWidget.extend(
        {
            init: function(config)
            {
                if(typeof(config.width)=="undefined") config.width = 94;
                if(typeof(config.height)=="undefined") config.height = 27;
                this._super( config );
                this.wtype = "switch";
                this.on = config.on == null ? false : config.on ;
                this.resizer.resizable = false;
                this.nvalue = config.nvalue || "";
                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element' style='{elementstyle}'>",
                        "<div id='{id}-input' class='-ui-switch {cls}'>",
                        "<img id='{id}-img' src='" + _preferences.libpath + "/images/off.png' style='width:{width}px;height:{height}px'/>",
                        "</div>",
                        "</div>"
                    );
            },
            isOn : function()
            {
                return this.on;
            },
            setOn : function(switchon)
            {
                if (switchon)
                {
                   $('#'+this.id+"-img").attr('src', _preferences.libpath + '/images/on.png');
                   this.on = true;
                }
                else
                {
                   $('#'+this.id+"-img").attr('src', _preferences.libpath + '/images/off.png');
                   this.on = false;
                }
            },
            getValue:function()
            {
                return this.isOn() ? this.value : this.nvalue;
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var style =  this.elementStyle;

                var data = new Array();

                data['id'] = this.id;
                data['width'] = this.width;
                data['height'] = this.height;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);

                idev.internal.afterRender(this);
                if (this.on)
                    this.setOn(true);
                $( '#' + this.id +"-input" ).click(function()
                {
                    var widget = idev.get(this.id.replace("-input",""));
                    if (!widget.resizer.isResizing()) widget.setOn(!widget.on);
                });
                if (this.events.change)
                {
                    $( '#' +  this.id).click(idev.internal.onChange);
                }
                this.rendered = true;
            }
        }),
        //------------------------------------------------------------------
        widgetRadio : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "radio";
                this.checked = config.checked == null ? false : config.checked ;
                this.group = config.group == null ? "" : config.group;
                this.text = config.text || "";
                this.textStyle = config.textStyle || "";
                this.align = config.align || "left";
                this.resizer.handlers = "n,s,w,e,"

                if (this.align == "right")
                    this.tpl = new idev.wTemplate(
                            "<div id='{id}' class='ui-element' style='{elementstyle}'>",
                            "<table width=100% style='{style}'>",
                            "<tr>",
                            "<td width='20px'>",
                            "<div id='{id}-input' style='width:20px;height:20;px' group='{group}' class='ui-radio-off {cls}'>&nbsp;&nbsp;&nbsp;&nbsp;",
                            "</div>",
                            "</td>",
                            "<td id='{id}-text'>",
                            "<span class='ui-radio-text' style='{textStyle}'>{text}</span>",
                            "</td>",
                            "</tr>",
                            "</table>",
                            "</div>"
                        );
                else
                    this.tpl = new idev.wTemplate(
                            "<div id='{id}' class='ui-element' style='{elementstyle}'>",
                            "<table width=100% style='{style}'>",
                            "<tr>",
                            "<td id='{id}-text'>",
                            "<span class='ui-radio-text' style='{textStyle}'>{text}</span>",
                            "</td>",
                            "<td width='20px'>",
                            "<div id='{id}-input' style='width:20px;height:20;px' group='{group}' class='ui-radio-off {cls}'>&nbsp;&nbsp;&nbsp;&nbsp;",
                            "</div>",
                            "</td>",
                            "</tr>",
                            "</table>",
                            "</div>"
                        );
            },
            isChecked : function()
            {
				return $('#'+this.id+"-input").hasClass("ui-radio-on");
            },
            getValue : function()
            {
				var id = $('[group='+this.group+'].ui-radio-on').attr('id').replace('-input','');
				return idev.widgets[id].value;
            },
            check : function(checked)
            {
                var isChecked = $('#'+this.id+"-input").hasClass("ui-radio-on");
                if (checked && !isChecked) $('#'+this.id+"-input").toggleClass("ui-radio-on");
                if (!checked && isChecked) $('#'+this.id+"-input").toggleClass("ui-radio-on");
            },
            handleRadio : function(radio)
            {
				if (this.isChecked()) return;
                //Will match first found but radio should only have one active in each group
				var id = $('[group='+this.group+'].ui-radio-on').attr('id').replace('-input','');
				idev.widgets[id].check(false);
				this.check(true);
                if (this.events.click) this.events.click(this);
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var data = new Array();

                data['id'] = this.id;
                if (this.checked)
                    data['cls'] = "ui-radio-on";
                else
                    data['cls'] = "";
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;
                data['textStyle'] = this.textStyle;
                data['text'] = this.text;
                data['group'] = this.group;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);

                idev.internal.afterRender(this);
				$( '#' + this.id).click(function()
                {
                    var r = idev.get(this.id);
                    r.handleRadio();
                });
                this.rendered = true;
            }
        }),
        //------------------------------------------------------------------
        widgetSVGButton : baseWidget.extend(
        {
            init: function(config)
            {
                if (!_preferences.useCSS3) config.hideType = "visibility";
                config.height = config.height == null ? 38 :config.height;
                this._super( config );

                var color = "blue",startColor = "",endColor = "",fontColor = "#222",iconColor = "black",fontSize = 12,fontWeight = "normal",fontFamily = "Arial",radius = 6, borderColor, border=false;

                this.wtype = "svgbutton";
                this.width = this.width == null ? 80 : this.width ;
                this.icon = config.icon == null ? "" : config.icon ;
                this.iconAlign = config.iconAlign == null ? "left" : config.iconAlign.toLowerCase();
                this.text = this.config.text == null ? "" : this.config.text;
                this.color =  this.config.color == null ? "" : this.config.color;
                this.transparent = this.config.transparent == null ? false : this.config.transparent;
                if ( this.color == "" && !this.transparent)
                {
                    if (_preferences)
                    {
                        if (_preferences.button.startcolor) startColor = _preferences.button.startcolor;
                        if (_preferences.button.endcolor) endColor = _preferences.button.endcolor;
                        if (_preferences.button.fontcolor) fontColor = _preferences.button.fontcolor;
                        if (_preferences.button.iconcolor) iconColor = _preferences.button.iconcolor;
                        if (_preferences.button.fontsize) fontSize = _preferences.button.fontsize;
                        if (_preferences.button.fontweight) fontWeight = _preferences.button.fontweight;
                        if (_preferences.button.radius) radius = _preferences.button.radius;
                        if (_preferences.button.bordercolor) borderColor = _preferences.button.bordercolor;
                        if (_preferences.button.border) border = _preferences.button.border;
                    }
                    else
                        this.color = color;
                }
                if (_preferences.useCSS3) fontColor = "inherit";
                if (this.width == null && this.height != null) this.width = this.height;
                if (this.height == null && this.width != null) this.height = this.width;
                this.isshown = false;
                this.radius = this.config.radius == null ? radius : this.config.radius;
                this.startColor = this.config.startColor == null ? startColor : this.config.startColor;
                this.endColor = this.config.endColor == null ? endColor : this.config.endColor;
                this.fontColor = this.config.fontColor == null ? fontColor : config.fontColor;
                this.fontDisableColor = this.config.fontDisableColor == null ? fontColor : config.fontDisableColor;
                this.fontSize = this.config.fontSize == null ? fontSize : this.config.fontSize;
                this.fontWeight = this.config.fontWeight == null ? fontWeight : this.config.fontWeight;
                this.fontFamily = this.config.fontFamily == null ? fontFamily  : this.config.fontFamily;
                this.iconColor = this.config.iconColor == null ? iconColor : this.config.iconColor;
                this.iconRotation = this.config.iconRotation == null ? 0 : this.config.iconRotation;
                this.iconScale = this.config.iconScale == null ? 0.6 : this.config.iconScale;
                this.toggle = this.config.toggle == null ? false : this.config.toggle;
                this.down = this.config.down == null ? false : this.config.down;
                this.ix = this.config.ix ;
                this.iy = this.config.iy ;
                this.svg = this.config.svg == true ? true : false;
                if (this.color != "") 
                {
                    idev.colors.gradientColors(this);
                    if (this.config.fontColor != null) this.fontColor = this.config.fontColor;
                    if (this.config.fontSize != null) this.fontSize = this.config.fontSize;
                    if (this.config.fontWeight != null) this.fontSize = this.config.fontWeight;
                }
                if(!borderColor) borderColor = startColor;
                this.borderColor = this.config.borderColor || borderColor;
                this.path = this.config.path;
                this.shape = this.config.shape == null ? null : this.config.shape.toLowerCase();
                this.gradient = config.gradient == null ? null : this.config.gradient.toLowerCase();
                this.rx = this.config.rx == null ? 0.5 : this.config.rx;
                this.ry = this.config.ry == null ? 0.5 : this.config.ry;
                this.textXOffset = this.config.textXOffset == null ? 0 : this.config.textXOffset;
                this.textYOffset = this.config.textYOffset == null ? 0 : this.config.textYOffset;
                this.border = this.config.border == null ? border : this.config.border;
                this.image = this.config.image;
                this.imageFill = this.config.imageFill;
                this.title = this.config.title || "";
                this.startTColor = this.config.startTColor == null ? this.endColor : this.config.startTColor;
                this.endTColor = this.config.endTColor == null ? this.startColor : this.config.endTColor;

                if (this.image != null)
                {
                    if (this.image.x == null) this.image.x = 0;
                    if (this.image.y == null) this.image.y = 0;
                    if (this.image.width == null) this.image.width = 20;
                    if (this.image.height == null) this.image.height = 20;
                }
                this.icon = this.icon.replace("ui-icon-","");
                this.icon = this.icon.replace("-white","");
                this.icon = this.icon.replace("-black","");
                this.tpl = new idev.wTemplate("<div id='{id}' class='ui-element {buttoncls}' style='{elementstyle}{style}' title='{title}'></div>");
                if (this.startColor != "" && this.endColor != "") this.color = "";
            },
            drawButton:function()
            {
                var widget = this;
                
                if (widget.ix == null) widget.ix = 0;
                if (widget.iy == null) widget.iy = 0;
                widget.paper = Raphael(widget.id,widget.width, widget.height);
                widget.paper.safari();
                if (!widget.transparent)
                {
                    var borderOffset = widget.border ? 3 : 2;

                    if (widget.path != null)
                    {
                        widget.object = widget.paper.path(widget.path);
                    }
                    else if (widget.shape == "circle")
                    {
                        widget.object = widget.paper.circle(widget.width/2, widget.height/2,widget.radius-2);
                    }
                    else if (widget.shape == "ellipse")
                    {
                        widget.object = widget.paper.ellipse(widget.width/2, widget.height/2,widget.width/2-2, widget.height/2-2);
                    }
                    else
                    {
                        widget.object = widget.paper.rect(1.5, 1.5, widget.width-borderOffset, widget.height-borderOffset,widget.radius);
                    }
                    if (widget.border)
                        widget.object.attr({ "stroke": widget.borderColor, "stroke-width": "0.3",cursor: "pointer" });
                    else
                        widget.object.attr({ "stroke-width": "0.05",cursor: "pointer" });
                    if (widget.imageFill != null)
                    {
                        widget.object.attr({ fill: "url("+widget.imageFill+")" });
                    }
                    else if (widget.gradient == 'radial')
                    {
                        widget.object.attr({ fill:"r(" + widget.rx + "," + widget.ry + ")" + widget.endColor.toLowerCase() + "-" + widget.startColor.toLowerCase() });
                    }
                    else
                        widget.object.attr({ fill:"90-" + widget.startColor.toLowerCase() + "-" + widget.endColor.toLowerCase() });
                }
                else
                {
                    if (widget.border)
                    {
                        widget.object = widget.paper.rect(1.5, 1.5, widget.width-2, widget.height-2,widget.radius);
                        widget.object.attr({ "stroke": widget.borderColor, "stroke-width": "0.25",cursor: "pointer" });
                    }
                }

                if ( widget.text != "")
                {
                    if (widget.transparent && widget.image != null)
                    {
                        if (widget.textXOffset < 4) widget.textXOffset = 4;
                        widget.tx = widget.paper.text(widget.image.width + widget.textXOffset, (widget.height/2)+widget.textYOffset, widget.text).attr({'text-anchor': 'start'});;
                    }
                    else
                    {
                        widget.tx = widget.paper.text((widget.width/2)+widget.textXOffset, (widget.height/2)+widget.textYOffset, widget.text);
                    }
                    if (widget.enabled)
                    {
                        widget.tx.attr( {
                            fill:widget.fontColor,
                            stoke:widget.fontColor,
                            "stroke-width": "0.1",
                            'font-size':widget.fontSize,
                            'font-weight':widget.fontWeight,
                            cursor: "pointer" });
                    }
                    else
                    {
                        widget.tx.attr( {
                            fill:'#888',
                            stoke:'#222',
                            "stroke-width": "0.1",
                            'font-size':widget.fontSize,
                            'font-weight':widget.fontWeight,
                            cursor: "pointer" });
                    }
                }
                if (widget.image != null)
                {
                    if (widget.image.src != null)
                    {
                        widget.graphic = widget.paper.image(widget.image.src,widget.image.x,widget.image.y,widget.image.width,widget.image.height);
                        if (typeof widget.events.click == "function")
                        {
                            widget.graphic.attr("cursor","pointer");
                        }
                    }
                }
                var sIcon = "";
                if (widget.icon != "")
                {
                    sIcon = eval("icon."+widget.icon);
                }
                if (sIcon != "")
                {
                    widget.ic = widget.paper.path(sIcon).attr({fill: widget.iconColor, stroke: "none"});
                    if (widget.iconAlign == "center")
                    {
                        widget.ic.scale( widget.iconScale, widget.iconScale ); 
                        bbox = widget.ic.getBBox();
                        var cx = (widget.width)/2;
                        var cy = (widget.height)/2;
                        
                        var dx = cx - (bbox.x + bbox.width/2);
                        var dy = cy - (bbox.y + bbox.height/2);
                        if (idev.isIE8())                            
                            dx *=  2.8-widget.iconScale;
                        else
                            dx *=  2.05-widget.iconScale;
                        dy *=  2-widget.iconScale;
                        widget.ic.translate(dx+widget.ix,dy+widget.iy);
                        if (widget.iconRotation != 0)
                        {
                             widget.ic.rotate(widget.iconRotation);
                        }
                    }
                    else
                    {
                        var sx = 16;
                        var sy = 18;
                        widget.ic.scale( widget.iconScale,widget.iconScale );
                        if (widget.iconAlign == "left")
                        {
                            widget.ic.translate(-4 + widget.ix,-4 + widget.iy);
                            if (widget.iconRotation != 0)
                                widget.ic.rotate(widget.iconRotation,sx,sy);
                        }
                        else
                        {
                            widget.ic.translate(widget.width+8 + widget.ix,-4 + widget.iy);
                            cx = widget.width-8;
                            if (widget.iconRotation != 0)
                                widget.ic.rotate(widget.iconRotation,sx,sy);
                        }
                    }
                }
                if (widget.down) widget.toggleButton(true);
                if (widget.hidden)
                {
                    widget.hide();
                }
                if (!idev.isIE8()) this.isshown = true;
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var sHTML = "",sColor = this.color,btnCls = "",btnBodyCls = this.btnBodyCls;

                if ((idev.agent.indexOf("android 2.") != -1 || _preferences.useCSS3 || Raphael == null)  && !this.svg)
                {
                    btnCls = 'ui-button ';
                    if (btnBodyCls == "") btnBodyCls = 'ui-button-body';
                    if (this.color && !this.transparent)  btnBodyCls += "-" + this.color.toLowerCase();
                    if (!this.enabled) btnBodyCls += " " + this.btnDisabledCls;
                }
                var data = new Array();
                data['id'] = this.id;
                data['width'] = this.width;
                data['bodywidth'] = this.width;
                data['height'] = this.height;
                data['bodyheight'] = this.height;
                data['elementstyle'] = this.elementStyle;
                data['title'] = this.title;
                data['style'] = this.style;
                data['buttoncls'] = this.cssQuirks(btnCls);
                data['buttonbodycls'] = this.transparent ? "" : this.cssQuirks(btnBodyCls);
                data['buttonBodyStyle'] = this.buttonBodyStyle;
                var sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                // This delay is because safari and chrome miss render the canvas
                idev.utils.delay(100,function(widget)
                {
                    widget.drawButton();
                    idev.internal.afterRender(widget);
                },this);
                if (typeof this.events.click == "function")
                {
                    $( '#' +  this.id ).click(function(e)
                    {
                        var wgt = idev.get(this.id);
                        if (wgt.toggle)
                        {
                            var ok = true;
                            if (wgt.events.canToggle) ok = wgt.events.canToggle(wgt);
                            if (ok)
                            {
                                wgt.toggleButton(wgt.down ? false : true);
                                idev.internal.onClick.call(this,e);
                            }
                        }
                        else
                            idev.internal.onClick.call(this,e);
                    });
                }
                this.rendered = true;
            },
            setBorderColor:function(sColor,w)
            {
                if (_preferences.useCSS3 && !this.svg) return;
                w = w || 0.3;
                this.object.attr({ "stroke": sColor, "stroke-width": w });
            },
            textColor : function(fontColor)
            {
                if (_preferences.useCSS3 && !this.svg) return;
                this.tx.attr( {
                    fill:fontColor,
                    stoke:fontColor});
            },
            setText : function(sText)
            {
                this.text = sText;
                if (_preferences.useCSS3)
                    $("#"+this.id+"-text").html(sText);
                else
                    this.tx.attr({text:sText});
            },
            getText : function()
            {
                return this.text;
            },
            isDown:function()
            {
                return this.down;
            },
            enableButton: function(enable)
            {
                this.enabled = enable; 
                if (enable)
                {
                    this.textColor(this.fontColor)
                }
                else
                {
                    this.textColor(this.fontDisableColor)
                }   
            },
            toggleButton: function(down)
            {
                if (!this.toggle) return;
                this.down = down;
                if (this.down)
                {
                    this.object.attr({ fill:"90-" + this.startTColor.toLowerCase() + "-" + this.endTColor.toLowerCase() });
                }
                else
                {
                    this.object.attr({ fill:"90-" + this.startColor.toLowerCase() + "-" + this.endColor.toLowerCase() });
                }
                if (typeof this.events.ontoggle == "function") this.events.ontoggle(this,down);
            },
            reColor : function(startColor, endColor)
            {
                this.object.attr({ fill:"90-" + startColor.toLowerCase() + "-" + endColor.toLowerCase() });
            },
            onshow:function()
            {
                this._super();
                if (idev.isIE8() && !this.isshown)
                {
                    if (this.paper)
                    {
                        this.paper.remove();
                        this.drawButton();
                    }
                    this.isshown = true;
                }
            },
            onhide:function()
            {
                if (idev.isIE8())
                {
                    if (this.paper) this.paper.hide();
                }
            },
            ondestroy:function()
            {
                if (this.paper)
                {
                    this.paper.remove();
                }
            },
            doLayout:function()
            {
                this._super();
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();
            }
        }),
        //------------------------------------------------------------------
        widgetButton : baseWidget.extend(
        {
            init: function(config)
            {
                config.cls = config.cls || "ui-button";
                this._super( config );
                this.wtype = "button";
                this.textCls = this.config.textCls || 'ui-button-text';
                this.textStyle = this.config.textStyle || '';
                this.icon = this.config.icon || { cls:'', src:null, align:'left', color:'black' };
                if (typeof this.icon == "string")
                {
                    this.icon = { cls:'', src:this.icon, align:'left', color:'black' };
                }
                this.toggle = this.config.toggle || false;
                this.down = this.config.down || false;
                this.toggleCls = this.config.toggleCls || 'ui-button-toggle';
                this.enabled = this.config.enabled == null ? true : this.config.enabled;
                this.disabledCls = this.config.disabledCls || 'ui-button-disabled';
                this.transparent = this.config.transparent == null ? false : this.config.transparent;
				this.tooltip = config.tooltip || "";
                this.tpl = new idev.wTemplate(
                    
                    "<button unselectable='on' type='button' id='{id}' class='ui-element {cls} {togglecls} unselectable' style='{elementstyle}{style}' title='{tooltip}'>",
                    "{image1}<span class='{textcls}' id='{id}-text' style='{textstyle}'>{text}</span>{image2}",
                    "</button>" );
            },                                 
            render : function()
            {
                if (this.renderTo == null) return;
        
                var data = new Array();
                var sImage="";
                
                if (this.icon.src != null)
                {
                    this.icon.cls = this.icon.cls || "";
                    this.icon.color = this.icon.color || "black";
                    this.icon.style = this.icon.style || "";
                    if (this.icon.src == "_arrow")
                        sImage = "<img id='"+this.id+"-icon' class='"+this.icon.cls +"' src='" + _preferences.libpath+"images/arrow.png' style='";
                    else if (this.icon.src == "_calendar")
                        sImage = "<img id='"+this.id+"-icon' class='"+this.icon.cls +"' src='" + _preferences.libpath+"images/calendar.png' style='";
                    else if (this.icon.src .indexOf(".") == -1)
                    {
                        var sColor = this.icon.color.toLowerCase() ;
                        
                        if (sColor == "white" || sColor == "#fff" || sColor == "#ffffff")
                            sImage = "<img id='"+this.id+"-icon' class='"+this.icon.cls +"' src='"+_preferences.libpath+"images/icons/white/"+this.icon.src+".png' style='";
                        else
                            sImage = "<img id='"+this.id+"-icon' class='"+this.icon.cls +"' src='"+_preferences.libpath+"images/icons/black/"+this.icon.src+".png' style='";
                    }
                    else 
                        sImage = "<img id='"+this.id+"-icon' class='"+this.icon.cls +"' src='" + this.icon.src + "' style='";
                    if (this.icon.x != null || this.icon.right != null || 
                        this.icon.y != null || this.icon.bottom != null) sImage += "position:absolute;";
                    if (this.icon.x != null) sImage += "left:"+this.icon.x+"px;";
                    if (this.icon.right != null) sImage += "right:"+this.icon.right+"px;";
                    if (this.icon.y != null) sImage += "top:"+this.icon.y+"px;";
                    if (this.icon.bottom != null) sImage += "bottom:"+this.icon.bottom+"px;";
                    if (this.icon.width != null) sImage += "width:"+this.icon.width+"px;";
                    if (this.icon.height != null) sImage += "height:"+this.icon.height+"px;";
                    sImage += this.icon.style+"'/>";
                }
                
        
                data['id'] = this.id;
                data['width'] = this.width;
                data['height'] = this.height;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;
				data['tooltip'] = this.tooltip;
                data['cls'] = this.cssQuirks(this.transparent ? "ui-button-transparent" : this.cls);
                data['togglecls'] = !this.toggle ? "" : this.down ? this.toggleCls : ""; 
                if (this.icon.align == "right")
                {
                    data['image1'] = "";
                    data['image2'] = sImage;
                }
                else
                {
                    data['image1'] = sImage;
                    data['image2'] = "";
                }
                data['text'] = this.text;
                data['textcls'] = this.textCls;
                data['textstyle'] = this.textStyle;
                
                var  sHTML = this.tpl.render(data);
                
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                if (typeof this.events.click == "function")
                {
                    $( '#' +  this.id).click(function(e)
                    {                  
                        var wgt = idev.get(this.id);
                        if (!wgt.enabled) return;
                        if (wgt.toggle && !wgt.transparent)
                        {
                            var ok = true;
                            if (wgt.events.canToggle) ok = wgt.events.canToggle(wgt);
                            if (ok)
                            {
                                wgt.toggleButton(wgt.down ? false : true);
                                idev.internal.onClick.call(this,e);
                            }
                        }
                        else
                            idev.internal.onClick.call(this,e);
                    });
                }
                if (!this.enabled) this.enable(false);
                this.rendered = true;
            },
            getText : function()
            {
                return this.text;;
            },
            setText : function(text)
            {
                this.text = text;
                $( '#' +  this.id + '-text' ).html(text);
            },
            enableButton: function(enable)
            {
                this.enabled = enable; 
                if (enable)
                {
                    $("#"+this.id+"-text").removeClass(this.disabledCls);
                }
                else
                {
                    $("#"+this.id+"-text").addClass(this.disabledCls);
                }   
            },
            isEnabled:function()
            {
                return this.enabled;
            },
            isDown:function()
            {
                return this.down;
            },
            toggleButton:function(down)
            {
                if (!this.toggle) return;
                this.down = down;
                if (this.down)
                {
                    $("#"+this.id).addClass(this.toggleCls);
                }
                else
                {
                     $("#"+this.id).removeClass(this.toggleCls);
                }
                if (typeof this.events.ontoggle == "function") this.events.ontoggle(this,down);
            }
        }),
        //------------------------------------------------------------------
        widgetLabel : baseWidget.extend(
        {
            init: function(config)
            {
                config.height = config.height || 30;
                this._super( config );
                this.wtype = "label";
                this.text = config.text == null ? "" : config.text;
				this.title = config.title == null ? false : config.title;
                if (this.text == "") this.text = "";
				if (this.title == true) $("#" + this.id).attr('title',this.text);

                this.tpl = new idev.wTemplate(
                        "<div id='{id}' title='' class='ui-element ui-label {cls}' style='{elementstyle};{style}'>",
                        "{text}",
                        "</div>"
                    );
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var style = this.style;
                var data = new Array();

                if (this.events.click || this.events.dblclick) style += "cursor:pointer";
                
                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls);
                data['elementstyle'] = this.elementStyle;
                data['style'] = style;
                data['text'] = this.text;

                var  sHTML = this.tpl.render(data);

                idev.internal.beforeRender(this);
                $('#' + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
                this.rendered = true;
            },
            setText : function(sHTML)
            {
                this.text = sHTML.replace(/^\s+|\s+$/g,'');
                $("#" + this.id).empty();
                $("#" + this.id).html(this.text);
				if (this.title == true) $("#" + this.id).attr('title',this.text);
            },
            getText : function()
            {
                return this.text;
            },
            setValue: function(v)
            {
                this.setText(v);
            },
            getValue: function(v)
            {
                return this.getText();
            }
        }),
        //------------------------------------------------------------------
        widgetImage : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "image";
                this.src = config.src;
                this.title = config.title || "";
                this.html = config.html || "";
                this.prehtml = config.prehtml || "";
                this.imageWidth = config.imageWidth == null ? this.width : config.imageWidth;
                this.imageHeight = config.imageHeight == null ? this.height : config.imageHeight;
                this.tpl = new idev.wTemplate(
                    "<div class='ui-element' id='{id}' style='{style}'>",
                        "{prehtml}<img id='{id}-image' class='{cls}' src='{src}' style='width:{width}px;height:{height}px;' title='{title}'/>{html}",
                    "</div>" );
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.src == "") return;
                if (this.src == "undefined") return;
                if (this.src == null) return;
                var sHTML = "",style = this.style + this.elementStyle;

                if (this.events.click)  style += "cursor:pointer;";

                var data = new Array();

                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls);
                data['width'] = this.imageWidth == null ? "" : this.imageWidth;
                data['height'] = this.imageHeight == null ? "" : this.imageHeight;
                data['src'] = this.src.toUpperCase() == "BLANK" || this.src == "" ? _preferences.blankimage : this.src;
                data['style'] = style;
                data['title'] = this.title;
                data['prehtml'] = this.prehtml;
                data['html'] = this.html;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
                this.rendered = true;
            },
            setSrc :function(sSrc,width,height)
            {
                width = width || "";
                height = height || "";
                if (width == "" && height == "")
                    $( '#' +  this.id + "-image" ).attr( { src:sSrc.toUpperCase() == "BLANK" || sSrc == "" ? _preferences.blankimage : sSrc });
                else
                {
                    var tpl = new idev.wTemplate("{prehtml}<img id='{id}-image' class='{cls}' src='{src}' style='width:{width}px;height:{height}px;' title='{title}'/>{html}");
                    var data = new Array();
    
                    data['id'] = this.id;
                    data['cls'] = this.cssQuirks(this.cls);
                    data['width'] = width;
                    data['height'] = height;
                    data['src'] = sSrc.toUpperCase() == "BLANK" || sSrc == "" ? _preferences.blankimage : sSrc;
                    data['title'] = this.title;
                    data['prehtml'] = this.prehtml;
                    data['html'] = this.html;
    
                    var  sHTML = tpl.render(data);
                    $( '#' +  this.id).html(sHTML);
                }
            },
            doLayout: function()
            {
                this._super();
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id + "-image").width(w);
                $("#" + this.id + "-image").height(h);
            }
        }),
        //------------------------------------------------------------------
        widgetChart : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "chart";
                this.attr = config.attr;
                this.series = config.series;
                this.options = config.options;

                this.tpl = new idev.wTemplate(
                    "<div id='{id}' class='ui-element' style='{elementstyle}{style};padding:10px;'>",
                    "<div id='{id}-chart' style='width:{width}px;height:{height}px;'></div>",
                    "</div>" );
            },
            setSeries: function(series)
            {
                this.series = series;
                idev.utils.delay(500,function(widget)
                {
                    widget.chart.setData(series);
                    widget.chart.draw();
                },this);
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.series == null) return;
                if (this.options == null) return;
                var sHTML = "",style = this.style + this.elementStyle;

                var data = new Array();

                data['id'] = this.id;
                data['width'] = this.width;
                data['height'] = this.height;
                data['elementstyle'] = this.elementStyle;
                data['style'] = "font-size: 16px;font-family: sans-serif;" + this.style;

                var  sHTML = this.tpl.render(data);

                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.utils.delay(500,function(widget)
                {
                    widget.chart = $.plot($("#"+widget.id+"-chart"), widget.series, widget.options );
                },this);
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
                this.rendered = true;
            },
            doLayout: function()
            {
                this._super();

                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id + "-chart").width(w);
                $("#" + this.id + "-chart").height(h);
                //this.chart = $.plot($("#"+this.id+"-chart"), this.data, this.options );
				this.chart.resize();
                this.chart.setupGrid();
                this.chart.draw();
            }
        }),
        //------------------------------------------------------------------
        widgetSlider : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "slider";
                this.height = config.height == null ? 20 : config.height;
                this.tpl = new idev.wTemplate(
                    "<div id='{id}' class='ui-element' style='{elementstyle};height:{height}px;'>",
                    "<div id='{id}-bar' class='ui-sliderbar ie9gradient' style='position:absolute;left:0px;top:{top}px;width:{width}px;height:{barheight}px;'>",
                    "</div>",
                    "<div id='{id}-slider' class='ui-slider ie9gradient' style='position:absolute;left:0px;top:0px;width:{sliderwidth}px;height:{sliderheight}px;'>",
                    "</div>",
                    "</div>" );
                this.resizer.handlers = "n,s,w,e,"
                
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var data = new Array();

                data['id'] = this.id;
                data['width'] = this.width-2;
                data['height'] = this.height;
                data['barheight'] = this.height/2;
                data['sliderheight'] = this.height-2;
                data['sliderwidth'] = this.height/2;
                data['top'] = this.height/4;
                data['elementstyle'] = this.elementStyle;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                $( '#' +  this.id).mousedown(function(e)
                {
                    var w = parseInt($("#" + this.id).css("width").replace("px",""));
                    if (e.target.id.indexOf("-slider") != -1)
                    {
                        idev._sliderWidget = idev.get(this.id);
                        mpos = idev.utils.mousePosition(e);
                        idev._slider = e.target;
                        idev._sliderpos = parseInt(mpos.x);
                        idev._sliding = true;
                        idev._sliderstart = $(e.target).css("left").replace("px","");
                        idev._sliderwidth = w - (parseInt($(e.target).css("width").replace("px","")) + 2);
                        e.preventDefault();
                    }
                });
                $( '#' +  this.id).mousemove(function(e)
                {
                    if (idev._sliding)
                    {
                        mpos = idev.utils.mousePosition(e);
                        var dx = parseInt(mpos.x) - idev._sliderpos;
                        var left = parseInt(idev._sliderstart) + parseInt(dx);
                        if (left >= 0 && left < idev._sliderwidth)
                            $(idev._slider).css("left",left+"px");
                        e.preventDefault();
                        if (idev._sliderWidget.events.onchange)
                        {
                            idev._sliderWidget.events.onchange(idev._sliderWidget,idev._sliderWidget.getValue());
                        }
                    }
                });
                $( '#' +  this.id).mouseup(function(e)
                {
                    idev._sliding = false;
                });
                if (idev.isTouch())
                {
                    var el = $('#'+this.id);
                    el.addEventListener("touchstart",function(e)
                    {
                        var w = parseInt($("#" +this.id).css("width").replace("px",""));
                        if (e.target.id.indexOf("-slider") != -1)
                        {
                            var touch = e.touches[0];
                            idev._sliderWidget = idev.get(this.id);
                            idev._slider = e.target;
                            idev._sliderpos = touch.pageX ;
                            idev._sliding = true;
                            idev._sliderstart = $(e.target).css("left").replace("px","");
                            idev._sliderwidth = w - (parseInt($(e.target).css("width").replace("px","")));
                        }
                    });
                    el.addEventListener("touchmove",function(e)
                    {
                        if (idev._sliding)
                        {
                            var touch = e.touches[0];
                            var dx = touch.pageX - idev._sliderpos;
                            var left = parseInt(idev._sliderstart) + parseInt(dx);
                            if (left >= 0 && left < idev._sliderwidth)
                                $(idev._slider).css("left",left+"px");
                            e.preventDefault();
                            if (idev._sliderWidget.events.onchange)
                            {
                                idev._sliderWidget.events.onchange(idev._sliderWidget,idev._sliderWidget.getValue());
                            }
                        }
                    });
                    el.addEventListener("touchend",function(e)
                    {
                        idev._sliding = false;;
                    });
                }
                this.rendered = true;
                this.setValue(this.value);
            },
            // Range 0 - 1
            getValue : function()
            {
                var l = parseInt($("#" + this.id + "-slider").css("left").replace("px",""));
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();
                return idev.utils.round(l / (w - h/2 - 2),2);
            },
            setValue : function (value)
            {
                if (value < 0 || value > 1) return;
                var l = parseInt($("#" + this.id + "-slider").css("left").replace("px",""));
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();
                l = (w - h/2 - 2) * value;
                $("#" + this.id + "-slider").css("left",l);
                if (this.events.onchange) this.events.onchange(this,value);
            },
            doLayout: function()
            {
                this._super();

                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id + "-bar").width(w-2);
                $("#" + this.id + "-bar").css("top",h/4);
                $("#" + this.id + "-bar").height(h/2);

                $("#" + this.id + "-slider").width(h/2);
                $("#" + this.id + "-slider").height(h-2);

                this.setValue(this.value);
            },
            beforeResize: function()
            {
                this.value = this.getValue();
            }
        }),
        //------------------------------------------------------------------
        widgetProgress : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "progressbar";

                this.height = config.height == null ? 30 : config.height;
                this.roundCorners = config.roundCorners == null ? false : config.roundCorners;
                this.tpl = new idev.wTemplate(
                    "<div id='{id}' class='ui-element' style='{elementstyle};height:{height}px;'>",
                    "<div id='{id}-bar' class='ui-progressbar ie9gradient' style='position:absolute;left:0px;top:0px;width:{width}px;height:{pheight}px;'>",
                    "</div>",
                    "<div id='{id}-progress' class='ui-progress ie9gradient' style='position:absolute;left:1px;top:1px;width:{progresswidth}px;height:{progressheight}px;'>",
                    "</div>",
                    "</div>" );
                this.resizer.handlers = "n,s,w,e,"
                
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var data = new Array();

                data['id'] = this.id;
                data['width'] = this.width-2;
                data['height'] = this.height;
                data['pheight'] = this.height-2;
                data['progressheight'] = this.height-2;
                data['progresswidth'] = 0;
                data['elementstyle'] = this.elementStyle;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                    $("#" + this.id + "-bar" ).css("border-radius",this.radius + "px");
                    $("#" + this.id + "-bar" ).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id + "-bar" ).css("-webkit-border-radius",this.radius + "px");
                    $("#" + this.id + "-progress" ).css("border-radius",this.radius + "px");
                    $("#" + this.id + "-progress").css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id + "-progress").css("-webkit-border-radius",this.radius + "px");
                }
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                this.rendered = true;
                this.setValue(this.value);
            },
            // Range 0 - 1
            getValue : function()
            {
                var l = parseInt($("#" + this.id + "-progress").css("width").replace("px",""));
                return idev.utils.round(l / (this.width - this.height/2 - 2),2);
            },
            setValue : function (value)
            {
                if (value < 0 || value > 1) return;
                var w = $("#" + this.id).width();
                var l = parseInt($("#" + this.id + "-progress").css("width").replace("px",""));
                l = (w-2) * value;
                $("#" + this.id + "-progress").css("width",l);
            },
            doLayout: function()
            {
                this._super();
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id + "-bar").width(w);
                $("#" + this.id + "-bar").height(h);
                $("#" + this.id + "-progress").height(h);
                this.setValue(this.value);
            },
            beforeResize: function()
            {
                this.value = this.getValue();
            }

        }),
        //------------------------------------------------------------------
        widgetIFrame : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "iframe";
                this.src = this.config.src || "";
                this.noResize = this.config.noResize == null ? false : config.noResize;
                this.tpl = new idev.wTemplate(
                    "<div id='{id}' class='ui-element' style='{elementstyle};{style};'>",
                    "<iframe id='{id}-frame' src='{src}' frameborder=0 style='height:{height}px;width:{width}px;overflow:auto;'>",
                    "</iframe>",
                    "</div>" );
                
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var data = new Array();
                var wgt = this;

                data['id'] = this.id;
                data['width'] = this.width;
                data['height'] = this.height;
                data['src'] = this.src;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                this.rendered = true;
                $('#'+this.id+'-frame').load(function()
                {
                    if (wgt.events.loaded) wgt.events.loaded(wgt);
                });
            },
            getSrc : function()
            {
                return this.src;
            },
            setSrc: function (sSrc)
            {
                $("#" + this.id + "-frame").attr("src",sSrc);
            },
            getFrame:function()
            {
                try
                {
                    return window.frames[this.id+"-frame"];
                }
                catch(e)
                {
                    alert(e.message)
                }
                return null;
            },
            getDocument:function()
            {
                try
                {
                    return window.frames[this.id+"-frame"].contentDocument;
                }
                catch(e)
                {
                    alert(e.message)
                }
                return null;
            },
            getWindow:function()
            {
                try
                {
                    return window.frames[this.id+"-frame"].contentWindow;
                }
                catch(e)
                {
                }
                return null;
            },
            doLayout: function()
            {
                this._super();
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                if (!this.noResize)
                {
                    $("#" + this.id + "-frame").width(w);
                    $("#" + this.id + "-frame").height(h);
                }
            }
        }),
        //------------------------------------------------------------------
        widgetObject : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "object";
                this.src = config.src || "";
                this.type = config.type || "text/html";
                this.noResize = config.noResize == null ? false : config.noResize;
                this.tpl = new idev.wTemplate(
                    "<div id='{id}' class='ui-element' style='{elementstyle};{style};'>",
                    "<object id='{id}-object' type='{type}' data='{src}' style='height:{height}px;width:{width}px;overflow:auto;'></object>",
                    "</div>" );
                
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var data = new Array();
                var wgt = this;

                data['id'] = this.id;
                data['width'] = this.width;
                data['height'] = this.height;
                data['src'] = this.src;
                data['type'] = this.type;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                this.rendered = true;
                $('#'+this.id+'-object').ready(function()
                {
                    // Wait for content to render
                    $delay(200,function(wgt)
                    {
                        if (wgt.events.loaded) wgt.events.loaded(wgt);
                    },wgt);
                });
            },
            getSrc : function()
            {
                return this.src;
            },
            setSrc: function (sSrc)
            {
                $("#" + this.id + "-object").attr("data",sSrc);
            },
            doLayout: function()
            {
                this._super();
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                if (!this.noResize)
                {
                    $("#" + this.id + "-object").width(w);
                    $("#" + this.id + "-object").height(h);
                }
            }
        }),
        //------------------------------------------------------------------
        widgetGrid : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "grid";
                this.ds = config.ds;
                this.cm = config.cm;
                this.headerHeight = 26;
                this.offset = config.offset == null ? 0 : config.offset;
                this.limit = config.limit || 65535;
                this.rowHeight = config.rowHeight == null ? 25 : config.rowHeight;
                config.rowHeight = this.rowHeight;
                this.selectedRow = -1;
				this.selectedCell = -1;
                this.autoSelect = config.autoSelect == null ? true : config.autoSelect; 
                this.dsFilter = config.dsFilter;
                this.editCol = null;
                this.altCls = config.altCls || "ui-grid-cell-alt";
                
                this.tbar = this.config.tbar;
                this.tbarHeight = this.config.tbarHeight || 34;
                this.tbarCls = this.config.tbarCls || "";
                this.tbarStyle = this.config.tbarStyle || "";
                this.tbarConfig = this.config.tbarConfig || {};
                this.tbCreated = false;
                
                this.bbar = this.config.bbar;
                this.bbarHeight = this.config.bbarHeight || 34;
                this.bbarCls = this.config.bbarCls || "";
                this.bbarStyle = this.config.bbarStyle || "";
                this.bbarConfig = this.config.bbarConfig || {};
                this.bbCreated = false;
                
                this.showHeader = config.showHeader == null ? true : config.showHeader; 
                this.editClicks = config.editClicks || 2;
                if (!this.showHeader) this.headerHeight = 0;
                if (this.tbar != null)
                {
                    if (this.tbar instanceof baseWidget)
                    {
                        this.tbCreated = false;
                    }
                    else
                    {
                        if (this.tbarConfig.cls == null) this.tbarConfig.cls = this.tbarCls;
                        if (this.tbarConfig.height == null) this.tbarConfig.height = this.tbarHeight;
                        this.tbarConfig.width = this.width;
                        var tb = new idev.ui.widgetToolbar(this.tbarConfig);
                        tb.widgets = this.tbar;
                        this.tbar = tb;
                        this.tbCreated = true;
                    }
                }
                else
                    this.tbarHeight = 0;
                if (this.bbar != null)
                {
                    if (this.bbar instanceof baseWidget)
                    {
                         this.bbCreated = false;
                    }
                    else
                    {
                        if (this.bbarConfig.cls == null) this.bbarConfig.cls = this.bbarCls;
                        if (this.bbarConfig.height == null) this.bbarConfig.height = this.bbarHeight;
                        this.bbarConfig.width = this.width;
                        var sb = new idev.ui.widgetStatusbar(this.bbarConfig);
                        sb.widgets = this.bbar;
                        this.bbar = sb;
                        this.bbCreated = true;
                    }
                }
                else
                    this.bbarHeight = 0;
                var sTBarHTML = "",sBBarHTML = "";

                if (this.tbar)
                {
                    sTBarHTML = "<div id='{id}-tbar' class='ui-panel-tbar {tbarcls}' style='max-width:{tbarwidth}px;width:{tbarwidth}px;height:{tbarheight}px;{tbarstyle};'>";
                    sTBarHTML += "</div>";
                    if (this.roundCorners && this.title == null)
                    {
                        this.tbarStyle += ";border-top-left-radius:" + (this.radius-2) + "px;";
                        this.tbarStyle += "border-top-right-radius:" + (this.radius-2) + "px;";
                        this.tbarStyle += "-webkit-border-top-left-radius:" + (this.radius-2) + "px;";
                        this.tbarStyle += "-webkit-border-top-right-radius:" + (this.radius-2) + "px;";
                        this.tbarStyle += "-moz-border-top-left-radius:" + (this.radius-2) + "px;";
                        this.tbarStyle += "-moz-border-top-right-radius:" + (this.radius-2) + "px;";
                    }
               }
                if (this.bbar)
                {
                    sBBarHTML = "<div id='{id}-bbar' class='ui-panel-bbar {bbarcls}' style='max-width:{bbarwidth}px;width:{bbarwidth}px;height:{bbarheight}px;{bbarstyle};'>";
                    sBBarHTML += "</div>";
                    if (this.roundCorners)
                    {
                        this.bbarStyle += ";border-bottom-left-radius:" + (this.radius-2) + "px;";
                        this.bbarStyle += "border-bottom-right-radius:" + (this.radius-2) + "px;";
                        this.bbarStyle += "-webkit-border-bottom-left-radius:" + (this.radius-2) + "px;";
                        this.bbarStyle += "-webkit-border-bottom-right-radius:" + (this.radius-2) + "px;";
                        this.bbarStyle += "-moz-border-bottom-left-radius:" + (this.radius-2) + "px;";
                        this.bbarStyle += "-moz-border-bottom-right-radius:" +(this.radius-2) + "px;";
                    }
                }
                this.tpl = new idev.wTemplate(
                    "<div id='{id}' class='ui-element ui-grid' style='{elementstyle}{style}'>",
                    sTBarHTML,
                    "<div id='{id}-body' style='height:{bodyheight}px;'>",
                    "</div>",
                    sBBarHTML,
                    "</div>" );
                
                if (this.ds != null) this.ds.bind(this);
            },
            build : function()
            {
                var sHTML = "";
                this.totalwidth = 0;
                				
                for (var c = 0,count = this.cm.getCount();c < count;c++)
                {
                    this.totalwidth += this.cm.getAt(c).width;
                }
                if (this.showHeader)
                {
                    sHTML = "<table  id='" + this.id + "-grid-header' cellpadding=0 cellspacing=0 width='" +  (this.totalwidth+20) + "px'>";
                    // Add the header
                    sHTML += "<tr>";
                    for (var c = 0,count = this.cm.getCount();c < count;c++)
                    {
                        var col = this.cm.getAt(c);
                        var w = col.width;
                        var sp = 3;
                        var sHeader = col.header;
                        var id = this.id + "-header-" + c;
    
                        if (col.headerRenderer) 
                        {
                            col.parent = this;
                            sHeader = col.headerRenderer.call(col,c);
                        }
                        if(c == 0)
                        {
                            sHTML += "<td id='"+id+"' width=" + (w-1) + " height=" + this.headerHeight + " class='ui-grid-header'><div style='float:left;line-height:"+this.headerHeight+"px;width:" + (w-1) +"px;'><center>" + sHeader + "</center></div></td>";
                        }
                        else if(c == this.cm.getCount()-1)
                        {
                            w += 25;
                            sHTML += "<td id='"+id+"' width=" + w + " height=" + this.headerHeight + " class='ui-grid-header'><div class='ui-grid-separator' style='float:left;width:1px;height:" + this.headerHeight + "px;'></div><div style='float:none;line-height:"+this.headerHeight+"px;width:" + (col.width) +"px;'><center>" + sHeader + "</center></div></td>";
                        }
                        else
                            sHTML += "<td id='"+id+"' width=" + w + " height=" + this.headerHeight + " class='ui-grid-header'><div class='ui-grid-separator' style='float:left;width:1px;height:" + this.headerHeight + "px;'></div><div style='float:none;line-height:"+this.headerHeight+"px;width:" + (col.width) +"px;'><center>" + sHeader + "</center></div></td>";
                    }
                    sHTML += "</tr>";
                    sHTML += "</table>";
                    this.htmlHeader = sHTML;
                }
                else
                    this.htmlHeader = "";
                // Build data grid
                sHTML = "<table id='" + this.id + "-grid' cellpadding=0 cellspacing=0 class='ui-grid-data' width='" +  (this.totalwidth+0) + "px' style:'table-layout:fixed;' >";
                var row = 0;
                for (var r = this.offset, count = this.ds.getCount();r < count && r < this.offset + this.limit;r++)
                {
                    var rec = this.ds.getAt(r);
                    var bAdd = true;

                    if (this.dsFilter)
                    {
                        bAdd = this.dsFilter.call(this,rec,r);
                    }
                    if (bAdd)
                    {            
                        sHTML += "<tr height='" + this.rowHeight + "'>";
                        for (var c = 0, count = this.cm.getCount();c < count;c++)
                        {
                            var col = this.cm.getAt(c);
                            var data = new Array();
                            var style = "";

                            col.index = c;
							col.col = c;
                            if (c == 0) style += "border-left:none;";
                            if (col.renderer != null)
                            {
								col.parent = this;
                                data['value'] = col.renderer(rec.get(col.field),rec,row,c,col);
                            }
                            else
                            {
                                data['value'] = rec.get(col.field);
                            }
                            if (col.style != null) style += col.style;
                            data['id'] = this.id;
                            data['style'] = style + ( col.style || "" );
                            if (r % 2) data['cls'] = this.altCls;
                            if (col.noselect) data['cls'] = null;
                            data['row'] = r;
                            data['col'] = c;
                            data['width'] = col.width-5;
                            data['height'] = this.rowHeight;
                            var value = col.render(data, rec, r, c);
                            sHTML += "<td id='" + this.id + "_" + r + "_" + c + "' style='width:" + col.width + "px;max-width:" + col.width + "px;'>" + value + "</td>";
                        }
                        sHTML += "</tr>";
                        row++;
                    }
                }
                sHTML += "</table>";
                this.htmlData = sHTML;
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.ds == null) return;
                if (this.cm == null) return;

                var bModern = true;

                if (this.border) this.style += "border:" + this.borderStyle;

                this.bodyheight = this.height;

                if (this.tbar) this.bodyheight = this.bodyheight - (parseInt(this.tbarHeight));
                if (this.bbar) this.bodyheight = this.bodyheight - (parseInt(this.bbarHeight));

                var data = new Array();
                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls);
                data['width'] = this.width;
                data['height'] = this.bodyheight - this.headerHeight - this.tbarHeight -  this.bbarHeight;
                data['bodyheight'] = this.bodyheight;
                data['tbarheight'] = this.tbarHeight;
                data['tbarcls'] = this.cssQuirks(this.tbarCls,bModern);;
                data['tbarstyle'] = this.tbarStyle;
                data['bbarheight'] = this.bbarHeight;
                data['bbarcls'] = this.cssQuirks(this.bbarCls,bModern);;
                data['bbarstyle'] = this.bbarStyle;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;

                var sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                if (this.tbar)
                {
                    this.tbar.page = this.page;
                    this.tbar.parent = this;
                    this.tbar.rowHeight = this.tbarHeight - 2;
                    this.tbar.renderTo = this.id + "-tbar";
                    this.tbar.render();
                }
                if (this.bbar)
                {
                    this.bbar.page = this.page;
                    this.bbar.parent = this;
                    this.bbar.rowHeight = this.bbarHeight - 2;
                    this.bbar.renderTo = this.id + "-bbar";
                    this.bbar.render();
                }
                idev.utils.delay(100,function(widget)
                {
                    widget.refresh(true);
                },this);
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                    $("#" + this.id+"-body").css("border-radius",this.radius + "px");
                    $("#" + this.id+"-body").css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id+"-body").css("-webkit-border-radius",this.radius + "px");
                    var r = this.radius-1;
                    if (this.tbar)
                    {
                        $("#" + this.id + "-tbar").css("-moz-border-radius-topleft",r + "px");
                        $("#" + this.id + "-tbar").css("-moz-border-radius-topright",r + "px");
                        $("#" + this.id + "-tbar").css("-webkit-border-radius-topleft",r + "px");
                        $("#" + this.id + "-tbar").css("-webkit-border-radius-topright",r + "px");
                    }
                    else
                    {
                        $("#" + this.id + "-header").css("-moz-border-radius-topleft",r + "px");
                        $("#" + this.id + "-header").css("-moz-border-radius-topright",r + "px");
                        $("#" + this.id + "-header").css("-webkit-border-radius-topleft",r + "px");
                        $("#" + this.id + "-header").css("-webkit-border-radius-topright",r + "px");
                    }
                    if (this.bbar)
                    {
                        $("#" + this.id + "-bbar").css("-moz-border-radius-bottomleft",r + "px");
                        $("#" + this.id + "-bbar").css("-moz-border-radius-bottomright",r + "px");
                        $("#" + this.id + "-bbar").css("-webkit-border-radius-bottomleft",r + "px");
                        $("#" + this.id + "-bbar").css("-webkit-border-radius-bottomright",r + "px");
                    }
                }
            },
            cellClick:function(e)
            {
                if (id == "") id = e.srcElement.parentNode.id;
				var target = e.target != null ? e.target : e.srcElement;
                var id = target.id;
                var p = id.indexOf("-");
                if (p != -1)
                {
                    var sID = id.substr(0,p);
                    var sPos = id.substr(p+6);
                    p = sPos.indexOf("-");
                    if (p == -1)
                        return;
                    var row = sPos.substr(0,p);
                    var c = sPos.substr(p+1);
                    var wgt = idev.get(sID);
                    var col = wgt.cm.getAt(c);

                    if (wgt.editCol)
                    {
                        if (row == wgt.editCol.editRow && c == wgt.editCol.editCol) return;
                        wgt.editCol.endEdit(row);
                        wgt.editCol = null;
                    }
                    if (wgt.events.editclick) 
                    {
                        var ncol = wgt.events.editclick(wgt,col,row,c,e);
                        if (ncol !== null) 
                            col = ncol;
                        else
                            return;
                    }  
					if (wgt.events.celldblclick) wgt.events.celldblclick(wgt,row,c,e);					

                    wgt.selectRow(row);
					wgt.selectCell(row,c);
					
                    if (wgt.editClicks == 1 && col.editor)
					{

						col.edit(row,c);
						wgt.editCol = col
						$("#"+wgt.id).focus();
						$delay(100,function(id)
						{

							var w=$get(id);
							w.focus();
							if(w.wtype=='combo')
								w.events.selected=function(w){
									wgt.editCol.endEdit(row);
									wgt.editCol = null;
								}

							else
								w.events.lostfocus = function(w){
									wgt.editCol.endEdit(row);
									wgt.editCol = null;
								}

						},wgt.editCol.editID);
						return;
					}
					var cellid = wgt.id + "_" + row + "_" + c;
					$('#' + cellid).keyup(function(e){
						if(e.which>36 && e.which<41 || e.which==13){
							c = parseInt(c,10);
							row = parseInt(row,10);
							var moveto;
							if(e.which==37){//left
								if(c==0) return;
								moveto = wgt.id + "-cell-" + (row) + "-" + (c-1);
							}
							if(e.which==38){//up
								if(row==0) return;
								moveto = wgt.id + "-cell-" + (row-1) + "-" + (c);
							}
							if(e.which==39){//right
								var max = wgt.cm.getCount()-1;
								if(c==max) return;
								moveto = wgt.id + "-cell-" + (row) + "-" + (c+1);
							}
							if(e.which==40){//down
								var max = wgt.ds.getCount()-1;
								if(row==max) return;
								moveto = wgt.id + "-cell-" + (row+1) + "-" + (c);
							}
							if(e.which==13){//enter
								if(wgt.cm.getAt(c).editor) {
									var enterEdit = wgt.id + "-cell-" + (row) + "-" + (c);
									$('#' + enterEdit).focus();
									$('#' + enterEdit).dblclick();
								} else {
									moveto = wgt.id + "-cell-" + (row) + "-" + (c);
								}
							}
							$('#' + cellid).unbind();
							$('#' + moveto).focus();
							$delay(0, function(){
								$('#' + moveto).click();
							});
						}
					});
					$('#' + cellid).blur(function(){
						$('#' + cellid).unbind();
					});
                    if (col.events != null)
                    {
                        if (col.events.click) col.events.click(wgt,row,col,e);
                    }
					if (wgt.events.click) wgt.events.click(wgt,e);
                    if (wgt.events.rowclick) wgt.events.rowclick(wgt,row,e);
                    if (wgt.events.cellclick) wgt.events.cellclick(wgt,row,c,e);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            },
            cellDblClick:function(e)
            {
				if (id == "") id = e.srcElement.parentNode.id;
				var target = e.target != null ? e.target : e.srcElement;
                var id = target.id;
                //$debug(e);
				//if (id == "") id = e.srcElement.parentNode.id;
				//var id = e.srcElement.id;
                var p = id.indexOf("-");
                if (p != -1)
                {
                    var sID = id.substr(0,p);
                    var sPos = id.substr(p+6);
                    p = sPos.indexOf("-");
                    if (p == -1)
                        return;
                    var row = sPos.substr(0,p);
                    var c = sPos.substr(p+1);
                    var wgt = idev.get(sID);
                    var col = wgt.cm.getAt(c);

                    if (wgt.editCol)
                    {
                        if (row == wgt.editCol.editRow && c == wgt.editCol.editCol) return;
                        wgt.editCol.endEdit();
                        wgt.editCol = null;
                    }
                    if (wgt.events.editclick) 
                    {
                        var ncol = wgt.events.editclick(wgt,col,row,c,e);
                        if (ncol) col = ncol;
                    }
                    wgt.selectRow(row);
                    if (wgt.editClicks == 2 && col.editor)
                    {
                        col.edit(row,c);
                        wgt.editCol = col
                        $("#"+wgt.id).focus();
                        $delay(100,function(id)
                        {
                            $get(id).focus();
                        },wgt.editCol.editID);
                    }
                    if (col.events != null)
                    {
                        if (col.events.click) col.events.click(wgt,row,col,e);
                        if (col.events.dblclick) col.events.dblclick(wgt,row,c,e);
                    }
                    if (wgt.events.dblclick) wgt.events.dblclick(wgt,e);
                    if (wgt.events.rowclick) wgt.events.rowclick(wgt,row,e);
                    if (wgt.events.cellclick) wgt.events.cellclick(wgt,row,c,e);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            },
            refresh: function(bInitial)
            {
                var tpl;
                
                if (this.ds == null) return;
                if (this.cm == null) return;

                if (this.events.beforeRefresh) this.events.beforeRefresh(this);
                if (this.events.beforerefresh) this.events.beforerefresh(this);
                if (this.showHeader)
                {
                    tpl = new idev.wTemplate(
                        "<div id='{id}-header' class='ui-grid-header' style='height:{headerheight}px;overflow:none;'>",
                        "{header}",
                        "</div>",
                        "<div id='{id}-data' class='ui-grid-data' style='width:{width}px;height:{height}px;overflow:auto;'>",
                        "{data}",
                        "</div>" );
                }
                else
                {
                    tpl = new idev.wTemplate(
                        "<div id='{id}-data' class='ui-grid-data' style='width:{width}px;height:{height}px;overflow:auto;'>",
                        "{data}",
                        "</div>" );
                }
                if (this.border) this.style += "border:" + this.borderStyle;
                this.build();
                var data = new Array();
                data['id'] = this.id;
                data['width'] = this.width;
                data['headerwidth'] = this.width + 250;
                data['height'] = this.height - this.headerHeight - this.tbarHeight -  this.bbarHeight;
                data['headerheight'] = this.headerHeight;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;
                data['header'] = this.htmlHeader;
                data['data'] = this.htmlData;

                var topoffset = 0;
                var leftoffset = 0;
                
                if (bInitial) this.selectedRow = -1;
                if(this.selectedRow > -1)
                {
                    topoffset = $("#"+this.id + "-data").scrollTop();
                    leftoffset = $("#"+this.id + "-data").scrollLeft();
                }
                var sHTML = tpl.render(data);

                $("#"+ this.id + "-body").html(sHTML);

                if (bInitial) idev.internal.afterRender(this);
                if(this.selectedRow > -1)
                {
                    for (var c = 0, count = this.cm.getCount();c < count;c++)
                    {
                        var col = this.cm.getAt(c);
                        if (col.noselect) continue;
                        var id = this.id + "-cell-" + this.selectedRow + "-" + c;
                        $('#'+id).addClass("ui-grid-cell-select");
                    }
                    if(topoffset > 0 || leftoffset > 0)
                    {
                    $("#"+this.id + "-data").scrollTop(topoffset);
                    $("#"+this.id + "-data").scrollLeft(leftoffset);
                    }
                }
                if (this.events.contextMenu || this.events.contextmenu) this.addEvent("contextmenu",idev.internal.onContextMenu);
                for (var c = 0, count = this.cm.getCount();c < count;c++)
                {
                    var col = this.cm.getAt(c);
                    if (typeof this.events.headerClick == "function")
                    {
                        var id = this.id + "-header-" + c;

                        $("#"+id).click({ 'widget':this, 'column':col },function(e)
                        {
                            e.data.widget.events.headerClick(e.data.widget,e.data.column,e);
                        });
                    }
                }
                for (var r = this.offset, count = this.ds.getCount();r < count && r < this.offset + this.limit;r++)
                {
                    for (var c = 0;c < this.cm.getCount();c++)
                    {
                        var id = this.id + "-cell-" + r + "-" + c;

                        $("#"+id).click(this.cellClick);
                        $("#"+id).dblclick(this.cellDblClick);
                    }
                }
                $( '#' +  this.id + "-data" ).scroll(function()
                {
                    var p = this.id.indexOf("-");
                    var sID = this.id.substr(0,p);
                    var wgt = idev.get(sID);
                    if (wgt.showHeader)
                    {
                        var sID = this.id.replace("-data","") + "-header";
                        var w = $("#" + this.id).width()
    
                        pos = this.scrollLeft;
                        $("#" + sID).scrollLeft(pos);
                    }
                });
                for (var c = 0, count = this.cm.getCount();c < count;c++)
                {
                    var col = this.cm.getAt(c);
                    col.parent = this;
                    if (col.events != null)
                    {
                        if (col.events.afterender) col.events.afterender(this,c);
                    }
                }
                if (this.events.afterRefresh) this.events.afterRefresh(this);
                if (this.events.afterrefresh) this.events.afterrefresh(this);
                this.rendered = true;
            },
            selectRow : function(row)
            {
                if (this.autoSelect == false) return;
                if (this.selectedRow != -1)
                {
                    for (var c = 0, count = this.cm.getCount();c < count;c++)
                    {
                        var id = this.id + "-cell-" + this.selectedRow + "-" + c;
                        $('#'+id).removeClass("ui-grid-cell-select");
                    }
                }
                for (var c = 0, count = this.cm.getCount();c < count;c++)
                {
                    var col = this.cm.getAt(c);
                    if (col.noselect) continue;
                    var id = this.id + "-cell-" + row + "-" + c;
                    $('#'+id).addClass("ui-grid-cell-select");
                }
                this.selectedRow= row;
            },
			selectCell: function(row,col) {
				if (this.autoSelect == false) return;
				if (this.selectedRow != -1)
                {
					var id = this.id + "-cell-" + row + "-" + col;
					$('#'+id).removeClass("ui-grid-cell-select");
				}
				if (this.selectedCell != -1)
				{
					var id = this.id + "-cell-" + this.selectedCell;
					$('#'+id).removeClass("ui-grid-cell-select-active");
				}
				var id = this.id + "-cell-" + row + "-" + col;
				var w = this;
				$('#'+id).addClass("ui-grid-cell-select-active");
				$('#'+id).blur(function(){
					if($('[id^=' + w.id + '-cell-' + row + '-]:focus').length == 0) {
						$('#'+id).removeClass("ui-grid-cell-select");
						$('#'+id).removeClass("ui-grid-cell-select-active");
						$('[id^=' + w.id + '-cell-' + row + '-]').removeClass("ui-grid-cell-select");		
					}
				});
				this.selectedCell= row+'-'+col;
			},
            getSelected:function()
            {
                return this.selectedRow;
            },
            getStore: function()
            {
                return this.ds;
            },
            ondestroy:function()
            {
                if (this.ds)
                {
                    if (this.ds.autoDestroy) delete this.ds;
                }
                if (this.tbCreated) this.tbar.destroy();
                if (this.bbCreated) this.bbar.destroy();
            },
            doLayout: function()
            {
                this._super();

                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();
                $("#" + this.id + "-data").height(h - this.headerHeight);
                $("#" + this.id + "-data").width(w);
            }
        }),
        //------------------------------------------------------------------
		widgetTabPanel : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "tabpanel";
                this.tabWidth = config.tabWidth || 90;
                this.tabHeight = config.tabHeight || 25;
                this.tabScrollWidth = config.tabScrollWidth || 25;
                this.tabStyle = config.tabStyle || "";
                this.contentStyle = config.contentStyle || "";
                this.activeTab = config.activeTab || 0;
                this.tabScroll = false;
                this.startTab = 0;
                this.radius = config.radius || 6;
                var sLeftBtn = "",sRightBtn = "";

                if (this.tabWidth * this.widgets.length > this.width)
                {
                    sLeftBtn = "<li unselectable='on' id='{id}-tableft' style='width:"+this.tabScrollWidth+"px;height:{tabheight}px;'><div id='{id}-tableft-body' class='ui-tab-scroll unselectable'>&laquo;</div></li>";
                    sRightBtn = "<li unselectable='on' id='{id}-tabright' style='float:right;width:"+this.tabScrollWidth+"px;height:{tabheight}px;'><div id='{id}-tabright-body' class='ui-tab-scroll ui-tab-scroll-active unselectable'>&raquo;</div></li>";
                    this.tabScroll = true;
                } else {
                    sLeftBtn = "<li unselectable='on' id='{id}-tableft' style='width:0px;height:{tabheight}px;'><div id='{id}-tableft-body' class='ui-tab-scroll unselectable'>&laquo;</div></li>";
                    sRightBtn = "<li unselectable='on' id='{id}-tabright' style='float:right;width:0px;height:{tabheight}px;'><div id='{id}-tabright-body' class='ui-tab-scroll unselectable'>&raquo;</div></li>";
                    this.tabScroll = true;		
				}

                this.tpl = new idev.wTemplate(
                    "<div id='{id}' class='ui-element ui-tabpanel' style='{elementstyle};{style}'>",
                    "<ul class='ui-tabs' style='height:"+(this.tabHeight-2)+"px;width:{contentwidth}px;'>",
                    sLeftBtn,
                    "{tabs}",
                    sRightBtn,
                    "</ul>",
                    "<div id='{id}-panels' class='ui-tab-content' style='width:{contentwidth}px;height:{contentheight}px;{contentstyle}'>",
                    "{panels}",
                    "</div>",
                    "</div>" );
                
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.widgets == null) return;

                var sTabs = "";
                var sPanels = "";
                var w = 0;

                for (var i = 0;i < this.widgets.length;i++)
                {
                    if (this.widgets[i].tabTitle == null) this.widgets[i].tabTitle = this.widgets[i].title || "";
                    var title =this.widgets[i].tabTitle;
                    w += this.tabWidth;

                    title = "<div class='ui-tab' style='position:relative;height:"+(this.tabHeight-2)+"px;'><div class='ui-tab-text' style='position:absolute;left:1px;width:" + (this.tabWidth-2) + "px;'><span unselectable='on' class='unselectable' id='"+this.id+"-tab-text" + i + "'>"+title+"</span><div id='" + this.id + "-tabclose" + i + "' class='ui-tab-btn-close' style='display:none;position:absolute;top:0px;right:2px;'></div></div>";
                    if (w > this.width - (this.tabScrollWidth*2))
                        sTabs += "<li class='ui-tab ie9gradient' style='display:none;width:" + this.tabWidth + "px;height:"+(this.tabHeight-2)+"px;" + this.tabStyle + ";' id='" + this.id + "-tab" + i + "' >" + title + "</li>";
                    else
                    {
                        sTabs += "<li class='ui-tab ie9gradient' style='width:" + this.tabWidth + "px;height:"+(this.tabHeight-2)+"px;" + this.tabStyle + ";' id='" + this.id + "-tab" + i + "' >" + title + "</li>";
                    }
                    sPanels += "<div class='ui-tab-content' style='display:none;width:{width}px;height:{height}px;' id='" +  this.id + "-panel" + i + "'>";
                    sPanels += "</div>";
                }
				this.visibleTabs = Math.floor((this.width - (this.tabScrollWidth*2))/this.tabWidth);
                var data = new Array();

                data['id'] = this.id;
                data['width'] = this.width-2;
                data['height'] = this.height-this.tabHeight;
                data['contentwidth'] = this.width-2;
                data['contentheight'] = this.height-this.tabHeight-2;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;
                data['contentstyle'] = this.contentStyle;
                data['tabheight'] = this.tabHeight;
                data['tabwidth'] = this.tabWidth;
                data['tabs'] = sTabs;
                data['panels'] = sPanels;

                var  sHTML = this.tpl.render(data);

                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.utils.delay(100,function(widget)
                {
                    for (var i = 0;i < widget.widgets.length;i++)
                    {
                        var sID = widget.id + "-panel" + i;
                        var element = widget.widgets[i];
                        var lborder = parseInt($('#'+widget.id+"-panels").css("borderLeftWidth"));
                        var rborder = parseInt($('#'+widget.id+"-panels").css("borderRightWidth"));

                        element.renderTo = sID;
                        element.width = widget.width-(1+lborder+rborder);
                        element.deferredRender = true;
                        element.title = null;
                        element.height = widget.height-widget.tabHeight-2;
                        element.cls = element.cls || "";
                        element.cls += " ui-tab-panel";
                    }
                    widget.showTab(widget.activeTab);
                    for (var i = 0;i < widget.widgets.length;i++)
                    {
                        $("#"+ widget.id + "-tab" + i).click(widget,function(ev)
                        {
                            var activeTab = this.id.replace(ev.data.id+"-tab","");
                            ev.data.showTab(activeTab);
                            return false;
                        });
                        $("#"+widget.id + "-tabclose" + i).click(widget,function(ev)
                        {
                            var tab = this.id.replace(ev.data.id+"-tabclose","");
                            ev.data.closeTab(tab)
                        });
                    }
                    $("#"+widget.id + "-tableft").click(function()
                    {
                        widget.showTab("left");
                        return false;
                    });
                    $("#"+widget.id + "-tabright").click(function()
                    {
                        widget.showTab("right");
                        return false;
                    });
                },this);
                idev.internal.afterRender(this);
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-bottom-left-radius",this.radius + "px");
                    $("#" + this.id).css("border-bottom-right-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-bottom-left-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-bottom-right-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-bottom-left-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-bottom-right-radius",this.radius + "px");
                    var r = this.radius;
                    if (this.border) r--;
                    $("#" + this.id + "-panels").css("border-bottom-left-radius",r + "px");
                    $("#" + this.id + "-panels").css("border-bottom-right-radius",r + "px");
                    $("#" + this.id + "-panels").css("-moz-border-bottom-left-radius",r + "px");
                    $("#" + this.id + "-panels").css("-moz-border-bottom-right-radius",r + "px");
                    $("#" + this.id + "-panels").css("-webkit-border-bottom-left-radius",r + "px");
                    $("#" + this.id + "-panels").css("-webkit-border-bottom-right-radius",r + "px");
                }
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                this.rendered = true;
            },
            setTabTitle:function(tab,title)
            {
                if (tab < 0 || tab >= this.widgets.length) return;
                $("#"+this.id+"-tab-text"+tab).html(title); 
            },
			addTab: function(tabConfig)
            {
                var o = idev.utils.clone(tabConfig);
                var widget = this;
                var tab = this.widgets.length;
                var tabTitle = "";
                if (o.title != null) tabTitle = o.title;
                if (o.tabTitle != null) tabTitle = o.tabTitle;
                o.tabTitle = tabTitle; //Preserve the title from future use
                var sTab = "";

                o.title = "<div class='ui-tab' style='position:relative;height:"+(this.tabHeight-2)+"px;'><div style='position:absolute;left:1px;width:" + (this.tabWidth-2) + "px;'><center><span id='"+this.id+"-tab-text" + tab + "'>"+o.tabTitle+"</span></center></div><div id='" + this.id + "-tabclose" + tab + "' class='ui-tab-btn-close' style='display:none;position:absolute;top:0px;right:2px;'></div></div>";
                if (this.widgets.length+1 >= this.startTab+this.visibleTabs)
                {
                    sTab = "<li style='display:none;width:" + this.tabWidth + "px;height:"+(this.tabHeight-2)+"px;" + this.tabStyle + ";' id='" + this.id + "-tab" + tab + "' >" + o.title + "</li>";
                }
                else
                    sTab = "<li style='width:" + this.tabWidth + "px;" + this.tabStyle + ";' id='" + this.id + "-tab" + this.widgets.length + "' >" + o.title + "</li>";
                var sPanel = "<div class='ui-tab-content' style='display:none;' id='" +  this.id + "-panel" + this.widgets.length + "'></div>";
                o.renderTo = this.id + "-panel" + tab;
                o.title = null;
                o.width = this.width-2;
                o.deferredRender = true;
                o.height = this.height-this.tabHeight-2;
                $("#"+this.id+"-tabright").before(sTab);
                $("#"+this.id+"-panels").append(sPanel);
                $("#"+this.id + "-tab" + tab).click(this,function(ev)
                {
                    var activeTab = this.id.replace(ev.data.id+"-tab","");
                    ev.data.showTab(activeTab);
                    return false;
                });
                $("#"+this.id + "-tabclose" + tab).click(this,function(ev)
                {
                    var tab = this.id.replace(ev.data.id+"-tabclose","");
                    widget.closeTab(tab)
                    return false;
                });
                this.widgets.push(o);
                this.showTab( tab );
            },
            closeTab: function(tab)
            {
                if (typeof tab == "string") tab = parseInt(tab);
                if (tab < 0 || tab >= this.widgets.length) return false;

                if (this.events.beforeCloseTab)
                {
                    if (this.events.beforeCloseTab(this,tab) === false) return;
                }
                var id = this.id + "-tab" + tab;
                $("#"+id).remove();
                id = this.id + "-panel" + tab;
                $("#"+id).remove();
                if(this.widgets[tab].id != null) try {$get(this.widgets[tab].id).destroy() } catch(e) {};
                for (var i = tab+1;i < this.widgets.length;i++)
                {
                    // Renumber tab elements
                    var id = this.id + "-tab" + i;
                    var newid = this.id + "-tab" + (i-1);
                    var element = this.widgets[i];

                    $("#"+id).attr("id",newid);
                    id = this.id + "-panel" + i;
                    newid = this.id + "-panel" + (i-1);
                    $("#"+id).attr("id",newid);
                    element.renderTo = newid;
                    id = this.id + "-tabclose" + i;
                    newid = this.id + "-tabclose" + (i-1);
                    $("#"+id).attr("id",newid);
                }
                this.widgets.splice(tab,1);
                var sID = "";

                if (this.startTab + this.visibleTabs-1 >= this.widgets.length)
                {
                    this.startTab--;
                    if (this.startTab >= 0)
                    {
                        sID = this.id + "-tab" + this.startTab;
                        $("#"+sID).css("display","block");
                    }
                    else
                    {
                        this.startTab = 0;
                        $("#"+this.id+"-tableft").hide();
                        $("#"+this.id+"-tabright").hide();
                    }
                }
                else
                {
                    sID = this.id + "-tab" + (this.startTab + this.visibleTabs-1);
                    $("#"+sID).css("display","block");
                }
                if (tab == this.activeTab)
                {
                    if (tab == this.widgets.length) tab--;
                    if (this.widgets.length == 0) return;
                    this.showTab( tab );
                }
                if (this.events.afterCloseTab)
                {
                    this.events.afterCloseTab(this,tab);
                }
                return true;
            } ,
            showTab: function(tab)
            {
                var leftID = "#"+this.id + "-tableft-body";
                var rightID = "#"+this.id + "-tabright-body";
				var leftTabID = "#"+this.id + "-tableft";
                var rightTabID = "#"+this.id + "-tabright";

                if (this.widgets.length == 0) return;
                if (typeof this.events.beforeShowTab == "function")
                {
                    if (this.events.beforeShowTab(this,tab) === false) return;
                }
                if(tab == "left")
                {
                    if (this.startTab == 0) return;
                    this.startTab--;

                    var sShowID = this.id + "-tab" + this.startTab;
                    var sHideID = this.id + "-tab" + (this.startTab + this.visibleTabs);

                    $("#"+sHideID).css("display","none");
                    $("#"+sShowID).css("display","block");

                    $(rightID).addClass("ui-tab-scroll-active");
					$(rightTabID).width(this.tabScrollWidth);
					$(leftTabID).width(this.tabScrollWidth);
                    if (this.startTab == 0) $(leftID).removeClass("ui-tab-scroll-active");
                    return;
                }
                if(tab == "right")
                {
                    if (this.startTab + 1 + this.visibleTabs > this.widgets.length) return;

                    var sHideID = this.id + "-tab" + this.startTab;
                    var sShowID = this.id + "-tab" + (this.startTab + this.visibleTabs);

                    $("#"+sHideID).css("display","none");
                    $("#"+sShowID).css("display","block");

					$(leftID).addClass("ui-tab-scroll-active");
					$(rightTabID).width(this.tabScrollWidth);
					$(leftTabID).width(this.tabScrollWidth);
                    if (this.startTab + 1 + this.visibleTabs == this.widgets.length) $(rightID).removeClass("ui-tab-scroll-active");
                    this.startTab++;
                    return;
                }
                if (tab > this.widgets.length) return;
                if (tab < 0) return;
                while (tab < this.startTab)
                {
					this.startTab--;
                    var sShowID = this.id + "-tab" + this.startTab;
                    var sHideID = this.id + "-tab" + (this.startTab + this.visibleTabs);

                    $("#"+sHideID).css("display","none");
                    $("#"+sShowID).css("display","block");

                    $(rightID).addClass("ui-tab-scroll-active");
					$(rightTabID).width(this.tabScrollWidth);
					$(leftTabID).width(this.tabScrollWidth);
                    if (this.startTab == 0) $(leftID).removeClass("ui-tab-scroll-active");
                }
                while (tab > this.startTab+this.visibleTabs-1)
                {
						var sHideID = this.id + "-tab" + this.startTab;
						var sShowID = this.id + "-tab" + (this.startTab + this.visibleTabs);
						$("#"+sHideID).css("display","none");
						$("#"+sShowID).css("display","block");

					$(leftID).addClass("ui-tab-scroll-active");
					$(rightTabID).width(this.tabScrollWidth);
					$(leftTabID).width(this.tabScrollWidth);
                    if (this.startTab + 1 + this.visibleTabs == this.widgets.length) $(rightID).removeClass("ui-tab-scroll-active");
                    this.startTab++;
                }
                var sID = this.id + "-panel" + this.activeTab;
                $("#"+this.id + "-tabclose" +  this.activeTab ).css("display","none");
                this.activeTab = tab;
                for (var i = 0;i < this.widgets.length;i++)
                {
                    $("#" + this.id + "-tab" + i).removeClass("active");
                }
                $("#"+sID).css("display","none");
                $("#" + this.id + "-tab" + this.activeTab).addClass("active").show(); //Activate first tab
                if (this.widgets[tab].closable)
                {
                    $("#"+this.id + "-tabclose" +  tab ).css("display","block");
                }
                activeTab = this.id + "-panel" + this.activeTab;
                if (this.widgets[tab].deferredRender)
                {
                    var sID = this.id + "-panel" + tab;
                    var element = this.widgets[tab];
                    element.deferredRender = false;
                    element.parent = this;
                    idev.internal.renderWidget( this.page, element );
                    $("#" + activeTab).show(); //Fade in the active ID content
                    var wgt = $get(element.id);
                    if (wgt.events)
                    {
                        if(wgt.events.show) 
                        {
                            wgt.events.show(wgt);
                        }
                    }
                }
                else
                {
                    $("#" + activeTab).show(); //Fade in the active ID content
                    var wgt = $get(this.widgets[tab].id);
                    if (wgt.events)
                    {
                        if(wgt.events.show) 
                        {
                            wgt.events.show(wgt);
                        }
                    }
                }
                if (this.events.showTab)
                {
                    this.events.showTab(this,activeTab);
                }
            },
            onshow:function()
            {
                this._super();
                if (idev.isIE8())
                {
                    for (var i = 0;i < this.widgets.length;i++ )
                    {
                        var wgt = idev.get(this.widgets[i].id);
                        try{ wgt.onshow(); } catch(e) { }
                    }
                }
            }
        }),
        //------------------------------------------------------------------
        widgetIcon : baseWidget.extend(
        {
            init: function(config)
            {
                config.hideType = "visibility";
                if (config.width == null) config.width = 24;
                if (config.height == null) config.height = 24;
                this._super( config );
                this.wtype = "icon";
                this.icon = config.icon == null ? "" : config.icon;
                this.background = config.background == null ? false : config.background;
                this.resizer.resizable = false;
                this.color = config.color || "black";
                this.backgroundColor = config.backgroundColor || '#ddd';
                this.scale = config.scale || 0.7;
                this.xoffset = config.xoffset == null ? -5 : config.xoffset;
                this.yoffset = config.yoffset == null ? -5 : config.yoffset;
                this.title = config.title || "";
                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element {cls}' style='{elementstyle};{style}' title='{title}'>",
                        "</div>"
                    );

                
            },
            drawIcon:function()
            {
                this.paper = Raphael(this.id,this.width, this.height);
                this.paper.safari();
                var sIcon = "";
                if (this.icon != "")
                {
                    sIcon = eval("icon."+this.icon);
                }
                if (sIcon != "")
                {
                    if (this.background)
                    {
                        var c = this.paper.circle(this.width/2,this.height/2,(this.width/2)-2);
                        c.attr({fill: this.backgroundColor, stroke:'none'});
                    }
                    this.ic = this.paper.path(sIcon).attr({fill: this.color, stroke: "none"});
                    if (this.ic)
                    {
                        this.ic.scale( this.scale, this.scale );
                        this.ic.translate(this.xoffset,this.yoffset);
                    }
                }
                if (typeof this.events.click == "function")
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (typeof this.events.dblclick == "function")
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.icon == "") return;
                var data = new Array();
                data['id'] = this.id;
                data['width'] = this.width;
                data['height'] = this.height;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style  + (this.events.click ? "cursor:pointer;" : "");
                data['cls'] = "";
                data['title'] =  this.title;
                var sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                // This delay is because safari and chrome miss render the canvas
                idev.utils.delay(100,function(widget)
                {
                    widget.drawIcon();
                    idev.internal.afterRender(widget);
                },this);
                this.rendered = true;
            },
            refresh:function()
            {
                if (this.paper) this.paper.remove();
                this.drawIcon();
            }
        }),
        //------------------------------------------------------------------
        widgetElement : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "element";
                this.data = config.data;
                this.tpl = config.tpl;
                if (typeof this.tpl == "string")
                    this.tpl = new idev.wTemplate(this.tpl);
                this.bodyStyle = this.config.bodyStyle || "";
                
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.tpl == null) return;

                var data = new Array();

                data['id'] = this.id;
                data['bodystyle'] = this.bodyStyle;
                data['width'] = this.width;
                data['height'] = this.height;
                data['text'] = this.text;
                data['color'] = this.color;
                if ( this.data != null )
                {
                    for (var i = 0;i < this.data.length;i++)
                    {
                        data.push( this.data[i] );
                    }
                }
                var sDIV = "<div id='{id}' class='ui-element'>";

                sDIV = "<div id='{id}' class='ui-element' style='" + this.elementStyle + ";"+this.style+"'>";
                var  sHTML = sDIV + this.tpl.render(data) + "</div>";
                sHTML = sHTML.replace("{id}",this.id);
                idev.internal.beforeRender(this);
                $('#' +this.renderTo).append(sHTML);
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                }
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
                this.rendered = true;
            }
        }),
        //------------------------------------------------------------------
        widgetComposite : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "composite";
                this.data = config.data;
                this.bodyStyle = this.config.bodyStyle || "";
                this.columnAlign = this.config.columnAlign || "CENTER";

                this.layout = config.layout == null ? "column" : config.layout;
                if (this.layout == "fit" || this.layout == "frame" || this.layout == "accordion") this.layout = "column";
                this.labelwidth = config.labelwidth == null ? 70 : config.labelwidth;
                this.cls = config.cls || "";
                
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.tpl == null) return;

                if (this.parent.layoutConfig)
                {
                    if (this.parent.layoutConfig.fit)
                    {
                        this.width = this.parent.getWidth();
                    }
                }
                var data = new Array();

                data['id'] = this.id;
                data['bodystyle'] = this.bodyStyle;
                data['width'] = this.width;
                data['height'] = this.height;
                data['text'] = this.text;
                data['color'] = this.color;
                if ( this.data != null )
                {
                    for (var i = 0;i < this.data.length;i++)
                    {
                        data.push( this.data[i] );
                    }
                }
                sHTML = "<div id='{id}' class='ui-element "+this.cssQuirks(this.cls)+"' style='" + this.elementStyle + ";"+this.style+"'></div>";
                sHTML = sHTML.replace("{id}",this.id);
                idev.internal.beforeRender(this);
                $('#' +this.renderTo).append(sHTML);
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                }
                if (this.widgets)
                {
                    idev.internal.renderWidgets( this.page, this.id, this.widgets, this.layout, this.labelwidth, this );
                }
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
                this.rendered = true;
            },
            onshow:function()
            {
                this._super();
                if (idev.isIE8())
                {
                    for (var i = 0;i < this.widgets.length;i++ )
                    {
                        var wgt = idev.get(this.widgets[i].id);
                        try{ wgt.onshow(); } catch(e) { }
                    }
                }
                for (var i = 0;i < this.children.length;i++ )
                {
                    try{ this.children[i].show(); } catch(e) { }
                }
            },
            doLayout: function()
			{

				this._super();
				var w = $("#" + this.parent.id).width();
				var spacer = w,spacerFound = false,variableID;
				$("#"+this.id).width(w);
				$("#"+this.id+"-table").width(w);
				for(var i = 0;i < this.widgets.length;i++)
				{

					if (this.widgets[i] != ">>")
					{

						if (this.widgets[i].variable) 
							variableID = this.widgets[i].id;
					}

					else if (this.widgets[i] === ">>")
					{

						spacerFound = true;
						$('#' + this.widgets[i] + "-spacer").width(0);
						$('#' + this.widgets[i] + "-spacer").css("max-width","0px");
					}
				}


				if(!spacerFound && variableID)
				{

					$("#"+variableID).width(0);
					$("#"+variableID).css("max-width",0);
				}

				if (spacerFound || variableID)
				{

					$delay(0, function(wgt) {
						for (var i = 0;i < wgt.widgets.length;i++) {
							spacer -= $('#' + wgt.widgets[i].id).outerWidth(true);
						}

						if(spacer<0) spacer =0;
						if(spacerFound) var id = wgt.id + "-spacer";
						else var id = variableID;
						$("#"+id).width(spacer);
						$("#"+id).css("max-width",spacer);
					},this);
				}
			}


        }),
        //------------------------------------------------------------------
        widgetSpacer : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "spacer";

                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element' style='{elementstyle}{style}'>",
                        "<img src='" + idev.blankimage + "' style='width:{width}px;height:{height}px;'/>",
                        "</div>"
                    );

                
            },
            render : function()
            {
                if (this.renderTo == null) return;
                var data = new Array();
                data['id'] = this.id;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;
                data['width'] = this.width || 1;
                data['height'] = this.height || 1;
                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $('#' +this.renderTo).append(sHTML);
                this.rendered = true;
            }
        }),
        //------------------------------------------------------------------
        widgetHTML : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "html";
                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element' style='{elementstyle}'>",
                        "{html}",
                        "</div>"
                    );
                
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.html == null) return;

                var data = new Array();

                data['id'] = this.id;
                data['elementstyle'] = this.elementStyle;
                data['html'] = this.html;

                var  sHTML = this.tpl.render(data);
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                this.rendered = true;
            }
        }),
        //------------------------------------------------------------------
        widgetCanvas : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "canvas";
                this.paper = null;

                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element{cls}' style='width:{width}px;height:{height}px;{style}'>",
                        "{text}",
                        "</div>"
                    );

                
            },
            render : function()
            {
                var style = this.style + this.elementStyle;

                if (this.renderTo == null) return;

                var data = new Array();

                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls);
                data['style'] = style;
                data['width'] = this.width;
                data['height'] = this.height;

                var  sHTML = this.tpl.render(data);

                $("#" + this.renderTo).append(sHTML);

                idev.internal.beforeRender(this);
                this.paper = new Raphael($('#'+this.id) , this.width, this.height);
                idev.internal.afterRender(this);
                if (this.events.click)
                {
                    $( '#' +  this.id ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    $( '#' +  this.id ).dblclick(idev.internal.onDblClick);
                }
                this.rendered = true;
            },
            getPaper : function()
            {
                return this.paper;
            }
        }),
        //------------------------------------------------------------------
        widgetListItem : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "listitem";
                this.icon = config.icon == null ? "" : config.icon ;
                this.image = config.image == null ? "" : config.image ;
                this.text = config.text == null ? "" : config.text ;
                this.textStyle = config.textStyle == null ? "" : config.textStyle;
                this.widgetWidth = config.widgetWidth == null ? 30 : config.widgetWidth;
                this.widget = config.widget;
                this.index = config.index;
                this.itemHeight = config.itemHeight == null ? 40 : config.itemHeight;
                this.background = config.background;
                this.selectable = config.selectable == null ? true : config.selectable;

                if ((idev.isWebkit() || idev.isFF()) && !idev.isPalm())
                    this.width -= 2;
                else
                    this.width -= 4;

                this.html += this.text;

                this.tpl = new idev.wTemplate(
                    "<div id='{id}' class='ui-element {cls}' style='width:{width}px;padding:2px;{style}'>",
                    "<table cellspacing=0 cellpadding=0 height={itemheight}><tr>",
                    "<tr>",
                    "{item}",
                    "</tr>",
                    "</table>",
                    "</div>" );
                
            },
            render : function()
            {
                if (this.renderTo == null) return;

                var sItem = "",sCls,style = this.style;

                sCls = "ui-listbox-item ie9gradient";
                style += "background-position:bottom;background-repeat: repeat-x;";
                if (this.parent)
                {
                    if (this.index == this.parent.items.length-1)
                    {
                        sCls = "ui-listbox-item-last";
                    }
                }
                if (this.image != "")
                {
                    sItem = "<td width='50px'><img src='" + this.image + "' style=''></td>";
                }
                if (this.widget)
                {
                    if (this.widget.wtype != "icon")  // This is fix because IE gets it wrong
                        sItem = "<td d='" + this.id + "-text'align='left' valign=center width='" + (this.width-this.widgetWidth) + "'' ><div class='ui-listbox-text' style='" + this.textStyle + "'>" + this.html + "</div></td><td id='" + this.id + "-widget' width=" + this.widgetWidth + " valign=top style='padding-top:5;'></td>";
                    else
                        sItem = "<td d='" + this.id + "-text'align='left' valign=center width='" + (this.width-this.widgetWidth) + "'><div class='ui-listbox-text' style='" + this.textStyle + "'>" + this.html + "</div></td><td id='" + this.id + "-widget' width=" + this.widgetWidth + "></td>";
                }
                else
                {
                    this.widget = { wtype:'icon', icon: this.icon, background: this.background };
                    sItem = "<td id='" + this.id + "-text' align='left' valign=center width='" + (this.width-this.widgetWidth) + "'><div class='ui-listbox-text' style='" + this.textStyle + "'>" + this.html + "</div></td><td id='" + this.id + "-widget' width=" + this.widgetWidth + "></td>";
                }

                var data = new Array();

                data['id'] = this.id;
                data['cls'] = sCls;
                data['width'] = this.width;
                data['itemheight'] = this.itemHeight;
                data['style'] = style;
                data['item'] = sItem;

                var  sHTML = this.tpl.render(data);

                $("#" + this.renderTo + "-body").append(sHTML);
                if (this.widget)
                {
                    if (this.widget.wtype != null)
                    {
                        if (this.widget.wtype == "icon")
                        {
                            if (this.widget.icon != "")
                            {
                                this.widget.renderTo = this.id + '-widget';
                                this.widget.id = idev.internal.renderWidget( this.page, this.widget );
                            }
                        }
                        else
                        {
                            this.widget.renderTo = this.id + '-widget';
                            this.widget.id = idev.internal.renderWidget( this.page, this.widget );
                        }
                    }
                }
                $( '#' +  this.id ).click(function(e)
                {
                    var widget = idev.get(this.id);
                    if (widget.enabled)
                    {
                        widget.select();
                        if (widget.events)
                            if (widget.events.click)
                                widget.events.click(widget,widget.index,e);
                    }
                });
                $( '#' +  this.id ).dblclick(function(e)
                {
                    var widget = idev.get(this.id);
                    if (widget.enabled)
                    {
                        widget.select();
                        if (widget.events)
                            if (widget.events.dblclick)
                                widget.events.dblclick(widget,widget.index,e);
                    }
                });
                this.rendered = true;
            },
            select:function()
            {
                if (!this.selectable) return false;
                if (this.parent.selected != null)
                {
                    $("#" + this.parent.selected).removeClass("ui-listbox-select");
                }
                $("#" + this.id).addClass("ui-listbox-select");
                this.parent.selected = this.id;
                return true;
            },
            syncWidth:function()
            {
                var w = $("#" + this.parent.id).width();

                 $("#" + this.id).width(w);
                 $("#" + this.id + "-text").width(w - this.widgetWidth);
            }
        }),
        //------------------------------------------------------------------
        widgetListbox : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "listbox";
                this.title = config.title == null ? "" : config.title;
                this.titleHeight = config.titleHeight == null ? 30: config.titleHeight;
                this.titleStyle = config.titleStyle == null ? "": config.titleStyle;
                this.items = config.items;
                this.background = config.background == null ? true : config.background;

                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element ui-listbox {extracls} {cls}' style='overflow:hidden;{elementstyle};{style}'>",
                        "<div id='{id}-header' class='{headercls}' style='max-width:{width}px;width:{width}px;height:{titleheight}px;{titlestyle}'>",
                        "<center>",
                        "{title}",
                        "</center>",
                        "</div>",
                        "<div id='{id}-body' class='{bodycls}' style='width:{width}px;'>",
                        "</div>",
                        "</div>"
                    );
                
            },
            render : function()
            {
                if (this.renderTo == null) return;
                var data = new Array();
                data['id'] = this.id;
                data['width'] = this.width;
                data['height'] = this.height;
                data['titleheight'] = this.titleHeight;
                data['titlestyle'] = this.titleStyle;
                data['extracls'] = "curved";
                data['cls'] = this.cssQuirks(this.cls);
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;
                data['headercls'] = "ui-listbox-header ie9gradient";
                data['title'] = this.title;
                data['bodycls'] = "ui-listbox-body";

                var sHTML = this.tpl.render(data);

                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                if (this.items)
                {
                    for(var i = 0;i < this.items.length;i++)
                    {
                        var item = this.items[i];
                        if (item.text != "")
                        {
                            item.index = i;
                            item.background = this.background;
                            item.wgt = this.add( item );
                        }
                    }
                }
                idev.internal.afterRender(this);
                this.rendered = true;
            },
            add : function( config )
            {
                config.renderTo = this.id;
                if (config.width == null) config.width = this.width;
                config.page = this.page;
                config.parent = this;
                var wgt = new idev.ui.widgetListItem( config );
                wgt.parent = this;
                wgt.render();
                return wgt;
            },
            get : function( index )
            {
                if (index < 0) return null;
                if (index >= this.items.length) return null
                return this.items[index].wgt ;
            },
            doLayout: function()
            {
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id + "-header").width(w);
                $("#" + this.id + "-body").width(w);
                for(var i = 0;i < this.items.length;i++)
                {
                    var item = this.items[i];

                    item.wgt.syncWidth();
                }
            }
        }),
        //------------------------------------------------------------------
        widgetList : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "list";
                this.tpl = config.tpl == null ? "" : config.tpl;
                this.offset = config.offset || 0;
                this.limit = config.limit || 65535;
                this.selected = -1;
                this.dsFilter = config.dsFilter;
                this.itemStyle = config.itemStyle || "";
                this.itemCls = config.itemCls || "";
                this.backgroundStyle = config.backgroundStyle || "";
                this.metaData = config.metaData;
                this.autoSelect = config.autoSelect;
                this.selectColor = config.selectColor;
                this.selectCls = config.selectCls || "";
                this.renderer = config.renderer;
                this.emptyText = config.emptyText == null ? false : config.emptyText;
                if (this.selectColor != "" ||this.selectCls != "") this.autoSelect = true;

                this.template = new idev.wTemplate(
                        "<div id='{id}' class='ui-element' style='{elementstyle};'>",
                        "<div id='{id}-background' style='position:absolute;left:0px;top:0px;width:{width}px;max-width:{width}px;height:{height}px;max-height:{height}px;{backgroundstyle}'>",
                        "</div>",
                        "<div id='{id}-wrapper' class='ui-list {cls}' style='position:absolute;left:0px;top:0px;width:{wwidth}px;max-width:{wwidth}px;height:{height}px;max-height:{height}px;{style};'>",
                        "<div id='{id}-scroller'>",
                        "{items}",
                        "</div>",
                        "</div>",
                        "</div>"
                    );

                this.itemtpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-listentry {itemcls}' style='width:{width}px;max-width:{width}px;{itemstyle}'>",
                        "{entry}",
                        "</div>"
                    );
                
                if (this.ds != null) this.ds.bind(this);
                if (this.itemCls != "") this.itemCls += "  ie9gradient";
                if (this.selectCls != "") this.selectCls += "  ie9gradient";
            },
            buildList : function()
            {
                var sHTML = "";

                var tpldata = new Array();

                for (var i = this.offset, count = this.ds.getCount();i < count && i < this.offset + this.limit;i++)
                {
                    var sEntry = "";
                    var style = "";
                    var rec = this.ds.getAt(i);
                    var bAdd = true;

                    if (this.dsFilter)
                    {
                        bAdd = this.dsFilter.call(this,rec);
                    }
                    if (bAdd)
                    {
                        if (typeof this.tpl == "object")
                        {
                            sEntry  = this.tpl.render(this.data);
                        }
                        else
                            sEntry  = this.tpl;
                        for (var f = 0, fcount = this.ds.fieldCount();f < fcount;f++)
                        {
                            var sFld = this.ds.getFieldName(f);
                            var trys = 20;

                            while (sEntry.indexOf("{" + sFld + "}") != -1 && trys > 0)
                            {
                                sEntry = sEntry.replace("{" + sFld + "}",rec.get(sFld) == "" ? "&nbsp;" : rec.get(sFld) );
                                trys--;
                            }
                        }
                        if (this.data)
                        {
                            for(var key in this.data)
                            {
                                var f = this.data[key];
                                
                                if (typeof f == "string" || typeof f == "number")
                                    sEntry = idev.utils.replaceAll(sEntry,"{" + key + "}",this.data[key]);
                            }  
                        }                        
                        if (this.renderer) sEntry = this.renderer(this,sEntry,rec,i);
                        tpldata['id'] = this.id + "_" + i;
                        tpldata['width'] = this.width;
                        tpldata['entry'] = sEntry;
                        tpldata['itemstyle'] = this.itemStyle;
                        tpldata['itemcls'] = this.itemCls;
                        if (this.events.click) style = "cursor:pointer;";
                        tpldata['style'] = style;
						if(this.metaData){
							for(var k in this.metaData){
								tpldata[k] = this.metaData[k];
							}
						}
                        sHTML += this.itemtpl.render(tpldata);
                    }
                }
                if(this.ds.getCount() == 0 && this.emptyText)
                {
                    tpldata['id'] = this.id + "_emptyText";
                    tpldata['width'] = this.width;
                    tpldata['entry'] = this.emptyText;
                    tpldata['itemstyle'] = this.itemStyle + "font-style:italic;";
                    tpldata['itemcls'] = this.itemCls;
                    if (this.events.click) style = "cursor:pointer;";
                    tpldata['style'] = style;
                    sHTML += this.itemtpl.render(tpldata);
                }
                return sHTML;
            },
            refresh : function()
            {
                var sID = this.id;

                if (this.events.beforeRefresh) this.events.beforeRefresh(this);
                if (this.events.beforerefresh) this.events.beforerefresh(this);
                var sHTML = this.buildList();
                $("#"+sID+"-scroller").html(sHTML);
                for (var i = 0, count = this.ds.getCount();i < count;i++)
                {
                    $( '#' +  this.id + "_" + i ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    for (var i = 0, count = this.ds.getCount();i < count;i++)
                    {
                        $( '#' +  this.id + "_" + i ).dblclick(idev.internal.onDblClick);
                    }
                }
                if (this.autoScroll && idev.isTouch())
                {
					var wgt=this;
                    setTimeout(function()
                    {
                        if(wgt.iScroll)wgt.iScroll.refresh();
                    },500);
                }
                this.selected = -1;
                this.scrollPos = 0;
                if (this.events.afterRefresh) this.events.afterRefresh(this);
                if (this.events.afterrefresh) this.events.afterrefresh(this);
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.ds == null) return;
                var style = this.style;

                if (this.autoScroll && !idev.isTouch())
                {
                     style += "overflow:auto;overflow-x:hidden; overflow-y:auto;";
                }
                var data = new Array();

                data['id'] = this.id;
                data['style'] = style;
                data['cls'] = this.cssQuirks(this.cls);
                data['elementstyle'] = this.elementStyle;
                data['backgroundstyle'] = this.backgroundStyle;
                data['width'] = this.width;
                data['wwidth'] = this.width - (this.border ? 2 : 0);
                data['height'] = this.height;// - (this.border ? 2 : 0) - 2; to fix combobox
                data['items'] =  "";

                var  sHTML = this.template.render(data);

                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);

                idev.internal.afterRender(this);
                if (this.autoScroll && idev.isTouch())
                {
                    $delay(400,function(widget)
                    {
                        widget.iScroll = new iScroll($('#' + widget.id + "-scroller"),{bounce:false});
                    },this);
                }
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                    var r = this.radius;
                    if (this.border) r--;
                    $("#" + this.id + "-background").css("border-radius",r + "px");
                    $("#" + this.id + "-background").css("-moz-border-radius",r + "px");
                    $("#" + this.id + "-background").css("-webkit-border-radius",r + "px");
              }
                this.rendered = true;
                this.refresh();
            },
            getStore: function()
            {
                return this.ds;
            },
            getSelected: function()
            {
                return this.selected;
            },
            getItemId: function(index)
            {
                return this.id + index;
            },
            updateItem: function(index,propertyName,value)
            {
                $( '#' +  this.id + "_" + index ).css(propertyName,value);
            },
			select: function(idx)
            {
				$( '#' +  this.id + "_" + this.selected).removeClass(this.selectCls);
				$( '#' +  this.id + "_" + idx).addClass(this.selectCls);
                this.selected = idx;
            },
            setScrollPos:function(pos)
            {
                $("#"+this.id+"-wrapper").scrollTop(pos);
                this.scrollPos = $("#"+this.id+"-wrapper").scrollTop();
            },
            getScrollPos:function()
            {
                return this.scrollPos;
            },
            onhide:function()
            {
                this.scrollPos = $("#"+this.id+"-wrapper").scrollTop();
            },
            ondestroy:function()
            {
                if (this.ds)
                {
                    if (this.ds.autoDestroy) delete this.ds;
                }
            },
            doLayout: function()
            {
                this._super();
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id+"-wrapper").css("width",w);
                $("#" + this.id+"-wrapper").css("max-width",w);
                $("#" + this.id+"-wrapper").css("height",h);
                $("#" + this.id+"-wrapper").css("max-height",h);
                this.refresh()
                this._super();

            },
            clearSelection: function()
            {
                this.selected = -1;
            }
        }),
        //------------------------------------------------------------------
        widgetDataView : baseWidget.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "dataview";
                if (config.template != null)
                    this.tpl = config.template;
                else
                    this.tpl = config.tpl == null ? "<div class='ui-listentry'></div>" : config.tpl;
                this.columns = config.columns == null ? 2 : config.columns;
                this.roundCorners = config.roundCorners == null ? false : config.roundCorners;
                this.radius       = idev.convertNulls(this.config.radius,4);
                this.autoSelect = config.autoSelect;
                this.selectColor = config.selectColor || "";
                this.selectCls = config.selectCls || "ui-dataview-select";
                this.entryCls = config.entryCls || "";
                if (this.selectColor != "" || this.selectCls != "") this.autoSelect = true;
                this.offset = config.offset || 0;
                this.limit = config.limit || 65535;
                this.entryWidth = config.entryWidth;
                this.entryHeight = config.entryHeight;
                this.swipeDelay = config.swipeDelay == null ? 3000 : config.swipeDelay;
                this.selected = -1;
				this.renderer = config.renderer;
                this.dsFilter = config.dsFilter;

                this.basetpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element ui-dataview {cls}' style='{elementstyle};{style}'>",
                        "<div id='{id}-wrapper' style='position:relative;left:0px;top:0px;width:{width}px;max-width:{width}px;height:{height}px;max-height:{height}px;{bodystyle}'>",
                        "<div id='{id}-scroller'  class='ui-scroller' style=''>",
                        "{items}",
                       "</div>",
                       "</div>",
                        "</div>"
                    );

                if (typeof this.tpl == "string")
                {
                    if (this.entryWidth)
                    {
                         this.tpl=  this.tpl.replace("{entrywidth}",this.entryWidth);
                    }
                    if (this.entryHeight)
                    {
                         this.tpl =  this.tpl.replace("{entryheight}",this.entryHeight);
                    }
                }
                if (config.autoHeight) this.height = null;
                
                if (this.ds != null) this.ds.bind(this);
                if (this.selectCls != "") this.selectCls += "  ie9gradient";
                if (this.entryCls != "") this.entryCls += "  ie9gradient";
            },
            buildList : function()
            {
                var sHTML = "<table>";
                var col = 0;
                var cellstyle = '';

                if (this.events.click || this.events.dblclick) cellstyle += "cursor:pointer;";
                if (this.columns == "auto")
                {
                    sHTML = "";
                    for (var i = this.offset, count = this.ds.getCount();i < count && i < this.offset + this.limit;i++)
                    {
                        var sEntry = "";
                        var rec = this.ds.getAt(i);
                        var bAdd = true;
    
                        if (this.dsFilter)
                        {
                            bAdd = this.dsFilter.call(this,rec);
                        }
                        if (bAdd)
                        {
                            if (typeof this.tpl == "string")
                                sEntry = this.tpl;
                            else
                            {
                                sEntry = this.tpl.get();
                                if (this.entryWidth)
                                {
                                     sEntry =  sEntry.replace("{entrywidth}",this.entryWidth);
                                }
                                if (this.entryHeight)
                                {
                                     sEntry =  sEntry.replace("{entryheight}",this.entryHeight);
                                }
                            }
                            for (var f = 0, fcount = this.ds.fieldCount();f < fcount;f++)
                            {
                                var sFld = this.ds.getFieldName(f);
    
                                sEntry = idev.utils.replaceAll(sEntry,"{" + sFld + "}",rec.get(sFld));
                            }
                            if (this.data)
                            {
                                for(var key in this.data)
                                {
                                    var f = this.data[key];
                                    
                                    if (typeof f == "string" || typeof f == "number")
                                        sEntry = idev.utils.replaceAll(sEntry,"{" + key + "}",this.data[key]);
                                }  
                            }
    						if (this.renderer) sEntry = this.renderer(this,sEntry,rec,i);
                            sHTML += "<div id='" + this.id + "_" + i + "' class='ui-dataview-wrapper "+this.entryCls+"' style='float:left;"+cellstyle+"'>" + sEntry + "</div>";
                        }
                    }
                    return sHTML;
                }
                sHTML += "<tr>";
                for (var i = this.offset, count = this.ds.getCount();i < count && i < this.offset + this.limit;i++)
                {
                    var sEntry = "";
                    var rec = this.ds.getAt(i);
                    var bAdd = true;

                    if (this.dsFilter)
                    {
                        bAdd = this.dsFilter.call(this,rec);
                    }
                    if (bAdd)
                    {
                        if (typeof this.tpl == "string")
                            sEntry = this.tpl;
                        else
                        {
                            sEntry = this.tpl.get();
                            if (this.entryWidth)
                            {
                                 sEntry =  sEntry.replace("{entrywidth}",this.entryWidth);
                            }
                            if (this.entryHeight)
                            {
                                 sEntry =  sEntry.replace("{entryheight}",this.entryHeight);
                            }
                        }
                        for (var f = 0, fcount = this.ds.fieldCount();f < fcount;f++)
                        {
                            var sFld = this.ds.getFieldName(f);

                            sEntry = idev.utils.replaceAll(sEntry,"{" + sFld + "}",rec.get(sFld));
                        }
                        if (this.data)
                        {
                            for(var key in this.data)
                            {
                                var f = this.data[key];
                                
                                if (typeof f == "string" || typeof f == "number")
                                    sEntry = idev.utils.replaceAll(sEntry,"{" + key + "}",this.data[key]);
                            }  
                        }                        
                        sHTML += "<td valign=top><div id='" + this.id + "_" + i + "' class='ui-dataview-wrapper ui-dataview-element "+ this.entryCls + "' style='"+cellstyle+"'>" + sEntry + "</div></td>";
                        col++;
                        if (col == this.columns)
                        {
                            sHTML += "</tr>";
                            sHTML += "<tr>";
                            col = 0;
                        }
                    }
                }
                sHTML += "</tr>";
                sHTML += "</table>";
                return sHTML;
            },
            refresh : function()
            {
                var sID = this.id;

                if (this.events.beforeRefresh) this.events.beforeRefresh(this);
                if (this.events.beforerefresh) this.events.beforerefresh(this);
                var sHTML = this.buildList();
                $("#"+sID + "-scroller").html(sHTML);
                if (this.autoScroll && idev.isTouch())
                {
                    sID = this.id + "-scroller";
                    $delay(500,function(widget){
                        widget.iScroll.refresh();
                    },this);
                }
                for (var i = 0, count = this.ds.getCount();i < count;i++)
                {
                    $( '#' +  this.id + "_" + i ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    for (var i = 0, count = this.ds.getCount();i < count;i++)
                    {
                        $( '#' +  this.id + "_" + i ).dblclick(idev.internal.onDblClick);
                    }
                }
                if (this.events.hover)
                {
                    for (var i = 0, count = this.ds.getCount();i < count;i++)
                    {
                        $( '#' +  this.id + "_" + i ).hover(idev.internal.onHoverIn,idev.internal.onHoverOut);
                    }
                }
                this.selected = -1;
                if (this.events.afterRefresh) this.events.afterRefresh(this);
                if (this.events.afterrefresh) this.events.afterrefresh(this);
            },
            render : function()
            {
                if (this.renderTo == null) return;
                if (this.ds == null) return;

                var style = this.style;
                var bodystyle = "";
                if (this.border) style += "border: 1px solid " + this.borderColor + ";";

                if (this.autoScroll && !idev.isTouch())
                {
                     bodystyle += ";overflow:auto;";
                }
                var data = new Array();
                var w = this.width - (this.border ? 1 : 0);
                var h = this.height - (this.border ? 1 : 0)

                if (this.roundCorners)
                {
                    w -= this.radius;
                    h -= this.radius;
                    bodystyle += "margin:2px;";
                }
                data['id'] = this.id;
                data['cls'] = this.cssQuirks(this.cls);
                data['style'] = style;
                data['bodystyle'] = bodystyle;
                data['width'] = w;
                data['height'] = h;
                data['elementstyle'] = this.elementStyle;
                data['items'] =  this.buildList();

                var  sHTML = this.basetpl.render(data);
                delete data;
                idev.internal.beforeRender(this);
                $("#" + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                for (var i = 0, count = this.ds.getCount();i < count;i++)
                {
                    $( '#' +  this.id + "_" + i ).click(idev.internal.onClick);
                }
                if (this.events.dblclick)
                {
                    for (var i = 0, count = this.ds.getCount();i < count;i++)
                    {
                        $( '#' +  this.id + "_" + i ).dblclick(idev.internal.onDblClick);
                    }
                }
                if (this.events.hover)
                {
                    for (var i = 0, count = this.ds.getCount();i < count;i++)
                    {
                        $( '#' +  this.id + "_" + i ).hover(idev.internal.onHoverIn,idev.internal.onHoverOut);
                    }
                }
                if (this.roundCorners)
                {
                    $("#" + this.id).css("border-radius",this.radius + "px");
                    $("#" + this.id).css("-moz-border-radius",this.radius + "px");
                    $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
                    var r = this.radius;
                    if (this.border) r--;
                    $("#" + this.id + "-wrapper").css("border-radius",r + "px");
                    $("#" + this.id + "-wrapper").css("-moz-border-radius",r + "px");
                    $("#" + this.id + "-wrapper").css("-webkit-border-radius",r + "px");
                }
                if (this.autoScroll && idev.isTouch())
                {
                    idev.utils.delay(1000,function(widget)
                    {
                        widget.iScroll = new iScroll($('#' + widget.id + "-scroller"));
                    },this);

                }
                this.rendered = true;
            },
            updateItem: function(index,propertyName,value)
            {
                $( '#' +  this.id + "_" + index ).css(propertyName,value);
            },
            getSelected: function()
            {
                return this.selected;
            },
            select: function(row)
            {
                if(this.selected!=-1)
                {
                    $( '#' +  this.id + "_" + this.selected).addClass(this.entryCls);
                    $( '#' +  this.id + "_" + this.selected).removeClass(this.selectCls);
                }
                if(row!=-1){
                    $( '#' +  this.id + "_" + row).removeClass(this.entryCls);
                    $( '#' +  this.id + "_" + row).addClass(this.selectCls);
                }
                this.selected = row;
            },
            getStore: function()
            {
                return this.ds;
            },
            ondestroy:function()
            {
                if (this.ds)
                {
                    if (this.ds.autoDestroy) delete this.ds;
                }
            },
            doLayout: function()
            {
                this._super();
                var w = $("#" + this.id).width();
                var h = $("#" + this.id).height();

                $("#" + this.id+"-wrapper").css("width",w);
                $("#" + this.id+"-wrapper").css("max-width",w);
                $("#" + this.id+"-wrapper").css("height",h);
                $("#" + this.id+"-wrapper").css("max-height",h);
                this.refresh()
            }
        }),
        //------------------------------------------------------------------
        widgetSound : baseWidget.extend(
        {
            init: function(config)
            {
                config.width = 0;
                config.height = 0;
                this._super( config );
                this.wtype = "sound";
                this.src = config.src;

                this.tpl = new idev.wTemplate(
                        "<div id='{id}' class='ui-element' style='{elementstyle};'>",
                        "<audio id='{id}-player' src='{src}'></audio>",
                        "</div>"
                    );

                
            },
            render : function()
            {
                var style = this.style + this.elementStyle;

                if (this.renderTo == null) return;

                var data = new Array();
                data['id'] = this.id;
                data['elementstyle'] = this.elementStyle;
                data['style'] = this.style;
                data['src'] = this.src;

                var  sHTML = this.tpl.render(data);
                $("#" + this.renderTo).append(sHTML);
                idev.internal.afterRender(this);
                this.rendered = true;
            },
            play : function()
            {
                var audio = $("#" + this.id + "-player");
                var track = audio.get(0);
                track.pause();
                audio.currentTime -= 30.0;
                track.play();
            }
        })

    }, // End of widgets
    //////////////////////////////////////////////////////////////////////////
    //  User eXtensions based the baseWidget class;
    /*
    */
    //////////////////////////////////////////////////////////////////////////
    ux: {
        loadCSS: function(css,callback)
        {
            try
            {
                if (callback == null) callback = idev.internal.callback;
                idev.internal.addStyleSheet(_preferences.libpath+"ux/"+css,callback);
            }
            catch(e)
            {
                idev.errorHandler(e.message);
            }
        },
        loadScript: function(script,callback,scope)
        {
            try
            {
                if (callback == null) callback = idev.internal.callback;
                if (script.indexOf("http://") != -1 || script.indexOf("https://") != -1)
                    idev.internal.addScript(script,callback,scope);
                else
                    idev.internal.addScript(_preferences.libpath+"ux/"+script,callback,scope);
            }
            catch(e)
            {
                idev.errorHandler(e.message);
            }
        }
    },
    //////////////////////////////////////////////////////////////////////////
    //  Extension function to extend the base iDevUI framework;
    /*
        These are widgets that are based on other core widgets
    */
    //////////////////////////////////////////////////////////////////////////
    extensions: function()
    {
        this.ui.widgetToolbar = this.ui.widgetComposite.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "toolbar";
                this.layout = "column";
                this.defaultType = "button";
                this.padding = this.padding || 2;
                
            }
        });
        this.register("toolbar",this.ui.widgetToolbar);
        this.ui.widgetStatusbar = this.ui.widgetComposite.extend(
        {
            init: function(config)
            {
                this._super( config );
                this.wtype = "statusbar";
                this.layout = "column";
                this.defaultType = "button";
                this.padding = this.padding || 2;
                
            }
        });
        this.register("statusbar",this.ui.widgetStatusbar);
        this.ui.widgetWindow = this.ui.widgetPanel.extend(
        {
            init: function(config)
            {
                if (config.x == null) config.x = $("#container").width()/2 - config.width/2;
                if (config.y == null) config.y = $("#container").height()/2 - config.height/2;
                config.renderTo = "container";
                config.frame = true;
                config.closable = idev.convertNulls(config.closable,true);
                config.panelCls = config.panelCls || 'ui-window';
                config.backgroundCls = config.backgroundCls || "ui-window-background";
                this._super( config );
                this.wtype = "window";
                this.draggable = idev.convertNulls(config.draggable,true);
                this.autoDestroy = true;
                this.autoClose = idev.convertNulls(config.autoClose,false);
                if(this.autoClose) this.modal=true; 
                
            },
            render: function()
            {
                this._super();
                if(this.autoClose)
                {
                    var win = this;
                    $( '#' +  this.maskID ).click(function(){
                        win.close();
                    });
                }
            },
            show: function()
            {
                if (this.rendered)
                    this._super();
                else { 
                    this.render();
                    this._super();
                }
            }
        });
        this.ui.widgetForm = this.ui.widgetPanel.extend(
        {
            init: function(config)
            {
                config.layout = 'form';
                this._super(config);
                this.wtype = 'formpanel';
                this.dataRec = config.dataRec;
                
                if (this.dataRec != null) this.dataRec.bind(this);
            },
            render:function()
            {
                this._super();
                $delay(200,function(wgt)
                {
                    wgt.setValues();
                },this);
            },
            getFieldWidget:function(field)
            {
                var scope = {
                    action:3,
                    field:field,
                    widget:null
                };
                idev.utils.form.action(this, scope);
                return scope.widget;
            },
            getFieldConfig:function(field,json,config)  //Only real parameter is field the others are for internal use
            {
                if (json === null) json = this.config;
                if (field == null || field == "") return null;
                for (var i = 0;i < json.widgets.length;i++)
                {
                    var fld = json.widgets[i].field;
                    if (fld == field) 
                    {
                        config = json.widgets[i];
                        break;
                    }
                    if (json.widgets[i].widgets) 
                    {
                        config = this.getFieldConfig(field,json.widgets[i],config);
                        if (config != null) break;
                    }
                }
                return config;
            },
            getValues:function()  // Returns an array of values with field names as keys
            {
                return  this.action(this,{
                        action:0
                    });
            },
            clearValues:function()
            {
                return  this.action(this,{
                        action:1
                    });
            },
            setValues:function(rec)
            {
                if (rec == null) rec = this.dataRec;
                this.action(this,{
                        action:2,
                        rec:rec
                    });
                if (this.events.onSetValues) this.events.onSetValues(this,rec);
            },
            setDataRec:function(rec)
            {
                if (rec == null) return false;
                this.dataRec = rec;
                this.dataRec.bind(this);
                this.setValues();
                return true;
            },
            commit:function(rec)
            {
                if (rec == null) rec = this.dataRec;
                if (rec == null) return;
                this.action(this,{
                        action:4,
                        rec:rec
                    });
                if (this.events.onCommit) this.events.onCommit(this);
                return true;
            },
            setEditable:function(editable)
            {
                return  this.action(this,{
                        action:5,
                        editable:editable
                    });
            },
            // None public method
            action:function(panel,scope)
            {
                if (scope.data == null) scope.data = new Array();
                
                for (var i = 0;i < panel.children.length;i++)
                {
                    var tp = panel.children[i].wtype;
                    
                    if (tp != "button" && 
                        tp != "icon" &&
                        tp != "image" &&
                        tp != "label" &&
                        tp != "spacer" &&
                        tp != "dataview" &&
                        tp != "tabpanel" &&
                        tp != "grid")
                        {
                            if (tp == "composite")
                            {
                                this.action(panel.children[i],scope); 
                            }
                            else if (tp == "panel")
                            {
                                this.action(panel.children[i],scope); 
                            }
                            else switch(scope.action)
                            {
                                case 0:
                                    scope.data.push(panel.children[i].getValue()); 
                                    if (typeof panel.children[i].field == "string" && panel.children[i].field != "")
                                        scope.data[panel.children[i].field] = panel.children[i].getValue();   
                                    break
                                case 1:
                                    panel.children[i].setValue("");    
                                    break
                                case 2:
                                    if (typeof panel.children[i].field == "string" && panel.children[i].field != "")
                                    {
                                        if (scope.rec)
                                            panel.children[i].setValue(scope.rec.get(panel.children[i].field));
                                        else     
                                            panel.children[i].setValue("");
                                    }
                                    break
                                case 3:
                                    if (panel.children[i].field == scope.field)
                                    {
                                        scope.widget = panel.children[i];
                                        return;
                                    }     
                                    break
                                case 4:
                                    if (typeof panel.children[i].field == "string" && panel.children[i].field != "")
                                    {
                                        scope.rec.set(panel.children[i].field,panel.children[i].getValue(),true);
                                    }
                                    break
                                case 5:
                                    if (panel.children[i].wtype == "input" || panel.children[i].wtype == "textarea")
                                    {
                                        panel.children[i].setEditable(scope.editable);
                                    }
                                    break
                            }
                        }
                    else if (scope.action == 3 && panel.children[i].field == scope.field)
                    {
                        scope.widget = panel.children[i];
                        return;
                    }     
                    
                }
                return scope.data;
            }
        });
        this.register("formpanel",this.ui.widgetForm);
        this.ui.widgetFormWindow = this.ui.widgetForm.extend(
        {
            init: function(config)
            {
                if (config.x == null) config.x = $("#container").width()/2 - config.width/2;
                if (config.y == null) config.y = $("#container").height()/2 - config.height/2;
                config.renderTo = "container";
                config.frame = true;
                config.closable = idev.convertNulls(config.closable,true);
                config.panelCls = config.panelCls || 'ui-window';
                config.backgroundCls = config.backgroundCls || "ui-window-background";
                this._super( config );
                this.wtype = "formwindow";
                this.draggable = idev.convertNulls(config.draggable,true);
                this.autoDestroy = true;
                this.autoClose = idev.convertNulls(config.autoClose,false);
                if(this.autoClose) this.modal=true; 
                
            },
            render: function()
            {
                this._super();
                if(this.autoClose)
                {
                    var win = this;
                    $( '#' +  this.maskID ).click(function(){
                        win.close();
                    });
                }
            },
            show: function()
            {
                if (this.rendered)
                    this._super();
                else { 
                    this.render();
                    this._super();
                }
            }
        });
    },
    //////////////////////////////////////////////////////////////////////////
    // This is main start function;
    //////////////////////////////////////////////////////////////////////////
    onReady : function(callback)
    {
        if (_preferences.config.fitDocument) document.body.style.overflow = "hidden"; 
        if (_preferences.config.noScale)
        {
            var metas = document.getElementsByTagName('meta');
            if (_preferences.config.noScaleTarget == null)
            {
                for (var i=0; i<metas.length; i++)
                {
                    if (metas[i].name == "viewport")
                    {
                        metas[i].content = "width=450, height=640, user-scalable=no";
                        break;
                    }
                }
            }
            else
            {
                if (navigator.userAgent.match(_preferences.config.noScaleTarget))
                {
                    for (var i=0; i<metas.length; i++)
                    {
                        if (metas[i].name == "viewport")
                        {
                            metas[i].content = "width=450, height=640, user-scalable=no";
                            break;
                        }
                    }
                }
            }
        }
        idev.blankimage = _preferences.blankimage;
        idev.controlHeight = idev.app.controlHeight;
        idev.callback = callback;
    }
});

////////////////////////////////////////////////////////////////////////////////
// macro helper functions

$debug = function(x) { try { if (console) console.log(x);}catch(e){} };
$msg = function(x) { return idev.ui.message({ text:x, type:'ok'}); };
$popup = function(t,i,x,y,a,ax,ay,d) { return idev.ui.message({ text:t, icon:i, x:x, y:y, animate:a, ax:ax, ay:ay, type:'', delay:d}); };
$error = function(x) { return idev.ui.message( { text:x, icon:'error'} ); };
$warning = function(x) { return idev.ui.message( { text:x, icon:'warning' } ); };
$info = function(x) { return idev.ui.message( { text:x, icon:'information' } ); };
$yesno = function(x,c) { return idev.ui.message( { text:x, icon:'question', type:'yesno',callback:c } ); };
$okcancel = function(x,c) { return idev.ui.message( { text:x, icon:'question', type:'OKCANCEL',callback:c } ); };
$tr = function(x) { return _language.translate(x); };
$delay = function(t,f,s) { return idev.utils.delay(t,f,s); };
$get = function(x) { return idev.get(x); };
$int = function(x) { return idev.utils.roundUp(x); };
$round = function(x,y) { return idev.utils.round(x,y); };
$ec = function(text) { return idev.utils.scrypt(text,idev.rkey,true) };
$dc = function(text) { return idev.utils.scrypt(text,idev.rkey,false) };

////////////////////////////////////////////////////////////////////////////////
// Executions point for the framework
var idev = new idevCore();
if (typeof idevLoader === "object") 
    idevLoader.render();
else
    idev.internal.loadDependants();
////////////////////////////////////////////////////////////////////////////////

