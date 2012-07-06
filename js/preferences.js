////////////////////////////////////////////////////////////////////////////////
/*  iDev UI preferences

    Use this document to define your application script file and configuration
    
    All paths are relative to the folder where index.html can be found
*/
////////////////////////////////////////////////////////////////////////////////
var _preferences = {
    title:'Mobile App',
    blankimage:"js/idevui/images/s.gif",  
    rootpath:'/',
    libpath:"js/idevui/",
    language:'english',
    languagepath:'/js/',
    imagepath:'/images/',
    apppath:'js/',
    app:'app.js',
    theme:'default',
    startPage:0,
    useCSS3:false,
    styling:'css/style.css',
    // Default button style.
    button: {
        startcolor: '#bbb',
        endcolor: '#fefefe:70-#ddd',
        fontcolor: '#000',
        fontsize:14,
        fontweight:'normal',
        iconcolor:'#000',
        radius:6
    },
    // Framework user eXtensions (loaded from libpath).
    ux:[
        "gauge/gauge.js",
        "uploader/uploader.js",
        "datepicker/datepicker.js",
        "signature/signature.js",
        "pictures/pictures.js",
        "treeview/treeview.js"
    ],
    // General application import files (loaded from apppath).
    imports:[
    ],
    config: {
        charts:false,
        norightclick:true,
        fitDocument:true,
        pageFit:true
    }
};

////////////////////////////////////////////////////////////////////////////////

