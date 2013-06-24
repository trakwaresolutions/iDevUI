// JavaScript Document

idev.ux.widgetRichtext = baseWidget.extend(
{
    init: function(config)
    {
        this._super( config );
        this.wtype = "richtext";
        this.value = config.value || "";
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element' style='{elementstyle}{style};max-height:{height}px;'>",
            "<div id='{id}-input' style='width:{width}px;height:{theight}px;max-height:{theight}px;overflow:auto;' class='ui-richtext-input no-kill-backspace'></div>",
            "</div>" );
        idev.internal.add(this);
    },                                 
    render : function()
    {
        if (this.renderTo == null) return;

        var data = new Array();
        
        data['id'] = this.id;
        data['width'] = this.width-2;
        data['height'] = this.height;
        data['theight'] = this.height-28;
        data['elementstyle'] = this.elementStyle;
        data['style'] = this.style;
        
        var sHTML = this.tpl.render(data);
        var wgt = this;
        
        $("#" + this.renderTo).append(sHTML);
        idev.internal.addScript(_preferences.libpath + "ux/richtext/nicEdit.js",function()
        {
            var buttons = ['save','bold','italic','underline','left','center','right','justify','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','forecolor','bgcolor'];
            
            wgt.myEditor = new nicEditor({ maxHeight : wgt.height-28 , buttonList: buttons, iconsPath: _preferences.libpath + "ux/richtext/nicEditorIcons.gif" }).panelInstance(wgt.id + "-input");
            wgt.setValue(wgt.value);
        });
        if (this.events.afterrender) this.events.afterrender(this);
        this.rendered = true;
    },
    getValue : function()
    {
        return $("#"+this.id+"-input").html();
    },
    setValue : function(text)
    {
        $("#"+this.id+"-input").html(text);
    },
    ondestroy:function()
    {
        try
        {
            delete this.myEditor;
        }
        catch(e)
        {
        }
    }
});
idev.register("richtext",idev.ux.widgetRichtext);
