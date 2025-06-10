import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Smartphone, Home, Users, Wrench, Settings, FileText, BarChart3 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Ordens de Serviço', url: '/ordens', icon: FileText },
  { title: 'Clientes', url: '/clientes', icon: Users },
  { title: 'Técnicos', url: '/tecnicos', icon: Wrench },
  { title: 'Serviços', url: '/servicos', icon: Settings },
  { title: 'Relatórios', url: '/relatorios', icon: BarChart3 },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-yellow-500 dark:text-yellow-300">TechAssist</h1>
            <p className="text-xs text-muted-foreground">Sistema de Assistência</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                className="w-full justify-start gap-3 px-3 py-2"
              >
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            © 2024 TechAssist
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
