Ext.define('App.view.UserWizardToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias : 'widget.userWizardToolbar',

    border: false,

    initComponent: function() {

        var buttonDefaults = {
            scale: 'medium',
            iconAlign: 'top',
            minWidth: 64
        };

        this.items = [
            {
                xtype: 'buttongroup',
                columns: 1,
                defaults: buttonDefaults,
                items: [
                    {
                        text: 'Save',
                        iconCls: 'icon-btn-save-24'
                    }
                ]
            },
            '->',
            {
                xtype: 'buttongroup',
                columns: 3,
                defaults: buttonDefaults,
                items: [
                    {
                        text: 'Previous',
                        iconCls: 'icon-btn-arrow-left-24'
                    },
                    {
                        text: 'Next',
                        iconCls: 'icon-btn-arrow-right-24'
                    },
                    {
                        text: 'Finish',
                        iconCls: 'icon-btn-tick-24'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }

});
