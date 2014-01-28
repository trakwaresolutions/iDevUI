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
        this.html += "</div>";
        this.loaderText = "Loading";

        if(navigator.userAgent.toLowerCase().indexOf('msie 8') != -1) this.html += "<span style='position:absolute;left:0px;width:"+this.width+"px;text-align:center;'>"+this.loaderText+"</span>";
        this.div = null;
        this.first = true;
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

            if(this.first)
            {
                if(_preferences.loaderText) this.loaderText = _preferences.loaderText;
                if(navigator.userAgent.toLowerCase().indexOf('msie 8') == -1 && _preferences.legacyLoader) this.html += "<span style='position:absolute;left:0px;width:"+this.width+"px;text-align:center;'>"+this.loaderText+"</span>";

                var oDiv=document.createElement("DIV");
                oDiv.id = "loader";
                oDiv.className = "ui-loader ui-modern ui-ie9";
                oDiv.innerHTML = this.html;
                this.div = oDiv;
                document.body.appendChild(oDiv);
                this.first = false;
            }

            if(typeof jQuery == 'undefined')
            {
                idev.internal.addScript(_preferences.libpath+"jquery191min.js");
                if(!jqueryCount) var jqueryCount = 0;
                jqueryCount++;
                $delay(100,function()
                {
                    if(jqueryCount < 20) 
                        idevLoader.render();
                    else
                        idev.errorHandler('FATAL: Could not load jQuery.');
                });
                return;
            }

            if((!idev.isIE8() && !idev.isIE7()) && !_preferences.legacyLoader)
            {
                if(_preferences.splashScreen == "" || !_preferences.splashScreen)
                {   
                    if(typeof jQuery != 'undefined')
                    {
                        idev.internal.addStyleSheet(idev.internal.addForceLoad(_preferences.libpath+"loader/loading.css"));
                        idev.internal.addStyleSheet(idev.internal.addForceLoad(_preferences.libpath+"loader/jquery.percentageloader.css"));
                        this.loader = null;
                        this.progress = 0;
                        var that = this;
                        idev.internal.addScript(_preferences.libpath+"loader/jquery.percentageloader.min.js",function(){
                            var loader = $('#_idevloader').percentageLoader({
                                width: 200,
                                height: 200,
                                progress: 0,
                                value: that.loaderText
                            });
                            that.loader = loader;
                        });
                    }
                    else
                    {
                        idev.internal.addScript(_preferences.libpath+"jquery191min.js");
                        $delay(100,function()
                        {
                            idevLoader.render();
                        });
                        return;
                    }
                }
                else
                {
                    var loader = $('#loader');
                    loader.append("<image src='"+_preferences.imagepath+_preferences.splashScreen+"' />");

                    this.loader = loader;
                }
            }
            else
            {
                idev.internal.addStyleSheet(idev.internal.addForceLoad(_preferences.libpath+"loader/legacy-loading.css"));
            }

            $delay(200,function()
            {
                idev.internal.loadDependants();
            });
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
            
            if((!idev.isIE8() && !idev.isIE7()) && !_preferences.legacyLoader)
            {
                if(_preferences.splashScreen == "" || !_preferences.splashScreen)
                {
                    var addPercent = 1 / idev.dependancy.length;
                    var loopCount = 0;
                    var roundedValue = Math.round(addPercent * 100);
                    var that = this;
                    var loop = window.setInterval(function(){
                        if(loopCount == roundedValue)
                        {
                            // Last Loop
                            that.progress = that.progress + (addPercent - (roundedValue / 100));
                        }

                        if(loopCount >= roundedValue)
                        {
                            loopCount = 0;
                            window.clearInterval(loop);
                        }
                        else
                        {
                            that.progress = that.progress + 0.01;
                            try {
                                that.loader.setProgress(that.progress);
                            } catch(e){ }
                        }
                        loopCount++;
                    },25);
                }
            }
            else
            {
                if(_preferences.splashScreen == "" || !_preferences.splashScreen)
                {
                    var prg = document.getElementById("_idevloader");
                    var w = prg.style.width;
                    w = parseInt(this.width / this.steps * nStep);
                    prg.style.width = w + "px";
                }
            }
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
            if(!idev.isIE8() && !idev.isIE7() && !_preferences.legacyLoader)
            {
                var div = $('#_idevloader');
                div.remove();
            }
            else
            {
                document.body.removeChild(wgt.div);
            }
            wgt.div = null;
        },this);
        if(_preferences.splashScreen != "" && _preferences.splashScreen)
        {
            if(this.loader) this.loader.remove();
        }
    }
};
idevLoader.init();