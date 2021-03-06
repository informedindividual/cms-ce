/*
 * Copyright 2000-2011 Enonic AS
 * http://www.enonic.com/license
 */
package com.enonic.cms.business.core.content;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.enonic.cms.business.core.security.SecurityService;

import com.enonic.cms.domain.security.group.GroupEntity;
import com.enonic.cms.domain.security.group.GroupKey;
import com.enonic.cms.domain.security.user.UserEntity;


public class ContentSecurityFilterResolver
{

    private SecurityService securityService;

    public Collection<GroupKey> resolveGroupKeys( UserEntity user )
    {

        Set<GroupKey> groupKeys = new HashSet<GroupKey>();

        if ( user.isRoot() )
        {
            // returning null means do not not perform access rights
            return null;
        }

        // add the given users all group keys
        groupKeys.addAll( user.getAllMembershipsGroupKeys() );

        // return at this stage if anonymous user
        if ( user.isAnonymous() )
        {
            return groupKeys;
        }

        // add also anonymous user group, since all users are implicit member of this group
        UserEntity anonymousUser = securityService.getUser( securityService.getAnonymousUserKey() );
        groupKeys.add( anonymousUser.getUserGroup().getGroupKey() );

        // add also authenticated users group
        if ( user.getUserStore() != null )
        {
            // PS! All users are always implicit member of authenticated users
            GroupEntity authenticatedUsersGroup = securityService.getAuthenticatedUsersGroup( user.getUserStore() );
            groupKeys.add( authenticatedUsersGroup.getGroupKey() );
            groupKeys.addAll( authenticatedUsersGroup.getAllMembershipsGroupKeys() );
        }

        // check "enterprise admins" group if user is member of that, because enterprise admin group does not have explisit rights
        GroupEntity enterpriseAdminsGroup = securityService.getGroup( securityService.getEnterpriseAdministratorGroup() );
        if ( user.isMemberOf( enterpriseAdminsGroup, true ) )
        {
            // returning null means do not not perform access rights
            return null;
        }

        return groupKeys;
    }


    @Autowired
    public void setSecurityService( @Qualifier("securityService") SecurityService value )
    {
        this.securityService = value;
    }
}
