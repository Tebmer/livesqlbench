import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const QuantitativeResults = () => {
  const modelData = [
    { name: 'GPT-4o', accuracy: 3.1, calibration: 92.3, logo: '/openai-logomark.png' },
    { name: 'Grok-2', accuracy: 3.9, calibration: 90.8, logo: '/xai_logo.png' },
    { name: 'Claude 3.5 Sonnet', accuracy: 4.8, calibration: 88.5, logo: '/claude_logo.png' },
    { name: 'Gemini Thinking', accuracy: 7.2, calibration: 90.6, logo: '/google-gemini-icon.png' },
    { name: 'o1', accuracy: 8.8, calibration: 92.8, logo: '/openai-logomark.png' },
    { name: 'DeepSeek-R1*', accuracy: 8.6, calibration: 81.4, logo: '/deepseek_logo.png' },
    { name: 'o3-mini (medium)*', accuracy: 11.1, calibration: 91.5, logo: '/openai-logomark.png' },
    { name: 'o3-mini (high)*', accuracy: 14.0, calibration: 92.8, logo: '/openai-logomark.png' }
  ];

  return (
    <section className="w-full mb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Quantitative Results</h2>
        
        <div className="h-0.5 w-16 mx-auto mb-6 bg-gradient-to-r from-gray-300 to-gray-100" />
        
        <div className="flex flex-col md:flex-row gap-8 sm:-mx-[20%]">
          <div className="md:w-1/2 md:flex md:flex-col md:justify-center">
            <p className="mb-6 text-base leading-relaxed text-gray-700">
              <span className="font-semibold">Accuracy.</span> All frontier models 
              achieve low accuracy on Humanity's Last Exam, highlighting significant 
              room for improvement in narrowing the gap between current LLMs and 
              expert-level academic capabilities on closed-ended questions.
            </p>
            <p className="text-base leading-relaxed text-gray-700">
              <span className="font-semibold">Calibration Error.</span> Given low 
              performance on Humanity's Last Exam, models should be calibrated, 
              recognizing their uncertainty rather than confidently provide incorrect 
              answers, indicative of confabulation/hallucination. To measure 
              calibration, we prompt models to provide both an answer and their 
              confidence from 0% to 100%.
            </p>
          </div>
          
          <div className="md:w-1/2">
            <div className="text-xs text-gray-600 text-right mb-2">
              Judge Model: o3-mini-2025-01-31 | Last Updated: 02/11/2025
            </div>
            
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 border-r">
                      Model
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-gray-600 border-r">
                      Accuracy (%) <ArrowUp className="inline h-4 w-4" />
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-gray-600">
                      Calibration Error (%) <ArrowDown className="inline h-4 w-4" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modelData.map((model, index) => (
                    <tr 
                      key={model.name}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 align-middle border-r flex items-center gap-2">
                        <img
                          src={model.logo}
                          alt={`${model.name} logo`}
                          className="w-4 h-4 object-contain"
                        />
                        {model.name}
                      </td>
                      <td className="p-4 align-middle text-right border-r">
                        {model.accuracy}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {model.calibration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="mt-2 text-xs text-gray-600">
              *Model is not multi-modal, evaluated on text-only subset.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuantitativeResults;