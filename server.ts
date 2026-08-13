import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper for Gemini AI client initialization
  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Topic Auto-Generation endpoint
  app.post("/api/ai/generate-topic", async (req, res) => {
    try {
      const { description, targetBrand, industry } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured
        const sampleTopic = {
          title: description ? `${description.slice(0, 16)}...舆情专题` : "2026 Q3产品发热与售后服务舆情监测专题",
          summary: `针对近期【${targetBrand || "品牌旗舰"}】在社交媒体与投诉平台关于产品异常及客服响应速度的舆情态势，建立专项全网实时监测与风险预警。`,
          riskLevel: "P1 - 高危",
          keywords: ["发热烫手", "客服拖延", "退款难", "品质缺陷", "卡顿", "黑屏"],
          excludeKeywords: ["官方抽奖", "好评通稿", "无损正常"],
          mediaChannels: ["微博", "小红书", "黑猫投诉", "抖音", "知乎"],
          monitorScope: `${targetBrand || "全线重点"} - 售后与质量监控组`,
          riskAlertThreshold: "小时负面声量 > 150条 或 P1级别投诉 > 5条",
          dimensions: [
            { name: "产品质量反响", description: "监控发热、异常死机、续航等硬件退化反馈" },
            { name: "客服服务态度", description: "评估用户对人工客服与工单处理时效的满意度" },
            { name: "公关与媒体扩散", description: "追踪KOL/KOC及新闻媒体的二次转发与舆情放大" },
            { name: "竞品对标声量", description: "对比同价位竞品在同类故障上的声量差异" }
          ],
          initialSentimentBreakdown: { positive: 12, neutral: 28, negative: 60 },
          predictedTrend: "未来48小时内若未发布有效回应声明，负面声量预计上涨35%-50%，小红书与黑猫投诉平台扩散风险最高。",
          actionSuggestions: [
            "启动P1级舆情应急响应小组，联合技术部复现故障样本",
            "统一客服话术，开辟售后快速退换或检修通道",
            "密切监控微博热搜与知乎相关讨论提问，准备官方答复声明"
          ]
        };
        return res.json({ success: true, topic: sampleTopic, isFallback: true });
      }

      const prompt = `你是一位顶尖的品牌舆情专家和VOC(用户声音)洞察分析师。
请根据用户提供的背景信息/监控需求，自动生成一份结构化的【舆情专题配置与分析方案】。

用户输入背景/需求: ${description || "近期品牌产品售后服务争议与质量风险监测"}
目标品牌/业务线: ${targetBrand || "主品牌"}
行业类型: ${industry || "消费电子/电商"}

请返回严格的JSON对象，包含以下字段：
1. title (专题名称, 简明扼要，如: "725产品发热与售后争议舆情专题")
2. summary (专题概要与背景说明，100字左右)
3. riskLevel ("P0 - 紧急" 或 "P1 - 高危" 或 "P2 - 中危" 或 "P3 - 低危")
4. keywords (字符串数组，5-8个核心正向/负向监测关键词)
5. excludeKeywords (字符串数组，3-5个需排除的噪音干扰词)
6. mediaChannels (字符串数组，如["微博", "小红书", "黑猫投诉", "抖音", "知乎", "贴吧"])
7. monitorScope (监控责任部门/业务范围)
8. riskAlertThreshold (预警触发条件说明)
9. dimensions (数组，3-4个维度，每个对象包含 name 和 description)
10. initialSentimentBreakdown (对象包含 positive: 数字, neutral: 数字, negative: 数字，总和100)
11. predictedTrend (未来24-72小时舆情走势AI预测)
12. actionSuggestions (字符串数组，3条具体的处置与公关应对建议)
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              excludeKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              mediaChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
              monitorScope: { type: Type.STRING },
              riskAlertThreshold: { type: Type.STRING },
              dimensions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                }
              },
              initialSentimentBreakdown: {
                type: Type.OBJECT,
                properties: {
                  positive: { type: Type.NUMBER },
                  neutral: { type: Type.NUMBER },
                  negative: { type: Type.NUMBER }
                },
                required: ["positive", "neutral", "negative"]
              },
              predictedTrend: { type: Type.STRING },
              actionSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              "title", "summary", "riskLevel", "keywords", "excludeKeywords",
              "mediaChannels", "monitorScope", "riskAlertThreshold", "dimensions",
              "initialSentimentBreakdown", "predictedTrend", "actionSuggestions"
            ]
          }
        }
      });

      const generatedText = response.text;
      if (!generatedText) {
        throw new Error("Gemini returned empty response.");
      }

      const parsedTopic = JSON.parse(generatedText.trim());
      return res.json({ success: true, topic: parsedTopic, isFallback: false });
    } catch (err: any) {
      console.error("Error generating topic with Gemini:", err);
      res.status(500).json({
        success: false,
        error: err.message || "AI专题生成失败",
      });
    }
  });

  // AI Deep Analysis endpoint for an existing sentiment topic
  app.post("/api/ai/analyze-topic", async (req, res) => {
    try {
      const { topicTitle, topicSummary, keywords } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          analysis: {
            riskStatus: "需重点关注",
            keyOpinionLeaders: ["@数码科技吐槽菌 (粉丝120万)", "@消费维权第一线 (粉丝85万)"],
            emotionDistribution: "负面情绪占比 58%（集中在客服回复僵硬与退款账期长），中立占比 32%，正面占比 10%",
            hotPosts: [
              { title: "新机使用第三天严重发热退货遭拒", source: "黑猫投诉", reads: "4.8万", sentiment: "负面" },
              { title: "官方回复售后策略调整说明", source: "微博", reads: "12.3万", sentiment: "中立" },
              { title: "同价位三款旗舰实测对比", source: "B站", reads: "25.1万", sentiment: "正面" }
            ],
            strategyRecommendation: "建议1小时内发布客诉回应公告，提供无条件复检通道，阻断小红书二次种草负面扩散。"
          },
          isFallback: true
        });
      }

      const prompt = `请对以下舆情专题进行深度的实时风险洞察与策略分析：
专题名称: ${topicTitle}
专题描述: ${topicSummary}
监测关键词: ${Array.isArray(keywords) ? keywords.join(", ") : keywords}

请返回JSON格式：
1. riskStatus (风险状态评估，如: "风险升级中", "平稳受控", "爆发期")
2. keyOpinionLeaders (字符串数组，关键KOL/账号扩散源)
3. emotionDistribution (情绪构成详细描述)
4. hotPosts (数组，3个高曝光帖子/新闻，包含 title, source, reads, sentiment)
5. strategyRecommendation (危机公关与引导策略建议)
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskStatus: { type: Type.STRING },
              keyOpinionLeaders: { type: Type.ARRAY, items: { type: Type.STRING } },
              emotionDistribution: { type: Type.STRING },
              hotPosts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    source: { type: Type.STRING },
                    reads: { type: Type.STRING },
                    sentiment: { type: Type.STRING }
                  },
                  required: ["title", "source", "reads", "sentiment"]
                }
              },
              strategyRecommendation: { type: Type.STRING }
            },
            required: ["riskStatus", "keyOpinionLeaders", "emotionDistribution", "hotPosts", "strategyRecommendation"]
          }
        }
      });

      const analysisData = JSON.parse(response.text.trim());
      return res.json({ success: true, analysis: analysisData, isFallback: false });
    } catch (err: any) {
      console.error("Error analyzing topic with Gemini:", err);
      res.status(500).json({ success: false, error: err.message || "AI分析失败" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VOC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
