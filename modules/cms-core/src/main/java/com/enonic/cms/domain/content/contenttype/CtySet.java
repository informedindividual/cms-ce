/*
 * Copyright 2000-2011 Enonic AS
 * http://www.enonic.com/license
 */
package com.enonic.cms.domain.content.contenttype;

import java.util.List;

import com.enonic.cms.domain.content.contenttype.dataentryconfig.DataEntryConfig;

public interface CtySet
{

    DataEntryConfig getInputConfig( String name );

    DataEntryConfig getInputConfigByRelativeXPath( String path );

    List<DataEntryConfig> getInputConfigs();

    CtySetConfig getSetConfig( String name );

    CtySetConfig getSetConfigByRelativeXPath( String path );

    List<CtySetConfig> getSetConfig();

    String getRelativeXPath();

}
