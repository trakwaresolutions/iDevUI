///////////////////////////////////////////////////////////////////////////////
/*
    iDevUI loading object

*/
///////////////////////////////////////////////////////////////////////////////
var idevLoader = {

    init: function()
    {
        this.steps = 10;
        this.width = 300;
        this.html = "<div id='_idevloader' class='ui-loader-progress ui-modern ui-ie9' style='position:absolute;left:0px;width:0px;'>";
        this.html += "</div>" 
        this.html += "<span style='position:absolute;left:0px;width:"+this.width+"px;text-align:center;'>Loading...</span>";
        this.div = null;
    },
    render:function()
    {
        try 
        {
            var container = document.getElementById("container");
            if (document.body == null) 
            {
                $delay(100,function()
                {
                    idevLoader.render();   
                })
                return;
            }
            var oDiv=document.createElement("DIV");
            oDiv.className = "ui-loader ui-modern ui-ie9";
            oDiv.innerHTML = this.html;
            this.div = oDiv;
            document.body.appendChild(oDiv);
            $delay(200,function()
            {
                idev.internal.loadDependants();
            })
        }
        catch(e)
        {
            alert(e.message)
        }
    },
    step : function(nStep)
    {
        try 
        {
            if (this.div == null) return;
            if (nStep > this.steps) return;
            var prg = document.getElementById("_idevloader");
            var w = prg.style.width;
            w = parseInt(this.width / this.steps * nStep);
            prg.style.width = w + "px";
        }
        catch(e)
        {
        }
    },
    remove : function(nStep)
    {
        if (this.div == null) return;
        $delay(150,function(wgt)
        {
            document.body.removeChild(wgt.div);
            wgt.div = null;
        },this);
    }
};
idevLoader.init();

