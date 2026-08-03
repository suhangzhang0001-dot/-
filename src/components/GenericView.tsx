import React from "react";
import { Search, RotateCcw, Download, Info, Settings, Database } from "lucide-react";

interface GenericViewProps {
  title: string;
}

export const GenericView: React.FC<GenericViewProps> = ({ title }) => {
  return (
    <div id="generic-view-container" className="p-4 space-y-4 text-xs">
      {/* Search / Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="font-bold text-gray-800 text-xs">{title} - 检索与管理</span>
          <span className="text-gray-400 text-[11px]">包含实时数据抓取与数据筛查</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">任务编号</span>
            <input type="text" placeholder="请输入" className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 outline-none" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">关键标题</span>
            <input type="text" placeholder="请输入" className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 outline-none" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">风险等级</span>
            <select className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 outline-none">
              <option>全部</option>
              <option>P0 - 紧急</option>
              <option>P1 - 高危</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">来源媒体</span>
            <input type="text" placeholder="请输入" className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 outline-none" />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-1 border-t border-gray-100">
          <button className="px-4 py-1.5 bg-teal-600 text-white rounded-md font-medium flex items-center space-x-1">
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-md font-medium flex items-center space-x-1">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-lg flex items-center justify-between text-sky-800 text-xs">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{title} 数据实时监控模块正常运行中</span>
        </div>
        <Settings className="w-4 h-4 text-sky-600 cursor-pointer" />
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs py-16 flex flex-col items-center justify-center space-y-2 text-gray-400">
        <Database className="w-8 h-8 text-gray-300" />
        <span className="text-gray-400">暂无相关预警记录</span>
      </div>
    </div>
  );
};
