// JavaScript Document

/* Raphaël Gauge 
 * Author: Renato Albano (renatoalbano.com) ~ http://github.com/renatoalbano 
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * Version: 1.0 (Jul 06 2010)
 */

(function (Raphael) {
  Raphael.fn.gauge = function(minAngle, maxAngle) {
    var minAngle = minAngle || 0;
    var maxAngle = maxAngle || 360;
    var actualAngle = minAngle;
    var bgCenter, pointerCenter = null;
    var bg = this.set();
    var pointer = this.set();

    this.animateMS = 1000;
    this.animateEasing = "elastic";
    
    this.bg = function(el, center) {
      bgCenter = center;
      if(pointerCenter != null) {
        pointer.toFront();
        pointer.attr({
          x: bgCenter[0]-pointerCenter[0],
          y: bgCenter[1]-pointerCenter[1]
        });
        this.moveToAngle(actualAngle);
      }
      bg.push(el);
    };
    
    this.pointer = function(el, center) {
      // if bg not exists use center point
      bgCenter = bgCenter || [parseInt(this.width/2), parseInt(this.height/2)];
      pointerCenter = center;
      el.attr({
           x: bgCenter[0]-center[0],
           y: bgCenter[1]-center[1],
           rotation: minAngle + " " + bgCenter[0] + " " + bgCenter[1]
         });
      pointer.push(el);
    };
    
    this.moveToAngle = function(angle) {
      pointer.animate({rotation: angle + " " + bgCenter[0] + " " + bgCenter[1]}, 0);
    };
    
    this.animateToAngle = function(angle) {
      actualAngle = angle;
      pointer.animate({transform: "r" + angle + "," + bgCenter[0] + "," + bgCenter[1] },1000,'<>');
    };
    
    this.move = function(percent, animate) {
      animate = animate == null ? true : animate;
      if(percent < 0) {
        percent = 0
      } else if(percent > 100) {
        percent = 100
      }
    
      var angle = (percent * ((maxAngle-minAngle)/100)) + minAngle;
      if(animate) {
        this.animateToAngle(angle)
      } else {
        this.moveToAngle(angle);
      }
    };
    
    this.minAngle = function(angle) { minAngle = angle; }
    this.maxAngle = function(angle) { maxAngle = angle; }
    
    return this;
  };
})(window.Raphael);


idev.ux.widgetGauge = baseWidget.extend(
{
    init: function(config)
    {
        this._super( config );
        this.wtype = "gauge";
        this.startcolor = config.startcolor || "#33FF33";
        this.centercolor = config.centercolor || "#FFCC00";
        this.endcolor = config.endcolor || "#f00";
        this.value = config.value || 0;
        this.title = config.title || "";
        this.demo = config.demo || false;
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element' style='{elementstyle}{style};'>",
            "</div>" );
        idev.internal.add(this);
    },                                 
    arc: function arc(center, radius, startAngle, endAngle) 
    {
        angle = startAngle;
        coords = this.toCoords(center, radius, angle);
        path = "M " + coords[0] + " " + coords[1];
        while(angle<=endAngle) {
            coords = this.toCoords(center, radius, angle);
            path += " L " + coords[0] + " " + coords[1];
            angle += 1;
        }
        return path;
    },            
    toCoords: function (center, radius, angle) {
        var radians = (angle/180) * Math.PI;
        var x = center[0] + Math.cos(radians) * radius;
        var y = center[1] + Math.sin(radians) * radius;
        return [x, y];
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
        idev.utils.delay(100,function(widget)
        {
            var cx =  widget.width/2, cy =  widget.width/2;
            var r = widget.width/2;
            
            widget.paper = Raphael(widget.id, widget.width, widget.width/2 + 5);
            widget.gauge = widget.paper.gauge(0, 180);
            widget.gauge.bg(widget.paper.circle(cx, cy, r).attr({fill:"90-#444-#999:60-#fff"}), [cx, cy]);
            widget.gauge.bg(widget.paper.circle(cx, cy, r-15).attr({fill:"r(0.25,0.75)#111-#666"}), [cx, cy]);
            widget.paper.path(widget.arc([cx, cy], cx-50, 170, 225)).attr({ "stroke":widget.startcolor,"stroke-width": "10",opacity:0.6 });  
            widget.paper.path(widget.arc([cx, cy], cx-50, 225, 313)).attr({ "stroke":widget.centercolor,"stroke-width": "10",opacity:0.9 });  
            widget.paper.path(widget.arc([cx, cy], cx-50, 313, 360)).attr({ "stroke":widget.endcolor,"stroke-width": "10",opacity:0.6 });  
            widget.paper.path(widget.arc([cx, cy], cx-50, 0, 20)).attr({ "stroke":widget.endcolor,"stroke-width": "10",opacity:0.6 });  
            
            widget.paper.rect(0, cy+3, widget.width,2).attr({ "stroke-width": "0.1", "stroke":"#aaa", fill:"#aaa"});
            widget.paper.text(20, cy-4, "0").attr({ 
                "stroke-width": "0.1",
                "fill":"#fff",
                'font-size':14
                });
            widget.paper.text( cx/2-10, 55, "25").attr({ 
                "stroke-width": "0.1",
                "fill":"#fff",
                'font-size':14
                });
            widget.paper.text( cx, 30, "50").attr({ 
                "stroke-width": "0.1",
                "fill":"#fff",
                'font-size':14
                });
            widget.paper.text( cx*1.5+10, 55, "75").attr({ 
                "stroke-width": "0.1",
                "fill":"#fff",
                'font-size':14
                });
            widget.paper.text( widget.width-30, cy-4, "100").attr({ 
                "stroke-width": "0.1",
                "fill":"#fff",
                'font-size':14
                });
            widget.paper.text(cx, cx*0.7, widget.title).attr({ 
                "stroke-width": "0.1",
                "fill":"#fff",
                'font-size':14
                });
            widget.gauge.pointer(widget.paper.rect(30, 30, cx-40, 2).attr({fill: "#000"}), [cx-20, 0]);
            
            widget.paper.circle(cx, cy, 20).attr({fill:"r(0,0)#111-#555"});
            widget.setValue(widget.value);
            if (widget.demo)
            {
                setInterval(function()
                {
                    var percent = Math.floor(Math.random()*100);
                    widget.gauge.move(percent,true);
                }, 2000);
            }
            
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
        return this.value;
    },
    setValue : function(percent)
    {
        if (percent < 0 || percent > 100) return;
        this.gauge.move(percent,true);
        this.value = percent;
    }
});
idev.register("gauge",idev.ux.widgetGauge);
