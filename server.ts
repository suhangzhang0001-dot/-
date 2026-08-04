import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_DISTRIBUTIONS,
  INITIAL_WORD_CLOUDS,
  INITIAL_QUADRANTS,
  INITIAL_RAW_COMMENTS,
  calculateMetrics,
  getFilteredWordClouds,
  generateLocalReport
} from './src/data/mockInsightData.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Fetch Insight Data API
  app.post('/api/insight/query', (req, res) => {
    try {
      const { filter, comparison } = req.body || {};
      const currentFilter = filter || {
        timeRange: '30d',
        sources: ['电商评论', '小红书/抖音', '知乎/论坛'],
        category: '电视',
        brand: '海信',
        series: 'all',
        model: 'all',
        keywords: []
      };

      const metricsA = calculateMetrics(currentFilter, INITIAL_DISTRIBUTIONS);
      const wordCloudsA = getFilteredWordClouds(currentFilter);

      let metricsB = null;
      let wordCloudsB = null;

      if (comparison && comparison.enabled && comparison.filterB) {
        metricsB = calculateMetrics(comparison.filterB, INITIAL_DISTRIBUTIONS);
        wordCloudsB = getFilteredWordClouds(comparison.filterB);
      }

      res.json({
        success: true,
        metricsA,
        metricsB,
        wordCloudsA,
        wordCloudsB,
        distributions: INITIAL_DISTRIBUTIONS,
        quadrants: INITIAL_QUADRANTS,
        comments: INITIAL_RAW_COMMENTS
      });
    } catch (error: any) {
      console.error('Error in /api/insight/query:', error);
      res.status(500).json({ success: false, error: error?.message || 'Server error' });
    }
  });

  // AI Gap Analysis API powered by Gemini
  app.post('/api/ai/analyze-gap', async (req, res) => {
    const { filter, brandName, category } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to local intelligent report generator if key is absent
      const localReport = generateLocalReport(filter || {}, calculateMetrics(filter || {}), brandName || '海信');
      return res.json({ success: true, isAI: false, report: localReport });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `
你是一位顶级家电与消费电子营销诊断专家与用户声量分析师。
请对以下“用户声音洞察平台 - 营销卖点认知诊断”进行深入分析并生成策略报告。

分析上下文：
- 品类：${category || '电视/家电'}
- 目标品牌：${brandName || '海信'}
- 时间段：${filter?.timeRange || '近30天'}
- 核心对比对象/筛选：${JSON.stringify(filter || {})}

请输出规范 JSON 格式，严格包含以下结构（不要用 markdown 格式包裹，直接返回 JSON 或以 JSON 块形式）：
{
  "summary": "一句话诊断结论总结",
  "cognitiveAlignmentScore": 88 (0-100的认知契合度综合打分),
  "keyInsights": [
    {
      "title": "洞察标题",
      "description": "详细描述与数据证据",
      "type": "success" 或 "warning" 或 "opportunity"
    }
  ],
  "topConsensusPoints": ["高宣高知达成共识的爆款卖点1", "卖点2"],
  "topMisalignments": ["高宣低知宣传浪费卖点1", "低宣高知隐性声量亮点2"],
  "marketingRecommendations": [
    "针对宣传术语的调优建议1",
    "社交平台传播侧重建议2",
    "渠道与服务体验改善建议3"
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        parsed = generateLocalReport(filter || {}, calculateMetrics(filter || {}), brandName || '海信');
      }

      res.json({
        success: true,
        isAI: true,
        report: parsed
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const fallbackReport = generateLocalReport(filter || {}, calculateMetrics(filter || {}), brandName || '海信');
      res.json({
        success: true,
        isAI: false,
        error: error?.message,
        report: fallbackReport
      });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`User Voice Insight Platform server running on http://localhost:${PORT}`);
  });
}

startServer();
