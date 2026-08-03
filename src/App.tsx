import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { TabsHeader } from "./components/TabsHeader";
import { BrandPublicOpinionView } from "./components/BrandPublicOpinionView";
import { TopicManagementView } from "./components/TopicManagementView";
import { OverviewDashboard } from "./components/OverviewDashboard";
import { GenericView } from "./components/GenericView";
import { MenuKey, TabItem, SentimentTopic, PublicOpinionItem } from "./types";
import { initialTopics, initialBrandOpinions } from "./data/mockData";

export default function App() {
  const [activeKey, setActiveKey] = useState<MenuKey>("brand_opinion");

  const [tabs, setTabs] = useState<TabItem[]>([
    { key: "overview", label: "总体概览", closable: false },
    { key: "brand_opinion", label: "品牌舆情管理", closable: true },
  ]);

  const [topics, setTopics] = useState<SentimentTopic[]>(initialTopics);
  const [brandOpinions] = useState<PublicOpinionItem[]>(initialBrandOpinions);

  // Handle Menu Selection
  const handleSelectMenu = (key: MenuKey, label: string) => {
    setActiveKey(key);
    if (!tabs.some((t) => t.key === key)) {
      setTabs((prev) => [...prev, { key, label, closable: key !== "overview" }]);
    }
  };

  // Handle Tab Close
  const handleCloseTab = (key: MenuKey, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTabs = tabs.filter((t) => t.key !== key);
    setTabs(updatedTabs);

    if (activeKey === key) {
      const lastTab = updatedTabs[updatedTabs.length - 1];
      if (lastTab) {
        setActiveKey(lastTab.key);
      }
    }
  };

  // Topic Handlers
  const handleAddTopic = (newTopic: SentimentTopic) => {
    setTopics((prev) => [newTopic, ...prev]);
  };

  const handleUpdateTopic = (updatedTopic: SentimentTopic) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === updatedTopic.id ? updatedTopic : t))
    );
  };

  const handleDeleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div id="voc-app-root" className="min-h-screen h-screen flex flex-col bg-gray-100 font-sans antialiased text-gray-900 overflow-hidden">
      {/* VOC Top Header */}
      <Header userName="张素航" />

      {/* Main Container */}
      <div id="voc-main-container" className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activeKey={activeKey} onSelectMenu={handleSelectMenu} />

        {/* Right Content Area */}
        <main id="voc-content-area" className="flex-1 flex flex-col min-w-0 bg-gray-100/70 overflow-hidden">
          {/* Top Active Tabs */}
          <TabsHeader
            tabs={tabs}
            activeKey={activeKey}
            onSelectTab={(key) => setActiveKey(key)}
            onCloseTab={handleCloseTab}
          />

          {/* Dynamic Content View */}
          <div id="voc-view-viewport" className="flex-1 overflow-y-auto custom-scrollbar">
            {activeKey === "overview" && (
              <OverviewDashboard
                topics={topics}
                onNavigateToTopics={() => handleSelectMenu("topic_opinion", "舆情专题管理")}
              />
            )}

            {activeKey === "brand_opinion" && (
              <BrandPublicOpinionView opinions={brandOpinions.filter(o => !o.category || o.category === "brand")} />
            )}

            {activeKey === "topic_opinion" && (
              <TopicManagementView
                topics={topics}
                onAddTopic={handleAddTopic}
                onUpdateTopic={handleUpdateTopic}
                onDeleteTopic={handleDeleteTopic}
                availableOpinions={brandOpinions}
              />
            )}

            {activeKey === "ecommerce_opinion" && (
              <BrandPublicOpinionView opinions={brandOpinions.filter(o => o.category === "ecommerce")} />
            )}

            {activeKey === "service_opinion" && (
              <BrandPublicOpinionView opinions={brandOpinions.filter(o => o.category === "service")} />
            )}

            {activeKey === "comments_opinion" && (
              <GenericView title="评论区舆情管理" />
            )}

            {activeKey === "overseas_brand" && (
              <GenericView title="海外品牌舆情管理" />
            )}

            {activeKey === "overseas_service" && (
              <GenericView title="海外服务舆情管理" />
            )}

            {activeKey === "overseas_ecommerce" && (
              <GenericView title="海外电商舆情管理" />
            )}

            {activeKey === "product_insight" && (
              <GenericView title="产品洞察分析" />
            )}

            {activeKey === "marketing_insight" && (
              <GenericView title="营销洞察分析" />
            )}

            {activeKey === "ecommerce_reputation" && (
              <GenericView title="电商口碑分析" />
            )}

            {activeKey === "closed_loop" && (
              <GenericView title="闭环工单管理" />
            )}

            {activeKey === "system_setting" && (
              <GenericView title="系统设置与权限" />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
