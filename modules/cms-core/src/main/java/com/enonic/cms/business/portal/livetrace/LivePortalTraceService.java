/*
 * Copyright 2000-2011 Enonic AS
 * http://www.enonic.com/license
 */
package com.enonic.cms.business.portal.livetrace;

import java.util.List;

/**
 * Oct 6, 2010
 */
public interface LivePortalTraceService
{
    boolean tracingEnabled();

    PortalRequestTrace startPortalRequestTracing( String url );

    PageRenderingTrace startPageRenderTracing( PortalRequestTrace portalRequestTrace );

    WindowRenderingTrace startWindowRenderTracing( PortalRequestTrace portalRequestTrace );

    DatasourceExecutionTrace startPageTemplateDatasourceExecutionTracing( String datasourceMethodName );

    DatasourceExecutionTrace startPortletDatasourceExecutionTracing( String datasourceMethodName );

    InstructionPostProcessingTrace startInstructionPostProcessingTracingForWindow();

    InstructionPostProcessingTrace startInstructionPostProcessingTracingForPage();

    AttachmentRequestTrace startAttachmentRequestTracing( PortalRequestTrace portalRequestTrace );

    ImageRequestTrace startImageRequestTracing( PortalRequestTrace portalRequestTrace );

    PortalRequestTrace getCurrentPortalRequestTrace();

    DatasourceExecutionTrace getCurrentDatasourceExecutionTrace();

    ImageRequestTrace getCurrentImageRequestTrace();

    void stopTracing( PortalRequestTrace livePortalRequestTrace );

    void stopTracing( PageRenderingTrace pageRenderTrace );

    void stopTracing( WindowRenderingTrace windowRenderingTrace );

    void stopTracing( DatasourceExecutionTrace datasourceExecutionTrace );

    void stopTracing( AttachmentRequestTrace attachmentRequestTrace );

    void stopTracing( ImageRequestTrace imageRequestTrace );

    void stopTracing( InstructionPostProcessingTrace trace );

    List<PortalRequestTrace> getCurrentPortalRequestTraces();

    List<PastPortalRequestTrace> getHistorySince( long historyNumber );

    List<PortalRequestTrace> getLongestTimePortalPageRequestTraces();

    List<PortalRequestTrace> getLongestTimePortalAttachmentRequestTraces();

    List<PortalRequestTrace> getLongestTimePortalImageRequestTraces();

    void clearLongestPageRequestsTraces();

    void clearLongestAttachmentRequestTraces();

    void clearLongestImageRequestTraces();
}
