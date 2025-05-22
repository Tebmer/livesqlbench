import React, { useState } from 'react';
import { Mail, MessageSquare, Copy } from 'lucide-react';

const Citation = () => {
  const [copied, setCopied] = useState(false);

  const bibtexContent = `@misc{phan2025humanitysexam,
    title = {Humanity's Last Exam},
    author = {Long Phan and Alice Gatti and Ziwen Han},
    year = {2025},
    eprint = {2501.14249},
    archivePrefix = {arXiv},
    primaryClass = {cs.LG},
    url = {https://arxiv.org/abs/2501.14249}
  }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bibtexContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-12 w-full">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Citation
        </h2>
        
        <div className="mx-auto mb-6 h-0.5 w-16 bg-gradient-to-r from-gray-300 to-gray-100" />
        
        <div className="relative">
          <div className="rounded-lg bg-gray-50 p-4">
            <pre className="max-h-[200px] overflow-y-scroll whitespace-pre-wrap text-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {bibtexContent}
            </pre>
            <button 
              className="absolute right-2 top-2 rounded-md bg-gray-200 p-2 hover:bg-gray-300" 
              title="Copy to clipboard"
              onClick={handleCopy}
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <div className="flex flex-col items-start text-sm sm:text-base text-gray-700 sm:flex-row sm:items-center">
            <Mail className="mr-2 h-6 w-6 sm:h-4 sm:w-4" />
            <span>
              For any inquiries or feedback, please contact us at{' '}
              <a href="mailto:agibenchmark@safe.ai" className="text-blue-600 hover:underline">
                agibenchmark@safe.ai
              </a>
            </span>
          </div>

          <div className="flex flex-col items-start text-sm sm:text-base text-gray-700 sm:flex-row sm:items-center">
            <MessageSquare className="mr-2 h-6 w-6 sm:h-4 sm:w-4" />
            <span>
              Submit feedback to questions in the dataset via{' '}
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdP4wbF8kWokZ6-Xg8b6yxAPNlLC61v_z0u4hafIa_v4ft5Yg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                this form
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Citation;
