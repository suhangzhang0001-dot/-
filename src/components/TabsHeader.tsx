import React from "react";
import { X, MoreVertical } from "lucide-react";
import { TabItem, MenuKey } from "../types";

interface TabsHeaderProps {
  tabs: TabItem[];
  activeKey: MenuKey;
  onSelectTab: (key: MenuKey) => void;
  onCloseTab: (key: MenuKey, e: React.MouseEvent) => void;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  tabs,
  activeKey,
  onSelectTab,
  onCloseTab,
}) => {
  return (
    <div id="voc-tabs-header" className="bg-gray-100/90 border-b border-gray-200 px-3 pt-1.5 flex items-center justify-between shrink-0 overflow-x-auto select-none">
      <div id="voc-tabs-list" className="flex items-center space-x-1 overflow-x-auto custom-scrollbar pr-2">
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <div
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => onSelectTab(tab.key)}
              className={`group h-8 px-3 rounded-t-md text-xs font-medium flex items-center space-x-2 border cursor-pointer transition-all ${
                isActive
                  ? "bg-white text-teal-800 border-gray-200 border-b-white font-semibold shadow-2xs"
                  : "bg-gray-200/60 text-gray-600 border-transparent hover:bg-gray-200/90"
              }`}
            >
              <span className="truncate max-w-[130px]">{tab.label}</span>
              {tab.closable && (
                <button
                  onClick={(e) => onCloseTab(tab.key, e)}
                  className={`p-0.5 rounded-full hover:bg-gray-300/60 ${
                    isActive ? "text-gray-500 hover:text-gray-800" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                  title="关闭标签页"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button id="voc-tabs-more" className="p-1 rounded text-gray-500 hover:bg-gray-200" title="更多标签操作">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
};
