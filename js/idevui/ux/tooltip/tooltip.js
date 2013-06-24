
idev.ux.widgetTooltip = baseWidget.extend(
{
	init: function(config)
	{
		idev.ux.loadCSS("tooltip/tooltip.css");
		this._super(config);
		this.wtype = "tooltip";
		this.element = config.element || false;
		this.content = config.content || '';
		this.options = config.options || {};
		this.cls = config.cls || "ui-tooltip"
		this.tpl = new idev.wTemplate();

		// Preferences
		var conf = _preferences.config.tooltip;
		var found;
		for(var prop in conf)
		{
			found = false;
			for(var option in this.options)
			{
				if(prop == option) found = true;
			}

			if(!found) this.options[prop] = conf[prop];
		}

		// Build Options
		if(!this.options.tipContent) this.options.tipContent = this.content;
		this.options.toolTipClass = this.cls;

		idev.internal.add(this);
	},
	render: function()
	{
		if(!this.element) return;

		var wgt = this;

		idev.internal.addScript(_preferences.libpath + "ux/tooltip/jquery.atooltip.min.js",function(){
			try {
				$('#'+wgt.element).aToolTip(wgt.options);
			} catch(e) {
				$debug('Tooltip Error: '+e.message);
			}
		});
	},
	getPos: function()
	{
		try {
			return this.api.getPos();
		} catch(e) {
			$debug('Tooltip Error: '+e);
			return false;
		}
	},
	setPos: function(newPosX, newPosY)
	{
		try {
			return this.api.setPos(newPosX, newPosY);
		} catch(e) {
			$debug('Tooltip Error: '+e);
			return false;
		}
	},
	show: function()
	{
		try {
			return this.api.show();
		} catch(e) {
			$debug('Tooltip Error: '+e);
			return false;
		}
	},
	hide: function()
	{
		try {
			return this.api.hide();
		} catch(e) {
			$debug('Tooltip Error: '+e);
			return false;
		}
	},
	update: function(newContent)
	{
		try {
			return this.api.update(newContent);
		} catch(e) {
			$debug('Tooltip Error: '+e);
			return false;
		}
	},
	load: function(url, data)
	{
		try {
			return this.api.load(url, data);
		} catch(e) {
			$debug('Tooltip Error: '+e);
			return false;
		}
	}
});
idev.register("tooltip",idev.ux.widgetTooltip);