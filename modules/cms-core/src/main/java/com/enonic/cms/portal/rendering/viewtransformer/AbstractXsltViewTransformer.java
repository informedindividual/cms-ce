/*
 * Copyright 2000-2011 Enonic AS
 * http://www.enonic.com/license
 */
package com.enonic.cms.portal.rendering.viewtransformer;

import javax.xml.transform.TransformerException;

import com.enonic.cms.core.xslt.*;
import org.jdom.Document;
import org.slf4j.Logger;

import com.enonic.cms.core.resource.ResourceKey;
import com.enonic.cms.core.resource.ResourceService;

/**
 * May 13, 2009
 */
public abstract class AbstractXsltViewTransformer

{
    protected final static String XSLT_NS = "http://www.w3.org/1999/XSL/Transform";

    protected ResourceService resourceService;

    protected void logXsltProcessorErrors( XsltProcessorErrors errors, Logger logger )
    {
        if ( errors == null )
        {
            return;
        }

        for ( TransformerException error : errors.getFatalErrors() )
        {
            logger.error( error.getMessageAndLocation() );
        }

        for ( TransformerException error : errors.getErrors() )
        {
            logger.error( error.getMessageAndLocation() );
        }

        for ( TransformerException error : errors.getWarnings() )
        {
            logger.warn( error.getMessageAndLocation() );
        }
    }

    protected XsltProcessor createProcessor( ResourceKey styleSheetKey, Document xslt )
        throws XsltProcessorException
    {
        final XsltProcessorManager manager = XsltProcessorManagerAccessor.getProcessorManager();
        return manager.createProcessor( XsltResource.create(styleSheetKey.toString(), xslt) );
    }

    protected XsltProcessor createProcessor( ResourceKey styleSheetKey, Document xslt, boolean omitXmlDecl )
        throws XsltProcessorException
    {
        XsltProcessor processor;
        processor = createProcessor( styleSheetKey, xslt );
        processor.setOmitXmlDecl( omitXmlDecl );
        return processor;
    }
}
