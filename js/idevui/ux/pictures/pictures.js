idev.ux.widgetPictures = baseWidget.extend(
{
    init: function(config)
    {
        idev.ux.loadCSS("pictures/pictures.css");
        this._super( config );
        this.wtype = "adverts";
        this.index = 0;
        this.lastidx = -1;
        this.animSpeed = config.animSpeed == null ? 2000 : config.animSpeed ;
        this.delaySpeed = config.delaySpeed == null ? 2000 : config.delaySpeed ;
        this.ds = config.ds; 
        this.imageField = config.imageField || "";
        this.toFadeOut = null;
        this.pictures = config.pictures;
        this.paused = false;
        this.tpl = new idev.wTemplate(
                "<div id='{id}' class='ui-element ui-pictures {cls}' style='{elementstyle};{style}'>",
                "{items}",
                "</div>"
            );
        if (this.ds != null) this.ds.bind(this);    
        idev.internal.add(this);        
    },
    picTimer : function(id,first)
    { 
        var wgt = idev.get(id);
        if (wgt == null) return;
        var adpanel = $("#" + id);
        var idx = wgt.index;
        var lastidx = wgt.lastidx;
        var toFadeOut = null;
        var toFadeIn = null;
       
        if (wgt.paused)
        {
            setTimeout("idev.funcs.picTimer('" + id + "');", wgt.delaySpeed); 
            return;
        }
        var kids = adpanel.children();
        
        kids.each(function() 
        {
            child = $(this);
            
            if (idx == 0)
            {
                toFadeIn = child;
            }
            idx--;
        })
        if (wgt.toFadeOut == null)
        {
            if (toFadeIn == null)
            {
                setTimeout("idev.funcs.picTimer('" + id + "');", wgt.delaySpeed); 
                return;
            }
            toFadeIn.fadeIn(wgt.animSpeed);
        }
        else
        {
            wgt.toFadeOut.fadeOut(wgt.animSpeed);
            toFadeIn.fadeIn(wgt.animSpeed);
        }
        wgt.toFadeOut = toFadeIn;
        wgt.lastidx = wgt.index;
        wgt.index++;
        if (wgt.index >= kids.length) wgt.index = 0;
        if (!first) setTimeout("idev.funcs.picTimer('" + id + "');", wgt.delaySpeed); 
    },    
    buildPictures: function()
    {
        var sItems= "";
        if (this.ds != null)
        {
            for (var i = 0;i < this.ds.getCount();i++)
            {
                var rec = this.ds.getAt(i);
                var istyle = "";
                var sSrc = rec.get(this.imageField);
                 
                if (this.width != null) istyle += "width:" + this.width + "px;";        
                if (this.height != null) istyle += "height:" + this.height + "px;";        
                if (i == 0)
                {
                    if (sSrc == "") sSrc = "images/picture.jpg";
                    sItems += "<img id='" + this.id + "_" + i + "' src='" + sSrc+ "' alt='' style='" + istyle + "' />";  
                }
                else
                {
                    if (sSrc != "") sItems += "<img id='" + this.id + "_" + i + "' src='" + sSrc + "' alt='' style='" + istyle + "'/>";  
                }              
            }
            return sItems;
        }
        if (this.pictures == null) return "";
        for (var i = 0;i < this.pictures.length;i++)
        {
            var pic = this.pictures[i];
            var istyle = "";
             
            if (this.width != null) istyle += "width:" + this.width + "px;";        
            if (this.height != null) istyle += "height:" + this.height + "px;";        
            if (pic.link == null) pic.link = "";
            if (i == 0)
            {
                if (pic.src == "") pic.src = "images/picture.jpg";
                sItems += "<img id='" + this.id + "_" + i + "' src='" + pic.src + "' alt='' style='" + istyle + "' />";  
            }
            else
            {
                if (pic.src != "") sItems += "<img id='" + this.id + "_" + i + "' src='" + pic.src + "' alt='' style='" + istyle + "'/>";  
            }              
        }
        return sItems;
    },
    pause:function()
    {
        this.paused = true;
    },    
    run:function()
    {
        this.paused = false;
    },    
    render : function()
    {
        if (this.renderTo == null) return;
        
        var style = this.style + this.elementStyle;                
        var sLastSrc = "";
        
        var data = new Array();
        data['id'] = this.id;
        data['cls'] = this.cls;
        data['elementstyle'] = this.elementStyle;
        data['items'] = this.buildPictures();
        
        var  sHTML = this.tpl.render(data);

        // Add the timer function to the idev object so we can switch adverts
        idev.funcs.picTimer = this.picTimer;
        
        $("#" + this.renderTo).append(sHTML);
        timer = setTimeout("idev.funcs.picTimer('" + this.id + "',false);", this.delaySpeed);
        idev.internal.afterRender(this);
        idev.utils.delay(200,function(widget)
        {
            if (widget.pictures != null)
            {
                for (var i = 0;i < widget.pictures.length;i++)
                {
                    $( '#' +  widget.id + "_" + i ).click(idev.internal.onClick);
                }
            }
            else if (widget.ds)
            {
                for (var i = 0;i < widget.ds.getCount();i++)
                {
                    $( '#' +  widget.id + "_" + i ).click(idev.internal.onClick);
                }
            }
        },this);
        idev.funcs.picTimer(this.id,true);
        this.rendered = true;
    },
    refresh : function()
    {
        this.pause();
        this.toFadeOut = null;
        this.index = 0;
        var sHTML = this.buildPictures();
        $("#"+this.id).html(sHTML);
        idev.utils.delay(200,function(widget)
        {
            if (widget.pictures != null)
            {
                for (var i = 0;i < widget.pictures.length;i++)
                {
                    $( '#' +  widget.id + "_" + i ).click(idev.internal.onClick);
                }
            }
            else if (widget.ds)
            {
                for (var i = 0;i < widget.ds.getCount();i++)
                {
                    $( '#' +  widget.id + "_" + i ).click(idev.internal.onClick);
                }
            }
        },this);
        this.run();
    },
    doLayout: function()
    {
        var w = $("#" + this.id).width();
        var h = $("#" + this.id).height();

        for (var i = 0;i < this.pictures.length;i++)
        {
            $( '#' +  this.id + "_" + i ).width(w);
            $( '#' +  this.id + "_" + i ).height(h);
        }
    }
});
idev.register("pictures",idev.ux.widgetPictures);
