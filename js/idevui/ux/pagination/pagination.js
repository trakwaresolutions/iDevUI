/*

    iDev UI Framework  copyright (c) 2012 Trakware Solutions Limited.

    Do not remove this copyright message

    Description: pagination widget 
    version    : 1.0.0
    build      : 120726.1

    Started    : 26th July 2012

    Notes:
    
    Distributed as part of iDevUI.

    iDevUI is distributed under the terms of the MIT license for non-commercial
    For more information visit http://www.idevui.com/

    Makes use of jquery

    History:
        1.0.0   2012-07-26  First release

    20120104.1
    - Fixed issue with local datastores.
    
    20120107.1
    - Amended id so that it's value can be specified by the user
    - Added gotoLast for use with local datastores

*/

///////////////////////////////////////////////////////////////////////////////

idev.ux.widgetPagination = baseWidget.extend(
{
    init: function(config)
    {
        if(config.grid)
        {
            this.grid = $get(config.grid);
            this.offset=0;
            config.width = this.grid.width;
            this._super(config);
            this.wtype = "pagination";
            this.id = config.id || this.parent.id + "-pagination";
            this.ds = this.grid.ds;
            this.limit = $get(config.limit);
            this.tpl = new idev.wTemplate(
                "<div id='{id}' class='ui-pagination' style='{elementstyle}{style}'>",
                    "<div id='{id}-leftendbutton' style='margin-top:2px;'></div>",
                    "<div id='{id}-leftbutton'></div>",
                    "<div id='{id}-pageno' style='margin-left:5px;margin-right:5px;text-align:center;'></div>",
                    "<div id='{id}-pageinput' style='margin-left:5px;text-align:center;'></div>",
                    "<div id='{id}-rightbutton'></div>",
                    "<div id='{id}-rightendbutton'></div>",
                    "<div id='{id}-pagesleft' style='float:right;margin-top:6px;padding-right:5px;text-align:right;'></div>",
                "</div>"
            );
            this.pageno = 0;
            idev.internal.add(this);
            this.reset = true;

            // Check for other widgets on the BBar
            if(this.parent.widgets)
            {
                for(var i = 0; i < this.parent.widgets.length; i++)
                {
                    if(this.parent.widgets[i].wtype != 'pagination')
                    {
                        config.width -= this.parent.widgets[i].width;
                    }
                }
            }
            this.width = config.width;

            this.elementStyle += 'width:'+this.width+'px !important;';
        }
        else
        {
            $error("You must define a grid to use pagination.");
        }
    },
    render: function()
    {
        if (this.renderTo == null) return;

        var pb = this;
        var data = new Array();

        data['id'] = this.id;
        data['width'] = this.width;
        data['height'] = this.height;
        data['elementstyle'] = this.elementStyle;
        data['style'] = this.style;
        
        var sHTML = this.tpl.render(data);
        idev.internal.beforeRender(this);
        $("#" + this.renderTo).append(sHTML);

        this.leftendbtn = new idev.ui.widgetButton({
                renderTo: this.id + "-leftendbutton",
                width:25,
                height: 25,
                icon:'arrowfirst',
                parent:this,
                roundCorners: true,
                events: {
                    click: function(btn)
                    {
                        if(!pb.reset) return;
                        // Check if there are pages left to go to
                        var gridOffset = pb.offset;
                        if(!pb.ds.url) var gridOffset = pb.grid.offset;
                        var gridLimit = pb.grid.limit;
                        var recordCount = pb.ds.getTotal();

                        // var pageCount = roundUp(recordCount / gridLimit);
                        if(gridOffset == 0)
                        {
                            var currentPage = 1;
                        }
                        else
                        {
                            var currentPage = (gridOffset / gridLimit) + 1;
                        }

                        var newOffset = 0;

                        if(currentPage !== 1)
                        {
                            // Go to first page
                            pb.offset = newOffset;
                            if(!pb.ds.url) {
                                pb.grid.offset = newOffset;
                            }
                            pb.ds.setParam('offset', newOffset);
                            pb.reset=false;
                            pb.ds.fetch();
                            if(!pb.ds.url) {
                                pb.grid.refresh();
                                pb.refresh();
                            }
                        }
                    }
                }
            });  
        this.leftendbtn.render();

        this.leftbtn = new idev.ui.widgetButton({
                renderTo: this.id + "-leftbutton",
                width:25,
                height: 25,
                icon:'back',
                parent:this,
                roundCorners: true,
                events: {
                    click: function(btn)
                    {
                        if(!pb.reset) return;
                        // Check if there are pages left to go to
                        var gridOffset = pb.offset;
                        if(!pb.ds.url) var gridOffset = pb.grid.offset;
                        var gridLimit = pb.grid.limit;
                        var recordCount = pb.ds.getTotal();

                        // var pageCount = roundUp(recordCount / gridLimit);
                        if(gridOffset == 0)
                        {
                            var currentPage = 1;
                        }
                        else
                        {
                            var currentPage = (gridOffset / gridLimit) + 1;
                        }

                        var newOffset = (currentPage * gridLimit) - (gridLimit * 2);

                        if(currentPage > 1)
                        {
                            // Yep theres pages!
                            pb.offset = newOffset;
                            if(!pb.ds.url) {
                                pb.grid.offset = newOffset;
                            }
                            pb.ds.setParam('offset', newOffset);
                            pb.reset=false;
                            pb.ds.fetch();
                            if(!pb.ds.url) {
                                pb.grid.refresh();
                                pb.refresh();
                            }
                        }
                    }
                }
            });  
        this.leftbtn.render();

        this.pagenolabel = new idev.ui.widgetLabel({
            renderTo: this.id + "-pageno",
            id: this.id + '-pagenolabel',
            width: 50,
            height: 20,
            parent:this,
            roundCorners: true,
            text: "Page",
            style: "margin-top:4px;"
        });
        this.pagenolabel.render();
        
        this.pageinput = new idev.ui.widgetTextField({
            renderTo: this.id + "-pageinput",
            id: this.id + '-pageinputbox',
            width: 30,
            height: 10,
            style:"margin-top:1px;margin-right:5px;text-align:center;",
            parent:this,
            value: "1",
            events: {
                onenter: function(wgt) {
                    if(!pb.reset) return;
                    var newPageNo = wgt.getValue();
                    var gridLimit = pb.grid.limit;
                    var newOffset = (newPageNo * gridLimit) - gridLimit;
                    var recordCount = pb.ds.getTotal();
                    var pageCount = idev.utils.roundUp(recordCount / gridLimit);
                    
                    if(newPageNo <= pageCount && newPageNo > 0)
                    {
                        pb.offset = newOffset;
                        pb.ds.setParam('offset', newOffset);
                        pb.reset=false;
                        // Must be under pb.reset=false as refresh sets to true.
                        if(!pb.ds.url) {
                            pb.grid.offset = newOffset;
                            pb.grid.refresh();
                            pb.refresh();
                        }
                        pb.ds.fetch();
                    }
                }
            }
        });
        this.pageinput.render();

        this.rightbtn = new idev.ui.widgetButton({
            renderTo: this.id + "-rightbutton",
            width:25,
            height: 25,
            icon:'forward',
            parent:this,
            roundCorners: true,
            events: {
                click: function(btn)
                {
                    if(!pb.reset) return;
                    // Check if there are pages left to go to
                    var gridOffset = pb.offset;
                    if(!pb.ds.url) var gridOffset = pb.grid.offset;
                    var gridLimit = pb.grid.limit;
                    var recordCount = pb.ds.getTotal();
                    var pageCount = idev.utils.roundUp(recordCount / gridLimit);
                    if(gridOffset == 0)
                    {
                        var currentPage = 1;
                    }
                    else
                    {
                        var currentPage = (gridOffset / gridLimit) + 1;
                    }

                    var newOffset = currentPage * gridLimit;
                    
                    if(currentPage < pageCount)
                    {
                        // Yep theres pages!
                        pb.offset = newOffset;
                        if(!pb.ds.url) {
                            pb.grid.offset = newOffset;
                        }
                        pb.ds.setParam('offset', newOffset);
                        pb.reset=false;
                        pb.ds.fetch();
                        if(!pb.ds.url) {
                            pb.grid.refresh();
                            pb.refresh();
                        }
                    }
                }
            }
        });  
        this.rightbtn.render();

        this.rightendbtn = new idev.ui.widgetButton({
                renderTo: this.id + "-rightendbutton",
                width:25,
                height: 25,
                icon:'arrowlast',
                parent:this,
                roundCorners: true,
                events: {
                    click: function(btn)
                    {
                        if(!pb.reset) return;
                        // Check if there are pages left to go to
                        var gridOffset = pb.offset;
                        if(!pb.ds.url) var gridOffset = pb.grid.offset;
                        var gridLimit = pb.grid.limit;
                        var recordCount = pb.ds.getTotal();

                        var pageCount = idev.utils.roundUp(recordCount / gridLimit);
                        if(gridOffset == 0)
                        {
                            var currentPage = 1;
                        }
                        else
                        {
                            var currentPage = (gridOffset / gridLimit) + 1;
                        }

                        var newOffset = (pageCount * gridLimit) - gridLimit;

                        if(currentPage !== pageCount)
                        {
                            // Go to first page
                            pb.offset = newOffset;
                            if(!pb.ds.url) {
                                pb.grid.offset = newOffset;
                            }
                            pb.ds.setParam('offset', newOffset);
                            pb.reset=false;
                            pb.ds.fetch();
                            if(!pb.ds.url) {
                                pb.grid.refresh();
                                pb.refresh();
                            }
                        }
                    }
                }
            });  
        this.rightendbtn.render();

        this.pagesleftlabel = new idev.ui.widgetLabel({
            renderTo: this.id + "-pagesleft",
            id: this.id + '-pagesleftlabel',
            width: 130,
            parent:this,
            text: "Page 1 of 1",
            style: "margin-top:-2px;"
        });
        this.pagesleftlabel.render();

        if(!pb.ds.url) pb.refresh();
        if (this.events.afterRender) this.events.afterRender(this);

        this.ds.bind(this);
        this.rendered = true;
    },
    gotoLast: function() {
        if(!this.ds.url) {
            var gridLimit = this.grid.limit;
            var recordCount = this.ds.getTotal();
            var pageCount = idev.utils.roundUp(recordCount / gridLimit);
            var newOffset = gridLimit * (pageCount - 1);
            this.grid.offset = newOffset;
            this.refresh();
            this.grid.refresh();
        }
    },
    refresh: function()
    {
        if(this.reset)
            this.offset = 0;
        else
        {
            this.reset=true;
            this.ds.setParam('offset', 0);
        }
        var pagenolabel = $get(this.id + "-pageno");
        var pagesleftlabel = $get(this.id + "-pagesleft");
        var gridOffset = this.offset;
        if(!this.ds.url) var gridOffset = this.grid.offset;
        var gridLimit = this.grid.limit;
        var recordCount = this.ds.getTotal();
        
        var pageCount = idev.utils.roundUp(recordCount / gridLimit);
        if(gridOffset == 0)
        {
            var currentPage = 1;
        }
        else
        {
            var currentPage = (gridOffset / gridLimit) + 1;
        }
        if(currentPage == 0)
        {
            currentPage = 1;
        }
        
        if(pageCount == 0)
        {
            pageCount = 1;
        }
        if(pageCount < currentPage) {
            currentPage = 1;
            this.grid.offset = 0;
            gridOffset = 0;
        }

        $get(this.id + '-pagenolabel').setValue("Page ");
        $get(this.id + '-pageinputbox').setValue(currentPage);
        $get(this.id + '-pagesleftlabel').setValue("Page "+currentPage+" of "+pageCount);
    },
    ondestroy:function()
    {
        this.leftendbtn.destroy();
        this.leftbtn.destroy();
        this.pagenolabel.destroy();
        this.pageinput.destroy();
        this.rightbtn.destroy();
        this.rightendbtn.destroy();
        this.pagesleftlabel.destroy();
    }
});
idev.register("pagination",idev.ux.widgetPagination);