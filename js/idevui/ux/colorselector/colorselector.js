///////////////////////////////////////////////////////////////////
/*

     Created: 8th July 2012 
     Author: S. Egginton

     Description: 

     Color selection widget. Designed for forms
     
Properties:

    wtype:            'colorselector'
    x:                Left position of widget
    y:                Top position of widget
    width:            Width of widget (default 60)
    height:           NOT USED
    value:            HEX color value
    style:            Standard CSS Styling
    roundCorners:     Show round corners
    

Methods:

    setValue(value)   Set new selector input value
    
    getValue()        Returns the select color value
       
     ------------------------- [ History ] -------------------------

     Version Date        Comment

     1.0    08-07-2012    Original

*/
///////////////////////////////////////////////////////////////////
idev.ui.colorSelector = baseWidget.extend(
{
    init: function(config)
    {
        if (config.width == null) config.width = 60;
        this._super( config );
        this.wtype = "colorselector";
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element ui-input' style='{elementstyle}{style};'>",
            "<input id='{id}-color' class='ui-color' value='{color}' style='border:0;width:{swidth}px;'>",
            "</div>" );
        if (this.width < 60) this.width = 60;
        idev.internal.add(this);
    },                                 
    render : function()
    {
        if (this.renderTo == null) return;

        var style = this.style;

        if (this.borderStyle != "") style += ";border:" + this.borderStyle;
        if (!this.roundCorner) style += ";border-radius: 0px;";

        var data = new Array();
        
        data['id'] = this.id;
        data['width'] = this.width;
        data['height'] = this.height;
        data['swidth'] = this.width;
        data['elementstyle'] = this.elementStyle;
        data['style'] = style;
        data['color'] = this.value;
        
        var  sHTML = this.tpl.render(data);
        
        $("#" + this.renderTo).append(sHTML);
        if (this.roundCorners)
        {
            $("#" + this.id).css("border-radius",this.radius + "px");
            $("#" + this.id).css("-webkit-border-radius",this.radius + "px");
            $("#" + this.id).css("-moz-border-radius",this.radius + "px");
        }
        if (this.events.afterRender) this.events.afterRender(this);
        if (this.events.click)
        {
            $( '#' +  this.id ).click(idev.internal.onClick);
        }
        this.rendered = true;
        jscolor.init();
    },
    getValue : function()
    {
        return idev.dom("#"+this.id+"-color").val();
    },
    setValue : function(value)
    {
        idev.dom("#"+this.id+"-color").val(value);
    }
});
idev.ux.loadScript("colorselector/jscolor.js");
idev.register("colorselector",idev.ui.colorSelector);
