import React, { useState } from "react";
import {
  Plus,
  Search,
  RotateCcw,
  Download,
  Sparkles,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  Eye,
  AlertTriangle,
  Layers,
  Filter,
  CheckCircle2,
  TrendingUp,
  BarChart2
} from "lucide-react";
import { SentimentTopic, RiskLevel, GenerationType, PublicOpinionItem } from "../types";
import { AddTopicModal } from "./AddTopicModal";
import { TopicDetailModal } from "./TopicDetailModal";

interface TopicManagementViewProps {
  topics: SentimentTopic[];
  onAddTopic: (topic: SentimentTopic) => void;
  onUpdateTopic: (topic: SentimentTopic) => void;
  onDeleteTopic: (id: string) => void;
  availableOpinions?: PublicOpinionItem[];
}

export const TopicManagementView: React.FC<TopicManagementViewProps> = ({
  topics,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
  availableOpinions,
}) => {
  // Filter state
  const [searchCode, setSearchCode] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("全部");
  const [filterGenType, setFilterGenType] = useState<string>("全部");
  const [filterStatus, setFilterStatus] = useState<string>("全部");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<SentimentTopic | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter topics
  const filteredTopics = topics.filter((t) => {
    if (searchCode && !t.code.toLowerCase().includes(searchCode.toLowerCase())) return false;
    if (
      searchTitle &&
      !t.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      !t.keywords.some((k) => k.toLowerCase().includes(searchTitle.toLowerCase()))
    )
      return false;
    if (filterRisk !== "全部" && t.riskLevel !== filterRisk) return false;
    if (filterGenType !== "全部" && t.generationType !== filterGenType) return false;
    if (filterStatus !== "全部" && t.status !== filterStatus) return false;
    return true;
  });

  const handleResetFilters = () => {
    setSearchCode("");
    setSearchTitle("");
    setFilterRisk("全部");
    setFilterGenType("全部");
    setFilterStatus("全部");
  };

  const handleToggleStatus = (topic: SentimentTopic) => {
    const newStatus = topic.status === "监测中" ? "已暂停" : "监测中";
    const updated = { ...topic, status: newStatus as any };
    onUpdateTopic(updated);
    showToast(`专题 【${topic.title.slice(0, 10)}...】 已设为: ${newStatus}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`确定要删除舆情专题【${title}】吗？删除后不可恢复。`)) {
      onDeleteTopic(id);
      showToast("已成功删除舆情专题");
    }
  };

  // Stats
  const totalTopicsCount = topics.length;
  const aiGeneratedCount = topics.filter((t) => t.generationType === "ai").length;
  const highRiskCount = topics.filter(
    (t) => t.riskLevel.includes("P0") || t.riskLevel.includes("P1")
  ).length;
  const totalMentionsSum = topics.reduce((acc, t) => acc + t.totalMentions, 0);

  return (
    <div id="topic-management-container" className="p-4 space-y-4 max-w-full text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-teal-800 text-white px-4 py-2.5 rounded-lg shadow-xl font-medium text-xs flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Metric Overview Cards */}
      <div id="topic-metrics-banner" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-gray-500 font-medium text-[11px]">舆情专题总数</span>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{totalTopicsCount} <span className="text-xs text-gray-500 font-normal">个</span></div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-gray-500 font-medium text-[11px]">AI 智能生成专题</span>
            <div className="text-xl font-bold text-teal-700 mt-0.5">{aiGeneratedCount} <span className="text-xs text-gray-500 font-normal">个 ({((aiGeneratedCount / Math.max(1, totalTopicsCount)) * 100).toFixed(0)}%)</span></div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-gray-500 font-medium text-[11px]">高风险预警 (P0/P1)</span>
            <div className="text-xl font-bold text-red-600 mt-0.5">{highRiskCount} <span className="text-xs text-gray-500 font-normal">个</span></div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-gray-500 font-medium text-[11px]">全网关联监控声量</span>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{totalMentionsSum.toLocaleString()} <span className="text-xs text-gray-500 font-normal">条</span></div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Top Search / Filter Bar (Matching VOC Design System) */}
      <div id="topic-filter-card" className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-gray-500 font-medium mb-1">专题编号</label>
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="请输入专题编号 (如 ZT-2026)"
              className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-medium mb-1">专题标题 / 关键词</label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="搜索标题或监测词"
              className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-gray-500 font-medium mb-1">预警级别</label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
            >
              <option value="全部">全部级别</option>
              <option value="P0 - 紧急">P0 - 紧急</option>
              <option value="P1 - 高危">P1 - 高危</option>
              <option value="P2 - 中危">P2 - 中危</option>
              <option value="P3 - 低危">P3 - 低危</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-medium mb-1">生成方式</label>
            <select
              value={filterGenType}
              onChange={(e) => setFilterGenType(e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
            >
              <option value="全部">全部方式</option>
              <option value="ai">AI 自动生成</option>
              <option value="manual">手动配置创建</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-medium mb-1">监测状态</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
            >
              <option value="全部">全部状态</option>
              <option value="监测中">监测中</option>
              <option value="已暂停">已暂停</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {}}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-xs transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>

            <button
              onClick={() => showToast("专题报表导出数据准备中...")}
              className="px-3.5 py-1.5 border border-teal-600 text-teal-700 hover:bg-teal-50 font-medium rounded-lg text-xs transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出数据</span>
            </button>
          </div>

          {/* Primary Feature Button: 【新增舆情专题】 */}
          <button
            id="btn-add-topic"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-all shadow-md flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>新增舆情专题</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div id="topic-table-card" className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
          <span className="font-bold text-gray-800 text-xs flex items-center">
            <Layers className="w-4 h-4 text-teal-600 mr-1.5" />
            舆情专题列表 ({filteredTopics.length})
          </span>
          <span className="text-[11px] text-gray-500">
            支持点击专题名称查看 Gemini AI 实时深度研判
          </span>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Filter className="w-8 h-8 mx-auto text-gray-300" />
            <p>暂无符合筛选条件的舆情专题</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-[11px] select-none">
                  <th className="py-2.5 px-3 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3">专题编号</th>
                  <th className="py-2.5 px-3 min-w-[220px]">专题名称</th>
                  <th className="py-2.5 px-3">生成方式</th>
                  <th className="py-2.5 px-3">风险等级</th>
                  <th className="py-2.5 px-3">核心关键词</th>
                  <th className="py-2.5 px-3">关联声量</th>
                  <th className="py-2.5 px-3">负面占比</th>
                  <th className="py-2.5 px-3">监测状态</th>
                  <th className="py-2.5 px-3">创建人</th>
                  <th className="py-2.5 px-3">创建时间</th>
                  <th className="py-2.5 px-3 text-center">操作</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
                {filteredTopics.map((topic, index) => {
                  const isAI = topic.generationType === "ai";
                  const isHighRisk = topic.riskLevel.includes("P0") || topic.riskLevel.includes("P1");

                  return (
                    <tr
                      key={topic.id}
                      className="hover:bg-teal-50/30 transition-colors group"
                    >
                      <td className="py-3 px-3 text-center font-mono text-gray-400">
                        {index + 1}
                      </td>

                      <td className="py-3 px-3 font-mono font-medium text-gray-800">
                        {topic.code}
                      </td>

                      <td className="py-3 px-3">
                        <div
                          onClick={() => setSelectedTopicDetail(topic)}
                          className="font-bold text-gray-900 hover:text-teal-700 cursor-pointer transition-colors flex items-center space-x-1.5"
                        >
                          <span className="truncate max-w-[240px]">{topic.title}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 mt-1">
                          {(topic.dataCategories || ["品牌舆情", "服务舆情", "电商舆情"]).slice(0, 3).map((cat, i) => (
                            <span
                              key={i}
                              className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                                cat === "品牌舆情"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : cat === "服务舆情"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : cat === "电商舆情"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-teal-50 text-teal-700 border-teal-200"
                              }`}
                            >
                              {cat}
                            </span>
                          ))}
                          {topic.linkedOpinions && topic.linkedOpinions.length > 0 && (
                            <span className="text-[10px] text-teal-700 bg-teal-50 px-1 rounded font-medium">
                              关联{topic.linkedOpinions.length}条
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 truncate max-w-[240px] mt-0.5">
                          {topic.summary}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        {isAI ? (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px] inline-flex items-center">
                            <Sparkles className="w-3 h-3 mr-0.5 text-amber-600" />
                            AI 自动生成
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 font-medium text-[11px] inline-flex items-center">
                            <Edit3 className="w-3 h-3 mr-0.5" />
                            手动配置
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            isHighRisk
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {topic.riskLevel}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {topic.keywords.slice(0, 3).map((kw, i) => (
                            <span key={i} className="px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded text-[10px]">
                              {kw}
                            </span>
                          ))}
                          {topic.keywords.length > 3 && (
                            <span className="text-[10px] text-gray-400">+{topic.keywords.length - 3}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold font-mono text-gray-800">
                        {topic.totalMentions.toLocaleString()}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <span className={`font-bold font-mono ${topic.negativeRatio > 35 ? "text-red-600" : "text-amber-600"}`}>
                            {topic.negativeRatio}%
                          </span>
                          <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${topic.negativeRatio}%` }}
                              className={`h-full ${topic.negativeRatio > 35 ? "bg-red-500" : "bg-amber-500"}`}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium text-[11px] inline-flex items-center ${
                            topic.status === "监测中"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1 ${
                              topic.status === "监测中" ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                            }`}
                          ></span>
                          {topic.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-600">{topic.creator}</td>

                      <td className="py-3 px-3 text-gray-500 text-[11px] font-mono">
                        {topic.createdAt.split(" ")[0]}
                      </td>

                      {/* Operations */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setSelectedTopicDetail(topic)}
                            className="text-teal-600 hover:text-teal-800 font-medium flex items-center space-x-0.5"
                            title="查看详情与AI研判"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>详情/AI研判</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(topic)}
                            className={`font-medium flex items-center space-x-0.5 ${
                              topic.status === "监测中"
                                ? "text-amber-600 hover:text-amber-800"
                                : "text-emerald-600 hover:text-emerald-800"
                            }`}
                            title={topic.status === "监测中" ? "暂停监测" : "重启监测"}
                          >
                            {topic.status === "监测中" ? (
                              <>
                                <PauseCircle className="w-3.5 h-3.5" />
                                <span>暂停</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>开启</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(topic.id, topic.title)}
                            className="text-red-500 hover:text-red-700 font-medium flex items-center space-x-0.5"
                            title="删除专题"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTopicModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableOpinions={availableOpinions}
        onAddTopic={(newTopic) => {
          onAddTopic(newTopic);
          showToast(`已成功添加专题 【${newTopic.title.slice(0, 10)}...】`);
        }}
      />

      <TopicDetailModal
        topic={selectedTopicDetail}
        onClose={() => setSelectedTopicDetail(null)}
      />
    </div>
  );
};
