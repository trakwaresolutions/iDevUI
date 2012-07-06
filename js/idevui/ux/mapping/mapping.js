idev.ux.widgetMap = baseWidget.extend(
{
    init: function(config)
    {
        this._super( config );
        this.wtype = "map";
        this.location = config.location == null ? "redditch" : config.location;
        this.point = null;
        this.marker = new Array();
        if (this.width == null) this.width = 300;
        if (this.height == null) this.height = 300;
          
        this.tpl = new idev.wTemplate(
                "<div id='{id}' class='ui-element' style='{elementstyle}'>",
                "</div>"
            );
        idev.internal.add(this);
    },    
    render : function()
    {
        if (this.renderTo == null) return;
                
        var sHTML = "",style = this.elementStyle;
    
        var data = new Array();
        
        data['id'] = this.id;
        data['elementstyle'] = this.elementStyle;

        var  sHTML = this.tpl.render(data);

        $("#" + this.renderTo).append(sHTML);
        
        idev.utils.delay(500,function(widget)
        {
            widget.createMap();
        },this);
        idev.internal.afterRender(this);
        this.rendered = true;
    },
    createMap: function()
    {
        var myOptions = { zoom: 14, mapTypeId: google.maps.MapTypeId.ROADMAP   };
        var widget = this; 
        
        widget.map = new google.maps.Map(document.getElementById( this.id ), myOptions); 
        if (widget.map)
        {
            widget.point = null;
            widget.geocoder = new google.maps.Geocoder();
            widget.geocoder.geocode( { 'address': widget.location  } ,function(point)
            {
                if (point) 
                {   
                    widget.point = point;
                    widget.map.setCenter(point[0].geometry.location, 13);
                    widget.center = new google.maps.Marker( { position:point[0].geometry.location, map: widget.map, title:"Center" });
                }
                        
            });     
        }
        else
            $debug("Failed To Create Map");
    },            
    setCenter : function (sAddress)
    {
        var widget = this;
        this.geocoder.geocode( { 'address': sAddress  } ,function(point)
        {
            if (point) 
            {   
                widget.map.setCenter(point[0].geometry.location, 13);
                widget.center.setPosition(point[0].geometry.location);
            }
                    
        });     
    },
    addMarker : function (sAddress,title)
    {
        var widget = this;
        this.geocoder.geocode( { 'address': sAddress  } ,function(point)
        {
            if (point) 
            {   
                widget.marker.push(new google.maps.Marker( { position:point[0].geometry.location, map: widget.map, title:title }));
            }
                    
        });     
    },
    removeMarker : function (index)
    {
        if (index >= this.marker.length) return false;
        var marker = this.marker[index];
        marker.setMap(null);
        this.marker.splice(index,1);
        delete marker;
        return true;
    },
    doLayout: function()
    {
        var w = $("#" + this.id).width();
        var h = $("#" + this.id).height();
        
    },
    afterResize: function()
    {
        idev.utils.delay(500,function(widget)
        {
            widget.createMap();
        },this);            
    }
});
idev.register("map",idev.ux.widgetMap);
idev.ux.loadScript("http://maps.google.com/maps/api/js?sensor=false&callback=idev.internal.callback");
