import React, { useState } from "react";
import {
  ShieldAlert,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { MenuKey } from "../types";

interface SidebarProps {
  activeKey: MenuKey;
  onSelectMenu: (key: MenuKey, label: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeKey, onSelectMenu }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      id="voc-sidebar"
      className={`bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-200 select-none z-10 shrink-0 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div id="voc-menu-list" className="py-3 px-2 space-y-1 overflow-y-auto custom-scrollbar flex-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          {!collapsed && "核心业务引擎"}
        </div>

        {/* Sole Active Menu Item: 舆情专题管理 */}
        <div
          id="menu-topic-opinion"
          onClick={() => onSelectMenu("topic_opinion", "舆情专题管理")}
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeKey === "topic_opinion"
              ? "bg-teal-700 text-white shadow-xs"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <ShieldAlert className={`w-4 h-4 shrink-0 ${activeKey === "topic_opinion" ? "text-amber-300" : "text-teal-600"}`} />
            {!collapsed && <span className="truncate">舆情专题管理</span>}
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
          <ChevronsRight className="w-4 h-4 mx-auto text-gray-600" />
        ) : (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <ChevronsLeft className="w-4 h-4" />
            <span>收起侧边栏</span>
          </div>
        )}
      </div>
    </aside>
  );
};
