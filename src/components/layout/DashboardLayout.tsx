import {
  HighlightOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Dropdown, Grid, Layout, MenuProps, Modal, Tooltip } from "antd";
import { StickyNote } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { useGetProfileQuery, useLogOutMutation } from "../../features/auth/api/authApi";
import SettingsPage from "../../features/setting/setting-page";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { showDrawer } from "../../redux/slice/drawerSlice";
import { setMode, setSidebarColor } from "../../redux/slice/themeSlice";
import { cn } from "../../utils/cn";
import { sidebarPalettes } from "../../utils/helper";
import AnimatedOutlet from "../common/AnimatedOutlet";
import DrawerConfig from "../common/DrawerConfig";
import ModalConfig from "../common/ModalConfig";
import { StickyNotesManager } from "../sticky-notes/sicky-notes-manager";
import AppSidebar from "./AppSidebar";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function DashboardLayout() {
  const screens = useBreakpoint();

  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const [isStickyNotesOpen, setIsStickyNotesOpen] = useState(false);
  const { mode } = useAppSelector((state) => state.theme);
  const { data } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [logOut] = useLogOutMutation();
  useGetProfileQuery();

  const handleBreakpoint = (broken: boolean) => {
    setCollapsed(broken);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Logout",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        return logOut()
          .unwrap()
          .then(() => {
            window.location.href = "/auth/login";
          });
      },
    });
  };

  const handleAppearance = () => {
    dispatch(showDrawer({ content: <SettingsPage />, title: "Apperance" }));
  };

  const userMenu: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to={"/profile"}>Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: "Appearance",
      icon: <HighlightOutlined />,
      onClick: handleAppearance,
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const toggleTheme = () => {
    dispatch(setMode(mode === "dark" ? "light" : "dark"));
    dispatch(setSidebarColor(sidebarPalettes[0]));
  };

  const isMobile = screens.md === undefined ? window.innerWidth < 768 : !screens.md;

  return (
    <Layout className="h-screen overflow-y-scroll">
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          placement="left"
          onClose={() => setCollapsed(true)}
          open={!collapsed}
          size={270}
          styles={{ body: { padding: 0 } }}
          closable={false}
          className="lg:hidden"
        >
          <AppSidebar collapsed={false} setCollapsed={setCollapsed} isMobile={isMobile} />
        </Drawer>
      ) : (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onBreakpoint={handleBreakpoint}
          collapsedWidth={80}
          width={270}
          className={cn("bg-slate-900! shadow-sm z-30 overflow-hidden h-screen")}
          style={{
            transition: "all 0.2s",
            backgroundColor: "#0f172a",
          }}
        >
          <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
        </Sider>
      )}

      <Layout className={cn("transition-all duration-200 flex flex-col h-screen overflow-hidden")}>
        <Header className="bg-white! dark:bg-black! p-0 shadow-sm z-10 sticky top-0 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 h-16">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg! w-10! h-10! text-gray-500 hover:text-blue-600 dark:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Toggle Theme">
              <Button
                type="text"
                style={{ border: `1px solid ${mode !== "dark" ? "#ccc" : "#000"}` }}
                shape="circle"
                icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                className="text-gray-500 dark:text-gray-400"
              />
            </Tooltip>
            <Tooltip title="Sticky note">
              {/* <Button
                type='text'
                shape='circle'
                icon={}
                onClick={() => setIsStickyNotesOpen(true)}
                className={isStickyNotesOpen ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}
              /> */}

              <div className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border">
                <StickyNote
                  className="size-4.5 text-gray-500 dark:text-gray-400"
                  onClick={() => setIsStickyNotesOpen(true)}
                />
              </div>
            </Tooltip>
            <Dropdown menu={{ items: userMenu }} trigger={["click"]} placement="bottomRight">
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                <Avatar icon={<UserOutlined />} />
                <div className="hidden md:block text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-200 leading-tight">
                    {data?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 leading-tight">{data?.role?.name}</p>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Content className="overflow-y-auto bg-gray-50 dark:bg-black flex-1 px-4 md:px-6 py-6">
            <DrawerConfig />
            <ModalConfig />
            <AnimatedOutlet />
          </Content>
        </QueryParamProvider>
      </Layout>
      {/* Sticky Notes Manager */}
      <StickyNotesManager isOpen={isStickyNotesOpen} onClose={() => setIsStickyNotesOpen(false)} />
    </Layout>
  );
}
