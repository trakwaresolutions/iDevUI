
idev.ux.widgetTreeview = baseWidget.extend(
{
    init: function(config)
    {
        idev.ux.loadCSS("treeview/treeview.css")
        this._super( config );
        this.wtype = "treeview";
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element' style='{elementstyle}{style};'>",
            "</div>" );
        this.root = config.root;
        if (typeof this.root == "string")
        {
            try { this.root = $.parseJSON(this.root);}
            catch(e){ }
        }
        this.treeCls = config.treeCls || "";
        this.collapsed = config.collapsed;
        this.persist = config.persist;
        this.cookieId = config.cookieId;
        this.animated = config.animated;
        idev.internal.add(this);
    }, 
    buildBranch: function(data)
    {
        var tree = "";
        for (var t = 0;t < data.length;t++)
        {
            var child = data[t];
            var style = "cursor:pointer;";                
            if (child.icon) style +="background-image:url("+child.icon+");padding-left:20px;background-repeat: no-repeat;";
            if (child.children)
            {
                child.id = this.id + "-node-" + this.node;
                if (child.expanded)
                    tree += "<li id='" + child.id + "'><span class='"+child.cls+"' style='"+style+"'>" + child.text + "</span>";
                else
                    tree += "<li id='" + child.id + "' class='closed'><span class='"+child.cls+"' style='"+style+"'>" + child.text + "</span>";
                this.node++;
                tree += "<ul id='" + this.id + "-node-" + this.node + "-ul'>"
                if (child.children) tree += this.buildBranch(child.children);
                tree += "</ul>";
                tree += "</li>";
            }
            else
            {
                child.id =  this.id + "-node-" + this.node;
                tree += "<li id='" + child.id + "' ><span class='"+child.cls+"' style='"+style+"'>" + child.text + "</span></li>";
                this.node++;
            }
        }
        return tree;
    },                                
    buildTree: function()
    {
        var tree = "";
        this.node = 0;
        if (this.root)
        {
            var style = "cursor:pointer;";                
            var cls = "";                
            if (this.root.icon) style+="background-image:url("+this.root.icon+");padding-left:20px;";
            if (this.root.iconCls) cls=this.root.iconCls;
            this.root.id = this.id + "-node-" + this.node;
            tree += "<ul id='"+this.id+"-tree' class='" + this.treeCls + "'>";
            tree += "<li id='" + this.root.id + "'><span class='"+this.root.cls+"' style='"+style+"'>" + this.root.text + "</span>";
            tree += "<ul id='" + this.id + "-node-" + this.node + "-ul'>"
            this.node++;
            if (this.root.children) tree += this.buildBranch(this.root.children);
            tree += "</ul>";
            tree += "</li></ul>";
        }
        return tree;
    },                                
    render : function()
    {
        if (this.renderTo == null) return;

        var data = new Array();
        
        data['id'] = this.id;
        data['width'] = this.width;
        data['height'] = this.height;
        data['elementstyle'] = this.elementStyle;
        data['style'] = this.style + ";overflow:auto;";
        
        var  sHTML = this.tpl.render(data);
        $("#" + this.renderTo).append(sHTML);

        idev.ux.loadScript("treeview/jqtreeview.js",function(widget)
        {
            widget.refresh();
            if (widget.events.afterrender) widget.events.afterrender(widget);
            widget.rendered = true;        
        },this);
    },
    refresh:function()
    {
        var sTree = this.buildTree();
        
        $("#" + this.id).html(sTree);
        this.tree = $("#"+this.id+"-tree").treeview({
            collapsed:this.collapsed,
            animated:this.animated,
            persist: this.persist ? "cookie" : null,
            cookieId: this.cookieId,
            toggle:function()
            {
                var expanding = $("#"+this.id).hasClass("collapsable");
                var text = $("#"+this.id+" span").html();
                
                var id = $("#"+this.id).attr("id");
                var p = id.indexOf("-",3);
                var wid = id.substr(0,p);
                var wgt = $get(wid);
                p = id.lastIndexOf("-");
                var index = id.substr(p+1); 
                if (wgt)
                {
                    if (wgt.events.toggle) 
                    {
                        wgt.events.toggle(wgt,id,index,text,expanding);
                    } 
                }
            }
        });
        if (this.events.click)
        {
            $(".treeview li").filter(function(index)
            {
                if ($(this).attr("id").indexOf("-folder") != -1) return false;
                return true; 
                
            }).click(function(e)
            {
                var text = $("#"+this.id+" span").html();
                var id = $("#"+this.id).attr("id");
                var p = id.indexOf("-",3);
                var wid = id.substr(0,p);
                var wgt = $get(wid);
                p = id.lastIndexOf("-")
                var index = id.substr(p+1); 
                if (wgt)
                {
                    if (wgt.events.click) wgt.events.click(wgt,id,index,text); 
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        }
        if (this.events.dblclick)
        {
            $(".treeview li").filter(function(index)
            {
                if ($(this).attr("id").indexOf("-folder") != -1) return false;
                return true; 
                
            }).dblclick(function(e)
            {
                var text = $("#"+this.id+" span").html();
                var id = $("#"+this.id).attr("id");
                var p = id.indexOf("-",3);
                var wid = id.substr(0,p);
                var wgt = $get(wid);
                p = id.lastIndexOf("-")
                var index = id.substr(p+1); 
                if (wgt)
                {
                    if (wgt.events.dblclick) wgt.events.dblclick(wgt,id,index,text); 
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        }
    },
    set:function(nodes)
    {
        if (typeof nodes == "string")
        {
            try { this.root = $.parseJSON(nodes);}
            catch(e){ }
        }
        else
            this.root = jQuery.extend(true, {}, nodes);
        this.refresh();
    },
    getRoot:function()
    {
        return this.root;    
    },
    getChild:function(node,index)
    {
        if (node.children == null) return null
        return node.children[index];    
    },
    getNodeId:function(node)
    {
        if (this.root) return this.root.id;
        return "";    
    },
    findNodeById:function(node,id)
    {
        this.targetParent = null;
        this.targetIndex = 0;
        if (node.id == id) return node;
        if (node.children != null)
        {
            this.targetParent = node;
            for (var c = 0;c < node.children.length;c++)
            {
                this.targetIndex = c;
                var child = node.children[c];
                if (child.id == id) return child;
                if (child.children != null)
                {
                    var found = this.findNodeById(child,id);
                    if (found) return found;
                }
            }            
        }
        return null;
    },
    find:function(node,text)
    {
        this.targetParent = null;
        this.targetIndex = 0;
        if (node.id == id) return node;
        if (node.children != null)
        {
            this.targetParent = node;
            for (var c = 0;c < node.children.length;c++)
            {
                this.targetIndex = c;
                var child = node.children[c];
                if (child.text == text) return child;
                if (child.children != null)
                {
                    var found = this.find(child,text);
                    if (found) return found;
                }
            }            
        }
        return null;
    },
    add : function(node,nodes)
    {
        if (this.root == null)
        {
            this.root = jQuery.extend(true, {}, nodes);
        }
        else
        {
            if (node == null) return false;
            this.targetNode =  this.findNodeById(this.root,node.id);       
            if (this.targetNode == null) return false;
            if (this.targetNode.children == null) this.targetNode.children = new Array();
            this.targetNode.children.push(jQuery.extend(true, {}, nodes));
        }
        this.refresh();
        return true;
    },
    remove : function(node)
    {
        if (node == null) return false;
        this.targetNode =  this.findNodeById(this.root,node.id);     
        if (this.targetNode == null) return false;
        if (this.targetParent == null) return false;
        this.targetParent.children.splice(this.targetIndex,1);
        this.refresh();
        return true;
    },
    clear : function()
    {
        this.root = null;
        this.refresh();
    },
    getText : function(node)
    {
        return node.text;
    },
    setText : function(node,text)
    {
        node.text = text;
        $("#"+node.id+" span:first").html(text);
    },
    toString:function()
    {
        if (this.root == null) return "";
        return idev.utils.JSON2string(this.root);
    }
});
idev.register("treeview",idev.ux.widgetTreeview);
