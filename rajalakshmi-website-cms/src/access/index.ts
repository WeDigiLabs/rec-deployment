// Define the user type with role
export type UserWithRole = {
  id: string
  email: string
  role: 'SuperAdmin' | 'Admin' | 'Blogger'
}

// Helper functions for access control
export const isSuperAdmin = (user: any): boolean => {
  return (user as UserWithRole)?.role === 'SuperAdmin'
}

export const isAdmin = (user: any): boolean => {
  return (user as UserWithRole)?.role === 'Admin'
}

export const isBlogger = (user: any): boolean => {
  return (user as UserWithRole)?.role === 'Blogger'
}

export const isSuperAdminOrAdmin = (user: any): boolean => {
  const userRole = (user as UserWithRole)?.role
  return userRole === 'SuperAdmin' || userRole === 'Admin'
}

export const isAdminOrBlogger = (user: any): boolean => {
  const userRole = (user as UserWithRole)?.role
  return userRole === 'Admin' || userRole === 'Blogger'
}

export const isAnyAdminOrBlogger = (user: any): boolean => {
  const userRole = (user as UserWithRole)?.role
  return userRole === 'SuperAdmin' || userRole === 'Admin' || userRole === 'Blogger'
}

// Common access patterns
export const superAdminOnly = {
  create: ({ req: { user } }: any) => isSuperAdmin(user),
  read: ({ req: { user } }: any) => isSuperAdmin(user),
  update: ({ req: { user } }: any) => isSuperAdmin(user),
  delete: ({ req: { user } }: any) => isSuperAdmin(user),
}

export const adminOnly = {
  create: ({ req: { user } }: any) => isSuperAdminOrAdmin(user),
  read: ({ req: { user } }: any) => isSuperAdminOrAdmin(user),
  update: ({ req: { user } }: any) => isSuperAdminOrAdmin(user),
  delete: ({ req: { user } }: any) => isSuperAdminOrAdmin(user),
}

export const adminAndBlogger = {
  create: ({ req: { user } }: any) => isAnyAdminOrBlogger(user),
  read: ({ req: { user } }: any) => isAnyAdminOrBlogger(user),
  update: ({ req: { user } }: any) => isAnyAdminOrBlogger(user),
  delete: ({ req: { user } }: any) => isAnyAdminOrBlogger(user),
}

// Enhanced access pattern that gives SuperAdmin full access while maintaining existing restrictions for others
export const adminAndBloggerWithSuperAdminAccess = {
  create: ({ req: { user } }: any) => isAnyAdminOrBlogger(user),
  read: ({ req: { user } }: any) => {
    if (isSuperAdmin(user)) return true
    return isAdminOrBlogger(user)
  },
  update: ({ req: { user } }: any) => {
    if (isSuperAdmin(user)) return true
    return isAdminOrBlogger(user)
  },
  delete: ({ req: { user } }: any) => {
    if (isSuperAdmin(user)) return true
    return isAdminOrBlogger(user)
  },
}

// Blog-specific access control - admin see all, bloggers see all but edit own, public see published
export const blogPostAccess = {
  create: ({ req: { user } }: any) => isAnyAdminOrBlogger(user),
  read: ({ req: { user } }: any) => {
    console.log('BlogPost read access check:', { 
      userId: user?.id, 
      userRole: user?.role,
      isSuperAdmin: isSuperAdmin(user),
      isAdmin: isAdmin(user),
      isBlogger: isBlogger(user)
    })
    
    // SuperAdmin and Admin can see all posts (published and unpublished)
    if (isSuperAdmin(user) || isAdmin(user)) return true
    
    // Bloggers can see all posts (for browsing in admin)
    if (isBlogger(user)) return true
    
    // Public access (no user) - only published posts
    if (!user) {
      return {
        isPublished: {
          equals: true,
        },
      }
    }
    
    // Default deny for any other case
    return false
  },
  update: ({ req: { user } }: any) => {
    if (isSuperAdmin(user)) return true
    if (isAdmin(user)) return true
    if (isBlogger(user)) {
      // Bloggers can only update their own blog posts
      return {
        author: {
          equals: user?.id,
        },
      }
    }
    return false
  },
  delete: ({ req: { user } }: any) => {
    if (isSuperAdmin(user)) return true
    if (isAdmin(user)) return true
    if (isBlogger(user)) {
      // Bloggers can only delete their own blog posts
      return {
        author: {
          equals: user?.id,
        },
      }
    }
    return false
  },
}

