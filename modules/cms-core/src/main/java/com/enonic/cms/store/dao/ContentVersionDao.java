/*
 * Copyright 2000-2011 Enonic AS
 * http://www.enonic.com/license
 */
package com.enonic.cms.store.dao;

import java.util.List;

import com.enonic.cms.domain.content.ContentVersionEntity;
import com.enonic.cms.domain.content.ContentVersionKey;
import com.enonic.cms.domain.content.ContentVersionSpecification;


public interface ContentVersionDao
    extends EntityDao<ContentVersionEntity>
{
    ContentVersionEntity findByKey( ContentVersionKey key );

    List<ContentVersionKey> findBySpecification( ContentVersionSpecification specification, String orderBy, int count );

    int findCountBySpecification( ContentVersionSpecification specification );
}
