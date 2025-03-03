import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookAIcon, BookOpen, Bot, ChartLine, Folder, LayoutGrid, LogsIcon, SquareTerminal, UserIcon } from 'lucide-react';
import AppLogo from './app-logo';
import NavDropdown from './nav-dropdown';
import AppearanceTabs from '@/components/appearance-tabs';
import AppearanceToggleDropdown from './appearance-dropdown';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Statistic',
        url: '#',
        icon: ChartLine,
    },
    {
        title: 'Log',
        url: '#',
        icon: LogsIcon,
    },
    {
        title: 'Todo',
        url: '/dashboard/todos',
        icon: BookAIcon,
    },
];

const dropdownNavItems: NavItem[] = [
    {
        title: 'User Management',
        url: '/#',
        icon: UserIcon,
        isActive: true,
        items: [
            {
                title: 'User',
                url: '/dashboard/users',
            },
            {
                title: 'Role',
                url: '#',
            },
            {
                title: 'Permission',
                url: '#',
            },
        ],
    },
    {
        title: 'Playground',
        url: '/#',
        icon: SquareTerminal,
        items: [
            {
                title: 'History',
                url: '#',
            },
            {
                title: 'Starred',
                url: '#',
            },
            {
                title: 'Settings',
                url: '#',
            },
        ],
    },
    {
        title: 'Models',
        url: '#',
        icon: Bot,
        items: [
            {
                title: 'Genesis',
                url: '#',
            },
            {
                title: 'Explorer',
                url: '#',
            },
            {
                title: 'Quantum',
                url: '#',
            },
        ],
    },
    {
        title: 'Documentation',
        url: '#',
        icon: BookOpen,
        items: [
            {
                title: 'Introduction',
                url: '#',
            },
            {
                title: 'Get Started',
                url: '#',
            },
            {
                title: 'Tutorials',
                url: '#',
            },
            {
                title: 'Changelog',
                url: '#',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavDropdown items={dropdownNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
