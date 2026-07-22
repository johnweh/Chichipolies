import { Flag, GearSix, Newspaper, UsersThree } from '@phosphor-icons/react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth, pendingReports } = usePage<SharedData & { pendingReports?: number | null }>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Feed',
            url: '/',
            icon: Newspaper,
        },
        ...(auth.user?.is_admin
            ? [
                  { title: 'Stories', url: '/admin/posts', icon: Newspaper },
                  { title: 'Members', url: '/admin/users', icon: UsersThree },
                  { title: 'Reports', url: '/admin/reports', icon: Flag, badge: pendingReports },
              ]
            : []),
        {
            title: 'Settings',
            url: '/settings/profile',
            icon: GearSix,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
