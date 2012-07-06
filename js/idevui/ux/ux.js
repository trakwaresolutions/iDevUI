idev.ui.widgetDemo = baseWidget.extend(
{
    init: function(config)
    {
        this._super( config );
        this.wtype = "demo";
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element' style='{elementstyle}{style};'>",
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
        
        var  sHTML = this.tpl.render(data);
        
        $("#" + this.renderTo).append(sHTML);
        if (this.events.afterRender) this.events.afterRender(this);
        if (this.events.click)
        {
            $( '#' +  this.id ).click(idev.internal.onClick);
        }
        this.rendered = true;
    },
    getValue : function()
    {
    },
    setValue : function(percent)
    {
    }
});
idev.register("demo",idev.ui.widgetDemo);
