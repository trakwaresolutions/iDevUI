///////////////////////////////////////////////////////////////////////////////
/*
    Simple code editor
    
    Build: 20120111.1
    
    Copyright Trakware Solutions Ltd 2012
    
    Makes use of CodeMirror  http://www.codemirror.net
    
    Additional Properties:
    
    lineNumbers
    theme
    
    Methods:
    
    setValue
    getValue
    Find
    FindNext
    undo
    redo
    
    example:
    
        {
            wtype:'codeeditor',
            id:'idCode',
            x:10,
            y:30,
            width:550,
            height:350 ,
            border:true,
            value:"function text() {};"
        } ,
    
	Change Log:
	
	130402.1
	- Updated onKeyEvent to capture Ctrl + Q correctly

    130905.1
    - Fixed bugs with loading multiple code editors at once onto a page.
	
*/
///////////////////////////////////////////////////////////////////////////////
idev.ui.widgetCodeEditor = baseWidget.extend(
{
    init: function(config)
    {
        config.borderColor = config.borderColor || "#ccc";
        this._super( config );
        this.wtype = "codeeditor";
        this.lineNumbers = idev.convertNulls(config.lineNumbers,true);
        this.editable = idev.convertNulls(config.editable,true);
        this.theme = config.theme || "neat";
        this.mode = config.mode || "javascript";
        this.markers = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        this.marker = 0;
        this.cursor = null;
        this.lastSearch = "";
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element' style='{elementstyle}{style};'>",
            "<form><textarea id='{id}-code' name='{id}-code'>",
            "</textarea></form>",
            "</div>" );
        this.dirty = false;
        idev.internal.add(this);
    },                                 
    resize : function ()
    {
         var w = this.editor.getWrapperElement();
         
         $(w).width(this.getWidth());
         $(w).height(this.getHeight());
         this.editor.focus();
    },
    onChange: function()
    {
        this.dirty = true;
    },
    isDirty: function()
    {
        return this.dirty;
    },
    gotoLine:function(nLine)
    {
        this.editor.setCursor(nLine-1);
    },
    find:function(sText)
    {
        if (sText == "") return;
        if (this.lastQuery != sText ) this.lastPos = null;
        this.cursor = this.editor.getSearchCursor(sText , this.lastPos || this.editor.getCursor());
        if (!this.cursor.findNext()) 
        {
            this.cursor = this.editor.getSearchCursor(sText);
            if (!this.cursor.findNext()) return;
        }
        this.editor.setSelection(this.cursor.from(), this.cursor.to());
        this.lastQuery = sText; this.lastPos = this.cursor.to();
    },
    findNext:function()
    {
        if (this.cursor == null) return;
        if (!this.cursor.findNext()) 
        {
            this.cursor = this.editor.getSearchCursor(this.lastQuery, null);
            if (!this.cursor.findNext()) return;
        }
        this.editor.setSelection(this.cursor.from(), this.cursor.to());
        this.lastPos = this.cursor.to();
    },
    redo:function()
    {
        this.editor.redo();
    },
    undo:function()
    {
        this.editor.undo();
    },
    render : function()
    {
        if (this.renderTo == null) return;

        var data = new Array();
        var style = this.style;
        
        if (this.border) style += "border:" + this.borderStyle + ";";

        data['id'] = this.id;
        data['width'] = this.width;
        data['height'] = this.height;
        data['elementstyle'] = this.elementStyle;
        data['style'] = style;
        
        var sHTML = this.tpl.render(data);
        var wgt = this;
        
        $("#" + this.renderTo).append(sHTML);
        idev.ux.loadCSS("codeeditor/codemirror/theme/"+this.theme+".css");
        
        switch(this.mode)
        {
            case 'javascript':
            case 'diff':
            case 'rpm/spec':
            case 'tiddlywiki':
                idev.ux.loadCSS("codeeditor/codemirror/mode/"+this.mode+"/"+this.mode+".css");
                break;
            case 'php':
                idev.ux.loadScript("codeeditor/codemirror/mode/xml/xml.js");
                idev.ux.loadScript("codeeditor/codemirror/mode/javascript/javascript.js");
                idev.ux.loadScript("codeeditor/codemirror/mode/css/css.js");
                idev.ux.loadScript("codeeditor/codemirror/mode/clike/clike.js");
                break;
        }

        idev.ux.loadScript("codeeditor/codemirror/mode/"+this.mode+"/"+this.mode+".js",function()
        {
            if(wgt.mode == "php") wgt.mode = "application/x-httpd-php";
            wgt.editor = CodeMirror.fromTextArea(document.getElementById(wgt.id+"-code"), {
                mode:wgt.mode,
                lineNumbers: wgt.lineNumbers,
                indentUnit: 4,
                indentWithTabs: true,
                height:wgt.height,
                enterMode: "keep",
                theme:wgt.theme,
                tabMode: "indent",
                matchBrackets:true,
                onGutterClick: function(cm, n) 
                {
                    var info = cm.lineInfo(n);
                    
                    if (info.markerText)
                    {
                        for (var i = 0;i < 10;i++)
                        {
                            if (cm.widget.markers[i] == n+1)
                            {
                                for (var j = i;j < 9;j++)
                                {
                                    cm.widget.markers[j] = cm.widget.markers[j+1];
                                }  
                                cm.widget.markers[9] = 0; 
                                cm.clearMarker(n);
                                cm.widget.marker++;
                                if (cm.widget.marker == 10 || cm.widget.markers[cm.widget.marker] == 0) cm.widget.marker = 0;
                                break;
                            }
                        }
                    }
                    else
                    {
                        for (var i = 0;i < 10;i++)
                        {
                            if (cm.widget.markers[i] == 0)
                            {
                                cm.widget.markers[i] = n+1;
                                if (idev.isFF())
                                    cm.setMarker(n, "<span style=\"color: #a00;\">*</span>%N%"); 
                                else
                                    cm.setMarker(n, "<span style=\"color: #a00;font-family:Webdings;font-size:6pt\">n</span>%N%"); 
                                break;
                            }
                        }
                    }
                    cm.focus();
                },
                onCursorActivity: function(cm) 
                {
                    if(cm.hlLine == null) cm.hlLine= 0; 
                    cm.setLineClass(cm.hlLine, null);
                    cm.setLineClass(cm.getCursor().line, "CodeMirror-activeline");
                    cm.hlLine = cm.getCursor().line;
                },
                onKeyEvent: function(cm,e) 
                {
                    if (!cm.widget.editable)
                    {
                        e.stop();
                        return true;
                    }
                    if((e.keyCode == 70 && e.ctrlKey))
                    {
						//Ctrl + F
                        e.stop();
                        return true;
                    }
                    if(e.keyCode == 81 && e.ctrlKey)
                    {
						//Ctrl + Q (breakpoint navigation)
						var n = cm.widget.markers[cm.widget.marker];
                       
						if (n != 0)
						{
							cm.widget.marker++;
							if (cm.widget.marker == 10 || cm.widget.markers[cm.widget.marker] == 0) cm.widget.marker = 0;
							cm.setCursor(n-1);
						}
						e.stop();
						return true;
                    }
                    if ((e.ctrlKey && e.keyCode == 86) || 
                       (e.ctrlKey && e.keyCode == 88) || 
                       (!e.ctrlKey && !e.altKey && !e.shiftKey && e.keyCode >= 65 && e.keyCode <= 90) ||
                       (!e.ctrlKey && !e.altKey && !e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) ||
                       (e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) ||
                       (!e.ctrlKey && !e.altKey && !e.shiftKey && e.keyCode >= 219 && e.keyCode <= 222) ||
                       (!e.ctrlKey && !e.altKey && !e.shiftKey && e.keyCode >= 186 && e.keyCode <= 194) ||
                       (!e.ctrlKey && !e.altKey && !e.shiftKey && (e.keyCode == 13 || e.keyCode == 9  || e.keyCode == 8)))
                    {
                        cm.widget.onChange();
                    }
                }
            });
            wgt.editor.widget = wgt;
            $delay(100,function(wgt)
            {
                wgt.resize()
                wgt.setValue(wgt.value);
            },wgt);
        },this);
        if (this.events.afterRender) this.events.afterRender(this);
        if (this.events.click)
        {
            $( '#' +  this.id ).click(idev.internal.onClick);
        }
        this.rendered = true;
    },
    getValue : function()
    {
        return this.editor.getValue();
    },
    setValue : function(text)
    {
        this.editor.setValue(text);
        this.dirty = false;
    },
    ondestroy:function()
    {
        if (this.editor) delete this.editor;
        this.editor = null;
    }
});
idev.ux.loadCSS("codeeditor/codemirror/lib/codemirror.css");
idev.ux.loadScript("codeeditor/codemirror/lib/codemirror.js",function()
{
    idev.ux.loadScript("codeeditor/codemirror/lib/util/searchcursor.js");
});
idev.register("codeeditor",idev.ui.widgetCodeEditor);
