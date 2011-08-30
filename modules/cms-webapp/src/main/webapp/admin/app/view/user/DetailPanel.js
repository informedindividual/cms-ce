Ext.define('CMS.view.user.DetailPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.userDetail',

    title: 'Details',
    split: true,
    autoScroll: true,
    layout: 'fit',
    layout: 'card',
    collapsible: true,

    initComponent: function() {

        this.dockedItems = [
            {
                dock: 'top',
                xtype: 'toolbar',
                border: false,
                padding: 5,
                items: [
                    {
                        text: 'Edit User',
                        iconCls: 'icon-edit-user',
                        action: 'edit'
                    },
                    {
                        text: 'Delete User',
                        iconCls: 'icon-delete-user',
                        action: 'showDeleteWindow'
                    },
                    '-',
                    {
                        text: 'Change Password',
                        iconCls: 'icon-change-password',
                        action: 'changePassword'
                    }
                ]
            }
        ];
        var largeBoxesPanel = this.createLargeBoxSelection();
        var smallBoxesPanel = this.createSmallBoxSelection();
        var detailsPanel = this.createSingleBoxSelection();
        this.items = [detailsPanel, largeBoxesPanel, smallBoxesPanel];
        this.callParent(arguments);
    },

    showMultipleSelection: function(data, detailed){
        var activeItem;
        if (detailed){
            activeItem = this.down('#largeBoxPanel');
            this.getLayout().setActiveItem('largeBoxPanel');
        }else{
            activeItem = this.down('#smallBoxPanel');
            this.getLayout().setActiveItem('smallBoxPanel');
        }
        activeItem.update({users: data});
    },

    showSingleSelection: function(data){
        var activeItem = this.down('#singleDetailsPanel');
        this.getLayout().setActiveItem('singleDetailsPanel');
        activeItem.update(data);
    },

    createSingleBoxSelection: function(){
        var tpl = new Ext.XTemplate(
                '<div class="detail-panel-container">',
                '<div id="" class="detail-left-panel"><div class=""><div class="">',
                '<table cellspacing="0">', '<tr><td colspan="1" rowspan="2">',
                '<img src="data/user/photo?key={key}&thumb=true" class="x-component x-component-default">',
                '</td>', '<td colspan="1" rowspan="1">',
                '<div class=""><div class=" "><div class="x-form-display-field">{name}</div></div>',
                '<div style="display:none" class=""></div><div class="x-clear"></div></div>',
                '</td></tr>', '<tr><td colspan="1" rowspan="1" class=" "><div>',
                '<div class=" "><div class="x-form-display-field">{qualifiedName}</div>',
                '</div><div style="display:none" class=""></div><div class=""></div></div>',
                '</td></tr>', '</table>', '</div>',
                '<fieldset class="x-fieldset x-fieldset-default">',
                '<legend class="x-fieldset-header x-fieldset-header-default">',
                '<div class="x-component x-fieldset-header-text x-component-default">User</div><div class="x-clear"></div>',
                '</legend>',
                '<div class="x-fieldset-body"><div class="x-field x-form-item x-field-default">',
                '<label class="x-form-item-label x-form-item-label-left">username:</label>',
                '<div class="x-form-item-body "><div class="x-form-display-field">{name}</div></div>',
                '<div style="display:none" class="x-form-error-msg"></div><div class="x-clear"></div></div>',
                '<tpl if="this.hasEmail(email)">',
                '<div class="x-field x-form-item x-field-default"><label class="x-form-item-label x-form-item-label-left">email:</label>',
                '<div class="x-form-item-body "><div class="x-form-display-field">{email}</div></div><div style="display:none" class="x-form-error-msg"></div>',
                '</tpl>',
                '<div class="x-clear"></div></div><div class="x-clear"></div></div>',
                '</fieldset>', '<div class="x-clear"></div></div></div>',
                '<div id="" class="detail-right-panel">',
                '<div class="x-panel-header x-panel-header-default">',
                '<span class="x-panel-header-text x-panel-header-text-default">Details</span></div>',
                '<div class="x-panel-body x-panel-body-default detail-right-panel-div">',
                '<fieldset class="x-fieldset x-fieldset-default">',
                '<legend class="x-fieldset-header x-fieldset-header-default">',
                '<div class="">Info</div><div class=""></div>', '</legend>',
                '<div class=""><div class="x-field x-form-item">',
                '<label class="x-form-item-label x-form-item-label-left">Last logged in:</label>',
                '<div class=" "><div class="x-form-display-field">{lastModified}</div></div>',
                '<div style="display:none" class="x-form-error-msg"></div><div class="x-clear"></div></div>',
                '<div class="x-field x-form-item"><label class="x-form-item-label x-form-item-label-left">Created:</label>',
                '<div class="x-form-item-body "><div class="x-form-display-field">{created}</div></div>',
                '<div style="display:none" class="x-form-error-msg"></div><div class="x-clear"><!-- --></div></div><div class="x-clear"></div></div>',
                '</fieldset>',
                '<tpl if="this.hasGroups(groups)">',
                '<fieldset class="x-fieldset x-fieldset-default">',
                '<legend class="x-fieldset-header x-fieldset-header-default">',
                '<div class="t">Groups</div><div class=""></div>', '</legend>',
                '<div class="x-fieldset-body"><div class="x-btn group-display x-btn-default-small x-icon-text-left x-btn-icon-text-left x-btn-default-small-icon-text-left">',
                '<tpl for="groups">',
                '<em>',
                '<button autocomplete="off" role="button" hidefocus="true" type="button">',
                '<span class="x-btn-inner">{name}</span>',
                '<span class="x-btn-icon icon-group"></span>', '</button>', '</em>',
                '</tpl>',
                '</div><div class="x-clear"></div> </div>', '</fieldset>',
                '</tpl>',
                '<div class="x-clear"></div></div></div></div></div>',

                {
                    hasGroups: function( groups )
                    {
                        return groups.length > 0;
                    },
                    hasEmail: function( email )
                    {
                        return email != null;
                    }

                } );
        var panel = {
            xtype: 'panel',
            itemId: 'singleDetailsPanel',
            styleHtmlContent: true,
            tpl: tpl
        }
        return panel;
    },

    generateFieldSet: function(title, fields, userData){
        var displayFields = [];
        Ext.Array.each(fields, function(field){
            var fieldValue = userData[field];
            if ((fieldValue == null) && (userData.userInfo != null) ){
                fieldValue = userData.userInfo[field];
            }
            if (fieldValue != null){
                var displayField = {
                    xtype: 'displayfield',
                    fieldLabel: field,
                    value: fieldValue
                };
                Ext.Array.include( displayFields, displayField );
            }

        });
        if (displayFields.length > 0){
            var fieldSet = {
                xtype: 'fieldset',
                title: title,
                items: displayFields
            };
            return fieldSet;
        }else{
            return null;
        }

    },

    generateGroupsFieldSet: function (userData){
        var groupFields = [];
        Ext.Array.each(userData.groups, function(group){
            var groupField = {
                    xtype: 'button',
                    text: group.name,
                    iconCls: 'icon-group',
                    cls: 'group-display',
                    margin: 5
                };
            Ext.Array.include(groupFields, groupField);
        });
        if (groupFields.length > 0){
            var groupFieldSet = {
                xtype: 'fieldset',
                width: 300,
                title: 'Groups',
                items: groupFields
            };
            return groupFieldSet;
        }else{
            return null;
        }
    },

    createLargeBoxSelection: function(){
        var tpl = Ext.Template('<tpl for="users">' +
           '<div class="cms-selected-item-box large x-btn-default-large clearfix">' +
           '<div class="left">' +
           '<img alt="User" src="data/user/photo?key={key}&thumb=true"/></div>' +
           '<div class="center">' +
           '<h2>{displayName}</h2>' +
           '<p>{userStore}/{name}</p></div>' +
           '<div class="right">' +
           ' <a href=""></a></div></div>' +
           '</tpl>');
        var panel = {
            xtype: 'panel',
            itemId: 'largeBoxPanel',
            styleHtmlContent: true,
            tpl: tpl
        }
        return panel;
    },

    createSmallBoxSelection: function(){
        var tpl = Ext.Template('<tpl for="users">' +
            '<div class="cms-selected-item-box small x-btn-default-small clearfix">' +
            '<div class="cms-selected-item-box left">' +
            '<img alt="User" src="data/user/photo?key={key}&thumb=true"/></div>' +
            '<div class="cms-selected-item-box center">' +
            '<h2>{displayName}</h2></div>' +
            '<div class="cms-selected-item-box right">' +
            '<a href="javascript;"></a></div></div>'+
            '</tpl>');
        var panel = {
            xtype: 'panel',
            itemId: 'smallBoxPanel',
            styleHtmlContent: true,
            tpl: tpl
        }
        return panel;
    },

    generateUserButton: function(userData, shortInfo){
        if (shortInfo){
            return {
                xtype: 'userShortDetailButton',
                userData: userData
            };
        }else{
            return {
                xtype: 'userDetailButton',
                userData: userData
            };
        }
    },

    setCurrentUser: function(user){
        this.currentUser = user;
    },

    getCurrentUser: function(){
        return this.currentUser;
    }

});
