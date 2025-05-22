import React from 'react';

const DiscussionSection = () => {
  const discussions = [
    {
      title: "Future Model Performance",
      content: "While current LLMs achieve very low accuracy on Humanity's Last Exam, recent history shows benchmarks are quickly saturated -- with models dramatically progressing from near-zero to near-perfect performance in a short timeframe. Given the rapid pace of AI development, it is plausible that models could exceed 50% accuracy on HLE by the end of 2025. High accuracy on HLE would demonstrate expert-level performance on closed-ended, verifiable questions and cutting-edge scientific knowledge, but it would not alone suggest autonomous research capabilities or \"artificial general intelligence.\" HLE tests structured academic problems rather than open-ended research or creative problem-solving abilities, making it a focused measure of technical knowledge and reasoning. HLE may be the last academic exam we need to give to models, but it is far from the last benchmark for AI."
    },
    {
      title: "Impact",
      content: "By providing a clear measure of AI progress, Humanity's Last Exam creates a common reference point for scientists and policymakers to assess AI capabilities. This enables more informed discussions about development trajectories, potential risks, and necessary governance measures."
    }
  ];

  return (
    <section className="w-full mb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">
          Discussion
        </h2>
        
        <div className="h-0.5 w-16 mx-auto mb-6 bg-gradient-to-r from-gray-300 to-gray-100" />
        
        <div className="space-y-6">
          {discussions.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
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