// Media-specific access control - users can only see their own uploaded media in admin
export const mediaAccess = {
  create: ({ req: { user } }: any) => isAnyAdminOrBlogger(user),
  read: ({ req: { user } }: any) => {
    // If no user (public access), allow read for frontend
    if (!user) return true
    
    // SuperAdmin can see all media
    if (isSuperAdmin(user)) return true
    
    // Admin can see all media
    if (isAdmin(user)) return true
    
    // Bloggers can only see their own uploaded media in admin
    if (isBlogger(user)) {
      return {
        uploadedBy: {
          equals: user?.id,
        },
      }
    }
    
    return false
  },
  update: ({ req: { user } }: any) => {
    if (isSuperAdmin(user)) return true
    if (isAdmin(user)) return true
    if (isBlogger(user)) {
      // Bloggers can only update their own uploaded media
      return {
        uploadedBy: {
          equals: user?.id,
        },
      }
    }
    return false
  },
  delete: ({ req: { user } }: any) => {
    if (isSuperAdmin(user)) return true
    if (isAdmin(user)) return true
    if (isBlogger(user)) {
      // Bloggers can only delete their own uploaded media
      return {
        uploadedBy: {
          equals: user?.id,
        },
      }
    }
    return false
  },
}

// Universal access pattern with public read for active content
export const universalAccess = {
  create: ({ req: { user } }: any) => adminOnly.create({ req: { user } }),
  read: ({ req: { user } }: any) => {
    // If user is SuperAdmin or Admin, show all content (including inactive ones)
    if (user && (isSuperAdmin(user) || isAdmin(user))) {
      return true;
    }
    // For public access (no user), only show active content
    if (!user) {
      return {
        isActive: {
          equals: true,
        },
      };
    }
    // Default deny for non-admin users
    return false;
  },
  update: ({ req: { user } }: any) => adminOnly.update({ req: { user } }),
  delete: ({ req: { user } }: any) => adminOnly.delete({ req: { user } }),
}

// Global access pattern with full public read access (for globals that don't have isActive field)
export const globalAccess = {
  create: ({ req: { user } }: any) => adminOnly.create({ req: { user } }),
  read: () => true, // Allow public read access without any conditions
  update: ({ req: { user } }: any) => adminOnly.update({ req: { user } }),
  delete: ({ req: { user } }: any) => adminOnly.delete({ req: { user } }),
}

// Universal access pattern with public read for visible content (for collections using isVisible)
export const universalAccessVisible = {
  create: ({ req: { user } }: any) => adminOnly.create({ req: { user } }),
  read: ({ req: { user } }: any) => {
    // If user is SuperAdmin or Admin, show all content (including hidden ones)
    if (user && (isSuperAdmin(user) || isAdmin(user))) {
      return true;
    }
    // For public access (no user), only show visible content
    if (!user) {
      return {
        isVisible: {
          equals: true,
        },
      };
    }
    // Default deny for non-admin users
    return false;
  },
  update: ({ req: { user } }: any) => adminOnly.update({ req: { user } }),
  delete: ({ req: { user } }: any) => adminOnly.delete({ req: { user } }),
}

// Universal access pattern with public read for published content (for collections using isPublished)
export const universalAccessPublished = {
  create: ({ req: { user } }: any) => adminOnly.create({ req: { user } }),
  read: ({ req: { user } }: any) => {
    // If user is SuperAdmin or Admin, show all content (including unpublished ones)
    if (user && (isSuperAdmin(user) || isAdmin(user))) {
      return true;
    }
    // For everyone else (including public access), only show published content
    return {
      isPublished: {
        equals: true,
      },
    };
  },
  update: ({ req: { user } }: any) => adminOnly.update({ req: { user } }),
  delete: ({ req: { user } }: any) => adminOnly.delete({ req: { user } }),
}

// Blog-specific public access - completely public read for published posts
export const blogPostPublicAccess = {
  create: ({ req: { user } }: any) => adminOnly.create({ req: { user } }),
  read: () => {
    // Always allow read access, but filter by published status
    return {
      isPublished: {
        equals: true,
      },
    };
  },
  update: ({ req: { user } }: any) => adminOnly.update({ req: { user } }),
  delete: ({ req: { user } }: any) => adminOnly.delete({ req: { user } }),
}
