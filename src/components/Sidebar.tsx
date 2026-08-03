import React, { useState } from "react";
import {
  LayoutDashboard,
  Eye,
  BarChart3,
  Monitor,
  GitCommit,
  ShieldAlert,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles
} from "lucide-react";
import { MenuKey } from "../types";

interface SidebarProps {
  activeKey: MenuKey;
  onSelectMenu: (key: MenuKey, label: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeKey, onSelectMenu }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    opinion: true, // Expand '舆情管理' by default matching screenshot
    product: false,
    marketing: false,
    ecommerce: false,
    closed_loop: false,
    system: false,
  });

  const toggleParent = (key: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const opinionSubMenus: { key: MenuKey; label: string; isNew?: boolean }[] = [
    { key: "brand_opinion", label: "品牌舆情管理" },
    { key: "topic_opinion", label: "舆情专题管理", isNew: true }, // The newly requested feature!
    { key: "ecommerce_opinion", label: "电商舆情管理" },
    { key: "service_opinion", label: "服务舆情管理" },
    { key: "comments_opinion", label: "评论区舆情管理" },
    { key: "overseas_brand", label: "海外品牌舆情管理" },
    { key: "overseas_service", label: "海外服务舆情管理" },
    { key: "overseas_ecommerce", label: "海外电商舆情管理" },
  ];

  return (
    <aside
      id="voc-sidebar"
      className={`bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-200 select-none z-10 shrink-0 ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      <div id="voc-menu-list" className="py-2 overflow-y-auto custom-scrollbar flex-1">
        {/* 1. 总体概览 */}
        <div
          id="menu-overview"
          onClick={() => onSelectMenu("overview", "总体概览")}
          className={`flex items-center px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors ${
            activeKey === "overview"
              ? "text-teal-700 bg-teal-50/70 border-r-2 border-teal-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" />
          {!collapsed && <span>总体概览</span>}
        </div>

        {/* 2. 产品洞察 */}
        <div id="menu-product-parent">
          <div
            onClick={() => toggleParent("product")}
            className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" />
              {!collapsed && <span>产品洞察</span>}
            </div>
            {!collapsed && (
              expandedParents.product ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )
            )}
          </div>
        </div>

        {/* 3. 营销洞察 */}
        <div id="menu-marketing-parent">
          <div
            onClick={() => toggleParent("marketing")}
            className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" />
              {!collapsed && <span>营销洞察</span>}
            </div>
            {!collapsed && (
              expandedParents.marketing ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )
            )}
          </div>
        </div>

        {/* 4. 电商口碑 */}
        <div id="menu-ecommerce-parent">
          <div
            onClick={() => toggleParent("ecommerce")}
            className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center">
              <Monitor className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" />
              {!collapsed && <span>电商口碑</span>}
            </div>
            {!collapsed && (
              expandedParents.ecommerce ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )
            )}
          </div>
        </div>

        {/* 5. 闭环管理 */}
        <div id="menu-closed-loop-parent">
          <div
            onClick={() => toggleParent("closed_loop")}
            className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center">
              <GitCommit className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" />
              {!collapsed && <span>闭环管理</span>}
            </div>
            {!collapsed && (
              expandedParents.closed_loop ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )
            )}
          </div>
        </div>

        {/* 6. 舆情管理 (Parent with sub-menus) */}
        <div id="menu-opinion-parent">
          <div
            onClick={() => toggleParent("opinion")}
            className={`flex items-center justify-between px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors ${
              opinionSubMenus.some((m) => m.key === activeKey)
                ? "text-teal-700 bg-teal-50/50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2.5 text-teal-600 shrink-0" />
              {!collapsed && <span className="font-semibold text-teal-800">舆情管理</span>}
            </div>
            {!collapsed && (
              expandedParents.opinion ? (
                <ChevronDown className="w-3.5 h-3.5 text-teal-600" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )
            )}
          </div>

          {/* Sub-menus */}
          {(!collapsed && expandedParents.opinion) && (
            <div id="opinion-submenus" className="bg-gray-50/60 py-1">
              {opinionSubMenus.map((sub) => {
                const isActive = activeKey === sub.key;
                return (
                  <div
                    key={sub.key}
                    id={`submenu-${sub.key}`}
                    onClick={() => onSelectMenu(sub.key, sub.label)}
                    className={`pl-9 pr-3 py-2 text-xs cursor-pointer flex items-center justify-between transition-all ${
                      isActive
                        ? "bg-teal-100/70 text-teal-800 font-semibold border-r-2 border-teal-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                    }`}
                  >
                    <span className="truncate">{sub.label}</span>
                    {sub.isNew && (
                      <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-amber-100 text-amber-800 border border-amber-300 rounded font-medium flex items-center shrink-0">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                        AI新增
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. 系统管理 */}
        <div id="menu-system-parent">
          <div
            onClick={() => toggleParent("system")}
            className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center">
              <Settings className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" />
              {!collapsed && <span>系统管理</span>}
            </div>
            {!collapsed && (
              expandedParents.system ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )
            )}
          </div>
        </div>
      </div>

      {/* Collapse/Expand Footer Toggle Button */}
      <div
        id="voc-sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 border-t border-gray-200 px-4 flex items-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors"
        title={collapsed ? "展开菜单" : "折叠菜单"}
      >
        {collapsed ? (
          <ChevronsRight className="w-4 h-4 mx-auto" />
        ) : (
          <div className="flex items-center space-x-2 text-xs">
            <ChevronsLeft className="w-4 h-4" />
            <span>收起侧边栏</span>
          </div>
        )}
      </div>
    </aside>
  );
};
