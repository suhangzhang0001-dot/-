export type RiskLevel = "S级" | "A级" | "B级" | "C级";

export type GenerationType = "manual" | "ai";

export type AuditStatus = "待审核" | "已通过" | "已拒绝";

export type TopicStatus = "待审核" | "处理中" | "已闭环";

export interface TopicDimension {
  name: string;
  description: string;
}

export type OpinionCategory = "brand" | "service" | "ecommerce" | "comments" | "overseas";

export interface PublicOpinionItem {
  id: string;
  taskNo: string;
  title: string;
  media: string;
  warningLevel: RiskLevel;
  handler: string;
  company: string;
  businessUnit: string;
  occurrenceDate: string;
  status: "未处理" | "处理中" | "已完结" | "已忽略";
  sentiment: "正面" | "中立" | "负面";
  category?: OpinionCategory;
  categoryLabel?: string;
  contentSnippet?: string;
}

export interface SentimentTopic {
  id: string;
  code: string; // 专题编号 e.g. ZT-20260802-01
  title: string;
  summary: string;
  generationType: GenerationType; // 手动 或 AI 自动生成
  auditStatus?: AuditStatus; // 对于AI自动生成的专题，需要审核状态
  riskLevel: RiskLevel; // S级, A级, B级, C级
  urgeTime?: string; // 催办/响应时限 (如: "2h")
  status: TopicStatus;
  keywords: string[];
  excludeKeywords: string[];
  mediaChannels: string[];
  monitorScope: string;
  riskAlertThreshold: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  totalMentions: number; // 关联声量
  sentimentScore: number; // 舆情健康分 (0-100)
  dimensions?: TopicDimension[];
  initialSentimentBreakdown?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  predictedTrend?: string;
  actionSuggestions?: string[];
  dataCategories?: string[]; // 选中的舆情数据类型 e.g. ["品牌舆情", "服务舆情", "电商舆情"]
  linkedOpinionIds?: string[]; // 关联的具体舆情任务/条目ID
  linkedOpinions?: PublicOpinionItem[]; // 关联的具体舆情对象
}

export type MenuKey =
  | "overview"
  | "brand_opinion"
  | "topic_opinion" // 舆情专题管理
  | "ecommerce_opinion"
  | "service_opinion"
  | "comments_opinion"
  | "overseas_brand"
  | "overseas_service"
  | "overseas_ecommerce"
  | "product_insight"
  | "marketing_insight"
  | "ecommerce_reputation"
  | "closed_loop"
  | "system_setting";

export interface TabItem {
  key: MenuKey;
  label: string;
  closable: boolean;
}
