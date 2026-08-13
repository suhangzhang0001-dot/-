import React, { useState } from "react";
import { X, Sparkles, Edit3, CheckCircle2, AlertCircle, Loader2, Info, Building2, Headphones, ShoppingCart, MessageSquare, Globe, Search, Link as LinkIcon, CheckSquare, Square, Users, UserPlus, Plus, Check } from "lucide-react";
import { SentimentTopic, RiskLevel, GenerationType, PublicOpinionItem } from "../types";
import { initialBrandOpinions } from "../data/mockData";

const PRESET_MEMBERS = [
  { id: "m1", name: "张素航", role: "公关总监", dept: "品牌公关部" },
  { id: "m2", name: "李美琳", role: "客服负责人", dept: "客户服务中心" },
  { id: "m3", name: "王建国", role: "法务经理", dept: "集团法务部" },
  { id: "m4", name: "陈思远", role: "运营总监", dept: "电商事业部" },
  { id: "m5", name: "刘强", role: "品牌经理", dept: "市场公关部" },
  { id: "m6", name: "吴海", role: "售后组长", dept: "售后服务部" },
];

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
  // Manual Form State
  const [manualTitle, setManualTitle] = useState("");
  const [manualRisk, setManualRisk] = useState<RiskLevel>("S级");
  const [urgeTime, setUrgeTime] = useState<string>("2");
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
  const [manualThreshold, setManualThreshold] = useState("小时关联异动声量 > 100条");
  const [manualSummary, setManualSummary] = useState("");

  // One-click group creation and members state
  const [autoCreateGroup, setAutoCreateGroup] = useState<boolean>(true);
  const [groupPlatform, setGroupPlatform] = useState<string>("企微协同群");
  const [groupName, setGroupName] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([
    "张素航 (公关总监)",
    "李美琳 (客服负责人)",
    "王建国 (法务经理)",
    "陈思远 (运营总监)",
  ]);
  const [newMemberInput, setNewMemberInput] = useState<string>("");

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

  const handleToggleMember = (memberLabel: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberLabel)
        ? prev.filter((m) => m !== memberLabel)
        : [...prev, memberLabel]
    );
  };

  const handleAddCustomMember = () => {
    if (newMemberInput.trim() && !selectedMembers.includes(newMemberInput.trim())) {
      setSelectedMembers((prev) => [...prev, newMemberInput.trim()]);
      setNewMemberInput("");
    }
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
      auditStatus: "已通过",
      riskLevel: manualRisk,
      urgeTime: urgeTime ? (urgeTime.toLowerCase().endsWith("h") ? urgeTime : `${urgeTime}h`) : "2h",
      status: "处理中",
      keywords: kwList.length > 0 ? kwList : ["品质瑕疵", "客服超时"],
      excludeKeywords: exList,
      mediaChannels: manualChannels.length > 0 ? manualChannels : ["微博", "黑猫投诉"],
      monitorScope: manualScope,
      riskAlertThreshold: manualThreshold,
      creator: "张素航",
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      updatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      totalMentions: linkedItems.length > 0 ? linkedItems.length * 1200 + Math.floor(Math.random() * 2000) : Math.floor(1000 + Math.random() * 5000),
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
              通过手动表单精准配置与勾选品牌/服务/电商等舆情数据源创建专属专题
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Manual Creation Form */}
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

              {/* 舆情专题等级与催办时间 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    舆情专题等级 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={manualRisk}
                    onChange={(e) => setManualRisk(e.target.value as RiskLevel)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white font-medium text-gray-800"
                  >
                    <option value="S级">S级 - 紧急重大 (最高响应/即时介入)</option>
                    <option value="A级">A级 - 高危风险 (重点关注/快速处置)</option>
                    <option value="B级">B级 - 中危关注 (日常异动/定期跟踪)</option>
                    <option value="C级">C级 - 一般监控 (常规声量/持续观察)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    催办/响应时限
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={urgeTime}
                      onChange={(e) => setUrgeTime(e.target.value)}
                      placeholder="如：0.5, 1, 2, 24"
                      className="w-full text-xs p-2.5 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white font-medium text-gray-800"
                    />
                    <span className="absolute right-3 text-xs font-bold text-gray-500 pointer-events-none select-none">
                      h
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  包含关键词/描述
                </label>
                <textarea
                  rows={2}
                  value={manualKeywords}
                  onChange={(e) => setManualKeywords(e.target.value)}
                  placeholder="例如：断连, 异常关机, 电池跑电, 售后拖延, 拒绝退差价"
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                />
              </div>

              {/* 一键拉群与群成员配置 */}
              <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-800 flex items-center">
                        一键拉应急处置群 / 告警协同群
                        <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-medium">
                          即时协同
                        </span>
                      </label>
                      <p className="text-[10px] text-gray-500">专题保存后自动创建沟通群，并实时推送异常与舆情条目</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAutoCreateGroup(!autoCreateGroup)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoCreateGroup ? "bg-teal-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        autoCreateGroup ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {autoCreateGroup && (
                  <div className="space-y-3 pt-1 border-t border-teal-100/80">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        拟建协同群名称
                      </label>
                      <input
                        type="text"
                        value={groupName || (manualTitle ? `[舆情处置群] ${manualTitle}` : "[应急响应] 专题舆情协同处置群")}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="例如：[应急响应] 618售后舆情专项处置群"
                        className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
                      />
                    </div>

                    {/* 选择群成员 */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-semibold text-gray-700 flex items-center">
                          <UserPlus className="w-3.5 h-3.5 text-teal-600 mr-1" />
                          选择拉入群成员
                        </label>
                        <span className="text-[10px] text-teal-700 font-medium">
                          已选 {selectedMembers.length} 位成员
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newMemberInput}
                          onChange={(e) => setNewMemberInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomMember();
                            }
                          }}
                          placeholder="输入姓名/邮箱/手机号回车添加..."
                          className="flex-1 text-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomMember}
                          className="px-3 py-2 bg-teal-100 text-teal-800 hover:bg-teal-200 text-xs font-medium rounded-lg transition-colors flex items-center shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          添加成员
                        </button>
                      </div>

                      {selectedMembers.length > 0 && (
                        <div className="mt-2 p-2 bg-white rounded-lg border border-teal-100 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] text-gray-400 font-medium mr-1">已选择拉群名单:</span>
                          {selectedMembers.map((m) => (
                            <span
                              key={m}
                              className="px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 text-[11px] rounded flex items-center space-x-1"
                            >
                              <span>{m}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleMember(m)}
                                className="text-teal-500 hover:text-teal-800 ml-1 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
        </div>
      </div>
    </div>
  );
};
