import React, { useState } from "react";
import { Search, RotateCcw, Download, Info, Settings, Database, Plus } from "lucide-react";
import { PublicOpinionItem } from "../types";

interface BrandPublicOpinionViewProps {
  opinions: PublicOpinionItem[];
}

export const BrandPublicOpinionView: React.FC<BrandPublicOpinionViewProps> = ({ opinions }) => {
  const [taskNo, setTaskNo] = useState("");
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("全部");
  const [media, setMedia] = useState("");
  const [status, setStatus] = useState("请选择");
  const [company, setCompany] = useState("全部");
  const [onlyMine, setOnlyMine] = useState(false);
  const [showData, setShowData] = useState(true);

  return (
    <div id="brand-opinion-container" className="p-4 space-y-4 text-xs">
      {/* Search / Filter Card */}
      <div id="brand-opinion-filter" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">任务编号</span>
            <input
              type="text"
              value={taskNo}
              onChange={(e) => setTaskNo(e.target.value)}
              placeholder="请输入"
              className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">舆情标题</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入"
              className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">预警级别</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            >
              <option value="全部">全部</option>
              <option value="P0 - 紧急">P0 - 紧急</option>
              <option value="P1 - 高危">P1 - 高危</option>
              <option value="P2 - 中危">P2 - 中危</option>
              <option value="P3 - 低危">P3 - 低危</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">媒体</span>
            <input
              type="text"
              value={media}
              onChange={(e) => setMedia(e.target.value)}
              placeholder="请输入"
              className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">发生日期</span>
            <input
              type="text"
              placeholder="开始日期 - 结束日期 📅"
              className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">状态</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            >
              <option value="请选择">请选择</option>
              <option value="未处理">未处理</option>
              <option value="处理中">处理中</option>
              <option value="已完结">已完结</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-16 text-gray-600 font-medium text-right shrink-0">所属公司</span>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 rounded-md bg-gray-50/60 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
            >
              <option value="全部">全部</option>
              <option value="集团总部">集团总部</option>
              <option value="华东分公司">华东分公司</option>
              <option value="华南分公司">华南分公司</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 pl-2">
            <span className="text-gray-600 font-medium">仅我的</span>
            <button
              onClick={() => setOnlyMine(!onlyMine)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                onlyMine ? "bg-teal-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-xs transform transition-transform duration-200 ease-in-out ${
                  onlyMine ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action buttons matching screenshot style */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <button
            onClick={() => setShowData(!showData)}
            className="px-3 py-1.5 text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-md font-medium transition-colors flex items-center space-x-1"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{showData ? "切换为界面空状态视图" : "切换为示例品牌数据"}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md text-xs transition-colors flex items-center space-x-1 shadow-2xs">
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>

            <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md text-xs transition-colors flex items-center space-x-1">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>

            <button className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md text-xs transition-colors flex items-center space-x-1 shadow-2xs">
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner matching screenshot */}
      <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-lg flex items-center justify-between text-sky-800 text-xs">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>未选中任何数据</span>
        </div>
        <Settings className="w-4 h-4 text-sky-600 cursor-pointer hover:rotate-45 transition-transform" />
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {!showData ? (
          /* Empty State matching user screenshot */
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
              <Database className="w-8 h-8 text-gray-300" />
            </div>
            <span className="text-gray-400 text-xs">暂无数据</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold select-none">
                  <th className="py-2.5 px-3 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3">任务编号</th>
                  <th className="py-2.5 px-3">舆情标题</th>
                  <th className="py-2.5 px-3">媒体</th>
                  <th className="py-2.5 px-3">舆情级别</th>
                  <th className="py-2.5 px-3">处理人</th>
                  <th className="py-2.5 px-3">所属公司</th>
                  <th className="py-2.5 px-3">业务板块</th>
                  <th className="py-2.5 px-3 text-center">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {opinions.map((op, i) => (
                  <tr key={op.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3 text-center text-gray-400">{i + 1}</td>
                    <td className="py-3 px-3 font-mono font-medium">{op.taskNo}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{op.title}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px]">
                        {op.media}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded text-[11px]">
                        {op.warningLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3">{op.handler}</td>
                    <td className="py-3 px-3">{op.company}</td>
                    <td className="py-3 px-3">{op.businessUnit}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium text-[11px]">
                        {op.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
