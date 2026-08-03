import React, { useState } from "react";
import { X, Sparkles, Edit3, CheckCircle2, AlertCircle, Loader2, Info, Building2, Headphones, ShoppingCart, MessageSquare, Globe, Search, Link as LinkIcon, CheckSquare, Square } from "lucide-react";
import { SentimentTopic, RiskLevel, GenerationType, PublicOpinionItem } from "../types";
import { initialBrandOpinions } from "../data/mockData";

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTopic: (topic: SentimentTopic) => void;
  availableOpinions?: PublicOpinionItem[];
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  onAddTopic,
  availableOpinions = initialBrandOpinions,
}) => {
  const [activeTab, setActiveTab] = useState<GenerationType>("ai");

  // AI Tab State
  const [aiPrompt, setAiPrompt] = useState("");
  const [targetBrand, setTargetBrand] = useState("");
  const [industry, setIndustry] = useState("消费电子与智能硬件");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiPreviewTopic, setAiPreviewTopic] = useState<Partial<SentimentTopic> | null>(null);

  // Manual Form State
  const [manualTitle, setManualTitle] = useState("");
  const [manualRisk, setManualRisk] = useState<RiskLevel>("P1 - 高危");
  const [manualKeywords, setManualKeywords] = useState("");
  const [manualExcludeKeywords, setManualExcludeKeywords] = useState("");
  const [manualChannels, setManualChannels] = useState<string[]>([
    "微博",
    "小红书",
    "黑猫投诉",
    "抖音",
    "知乎",
  ]);
  const [manualScope, setManualScope] = useState("集团品牌公关部 / 客户服务中心");
  const [manualThreshold, setManualThreshold] = useState("小时负面声量 > 100条");
  const [manualSummary, setManualSummary] = useState("");

  // Category & Linked Opinions State for Manual Mode
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "品牌舆情",
    "服务舆情",
    "电商舆情",
  ]);
  const [selectedOpinionIds, setSelectedOpinionIds] = useState<string[]>([
    "po-101",
    "po-201",
    "po-301",
  ]);
  const [opinionFilterCategory, setOpinionFilterCategory] = useState<string>("全部");
  const [opinionSearchKeyword, setOpinionSearchKeyword] = useState<string>("");

  if (!isOpen) return null;

  const handleToggleChannel = (channel: string) => {
    setManualChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleToggleCategory = (catLabel: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catLabel) ? prev.filter((c) => c !== catLabel) : [...prev, catLabel]
    );
  };

  const handleToggleOpinionItem = (id: string) => {
    setSelectedOpinionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Call Gemini API via Express backend `/api/ai/generate-topic`
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setAiError("请填写舆情事件背景、用户评价或监控需求说明");
      return;
    }

    setAiError("");
    setIsGenerating(true);
    setAiPreviewTopic(null);

    try {
      const response = await fetch("/api/ai/generate-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: aiPrompt,
          targetBrand: targetBrand || "品牌主线产品",
          industry: industry,
        }),
      });

      const data = await response.json();

      if (data.success && data.topic) {
        setAiPreviewTopic(data.topic);
      } else {
        throw new Error(data.error || "生成失败，请重试");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "连接服务器失败，已应用备用规则提取");
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit AI-generated topic
  const handleSubmitAITopic = () => {
    if (!aiPreviewTopic) return;

    const newTopic: SentimentTopic = {
      id: `topic-${Date.now()}`,
      code: `ZT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        10 + Math.random() * 90
      )}`,
      title: aiPreviewTopic.title || "AI 舆情专题",
      summary: aiPreviewTopic.summary || "AI智能生成的舆情专题方案",
      generationType: "ai",
      riskLevel: (aiPreviewTopic.riskLevel as RiskLevel) || "P1 - 高危",
      status: "监测中",
      keywords: aiPreviewTopic.keywords || ["发热", "退货", "服务差"],
      excludeKeywords: aiPreviewTopic.excludeKeywords || ["正常", "好评"],
      mediaChannels: aiPreviewTopic.mediaChannels || ["微博", "小红书", "黑猫投诉"],
      monitorScope: aiPreviewTopic.monitorScope || "品牌运营组",
      riskAlertThreshold: aiPreviewTopic.riskAlertThreshold || "小时负面声量 > 100条",
      creator: "AI 智能引擎",
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      updatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      totalMentions: Math.floor(2000 + Math.random() * 10000),
      negativeRatio: Math.floor(25 + Math.random() * 30),
      sentimentScore: Math.floor(40 + Math.random() * 35),
      dimensions: aiPreviewTopic.dimensions,
      initialSentimentBreakdown: aiPreviewTopic.initialSentimentBreakdown,
      predictedTrend: aiPreviewTopic.predictedTrend,
      actionSuggestions: aiPreviewTopic.actionSuggestions,
    };

    onAddTopic(newTopic);
    onClose();
  };

  // Submit Manual topic
  const handleSubmitManualTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const kwList = manualKeywords
      .split(/[,，\n]/)
      .map((k) => k.trim())
      .filter(Boolean);

    const exList = manualExcludeKeywords
      .split(/[,，\n]/)
      .map((k) => k.trim())
      .filter(Boolean);

    const linkedItems = availableOpinions.filter((item) => selectedOpinionIds.includes(item.id));

    const newTopic: SentimentTopic = {
      id: `topic-${Date.now()}`,
      code: `ZT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        10 + Math.random() * 90
      )}`,
      title: manualTitle,
      summary: manualSummary || "手动配置的舆情专题监测方案",
      generationType: "manual",
      riskLevel: manualRisk,
      status: "监测中",
      keywords: kwList.length > 0 ? kwList : ["品质瑕疵", "客服超时"],
      excludeKeywords: exList,
      mediaChannels: manualChannels.length > 0 ? manualChannels : ["微博", "黑猫投诉"],
      monitorScope: manualScope,
      riskAlertThreshold: manualThreshold,
      creator: "张素航",
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      updatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      totalMentions: linkedItems.length > 0 ? linkedItems.length * 1200 + Math.floor(Math.random() * 2000) : Math.floor(1000 + Math.random() * 5000),
      negativeRatio: Math.floor(25 + Math.random() * 25),
      sentimentScore: Math.floor(55 + Math.random() * 30),
      dataCategories: selectedCategories.length > 0 ? selectedCategories : ["品牌舆情", "服务舆情", "电商舆情"],
      linkedOpinionIds: selectedOpinionIds,
      linkedOpinions: linkedItems,
    };

    onAddTopic(newTopic);
    onClose();
  };

  const channelOptions = [
    "微博",
    "小红书",
    "黑猫投诉",
    "抖音",
    "知乎",
    "贴吧",
    "微信",
    "新闻媒体",
    "B站",
  ];

  return (
    <div id="add-topic-modal" className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800 flex items-center">
              新增舆情专题
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              可选择通过 Gemini AI 智能提取一键构建或手动精准配置表单
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creation Mode Tabs */}
        <div className="px-6 pt-3 bg-white border-b border-gray-200 flex items-center space-x-4">
          <button
            onClick={() => setActiveTab("ai")}
            className={`pb-2.5 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition-colors ${
              activeTab === "ai"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI 智能自动生成专题</span>
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded font-normal">
              推荐
            </span>
          </button>

          <button
            onClick={() => setActiveTab("manual")}
            className={`pb-2.5 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition-colors ${
              activeTab === "manual"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>手动表单配置创建</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {activeTab === "ai" ? (
            <div className="space-y-4">
              <div className="bg-teal-50/60 border border-teal-200/80 rounded-lg p-3.5 text-xs text-teal-900 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-teal-950">AI 智能提取机制说明：</p>
                  <p className="text-teal-800 mt-0.5">
                    粘贴用户投诉段落、热搜新闻事件或描述核心隐患，AI将自动萃取风险等级、核心关键词、监控范围、分析维度及应急处置建议。
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  舆情事件背景 / 客户反馈文本 / 监控需求 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="例如：近期有消费者在小红书和黑猫投诉集中反映我们的旗舰机型发热严重，并在玩游戏或长时间拍摄时出现降频死机，客服沟通时态度敷衍拒绝退货..."
                  rows={4}
                  className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    目标品牌 / 业务线
                  </label>
                  <input
                    type="text"
                    value={targetBrand}
                    onChange={(e) => setTargetBrand(e.target.value)}
                    placeholder="如：智能终端 / 725旗舰"
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    行业领域
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
                  >
                    <option value="消费电子与智能硬件">消费电子与智能硬件</option>
                    <option value="电商零售与快消品">电商零售与快消品</option>
                    <option value="互联网与SaaS软件">互联网与SaaS软件</option>
                    <option value="新能源汽车与出行">新能源汽车与出行</option>
                    <option value="金融保险与服务业">金融保险与服务业</option>
                  </select>
                </div>
              </div>

              {aiError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini AI 正在深度剖析事件与生成专题...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>AI 一键生成舆情专题架构</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Generated Preview Card */}
              {aiPreviewTopic && (
                <div className="mt-4 border border-teal-200 bg-teal-50/30 rounded-xl p-4 text-xs space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                    <span className="font-bold text-gray-900 text-sm flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mr-1.5" />
                      {aiPreviewTopic.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[11px]">
                      {aiPreviewTopic.riskLevel}
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{aiPreviewTopic.summary}</p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="font-semibold text-gray-700">监控关键词：</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiPreviewTopic.keywords?.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 rounded text-[11px]">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-700">重点监控渠道：</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiPreviewTopic.mediaChannels?.map((ch, i) => (
                          <span key={i} className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded text-[11px] font-medium">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {aiPreviewTopic.predictedTrend && (
                    <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100 text-gray-700">
                      <span className="font-semibold text-teal-800">🔮 AI 走势预判：</span>
                      <p className="mt-0.5 text-gray-600">{aiPreviewTopic.predictedTrend}</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSubmitAITopic}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-all shadow-sm"
                    >
                      确认启用此 AI 生成专题
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Manual Creation Form */
            <form onSubmit={handleSubmitManualTopic} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  专题名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="例如：618全网大促品牌服务与电商口碑综合监测专题"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                />
              </div>

              {/* Data Categories Selector (品牌/服务/电商/评论区/海外) */}
              <div className="bg-teal-50/40 p-3.5 rounded-xl border border-teal-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center">
                    <Building2 className="w-4 h-4 text-teal-600 mr-1.5" />
                    关联舆情数据分类 <span className="text-xs text-teal-700 font-normal ml-1">(支持多选 品牌/服务/电商 等数据源)</span>
                  </label>
                  <span className="text-[11px] text-teal-800 font-medium">
                    已选 {selectedCategories.length} 类数据
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { label: "品牌舆情", icon: Building2, desc: "公关PR/品牌口碑" },
                    { label: "服务舆情", icon: Headphones, desc: "客服/售后维修" },
                    { label: "电商舆情", icon: ShoppingCart, desc: "保价/快递破损" },
                    { label: "评论区舆情", icon: MessageSquare, desc: "爆款贴/评论词云" },
                    { label: "海外舆情", icon: Globe, desc: "跨境/海外社媒" },
                  ].map((cat) => {
                    const selected = selectedCategories.includes(cat.label);
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => handleToggleCategory(cat.label)}
                        className={`p-2.5 rounded-lg border text-left transition-all flex items-start space-x-2 ${
                          selected
                            ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${selected ? "text-amber-300" : "text-teal-600"}`} />
                        <div className="min-w-0">
                          <div className="font-semibold text-xs leading-tight flex items-center justify-between">
                            <span>{cat.label}</span>
                            {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white ml-1 shrink-0" />}
                          </div>
                          <p className={`text-[10px] mt-0.5 truncate ${selected ? "text-teal-100" : "text-gray-400"}`}>
                            {cat.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specific Opinion Items Chooser */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-gray-800 text-xs">勾选关联已抓取的舆情明细记录</span>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-medium text-[10px]">
                      已选中 {selectedOpinionIds.length} 条数据
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs">
                    {["全部", "品牌舆情", "服务舆情", "电商舆情"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setOpinionFilterCategory(cat)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                          opinionFilterCategory === cat
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={opinionSearchKeyword}
                    onChange={(e) => setOpinionSearchKeyword(e.target.value)}
                    placeholder="搜索任务编号、品牌/服务/电商标题或处理人..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Scrollable opinion list */}
                <div className="max-h-48 overflow-y-auto custom-scrollbar border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {availableOpinions
                    .filter((op) => {
                      if (opinionFilterCategory !== "全部" && op.categoryLabel !== opinionFilterCategory) {
                        return false;
                      }
                      if (opinionSearchKeyword.trim()) {
                        const kw = opinionSearchKeyword.toLowerCase();
                        return (
                          op.title.toLowerCase().includes(kw) ||
                          op.taskNo.toLowerCase().includes(kw) ||
                          op.handler.toLowerCase().includes(kw)
                        );
                      }
                      return true;
                    })
                    .map((op) => {
                      const isChecked = selectedOpinionIds.includes(op.id);
                      return (
                        <div
                          key={op.id}
                          onClick={() => handleToggleOpinionItem(op.id)}
                          className={`p-2.5 flex items-start space-x-3 cursor-pointer transition-colors ${
                            isChecked ? "bg-teal-50/50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="mt-0.5 text-teal-600 shrink-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-teal-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900 text-xs truncate max-w-[360px]">
                                {op.title}
                              </span>
                              <div className="flex items-center space-x-1.5 shrink-0">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                  op.categoryLabel === "品牌舆情"
                                    ? "bg-purple-100 text-purple-800"
                                    : op.categoryLabel === "服务舆情"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                  {op.categoryLabel || "品牌舆情"}
                                </span>
                                <span className="px-1.5 py-0.2 bg-red-100 text-red-700 font-bold rounded text-[10px]">
                                  {op.warningLevel}
                                </span>
                              </div>
                            </div>
                            {op.contentSnippet && (
                              <p className="text-gray-500 text-[11px] line-clamp-1">{op.contentSnippet}</p>
                            )}
                            <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-mono">
                              <span>编号: {op.taskNo}</span>
                              <span>媒体: {op.media}</span>
                              <span>处理人: {op.handler}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    风险等级预设
                  </label>
                  <select
                    value={manualRisk}
                    onChange={(e) => setManualRisk(e.target.value as RiskLevel)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
                  >
                    <option value="P0 - 紧急">P0 - 紧急 (集团级最高预警)</option>
                    <option value="P1 - 高危">P1 - 高危 (业务线重大隐患)</option>
                    <option value="P2 - 中危">P2 - 中危 (日常常态监控)</option>
                    <option value="P3 - 低危">P3 - 低危 (低风险观望)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    预警触发规则
                  </label>
                  <input
                    type="text"
                    value={manualThreshold}
                    onChange={(e) => setManualThreshold(e.target.value)}
                    placeholder="如：小时负面 > 100条 或 单帖阅读 > 5万"
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    包含关键词 (逗号分隔)
                  </label>
                  <textarea
                    rows={2}
                    value={manualKeywords}
                    onChange={(e) => setManualKeywords(e.target.value)}
                    placeholder="例如：断连, 异常关机, 电池跑电, 售后拖延, 拒绝退差价"
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    排除干扰词 (逗号分隔)
                  </label>
                  <textarea
                    rows={2}
                    value={manualExcludeKeywords}
                    onChange={(e) => setManualExcludeKeywords(e.target.value)}
                    placeholder="例如：抽奖活动, 官方正常通稿"
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  监测媒体渠道
                </label>
                <div className="flex flex-wrap gap-2">
                  {channelOptions.map((ch) => {
                    const checked = manualChannels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleToggleChannel(ch)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                          checked
                            ? "bg-teal-50 text-teal-700 border-teal-300"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  责任部门 / 业务范围
                </label>
                <input
                  type="text"
                  value={manualScope}
                  onChange={(e) => setManualScope(e.target.value)}
                  placeholder="如：集团品牌公关部 / 客户服务中心 / 电商运营部"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  专题描述与备注
                </label>
                <textarea
                  rows={2}
                  value={manualSummary}
                  onChange={(e) => setManualSummary(e.target.value)}
                  placeholder="请输入专题监控背景及品牌、服务、电商维度侧重点..."
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
                >
                  保存并建立专题
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
