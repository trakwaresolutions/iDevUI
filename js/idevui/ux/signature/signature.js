////////////////////////////////////////////////////////////////////////////////
/*
    Signature widget

    This widget is thanks to Thomas Bradley at thomasjbradley.ca

*/
////////////////////////////////////////////////////////////////////////////////
idev.ux.widgetSignature = baseWidget.extend(
{
    init: function(config)
    {
        this._super( config );
        this.wtype = "signature";
        this.displayOnly = config.displayOnly || false;
        this.bgColor = config.bgColor || "#fff";
        this.penColor = config.penColor || "#145394";
        this.penWidth = config.penWidth || 2;
        this.lineColor = config.lineColor || "#ccc";
        this.lineWidth = config.lineWidth || 2;
        this.lineMargin = config.lineMargin || 2;
        this.value = config.value;
        this.lineTop = config.lineTop || 35;
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element' style='{elementstyle}{style};'>",
            "<canvas class='pad' width='{width}' height='{height}' style='cursor: url({cursor}) 8 8, crosshair;'></canvas>",
            "</div>" );
        idev.internal.add(this);
    },                                 
    render : function()
    {
        if (this.renderTo == null) return;

        var data = new Array();
        
        data['id'] = this.id;
        data['width'] = this.width;
        data['height'] = this.height;
        data['elementstyle'] = this.elementStyle;
        data['style'] = this.style;
        data['cursor'] = _preferences.libpath + "ux/signature/pen.png";
        
        var sHTML = this.tpl.render(data);
        var wgt = this;
        
        $("#" + this.renderTo).append(sHTML);

        window.FlashCanvasOptions = {};
        window.FlashCanvasOptions.swfPath = _preferences.libpath + "ux/signature/";

        idev.internal.addScript(_preferences.libpath + "ux/signature/json2.min.js",function()
        {
            idev.internal.addScript(_preferences.libpath + "ux/signature/jquery.signaturepad.js",function()
            {
                var options = {defaultAction:"drawIt",displayOnly:false}
                
                options.displayOnly = wgt.displayOnly;
                options.bgColour = wgt.bgColor;
                options.penColour = wgt.penColor;
                options.penWidth = wgt.penWidth;
                options.lineColour = wgt.lineColor;
                options.lineWidth = wgt.lineWidth;
                options.lineMargin = wgt.lineMargin;
                options.lineTop = wgt.lineTop;
                wgt.signature = $('#' + wgt.id).signaturePad(options);
                if (wgt.value) wgt.setValue(wgt.value);
            });     
        });

        if (this.events.afterrender) this.events.afterrender(this);
        if (this.events.click)
        {
            $( '#' +  this.id ).click(idev.internal.onClick);
        }
        this.rendered = true;
    },
    clear : function()
    {
        return this.signature.clearCanvas();
    },
    getValue : function()
    {
        return this.signature.getSignatureString();
    },
    getImage : function()
    {
        return this.signature.getSignatureImage();
    },
    setValue : function(signature)
    {
        if (typeof signature == "string") signature = eval(signature);
        this.signature.regenerate(signature);
    }
});
idev.register("signature",idev.ux.widgetSignature);
