var REQUESTS_REFRESH_TIME = 1000;

Ext.define('LPT.controller.Requests', {
    extend: 'Ext.app.Controller',

    stores: [
        'PortalRequestTraceHistoryListStore',
        'PortalRequestTraceHistoryDetailsStore' ,
        'GeolocationStore',
        'StatusInfo'
    ],
    models: [
        'PortalRequestTraceModel',
        'GeolocationModel',
        'StatusInfo'
    ],
    views: [
        'requests.PortalRequestTraceHistoryGrid',
        'requests.FilterPanel',
        'requests.PortalRequestTraceHistoryPanel',
        'requests.PortalRequestTraceHistoryDetailsPanel',
        'requests.ContextMenu'
    ],

    refs: [
        {ref: 'portalRequestTraceHistoryGrid', selector: 'portalRequestTraceHistoryGrid'},
        {ref: 'filterPanel', selector: 'requestsFilterPanel'},
        {ref: 'mainTabPanel', selector: 'mainTabPanel'},
        {ref: 'portalRequestTraceHistoryDetailsPanel', selector: 'portalRequestTraceHistoryDetailsPanel', xtype: 'portalRequestTraceHistoryDetailsPanel'},
        {ref: 'requestContextMenu', selector: 'requestContextMenu', autoCreate: true, xtype: 'requestContextMenu'}
    ],

    init: function() {
        this.control({
            'portalRequestTraceHistoryGrid': {
                itemdblclick: this.showRequestInfo,
                itemcontextmenu: this.popupMenu
            },
            'portalRequestTraceHistoryGrid > tableview': {
            },
                         '*[action=details]': {
                             click: this.onContextMenuDetails
            },
            '#filterIncludePageRequestsCheckbox': {
                change: this.applyFilterForCmpletedRequests
            },
            '#filterIncludeWindowRequestsCheckbox': {
                change: this.applyFilterForCmpletedRequests
            }
            ,
            '#filterIncludeImageRequestsCheckbox': {
                change: this.applyFilterForCmpletedRequests
            }
            ,
            '#filterIncludeAttachmentRequestsCheckbox': {
                change: this.applyFilterForCmpletedRequests
            }

        });

        this.startAutoRefreshTimer();
    },

    totalFacetStatistics: new FacetStatistics(),

    showRequestInfo: function( view, modelItem, htmlEl, idx, e )
    {
        var req = modelItem;
        if ( req )
        {
            this.showRequestDetails(req);
        }
    },

    getRequestTitleForTab: function(reqData) {
//        var title = reqData.id +' - ';
//        var p = reqData.url.lastIndexOf('/');
//        var url = (p > 0)? '...'+reqData.url.substr(p) : reqData.url;
//        title += url;
//        return title;
        return reqData.url;
    },

    popupMenu: function(view, rec, node, index, e) {
        e.stopEvent();
        this.getRequestContextMenu().showAt(e.getXY());
        return false;
    },

    onContextMenuDetails: function () {
        var req = this.getPortalRequestTraceHistoryGrid().getSelectionModel().selected.get(0);
        this.showRequestDetails(req);
    },

    showRequestDetails: function (selectedRequest) {

        var detailsTab = this.getPortalRequestTraceHistoryDetailsPanel();

        detailsTab.setVisible(true);
        detailsTab.setTitle( "Details of Request #" + selectedRequest.data.id );

        detailsTab.store.setRootNode( {id: selectedRequest.data.id});

        //var path = "Portal request: " + selectedRequest.data["url.siteLocalUrl"];
        var path = "/Portal request";

        // TODO: detailsTab.store.selectPath( path, "text" );
    },

    startAutoRefreshTimer: function () {
        var controller = this;
        setTimeout( function() {
            controller.loadPortalRequests();
        }, REQUESTS_REFRESH_TIME);
    },

    loadPortalRequests: function () {
        var controller = this;
        var store = this.getPortalRequestTraceHistoryGrid().getView().getStore();
        Ext.Ajax.request( {
            url: '/liveportaltrace/rest/portal-request-trace-history/list',
            method: 'GET',
            params: {lastId: store.lastRequestId},
            success: function( response ) {
                var requestJson = Ext.JSON.decode( response.responseText );
                var requestObject, r, requestId, requestArray;

                requestJson = requestJson && requestJson.requests;
                if (requestJson && (requestJson.length > 0)) {
                    // add new requests to grid panel
                    console.log("Parsing requests in json format...");
                    requestArray = [];
                    for (r = 0; r < requestJson.length; r++) {
                        requestObject = controller.requestJsonToModel(requestJson[r]);
                        requestId = requestObject.get('id');

                        if (requestId > store.lastRequestId) {
                            store.lastRequestId = requestId;
                        }
                        requestArray.push(requestObject);
                    }
                    console.log("Inserting requests...");
                    store.insert(0, requestArray);
                    console.log("Loaded " + requestArray.length + " new requests");

                    Ext.Array.each( requestArray, function( item )
                    {
                        var trace = item.data;
                        if ( trace.requestType === "Page" )
                        {
                            controller.totalFacetStatistics.numberOfPageRequests++;
                        } else if ( trace.requestType === "Window" )
                        {
                            controller.totalFacetStatistics.numberOfWindowRequests++;
                        } else if ( trace.requestType === "Image" )
                        {
                            controller.totalFacetStatistics.numberOfImageRequests++;
                        } else if ( trace.requestType === "Attachment" )
                        {
                            controller.totalFacetStatistics.numberOfAttachmentRequests++;
                        }
                    }, this );

                    // update gui
                    controller.getFilterPanel().updateFacetStatistics( controller.totalFacetStatistics );
                }

                controller.startAutoRefreshTimer(); // restart timer
            },
            failure: function() {
                controller.startAutoRefreshTimer(); // restart timer
            }
        });
    },

    applyFilterForCmpletedRequests: function()
    {
        var store = Ext.data.StoreManager.lookup( 'PortalRequestTraceHistoryListStore' );

        var filterIncludePageRequestsCheckbox = Ext.getCmp( 'filterIncludePageRequestsCheckbox' );
        var filterIncludeWindowRequestsCheckbox = Ext.getCmp( 'filterIncludeWindowRequestsCheckbox' );
        var filterIncludeAttachmentRequestsCheckbox = Ext.getCmp( 'filterIncludeAttachmentRequestsCheckbox' );
        var filterIncludeImageRequestsCheckbox = Ext.getCmp( 'filterIncludeImageRequestsCheckbox' );

        var requestTypeFilter = new Ext.util.Filter( {
                                                         filterFn: function( item )
                                                         {
                                                             var dontAccept = false;
                                                             if ( !filterIncludePageRequestsCheckbox.getValue() )
                                                             {
                                                                 dontAccept = item.data.requestType === 'Page';
                                                             }
                                                             if ( dontAccept )
                                                             {
                                                                 return false;
                                                             }

                                                             if ( !filterIncludeWindowRequestsCheckbox.getValue() )
                                                             {
                                                                 dontAccept = item.data.requestType === 'Window';
                                                             }
                                                             if ( dontAccept )
                                                             {
                                                                 return false;
                                                             }

                                                             if ( !filterIncludeAttachmentRequestsCheckbox.getValue() )
                                                             {
                                                                 dontAccept = item.data.requestType === 'Attachment';
                                                             }
                                                             if ( dontAccept )
                                                             {
                                                                 return false;
                                                             }

                                                             if ( !filterIncludeImageRequestsCheckbox.getValue() )
                                                             {
                                                                 dontAccept = item.data.requestType === 'Image';
                                                             }
                                                             if ( dontAccept )
                                                             {
                                                                 return false;
                                                             }

                                                             return true;
                                                         }
                                                     } );

        store.clearFilter();
        store.filter( requestTypeFilter );

        this.getFilterPanel().updateFacetStatistics( this.countFacets() );
    },

    countFacets: function()
    {
        var store = this.getPortalRequestTraceHistoryGrid().getView().getStore();
        var facetStatistics = new FacetStatistics();
        Ext.Array.each( store.data.items, function(item) {

            var trace = item.data;
            if( trace.requestType === "Page" )
            {
                facetStatistics.numberOfPageRequests++;
            }
            else if( trace.requestType === "Window" )
            {
                facetStatistics.numberOfWindowRequests++;
            }
            else if( trace.requestType === "Image" )
            {
                facetStatistics.numberOfImageRequests++;
            }
            else if( trace.requestType === "Attachment" )
            {
                facetStatistics.numberOfAttachmentRequests++;
            }
        }, this);

        return facetStatistics;
    },

    requestJsonToModel: function(requestJson) {
        var requestObject = Ext.create('LPT.model.PortalRequestTraceModel', requestJson);
        requestObject.set('url.originalURL', requestJson.url.originalURL);
        requestObject.set('url.siteLocalUrl', requestJson.url.siteLocalUrl);
        requestObject.set('url.internalURL', requestJson.url.internalURL);
        requestObject.set('site.key', requestJson.site.key);
        requestObject.set('site.name', requestJson.site.name);
        requestObject.set('duration.startTime', requestJson.duration.startTime);
        requestObject.set('duration.milliseconds', requestJson.duration.milliseconds);
        requestObject.set('duration.humanReadable', requestJson.duration.humanReadable);
        requestObject.commit(true);
        return requestObject;
    }

});

function FacetStatistics() {
    this.numberOfPageRequests =  0;
    this.numberOfWindowRequests = 0;
    this.numberOfImageRequests = 0;
    this.numberOfAttachmentRequests = 0;
};