import React from 'react';

const DiscussionSection = () => {
  const discussions = [
    {
      title: "Current Model Performance",
      content: "Initial results on LiveSQLBench-Lite reveal significant challenges for current LLMs, with the best-performing model (o3-mini) achieving only 42.59% success rate. The performance gap between models is notable, with top models (o3-mini, Qwen 3 235B, Gemini 2.0 Flash) showing similar capabilities around 35-43%, while others struggle to generate correct SQL queries. This performance pattern suggests that while recent models have made progress in SQL understanding, there's substantial room for improvement in handling complex, knowledge-grounded, real-world database scenarios."
    },
    {
      title: "Working in Progress",
      content: "The benchmark is currently in the working progress, and we are working on expanding the benchmark to 600+ samples and developing large versions of each database with 40+ tables and 800+ columns for the first batch of data. Last but not least, we will update the benchmark with new DBs and tasks periodically."
    }
  ];

  return (
    <section className="w-full mb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">
          Discussion
        </h2>
        
        <div className="h-0.5 w-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        
        <div className="space-y-6">
          {discussions.map((section, index) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm mr-2">
                  {index + 1}
                </span>
                {section.title}
              </h3>
              <p className="text-base leading-relaxed text-gray-700">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscussionSection;