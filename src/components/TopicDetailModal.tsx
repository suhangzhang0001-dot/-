import React, { useState } from "react";
import { X, Sparkles, AlertTriangle, ShieldCheck, TrendingUp, RefreshCw, Layers, Radio, MessageSquareText } from "lucide-react";
import { SentimentTopic } from "../types";

interface TopicDetailModalProps {
  topic: SentimentTopic | null;
  onClose: () => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({ topic, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  if (!topic) return null;

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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="topic-detail-modal" className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded bg-teal-100 text-teal-800 font-bold text-xs">
              {topic.code}
            </span>
            <h3 className="text-base font-bold text-gray-900">{topic.title}</h3>
            {topic.generationType === "ai" ? (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded flex items-center">
                <Sparkles className="w-3 h-3 mr-0.5 text-amber-600" />
                AI 自动生成
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
                手动创建
              </span>
            )}
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-xs">
          {/* Key Overview Cards Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-500 font-medium">预警风险等级</span>
              <div className="mt-1 font-bold text-sm text-red-600">{topic.riskLevel}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-500 font-medium">全网监测总声量</span>
              <div className="mt-1 font-bold text-sm text-gray-900">{topic.totalMentions.toLocaleString()} 条</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-500 font-medium">负面声量占比</span>
              <div className="mt-1 font-bold text-sm text-red-500">{topic.negativeRatio}%</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-500 font-medium">舆情健康度得分</span>
              <div className={`mt-1 font-bold text-sm ${topic.sentimentScore < 60 ? "text-amber-600" : "text-emerald-600"}`}>
                {topic.sentimentScore} / 100
              </div>
            </div>
          </div>

          {/* Sentiment Ratio Visual Bar */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>全网情感分布极性占比</span>
              <span className="text-gray-500 text-[11px]">包含: 小红书, 微博, 黑猫投诉, 知乎等</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
              <div style={{ width: `${100 - topic.negativeRatio - 25}%` }} className="bg-emerald-500 h-full" title="正面声量"></div>
              <div style={{ width: `25%` }} className="bg-gray-400 h-full" title="中立声量"></div>
              <div style={{ width: `${topic.negativeRatio}%` }} className="bg-red-500 h-full" title="负面声量"></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-600 pt-0.5">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1"></span>正面 ({(100 - topic.negativeRatio - 25).toFixed(1)}%)</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-1"></span>中立 (25.0%)</span>
              <span className="flex items-center font-semibold text-red-600"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span>负面 ({topic.negativeRatio}%)</span>
            </div>
          </div>

          {/* Data Categories & Linked Opinion Items Section */}
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-gray-800 text-xs">涉及舆情数据源分类与关联明细</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {(topic.dataCategories || ["品牌舆情", "服务舆情", "电商舆情"]).map((cat, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
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
                  当前专题包含 {topic.linkedOpinions.length} 条归集关联的舆情数据：
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                  {topic.linkedOpinions.map((op) => (
                    <div
                      key={op.id}
                      className="p-2.5 bg-gray-50/80 rounded-lg border border-gray-200 flex items-start justify-between hover:border-teal-300 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1 pr-3">
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
                          <span className="font-bold text-gray-900 text-xs truncate">{op.title}</span>
                        </div>
                        {op.contentSnippet && (
                          <p className="text-gray-500 text-[11px] line-clamp-1">{op.contentSnippet}</p>
                        )}
                        <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-mono pt-0.5">
                          <span>任务: {op.taskNo}</span>
                          <span>媒体: {op.media}</span>
                          <span>责任人: {op.handler}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded shrink-0">
                        {op.warningLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-[11px]">该专题依据全网关键词监控自动采集，暂无手动绑定的个案工单。</p>
            )}
          </div>

          {/* Topic Settings & Keywords */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <div className="font-bold text-gray-800 flex items-center">
                <Radio className="w-4 h-4 mr-1.5 text-teal-600" />
                监测规则与词库配置
              </div>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-gray-500">监测关键词：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {topic.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 rounded text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                {topic.excludeKeywords.length > 0 && (
                  <div>
                    <span className="text-gray-500">排除干扰词：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {topic.excludeKeywords.map((ex, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px]">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">触发阈值：</span>
                  <span className="font-medium text-gray-800 ml-1">{topic.riskAlertThreshold}</span>
                </div>
                <div>
                  <span className="text-gray-500">归属部门：</span>
                  <span className="font-medium text-gray-800 ml-1">{topic.monitorScope}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <div className="font-bold text-gray-800 flex items-center">
                <Layers className="w-4 h-4 mr-1.5 text-teal-600" />
                监测媒体渠道
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {topic.mediaChannels.map((ch, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg text-[11px] border border-gray-200">
                    {ch}
                  </span>
                ))}
              </div>
              <div className="pt-2 text-gray-600">
                <span className="font-semibold text-gray-800">专题简述：</span>
                <p className="mt-1 text-gray-600 leading-relaxed">{topic.summary}</p>
              </div>
            </div>
          </div>

          {/* AI Real-time Deep Insight Analysis Button & Results */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-xl border border-teal-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
                <span className="font-bold text-teal-900 text-xs">Gemini AI 舆情实时研判与应对策略</span>
              </div>
              <button
                onClick={handleRunAIAnalysis}
                disabled={isAnalyzing}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center space-x-1.5 shadow-xs disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                <span>{isAnalyzing ? "研判中..." : "重新运行 AI 深度研判"}</span>
              </button>
            </div>

            {analysisResult ? (
              <div className="space-y-3 pt-2 text-xs text-gray-800 border-t border-teal-200/60 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-teal-100">
                    <span className="font-bold text-teal-900 block mb-1">舆情风险状态：</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded">
                      {analysisResult.riskStatus}
                    </span>
                    <p className="text-gray-600 mt-2">{analysisResult.emotionDistribution}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-teal-100">
                    <span className="font-bold text-teal-900 block mb-1">关键扩散 KOL / 风险源账号：</span>
                    <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                      {analysisResult.keyOpinionLeaders?.map((kol: string, i: number) => (
                        <li key={i}>{kol}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {analysisResult.hotPosts && (
                  <div className="bg-white p-3 rounded-lg border border-teal-100">
                    <span className="font-bold text-teal-900 block mb-2">全网热度较高文章/视频跟进：</span>
                    <div className="space-y-1.5">
                      {analysisResult.hotPosts.map((post: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                          <span className="font-medium text-gray-800 truncate max-w-[400px]">{post.title}</span>
                          <div className="flex items-center space-x-2 shrink-0 text-[11px]">
                            <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">{post.source}</span>
                            <span className="text-gray-500">阅读: {post.reads}</span>
                            <span className={`font-semibold ${post.sentiment === "负面" ? "text-red-600" : "text-emerald-600"}`}>
                              {post.sentiment}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-bold block mb-1">💡 推荐公关应对与处理策：</span>
                  <p className="leading-relaxed">{analysisResult.strategyRecommendation}</p>
                </div>
              </div>
            ) : (
              <p className="text-teal-800/80 leading-relaxed pt-1">
                点击【重新运行 AI 深度研判】按钮，结合 Gemini 模型分析全网抓取舆情数据，生成 KOL 跟踪图谱、热点帖子剖析及危机公关响应方案。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
