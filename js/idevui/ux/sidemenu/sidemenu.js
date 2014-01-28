idev.ui.widgetSideMenu = baseWidget.extend(
{
    init: function(config)
    {
        this._super( config );
        this.wtype = "sidemenu";
        this.autoScroll = config.autoScroll == null ? false : config.autoScroll;
        this.items = config.items || [];
        this.itemHeight = config.itemHeight || 25;
        if (this.cls == "") this.cls = "ui-sidemenu";
        this.itemCls = config.itemCls || "ui-sidemenu-item";
        this.itemStyle = config.itemStyle || "";
        this.defaultItem = config.defaultItem == null ? 0 : config.defaultItem;
        this.autoShow = config.autoShow == null ? false : config.autoShow;
        this.autoStart = config.autoStart == null ? true : config.autoStart;  
        this.basePanel = config.basePanel;      
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element {cls}' style='{elementstyle};{style};'>",
            "</div>" );
        this.tplItem = new idev.wTemplate(
            "<div id='{id}' class='{cls}' index={index} widget='{wid}' style='float:left;{style};cursor:pointer;line-height:{height}px;width:{width}px;'>",
            "<div style='float:left;width:{twidth}px;'>{text}</div>",
            "<div id='{mid}' class='ui-sidemenu-marker' style='height:{mheight}px;'></div>",
            "</div>" );
        this.selected = -1;
        idev.internal.add(this);
    },                                 
    render : function()
    {
        if (this.renderTo == null) return;
        var style = this.style;

        if (this.events.click) style += "cursor:pointer;"; 
        if (this.autoScroll)
        {
            style += "overflow-y:auto;overflow-x:hidden";
            this.width -= 16;
        }

        var data = new Array();
        
        data['id'] = this.id;
        data['width'] = this.width;
        data['height'] = this.height;
        data['elementstyle'] = this.elementStyle;
        data['cls'] = this.cssQuirks(this.cls);
        data['style'] = style;
        data['text'] = this.text;
        var  sHTML = this.tpl.render(data);
        
        $("#" + this.renderTo).append(sHTML);
        this.buildMenu();
        if (this.events.afterRender) this.events.afterRender(this);
        this.rendered = true;
    },
    buildMenu:function()
    {
        var sHTML = "";
        var data = new Array();
        
        for (var i = 0;i < this.items.length;i++)
        {
            var item = this.items[i];
            
            data['wid'] = this.id;
            data['id'] = this.id + "_" + i;
            data['mid'] = this.id + "_marker_" + i;
            data['width'] = this.width;
            data['twidth'] = this.width - 18;
            data['height'] = this.itemHeight;
            data['mheight'] = this.itemHeight-6;
            data['cls'] = this.cssQuirks(this.itemCls);
            data['style'] = this.itemStyle;
            data['text'] = item.text;
            data['index'] = i;
    
            var  sItem = this.tplItem.render(data);            
            sHTML += sItem;
        }
        $("#" + this.id).html(sHTML);
        for (var i = 0;i < this.items.length;i++)
        {
            $("#"+this.id + "_" + i).click(function(e)
            {
                var idx = $(this).attr("index")
                var wid = $(this).attr("widget")
                var wgt = $get(wid);
                
                if (wgt.autoShow) 
                    wgt.showMenuItem(idx);
                else
                    wgt.select(idx)
                idev.internal.onClick.call(this,e);
            });
        }
        this.select(this.defaultItem);
        if (this.autoShow && this.autoStart) 
        {
            $delay(200,function(wgt)
            {
                wgt.showMenuItem(wgt.defaultItem);
            },this);
        }
    },
    showMenuItem:function(idx)
    {
        if (typeof idx == "string") idx = parseInt(idx);
        if (idx < 0 || idx >= this.items.length) return;
        var showitem = this.items[idx];
        for (var i = 0;i < this.items.length;i++)
        {
            var item = this.items[i];
            if (i != idx)
            {
                if ($get(item.id) != null) 
                    $get(item.id).hide();
                else if (this.basePanel != null)
                {
                    var bp = $get(this.basePanel);
                    if (bp)
                    {
                        if (bp.children[i]) bp.children[i].hide();
                    }
                }
            }
        }
        if ($get(showitem.id) != null) 
            $get(showitem.id).show();
        else if (this.basePanel != null)
        {
            var bp = $get(this.basePanel);
            if (bp)
            {
                if (bp.children[idx]) bp.children[idx].show();
            }
        }
        this.select(idx)
    },
    select:function(idx)
    {
        if (typeof idx == "string") idx = parseInt(idx);
        if (idx < 0 || idx >= this.items.length) return;
        $("#"+this.id + "_marker_" + this.selected).css("display","none");
        $("#"+this.id + "_marker_" + idx).css("display","block");
        this.selected = idx;
    }
    
});
idev.ux.loadCSS("sidemenu/sidemenu.css");
idev.register("sidemenu",idev.ui.widgetSideMenu);
