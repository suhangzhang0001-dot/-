import React from "react";
import { TrendingUp, ShieldAlert, Sparkles, MessageSquare, AlertCircle, ArrowUpRight } from "lucide-react";
import { SentimentTopic } from "../types";

interface OverviewDashboardProps {
  topics: SentimentTopic[];
  onNavigateToTopics: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ topics, onNavigateToTopics }) => {
  return (
    <div id="overview-dashboard-container" className="p-4 space-y-4 text-xs">
      {/* Welcome & System Summary */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-900 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[11px] font-semibold backdrop-blur-xs">
              VOC 全网声量实时监测引擎
            </span>
            <span className="text-teal-200 text-xs">上次同步时间: 1分钟前</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight pt-1">
            欢迎使用 VOC 用户声音洞察平台
          </h2>
          <p className="text-teal-100 text-xs opacity-90 max-w-2xl">
            平台已实现对微博、小红书、抖音、黑猫投诉及海外Reddit等多渠道的分钟级全网监控。现已上线全新【舆情专题管理】功能，支持AI大模型智能提取与自动化研判。
          </p>
        </div>

        <button
          onClick={onNavigateToTopics}
          className="px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 font-bold rounded-xl text-xs transition-all shadow-md flex items-center space-x-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>进入舆情专题管理</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top 3 Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-gray-500 font-medium">
            <span>今日全网监测声量</span>
            <MessageSquare className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">128,450 <span className="text-xs text-emerald-600 font-normal">↑ 12.4%</span></div>
          <p className="text-[11px] text-gray-400">来自 9 大主流媒体与客诉渠道</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-gray-500 font-medium">
            <span>活跃舆情专题</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-teal-700 font-mono">{topics.length} <span className="text-xs text-gray-500 font-normal">个在监专题</span></div>
          <p className="text-[11px] text-gray-400">其中 {topics.filter(t => t.generationType === "ai").length} 个由 Gemini AI 智能建立</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-gray-500 font-medium">
            <span>今日紧急预警触发</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 font-mono">3 <span className="text-xs text-red-500 font-normal">起高危P1</span></div>
          <p className="text-[11px] text-gray-400">已自动推送到公关与客户服务应急响应群</p>
        </div>
      </div>

      {/* Active Sentiment Topics Spotlight */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="font-bold text-gray-800 text-xs flex items-center">
            <TrendingUp className="w-4 h-4 text-teal-600 mr-1.5" />
            重点关注舆情专题走势
          </span>
          <button
            onClick={onNavigateToTopics}
            className="text-teal-600 hover:text-teal-800 font-medium text-xs flex items-center"
          >
            查看全部专题 →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.slice(0, 2).map((topic) => (
            <div key={topic.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-xs truncate max-w-[280px]">{topic.title}</span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                  {topic.riskLevel}
                </span>
              </div>
              <p className="text-gray-500 text-[11px] line-clamp-2">{topic.summary}</p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-gray-600 border-t border-gray-200/60">
                <span>关联声量: <strong className="text-gray-900 font-mono">{topic.totalMentions}</strong></span>
                <span>负面占比: <strong className="text-red-600 font-mono">{topic.negativeRatio}%</strong></span>
                <span className="text-teal-700 font-medium">{topic.generationType === "ai" ? "✨ AI生成" : "✍️ 手动配置"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
