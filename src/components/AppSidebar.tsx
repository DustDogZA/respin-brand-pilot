import { Link, useLocation } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { BrandSelector } from '@/components/BrandSelector';
import {
  Sun,
  CalendarDays,
  PenTool,
  Search,
  Users,
  Building2,
  BarChart3,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { title: 'Today', url: '/', icon: Sun },
  { title: 'Campaigns', url: '/campaigns', icon: CalendarDays },
  { title: 'Content', url: '/content', icon: PenTool },
  { title: 'SEO', url: '/seo', icon: Search },
  { title: 'CRM', url: '/crm', icon: Users },
  { title: 'Brands', url: '/brands', icon: Building2 },
  { title: 'Reporting', url: '/reporting', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        {!collapsed && (
          <div className="mb-3">
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              respin.hub
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Marketing OS
            </p>
          </div>
        )}
        {collapsed ? (
          <div className="flex justify-center">
            <span className="text-xs font-bold text-primary">R</span>
          </div>
        ) : (
          <BrandSelector />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground/60 text-center">
            Respin © 2026
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
