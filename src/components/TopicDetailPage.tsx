import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Layers,
  Radio,
  CheckCircle2,
  RotateCcw,
  Download,
  Share2,
  ShieldCheck,
  Check
} from "lucide-react";
import { SentimentTopic } from "../types";

interface TopicDetailPageProps {
  topic: SentimentTopic;
  onBack: () => void;
  onUpdateTopic?: (topic: SentimentTopic) => void;
}

export const TopicDetailPage: React.FC<TopicDetailPageProps> = ({
  topic,
  onBack,
  onUpdateTopic,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/analyze-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle: topic.title,
          topicSummary: topic.summary,
          keywords: topic.keywords,
        }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        showToast("Gemini AI 深度研判报告更新完成");
      }
    } catch (err) {
      console.error(err);
      showToast("研判生成失败，请重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleStatus = () => {
    if (!onUpdateTopic) return;
    const newStatus = topic.status === "处理中" ? "已闭环" : "处理中";
    const updated = { ...topic, status: newStatus as any };
    onUpdateTopic(updated);
    showToast(`专题状态已更改为：${newStatus}`);
  };

  return (
    <div id="topic-detail-page" className="p-4 sm:p-6 space-y-5 text-xs animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs border border-gray-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Back Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1 font-semibold cursor-pointer border border-gray-200 bg-gray-50/50"
            title="返回专题列表"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs">返回专题列表</span>
          </button>

          <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>

          <div>
            <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-medium">
              <span>舆情专题管理</span>
              <span>/</span>
              <span className="text-gray-800 font-semibold">专题详情页</span>
            </div>
            <div className="flex items-center space-x-2.5 pt-0.5">
              <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold text-xs">
                {topic.code}
              </span>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                {topic.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Top Header Status & Actions */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {topic.generationType === "ai" ? (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg flex items-center shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
              AI 自动生成
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium rounded-lg">
              手动创建
            </span>
          )}

          {onUpdateTopic && (
            <button
              onClick={handleToggleStatus}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center space-x-1 border shadow-2xs cursor-pointer ${
                topic.status === "处理中"
                  ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              }`}
            >
              {topic.status === "处理中" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>标记为已闭环</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新开启处理</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => showToast("已导出该专题研判简报 (PDF/Word)")}
            className="p-1.5 text-gray-600 hover:text-teal-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer"
            title="导出研判简报"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Core KPI Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-gray-500 font-medium text-[11px] block">预警风险等级</span>
          <div className="flex items-center space-x-2">
            <span className={`text-xl font-bold font-mono ${
              topic.riskLevel === "S级" ? "text-red-600" :
              topic.riskLevel === "A级" ? "text-amber-600" :
              topic.riskLevel === "B级" ? "text-blue-600" : "text-slate-600"
            }`}>
              {topic.riskLevel}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              topic.riskLevel === "S级" ? "bg-red-100 text-red-800" :
              topic.riskLevel === "A级" ? "bg-amber-100 text-amber-800" :
              topic.riskLevel === "B级" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800"
            }`}>
              {topic.riskLevel === "S级" ? "紧急重大" : topic.riskLevel === "A级" ? "高危风险" : topic.riskLevel === "B级" ? "中危关注" : "一般监控"}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-gray-500 font-medium text-[11px] block">催办 / 响应时限</span>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-teal-600" />
            <span className="text-xl font-bold font-mono text-teal-800">
              {topic.urgeTime || "2h"}
            </span>
            <span className="text-gray-400 text-[10px]">要求响应</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-gray-500 font-medium text-[11px] block">全网监测总声量</span>
          <div className="text-xl font-bold font-mono text-gray-900">
            {topic.totalMentions.toLocaleString()} <span className="text-xs font-normal text-gray-500">条</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-gray-500 font-medium text-[11px] block">舆情健康度得分</span>
          <div className={`text-xl font-bold font-mono ${topic.sentimentScore < 60 ? "text-amber-600" : "text-emerald-600"}`}>
            {topic.sentimentScore} <span className="text-xs font-normal text-gray-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* Sentiment Breakdown Progress */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex justify-between items-center font-bold text-gray-800">
          <span className="flex items-center text-xs">
            <TrendingUp className="w-4 h-4 text-teal-600 mr-1.5" />
            全网情感声量分布比例
          </span>
          <span className="text-gray-400 text-[11px] font-normal">数据来源: 微博、小红书、抖音、知乎、黑猫投诉等</span>
        </div>
        <div className="h-3.5 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
          <div style={{ width: `30%` }} className="bg-emerald-500 h-full" title="正面声量"></div>
          <div style={{ width: `40%` }} className="bg-gray-300 h-full" title="中立声量"></div>
          <div style={{ width: `30%` }} className="bg-rose-500 h-full" title="预警声量"></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-600 pt-0.5">
          <span className="flex items-center font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>正面声量 (30%)</span>
          <span className="flex items-center font-medium"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 mr-1.5"></span>中立声量 (40%)</span>
          <span className="flex items-center font-bold text-rose-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5"></span>预警负面 (30%)</span>
        </div>
      </div>

      {/* Linked Opinion Items Section */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-gray-800 text-xs">涉及舆情数据源分类与关联明细</span>
          </div>
          <div className="flex items-center space-x-1.5">
            {(topic.dataCategories || ["品牌舆情", "服务舆情", "电商舆情"]).map((cat, i) => (
              <span
                key={i}
                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
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
          </div>
        </div>

        {topic.linkedOpinions && topic.linkedOpinions.length > 0 ? (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-semibold text-gray-500">
              当前专题归集包含了 {topic.linkedOpinions.length} 条关联舆情条目与客诉工单：
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {topic.linkedOpinions.map((op) => (
                <div
                  key={op.id}
                  className="p-3 bg-gray-50/90 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          op.categoryLabel === "品牌舆情"
                            ? "bg-purple-100 text-purple-800"
                            : op.categoryLabel === "服务舆情"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {op.categoryLabel || "品牌舆情"}
                      </span>
                      <span className="font-bold text-gray-900 text-xs truncate max-w-[220px]">{op.title}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded shrink-0">
                      {op.warningLevel}
                    </span>
                  </div>
                  {op.contentSnippet && (
                    <p className="text-gray-600 text-[11px] line-clamp-2 leading-relaxed">{op.contentSnippet}</p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1 border-t border-gray-200/60">
                    <span>任务: {op.taskNo}</span>
                    <span>媒体: {op.media}</span>
                    <span>责任人: {op.handler}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-[11px] py-2">该专题依据全网关键词监控自动采集，暂无手动绑定的个案工单。</p>
        )}
      </div>

      {/* Rules & Media Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="font-bold text-gray-800 text-xs flex items-center">
            <Radio className="w-4 h-4 mr-1.5 text-teal-600" />
            监测规则与词库配置
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-500 font-medium">包含关键词/描述：</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {topic.keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 font-medium rounded text-[11px]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            {topic.excludeKeywords.length > 0 && (
              <div>
                <span className="text-gray-500 font-medium">排除干扰词：</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {topic.excludeKeywords.map((ex, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px]">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-1 flex items-center justify-between text-[11px] border-t border-gray-100">
              <span className="text-gray-500">预警触发规则: <strong className="text-gray-800">{topic.riskAlertThreshold}</strong></span>
              <span className="text-gray-500">归属业务部门: <strong className="text-gray-800">{topic.monitorScope}</strong></span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="font-bold text-gray-800 text-xs flex items-center">
            <Layers className="w-4 h-4 mr-1.5 text-teal-600" />
            监测渠道与专题简述
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-500 font-medium block mb-1">已接入监测媒体渠道：</span>
              <div className="flex flex-wrap gap-1.5">
                {topic.mediaChannels.map((ch, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg text-[11px] border border-gray-200">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-800 block mb-1">专题摘要：</span>
              <p className="text-gray-600 leading-relaxed text-[11px]">{topic.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Real-time Deep Insight Analysis Section */}
      <div className="bg-gradient-to-r from-teal-50/90 via-emerald-50/90 to-teal-50/90 p-5 rounded-2xl border border-teal-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
            <span className="font-bold text-teal-900 text-xs sm:text-sm">Gemini AI 舆情深度研判与公关策略指引</span>
          </div>
          <button
            onClick={handleRunAIAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center space-x-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
            <span>{isAnalyzing ? "正在运行研判..." : "重新运行 AI 深度研判"}</span>
          </button>
        </div>

        {analysisResult ? (
          <div className="space-y-3 pt-2 text-xs text-gray-800 border-t border-teal-200/80 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-teal-100 space-y-1">
                <span className="font-bold text-teal-900 block">舆情风险状态评估：</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded inline-block text-[11px]">
                  {analysisResult.riskStatus}
                </span>
                <p className="text-gray-600 mt-1 leading-relaxed text-[11px]">{analysisResult.emotionDistribution}</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-teal-100 space-y-1">
                <span className="font-bold text-teal-900 block">关键扩散 KOL / 风险源账号：</span>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5 text-[11px]">
                  {analysisResult.keyOpinionLeaders?.map((kol: string, i: number) => (
                    <li key={i}>{kol}</li>
                  ))}
                </ul>
              </div>
            </div>

            {analysisResult.hotPosts && (
              <div className="bg-white p-3.5 rounded-xl border border-teal-100 space-y-2">
                <span className="font-bold text-teal-900 block">全网高关注度帖文/跟进：</span>
                <div className="space-y-1.5">
                  {analysisResult.hotPosts.map((post: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-200/80 gap-1">
                      <span className="font-semibold text-gray-800 truncate max-w-[480px]">{post.title}</span>
                      <div className="flex items-center space-x-2 shrink-0 text-[11px]">
                        <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 font-bold rounded">{post.source}</span>
                        <span className="text-gray-500 font-mono">阅读: {post.reads}</span>
                        <span className={`font-semibold ${post.sentiment === "负面" ? "text-red-600" : "text-emerald-600"}`}>
                          {post.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-200 text-amber-900 space-y-1">
              <span className="font-bold block text-xs">💡 推荐公关应对与处置策略：</span>
              <p className="leading-relaxed text-[11px]">{analysisResult.strategyRecommendation}</p>
            </div>
          </div>
        ) : (
          <p className="text-teal-800/80 leading-relaxed text-[11px] pt-1">
            点击【重新运行 AI 深度研判】按钮，系统将实时触发 Gemini 模型研判全网声量走势，提供扩散趋势图谱、KOL跟进列表及危机公关应对方案。
          </p>
        )}
      </div>
    </div>
  );
};
