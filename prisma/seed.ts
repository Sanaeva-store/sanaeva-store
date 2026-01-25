import { PrismaClient } from '@/lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * Database Seed Script
 * 
 * Seeds initial roles and permissions for RBAC system.
 * Run with: bunx prisma db seed
 */

async function main() {
    console.log('🌱 Starting database seed...')

    // Create permissions
    console.log('Creating permissions...')
    const permissions = await Promise.all([
        // Inventory permissions
        prisma.permission.upsert({
            where: { code: 'INVENTORY_VIEW' },
            update: {},
            create: {
                code: 'INVENTORY_VIEW',
                name: 'View Inventory',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'INVENTORY_ADJUST' },
            update: {},
            create: {
                code: 'INVENTORY_ADJUST',
                name: 'Adjust Inventory',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'INVENTORY_TRANSFER' },
            update: {},
            create: {
                code: 'INVENTORY_TRANSFER',
                name: 'Transfer Inventory',
            },
        }),

        // Purchase Order permissions
        prisma.permission.upsert({
            where: { code: 'PO_VIEW' },
            update: {},
            create: {
                code: 'PO_VIEW',
                name: 'View Purchase Orders',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'PO_CREATE' },
            update: {},
            create: {
                code: 'PO_CREATE',
                name: 'Create Purchase Orders',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'PO_APPROVE' },
            update: {},
            create: {
                code: 'PO_APPROVE',
                name: 'Approve Purchase Orders',
            },
        }),

        // Goods Receipt permissions
        prisma.permission.upsert({
            where: { code: 'GRN_VIEW' },
            update: {},
            create: {
                code: 'GRN_VIEW',
                name: 'View Goods Receipts',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'GRN_CREATE' },
            update: {},
            create: {
                code: 'GRN_CREATE',
                name: 'Create Goods Receipts',
            },
        }),

        // Sales Order permissions
        prisma.permission.upsert({
            where: { code: 'SO_VIEW' },
            update: {},
            create: {
                code: 'SO_VIEW',
                name: 'View Sales Orders',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'SO_CREATE' },
            update: {},
            create: {
                code: 'SO_CREATE',
                name: 'Create Sales Orders',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'SO_APPROVE' },
            update: {},
            create: {
                code: 'SO_APPROVE',
                name: 'Approve Sales Orders',
            },
        }),

        // Product permissions
        prisma.permission.upsert({
            where: { code: 'PRODUCT_VIEW' },
            update: {},
            create: {
                code: 'PRODUCT_VIEW',
                name: 'View Products',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'PRODUCT_MANAGE' },
            update: {},
            create: {
                code: 'PRODUCT_MANAGE',
                name: 'Manage Products',
            },
        }),

        // Return permissions
        prisma.permission.upsert({
            where: { code: 'RETURN_VIEW' },
            update: {},
            create: {
                code: 'RETURN_VIEW',
                name: 'View Returns',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'RETURN_PROCESS' },
            update: {},
            create: {
                code: 'RETURN_PROCESS',
                name: 'Process Returns',
            },
        }),

        // User management permissions
        prisma.permission.upsert({
            where: { code: 'USER_VIEW' },
            update: {},
            create: {
                code: 'USER_VIEW',
                name: 'View Users',
            },
        }),
        prisma.permission.upsert({
            where: { code: 'USER_MANAGE' },
            update: {},
            create: {
                code: 'USER_MANAGE',
                name: 'Manage Users',
            },
        }),
    ])

    console.log(`✅ Created ${permissions.length} permissions`)

    // Create roles
    console.log('Creating roles...')

    // Admin role - full access
    const adminRole = await prisma.role.upsert({
        where: { code: 'ADMIN' },
        update: {},
        create: {
            code: 'ADMIN',
            name: 'Administrator',
        },
    })

    // Manager role - can approve and manage operations
    const managerRole = await prisma.role.upsert({
        where: { code: 'MANAGER' },
        update: {},
        create: {
            code: 'MANAGER',
            name: 'Manager',
        },
    })

    // Staff role - basic operations
    const staffRole = await prisma.role.upsert({
        where: { code: 'STAFF' },
        update: {},
        create: {
            code: 'STAFF',
            name: 'Staff',
        },
    })

    // Customer role - storefront access
    const customerRole = await prisma.role.upsert({
        where: { code: 'CUSTOMER' },
        update: {},
        create: {
            code: 'CUSTOMER',
            name: 'Customer',
        },
    })

    console.log('✅ Created 4 roles')

    // Assign permissions to Admin role (all permissions)
    console.log('Assigning permissions to ADMIN role...')
    await Promise.all(
        permissions.map((permission) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: adminRole.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: adminRole.id,
                    permissionId: permission.id,
                },
            })
        )
    )

    // Assign permissions to Manager role
    console.log('Assigning permissions to MANAGER role...')
    const managerPermissionCodes = [
        'INVENTORY_VIEW',
        'INVENTORY_ADJUST',
        'INVENTORY_TRANSFER',
        'PO_VIEW',
        'PO_CREATE',
        'PO_APPROVE',
        'GRN_VIEW',
        'GRN_CREATE',
        'SO_VIEW',
        'SO_CREATE',
        'SO_APPROVE',
        'PRODUCT_VIEW',
        'PRODUCT_MANAGE',
        'RETURN_VIEW',
        'RETURN_PROCESS',
        'USER_VIEW',
    ]
    const managerPermissions = permissions.filter((p) =>
        managerPermissionCodes.includes(p.code)
    )
    await Promise.all(
        managerPermissions.map((permission) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: managerRole.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: managerRole.id,
                    permissionId: permission.id,
                },
            })
        )
    )

    // Assign permissions to Staff role
    console.log('Assigning permissions to STAFF role...')
    const staffPermissionCodes = [
        'INVENTORY_VIEW',
        'PO_VIEW',
        'PO_CREATE',
        'GRN_VIEW',
        'GRN_CREATE',
        'SO_VIEW',
        'SO_CREATE',
        'PRODUCT_VIEW',
        'RETURN_VIEW',
    ]
    const staffPermissions = permissions.filter((p) =>
        staffPermissionCodes.includes(p.code)
    )
    await Promise.all(
        staffPermissions.map((permission) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: staffRole.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: staffRole.id,
                    permissionId: permission.id,
                },
            })
        )
    )

    // Assign permissions to Customer role (storefront only)
    console.log('Assigning permissions to CUSTOMER role...')
    const customerPermissionCodes = ['PRODUCT_VIEW', 'SO_VIEW']
    const customerPermissions = permissions.filter((p) =>
        customerPermissionCodes.includes(p.code)
    )
    await Promise.all(
        customerPermissions.map((permission) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: customerRole.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: customerRole.id,
                    permissionId: permission.id,
                },
            })
        )
    )

    console.log('✅ Assigned permissions to all roles')

    console.log('🎉 Database seed completed successfully!')
}

main()
    .catch((error) => {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
