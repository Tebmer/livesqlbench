import React from 'react';
import { ArrowDown } from 'lucide-react';

const Leaderboard = () => {
  const modelData = [
    { 
      name: 'o3-mini-2025-01-31',
      completionRate: 42.59,
      logo: '/openai-logomark.png',
      fullName: 'o3-mini'
    },
    { 
      name: 'qwen-qwen3-235b-a22b',
      completionRate: 35.93,
      logo: '/qwen_logo.png',
      fullName: 'Qwen 3 235B'
    },
    { 
      name: 'gemini-2-0-flash-001',
      completionRate: 35.56,
      logo: '/google-gemini-icon.png',
      fullName: 'Gemini 2.0 Flash'
    },
    { 
      name: 'gpt-4o-2024-11-20',
      completionRate: 34.81,
      logo: '/openai-logomark.png',
      fullName: 'GPT-4o'
    },
    { 
      name: 'claude-3-7-sonnet-20250219',
      completionRate: 32.96,
      logo: '/claude_logo.png',
      fullName: 'Claude 3.7 Sonnet'
    },
    { 
      name: 'deepsseek-deepseek-r1',
      completionRate: 0,
      logo: '/deepseek_logo.png',
      fullName: 'DeepSeek R1'
    },
    { 
      name: 'deepsseek-deepseek-chat',
      completionRate: 0,
      logo: '/deepseek_logo.png',
      fullName: 'DeepSeek Chat'
    }
  ].sort((a, b) => b.completionRate - a.completionRate);

  return (
    <section className="w-full mb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">LiveSQLBench Leaderboard</h2>
        
        <div className="h-0.5 w-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 md:flex md:flex-col md:justify-center">
            <p className="mb-6 text-base leading-relaxed text-gray-700">
              <span className="font-semibold">Success Rate.</span> Measures the success rate of LLMs in generating correct SQL queries.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Evaluation Methodology</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>SELECT queries: Compare execution results with golden SQL outputs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Management SQLs: Verify through comprehensive test cases</span>
                </li>

              </ul>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="text-xs text-gray-600 text-right mb-2">
              Last Updated: 05/15/2024
            </div>
            
            <div className="relative w-full overflow-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">
                      Model
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-gray-600">
                      Sucess Rate (%) <ArrowDown className="inline h-4 w-4 text-gray-400" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modelData.map((model, index) => (
                    <tr 
                      key={model.name}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index === 0 ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          {index === 0 && (
                            <span className="text-yellow-500">🏆</span>
                          )}
                          <img
                            src={model.logo}
                            alt={`${model.fullName} logo`}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="font-medium">{model.fullName}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right font-medium">
                        {model.completionRate > 0 ? `${model.completionRate.toFixed(2)}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Note:</span> Results are based on 270+ SQL tasks across 18 databases, including both SELECT queries and management operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;