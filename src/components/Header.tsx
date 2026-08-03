import React from "react";
import { Bell, HelpCircle, FileText, ChevronDown, Activity } from "lucide-react";

interface HeaderProps {
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ userName = "张素航" }) => {
  return (
    <header id="voc-header" className="h-13 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-20 shrink-0">
      {/* Left Brand Logo & Title */}
      <div id="voc-logo-area" className="flex items-center space-x-2.5">
        <div id="voc-logo-badge" className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-sm">
          VOC
        </div>
        <div id="voc-app-title" className="flex items-center space-x-2">
          <span className="font-semibold text-gray-800 text-base tracking-tight">VOC用户声音洞察平台</span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-medium hidden sm:inline-block">
            企业级旗舰版 v3.2
          </span>
        </div>
      </div>

      {/* Right User Actions & Status */}
      <div id="voc-user-actions" className="flex items-center space-x-3 text-gray-600 text-xs">
        {/* Real-time Monitor Status Badge */}
        <div id="voc-live-status" className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>全网抓取运行中</span>
        </div>

        {/* Language selector */}
        <button id="voc-lang-btn" className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
          中
        </button>

        {/* Help button */}
        <button id="voc-help-btn" className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600" title="帮助中心">
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button id="voc-notify-btn" className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 relative" title="预警消息">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Docs */}
        <button id="voc-doc-btn" className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600" title="平台操作指南">
          <FileText className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-gray-200 my-auto"></div>

        {/* User Profile dropdown */}
        <div id="voc-user-profile" className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User Avatar"
            className="w-7 h-7 rounded-full object-cover border border-teal-200"
          />
          <span className="font-medium text-gray-700">{userName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </header>
  );
};
