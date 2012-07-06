///////////////////////////////////////////////////////////////////////
/*
    Title:    Mobile Application
    Created:
    Author:
    Description:
    
    Application developed using iDev Mobile app.

*/
///////////////////////////////////////////////////////////////////////

var sAjaxUrl = "ajax.php";

// Create pages in JSON

var page1 =  {
    name:'Home',
    labelWidth:120,
    cls:'pageCls',
    header: { 
            height:100,
            cls:'headerCls', 
            widgets: [
                {
                    wtype:'image',
                    x:350,
                    y:5,
                    width:96,
                    height:96,
                    src:'images/earth-red.png',
                    events: {
                        click: function(img)
                        {
                        }
                    }
                },                
                {
                    wtype:'label',
                    x:5,
                    y:55,
                    text:"Mobile Web Development",
                    style:'',
                    width:460
                }
            ]
        },
    content: {
        height:455,
        padding:5,
        widgets: [                
            {
                wtype:'panel',
                x:5,
                y:5,
                width:440,
                height:420,
                autoScroll:false,
                border:false,
                roundCorners:false,
                style:'',
                html: "Some Panel Text"
            }         
        ]
    },
    footer: {
        height:50,
        style:'', 
        html: "footer"
    }, 
    events: {
        afterRender: function(page)
        {
             // alert(page.data.footer);                                
        }
    }
};

var page2 =  {
    name:'Menu Page',
    cls:'pageCls',
    content: {
        height:578,
        padding:5,
        widgets: [                
            {
                wtype:'panel',
                x:5,
                y:5,
                width:440,
                height:420,
                autoScroll:false,
                border:false,
                roundCorners:false,
                style:'',
                html: "Some Panel Text"
            }         
        ]
    },
    events: {
        afterRender: function(page)
        {
        }
    }
};

///////////////////////////////////////////////////////////////////////
// Main application object

idev.app = {
    title:'Mobile App',
    toolbar: {
        widgets: [
                {
                    wtype:'button',
                    id:'idHome', 
                    width:90, 
                    text:'Home',
                    iconAlign:'left',
                    color:'blue', 
                    icon:'home',
                    events : {
                        click: function(page,btn)
                        {
                            idev.homePage();
                        }
                    } 
                },
                {
                    wtype:'label',
                    width:180,
                    text:'Mobile App',
                    style:'color:#fff;padding-top:4;text-align:center;'
                },
                '>>',
                {
                    wtype:'buttonrwd',
                    id:'idBack',
                    width:90,
                    color:'blue', 
                    text:'Back',
                    events : {
                        click: function(page,btn)
                        {
                            idev.pageManager.prevPage();
                        }
                    } 
                },      
                {
                    wtype:'spacer',
                    width:2
                },
                {
                    wtype:'buttonfwd',
                    id:'idNext', 
                    width:90,
                    color:'blue', 
                    text:'Next', 
                    events : {
                        click: function(page,btn)
                        {
                            idev.pageManager.nextPage();
                        }
                    } 
                } 
            ]        
        },
    pages : [ // Add pages here
        page1,
        page2
    ]
};
idev.onReady(function()
{        
    idev.pageManager.showPage(0);            
});
       