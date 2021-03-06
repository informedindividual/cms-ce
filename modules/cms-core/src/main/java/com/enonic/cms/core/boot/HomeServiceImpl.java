/*
 * Copyright 2000-2011 Enonic AS
 * http://www.enonic.com/license
 */
package com.enonic.cms.core.boot;

import org.springframework.core.io.Resource;

public class HomeServiceImpl
    implements HomeService
{
    public Resource homeDir;

    public void setHomeDir( Resource homeDir )
    {
        this.homeDir = homeDir;
    }

    public Resource getHomeDir()
    {
        return this.homeDir;
    }
}
