////////////////////////////////////////////////////////////////////////////////
/*
    Date Picker widget

Available color schemes: 
?aqua
?armygreen
?bananasplit
?beige
?deepblue
?greenish
?lightgreen
?ocean_blue ? If you choose not to supply the cellColorScheme variable - the calendar will default to this color.
?orange
?peppermint
?pink
?purple
?torqoise

*/
////////////////////////////////////////////////////////////////////////////////
idev.ux.widgetDatePicker = baseWidget.extend(
{
    init: function(config)
    {
//        config.width = nul;
        if (config.mode == 2 && config.width < 110) config.width = 110;
        config.height = config.mode == 2 ? 250 : 200;
        this._super( config );
        this.wtype = "datepicker";
        this.value = config.value || "";
        this.format = config.format || "d/m/yyyy";
        this.iconColor = config.iconColor || _preferences.button.iconcolor || "#000";
        this.mode = config.mode || 1;
        //if (this.mode == 2) this.width = 120;
        this.selectedDate = config.selectedDate;
        this.yearsRange = config.yearsRange || new Array(1971,2100);
        this.cellColorScheme = config.colorScheme || "orange";
        this.expanded = false;
        this.buttonCls = config.buttonCls || "";
        this.inputHeight = config.inputHeight || 24;
        if (this.mode == 2)
        {
            this.tpl = new idev.wTemplate(
                "<div id='{id}' class='ui-element' style='{style};width:{width}px'>",
                "<div id='{id}-input'>",
                "</div>",
                "<div id='{id}-button'>",
                "</div>",
                "</div>" );
        }
        else
        {
            this.tpl = new idev.wTemplate(
                "<div id='{id}' class='ui-element' style='{style};min-width:120px;'>",
                "<div id='{id}-input'>",
                "</div>",
                "<div id='{id}-button'>",
                "</div>",
                "<div id='{id}-calendar' style='{calendarstyle}'>",
                "</div>",
                "</div>" );
        }
        idev.internal.add(this);
    }, 
    autoHide:function(wgt,e)
    {
        var id = wgt.id + "-calendar";

        if (e == null)
        {
            $("#"+id).hide();
            wgt.expanded = false;
            return;
        }
        var target = e.target != null ? e.target : e.srcElement;
        if (target)
        {
            target = idev.findID(target);
            if (target.id.substr(0,id.length) != id && target.id != "" && target.id != wgt.btn.id)
            {
                $("#"+id).hide();
                wgt.expanded = false;
            }
        }                    
    },                                
    render : function()
    {
        if (this.renderTo == null) return;

        var data = new Array();
        
 //       if (this.x && this.y) this.style += "position:absolute;top:" + this.y + "px;left:" + this.x + "px;float:left;";
        if (this.mode == 2 && this.width < 110) this.width = 110;
        data['id'] = this.id;
        data['width'] = this.width;
        data['height'] = this.height;
        data['elementstyle'] = this.elementStyle;
        data['style'] = this.style;
        data['calendarstyle'] = this.mode == 1 ? "width:200px;height:200px;z-index:10;" :"display:none;width:200px;height:auto;z-index:10;";
        
        var sHTML = this.tpl.render(data);
        var wgt = this;
        
        var defaultValue;
        if(this.value instanceof Date)
            defaultValue = this.value.format(this.format);
        else
            defaultValue = this.value;

        $("#" + this.renderTo).append(sHTML);
        if (this.mode == 2)
        {
            this.input = new idev.ui.widgetTextField({
                renderTo: this.id + "-input",
                width:this.width-(this.inputHeight+2),
                height:this.inputHeight,
                parent:this,
                editable:false,
                cls:wgt.cls,
                style: 'border-top-left-radius:4px;border-bottom-left-radius:4px;border-top-right-radius:0;border-bottom-right-radius:0;',
                roundCorners:this.roundCorners,
                value:defaultValue,
                events: {
                    focus: function(w)
                    {
                        //$("#" + w.parent.id + "-calendar").show();
                        //w.parent.expanded = !w.parent.expanded;
                        wgt.btn.fireEvent('click');
                    }
                }});  
            this.input.render();
            this.btn = new idev.ui.widgetButton({
                renderTo: this.id + "-button",
                width:this.inputHeight+2, //26
                height:this.inputHeight+2,
                icon:'_calendar',
                iconColor:wgt.iconColor,
                ix:4,
                iy:4,
                parent:this,
                border:false,           
                cls:this.buttonCls,
                style: 'border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:4px;border-bottom-right-radius:4px;border-left:0;',
                y:0,//(this.inputHeight-24)/2
                events: {
                    click: function(btn)
                    {
                        $delay(100, function(btn){
                            if (!btn.parent.expanded)
                            {
                                var pos = btn.getPosition();
                                var h =  $("#" + btn.parent.id).height();
                                var pos = $("#" + btn.parent.id).offset();
                                var x =  pos.left;
                                var y =  pos.top + h;
                                var ch = $("#" + btn.parent.id + "-calendar").height();
                                if(y+ch > idev.pgHeight){
                                    y -= ch;
                                    y -= h;
                                }
                                $("#" + btn.parent.id + "-calendar").css("left",x);
                                $("#" + btn.parent.id + "-calendar").css("top",y);
                                idev.autoHide(btn.parent,btn.parent.autoHide);
                                $("#" + btn.parent.id + "-calendar").show();
                                var int = setInterval(function(){
                                    if($("#" + btn.parent.id + "-calendar").is(":visible")){
                                        var pos = $("#" + btn.parent.id).offset();
                                        var x =  pos.left;
                                        var y =  pos.top + h;
                                        if(y+ch > idev.pgHeight){
                                            y -= ch;
                                            y -= h;
                                        }
                                        if (btn.parent.roundCorners && !idev.isIE8()) x += 4;
                                        $("#" + btn.parent.id + "-calendar").css("left",x);
                                        $("#" + btn.parent.id + "-calendar").css("top",y);
                                    }
                                    else {
                                        clearInterval(int);
                                    }
                                },200)
                            }
                            else
                            {
                                idev.autoHide();
                                $("#" + btn.parent.id + "-calendar").hide();
                            }
                            btn.parent.expanded = !btn.parent.expanded;
                        },btn);
                    }
                }});  
            this.btn.render();
        }
        $delay(200,function(wgt)
        {
            if (wgt.mode == 2)
            {
                var h =  $("#" + wgt.id).height();
                var pos = $("#" + wgt.id).offset();
                var x =  pos.left;
                var y =  pos.top + h;
                if(y+200 > idev.pgHeight){
                    y -= 200;
                    y -= h;
                }
                sHTML = "<div id='"+wgt.id+"-calendar' class='ui-calendar' style='position:absolute;left:"+x+"px;top:"+y+"px;display:none;width:200px;height:auto;z-index:99999;'></div>";
                $("#container").append(sHTML);
            }
            d = 1;
            if(typeof JsDatePick == "undefined") d = 200;
            $delay(d,function(wgt)
            {
                wgt.calendarObject = new JsDatePick({
                    useMode:1,
                    isStripped:true,
                    imgPath:_preferences.libpath + 'ux/datepicker/img/',
                    target:wgt.id + "-calendar",
                    yearsRange:wgt.yearsRange,
                    cellColorScheme:wgt.cellColorScheme
                });
                if(wgt.value !== '') {
                    //Fix for setting widget value using value property on render
                    var d = { year:0, month:0, day:0 }
                    
                    var date = wgt.value;
                    d.year = date.getFullYear();
                    d.month = date.getMonth()+1;        
                    d.day = date.getDate();
                            
                    wgt.calendarObject.setSelectedDay(d);
                }
                
                wgt.calendarObject.wgt = wgt;
                $delay(100,function(wgt) 
                {                
        
                    wgt.calendarObject.setOnSelectedDelegate(function(picker)
                    {
                        var obj = picker.getSelectedDay(); 
                        if (picker.wgt.mode == 2)
                        {
                            var d = picker.wgt.getDate();
                            
                            picker.wgt.input.setValue(d.format(picker.wgt.format));
                            $("#" + picker.wgt.id + "-calendar").hide();
                            picker.wgt.expanded = !picker.wgt.expanded;
                        }
                        if (picker.wgt.events.click) picker.wgt.events.click( picker.wgt );
                    });
                },wgt);
                if (wgt.selectedDate) wgt.setValue(wgt.selectedDate);
                if (wgt.events.afterRender) wgt.events.afterRender(wgt);
            },wgt);
        },this);
        this.rendered = true;
    },
    getValue : function()
    { 
        if(!this.calendarObject) return;
        return this.getDate();
    },
    getValue2String : function()
    { 
        try{
            var d = this.calendarObject.getSelectedDay();
            var dt = new Date(d.year, (d.month-1), d.day);
            
            return dt.format(dateFormat.masks.uDateTime);
        }
        catch(e)
        {
            return "";
        }
    },
    getDate : function()
    { 
        if(!this.calendarObject) return;
        var d = this.calendarObject.getSelectedDay();
        
        return new Date(d.year, (d.month-1), d.day);
    },
    setDateFromString : function(date)
    {
        if(!this.calendarObject) return;
        var d = { year:0, month:0, day:0 }
        
        if (date == "")  return;
        d.year = date.substr(0,4)
        d.month = date.substr(4,2);        
        d.day = date.substr(6,2);
                
        this.calendarObject.setSelectedDay(d);
        
        d = new Date(d.year, d.month-1, d.day);
        if (this.mode == 2) this.input.setValue(d.format(this.format));
    },
    setDate : function(date)
    {
        if(!this.calendarObject) return;
        if(typeof(date)=="string" && date == "")
        {
            this.calendarObject.unsetSelection();
            this.input.setValue("");
            return;
        }
        
        var d = { year:0, month:0, day:0 }
        
        d.year = date.getFullYear();
        d.month = date.getMonth()+1;        
        d.day = date.getDate();
                
        this.calendarObject.setSelectedDay(d);
        
        d = new Date(d.year, d.month-1, d.day);
        if (this.mode == 2) this.input.setValue(d.format(this.format));
    },
    setValue : function(date)
    {
        if(typeof(date) == "object")
        {
            if(date.getMonth)
            {
                this.setDate(date);
                return;
            }
        }
    },
    ondestroy:function()
    {
        this.input.destroy();
        this.btn.destroy();
        delete this.calendarObject;
        $("#"+this.id+"-calendar").remove();
    }
});
idev.ux.loadCSS("datepicker/jsdatepick.css");
idev.ux.loadScript("datepicker/jsdatepick.js");
idev.register("datepicker",idev.ux.widgetDatePicker);

