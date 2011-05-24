/*
 * Copyright 2000-2011 Enonic AS
 * http://www.enonic.com/license
 */
package com.enonic.cms.portal;

import javax.inject.Inject;

import com.enonic.cms.core.content.ContentEntity;
import com.enonic.cms.core.resolver.ContentAccessResolver;
import com.enonic.cms.core.security.user.UserEntity;
import com.enonic.cms.core.resolver.MenuItemAccessResolver;
import com.enonic.cms.core.structure.menuitem.MenuItemAccessType;
import com.enonic.cms.core.structure.menuitem.MenuItemEntity;
import com.enonic.cms.store.dao.GroupDao;

import com.enonic.cms.domain.SitePath;

/**
 * This is called a Service because it not only checks the access but also throws corresponding exceptions.
 */
public class PortalAccessService
{
    @Inject
    private GroupDao groupDao;

    public void checkAccessToPage( MenuItemEntity menuItem, SitePath requestedPath, UserEntity requester )
    {
        MenuItemAccessResolver menuItemAccessResolver = new MenuItemAccessResolver( groupDao );
        boolean hasAccess = menuItemAccessResolver.hasAccess( requester, menuItem, MenuItemAccessType.READ );

        if ( !hasAccess )
        {
            if ( requester.isAnonymous() )
            {
                throw new PathRequiresAuthenticationException( requestedPath );
            }
            else
            {
                throw new PortalAccessDeniedException( menuItem.getMenuItemKey() );
            }
        }
    }

    public void checkAccessToContent( SitePath requestedPath, UserEntity requester, ContentEntity requestedContent,
                                      MenuItemEntity requestedMenuItem )
    {

        ContentAccessResolver contentAccessResolver = new ContentAccessResolver( groupDao );
        boolean hasAccess = contentAccessResolver.hasReadContentAccess( requester, requestedContent );

        if ( !hasAccess )
        {
            if ( requester.isAnonymous() )
            {
                throw new PathRequiresAuthenticationException( requestedPath );
            }
            else
            {
                throw new PortalAccessDeniedException( requestedMenuItem.getMenuItemKey() );
            }
        }
    }
}