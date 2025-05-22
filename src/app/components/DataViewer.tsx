'use client';

import { useState, useEffect } from 'react';
import type { DataEntry, KnowledgeEntry } from '@/utils/fileUtils';
import SqlViewer from '@/components/SqlViewer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import SchemaViewer from './SchemaViewer';

export default function DataViewer() {
  const [selectedDb, setSelectedDb] = useState<string>('');
  const [databases, setDatabases] = useState<string[]>([]);
  const [largeDatabases, setLargeDatabases] = useState<string[]>([]);
  const [data, setData] = useState<DataEntry[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DataEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    mainQuery: true,
    ambiguity: true,
    followUp: true
  });
  const [schemaDot, setSchemaDot] = useState<string | null>(null);
  const [showSchema, setShowSchema] = useState(false);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      const response = await fetch('/api/databases');
      if (!response.ok) throw new Error('Failed to fetch databases');
      const data = await response.json();
      // Separate base and large databases
      const baseDatabases = data.filter((db: string) => !db.endsWith('_large'));
      const largeDatabases = data.filter((db: string) => db.endsWith('_large'));
      setDatabases(baseDatabases);
      // Store large databases separately
      setLargeDatabases(largeDatabases);
    } catch (err) {
      setError('Failed to load databases');
      console.error(err);
    }
  };

  const handleDbSelect = async (dbName: string) => {
    setSelectedDb(dbName);
    setLoading(true);
    setError(null);
    setSelectedEntry(null);
    setShowDetails(false);
    setSchemaDot(null);
    setShowSchema(false);

    try {
      const [dataResponse, knowledgeResponse, schemaResponse] = await Promise.all([
        fetch(`/api/data/${dbName}`),
        fetch(`/api/knowledge/${dbName}`),
        fetch(`/api/schema/${dbName}`)
      ]);

      if (!dataResponse.ok || !knowledgeResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [dataEntries, knowledgeEntries, schemaData] = await Promise.all([
        dataResponse.json(),
        knowledgeResponse.json(),
        schemaResponse.ok ? schemaResponse.json() : { dotContent: null }
      ]);

      setData(dataEntries);
      setKnowledge(knowledgeEntries);
      if (schemaData.dotContent) {
        setSchemaDot(schemaData.dotContent);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEntrySelect = (entry: DataEntry) => {
    setSelectedEntry(entry);
    setShowDetails(true);
    // Reset expanded sections when selecting a new entry
    setExpandedSections({
      mainQuery: true,
      ambiguity: true,
      followUp: true
    });
    // Scroll to the details section
    setTimeout(() => {
      document.getElementById('entry-details')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Helper function to get knowledge entry by ID
  const getKnowledgeById = (id: number) => {
    return knowledge.find(k => k.id === id);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Add copy button component
  const CopyButton = ({ content }: { content: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    return (
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-300" />
        )}
      </button>
    );
  };

  // Modify renderSqlSnippet to include copy button
  const renderSqlSnippet = (sql: string) => {
    return (
      <div className="relative rounded-lg overflow-hidden">
        <CopyButton content={sql} />
        <SyntaxHighlighter
          language="sql"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          {sql}
        </SyntaxHighlighter>
      </div>
    );
  };

  // Modify renderPythonCode to include copy button
  const renderPythonCode = (code: string) => {
    return (
      <div className="relative rounded-lg overflow-hidden">
        <CopyButton content={code} />
        <SyntaxHighlighter
          language="python"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  // Modify SqlViewer usage to include copy button
  const SqlViewerWithCopy = ({ sql }: { sql: string }) => {
    return (
      <div className="relative">
        <CopyButton content={sql} />
        <SqlViewer sql={sql} />
      </div>
    );
  };

  // Format children knowledge IDs for display
  const formatChildrenKnowledge = (childrenKnowledge: number) => {
    if (childrenKnowledge === -1) return "None";
    return childrenKnowledge.toString();
  };

  // Render a collapsible section
  const renderCollapsibleSection = (
    id: string, 
    title: string, 
    content: React.ReactNode,
    defaultExpanded: boolean = true
  ) => {
    const isExpanded = expandedSections[id] ?? defaultExpanded;
    
    return (
      <div className="border rounded-lg bg-white overflow-hidden">
        <button
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => toggleSection(id)}
        >
          <h4 className="font-medium">{title}</h4>
          <svg 
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isExpanded && (
          <div className="p-4">
            {content}
          </div>
        )}
      </div>
    );
  };

  // Render test cases
  const renderTestCases = (testCases: any[], title: string = "Test Cases") => {
    if (!testCases || testCases.length === 0) return null;
    
    return (
      <div className="p-3 border rounded bg-gray-50">
        <h5 className="font-medium mb-2">{title}</h5>
        <div className="space-y-2">
          {testCases.map((testCase, index) => (
            <div key={index} className="p-2 border rounded bg-white">
              <h6 className="font-medium text-green-800 mb-1">Test Case {index + 1}</h6>
              {typeof testCase === 'string' && testCase.includes('def test_case') ? (
                renderPythonCode(testCase)
              ) : (
                <pre className="text-sm overflow-x-auto p-2 bg-gray-100 rounded">
                  {JSON.stringify(testCase, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">LiveSQLBench Data</h2>
          <div className="text-gray-600 max-w-3xl mx-auto space-y-2">
            <p>Explore <strong className="text-purple-600">LiveSQLBench-Lite</strong> sampled data, our initial release featuring 270 SQL tasks across 18 diverse databases. Each task features unambiguous user queries grounded in external knowledge, with medium to hard complexity SQL statements.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="font-semibold text-blue-700">180</div>
                <div className="text-gray-600">SELECT Queries</div>
                <div className="text-xs text-blue-600 mt-1">(Base Version)</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="font-semibold text-purple-700">90</div>
                <div className="text-gray-600">Management SQLs</div>
                <div className="text-xs text-purple-600 mt-1">(Base Version)</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="font-semibold text-green-700">360</div>
                <div className="text-gray-600">Avg SQL Tokens</div>
                <div className="text-xs text-green-600 mt-1">Current Avg</div>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <div className="font-semibold text-indigo-700">18</div>
                <div className="text-gray-600">Databases</div>
                <div className="text-xs text-indigo-600 mt-1">(Base Version)</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-700">
                <strong>Large Version Preview:</strong> We are currently developing large versions of each database, featuring 40+ tables and 800+ columns. Demo versions of <code className="px-1 py-0.5 bg-indigo-100 rounded">alien_large</code> and <code className="px-1 py-0.5 bg-indigo-100 rounded">archeology_large</code> are available for preview with very complex ER diagrams.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-8 max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Select Database</label>
          <div className="relative">
            <select
              className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-200 hover:border-blue-400"
              value={selectedDb}
              onChange={(e) => handleDbSelect(e.target.value)}
            >
              <option value="">Select a database...</option>
              <optgroup label="Base Versions">
                {databases.map((db) => (
                  <option key={db} value={db}>
                    {db}
                  </option>
                ))}
              </optgroup>
              {largeDatabases.length > 0 && (
                <optgroup label="Large Versions (Preview)">
                  {largeDatabases.map((db) => (
                    <option key={db} value={db}>
                      {db}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto p-4 mb-6 text-red-700 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
          </div>
        ) : (
          selectedDb && (
            <>
              {/* Add Schema Viewer Toggle Button */}
              {schemaDot && (
                <div className="max-w-4xl mx-auto mb-6">
                  <button
                    onClick={() => setShowSchema(!showSchema)}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                      </svg>
                      <span className="font-medium text-gray-900">Database Schema</span>
                    </div>
                    <svg 
                      className={`w-5 h-5 transform transition-transform ${showSchema ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              )}

              {/* Schema Viewer */}
              {showSchema && schemaDot && (
                <div className="max-w-4xl mx-auto mb-8">
                  <SchemaViewer dbName={selectedDb} dotContent={schemaDot} />
                </div>
              )}

              {selectedEntry && showDetails && (
                <div className="w-full py-6">
                  <div
                    id="entry-details"
                    className="mx-auto max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-white">Selected Entry Details</h3>
                        <button
                          onClick={() => setShowDetails(false)}
                          className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                        >
                          Hide Details
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-6">
                        {renderCollapsibleSection(
                          'mainQuery',
                          'Main Query Information',
                          <div className="space-y-6">
                            <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm">
                              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                                Query
                              </h5>
                              <p className="text-gray-700 leading-relaxed">{selectedEntry.query}</p>
                            </div>

                            {selectedEntry.sol_sql.length > 0 && (
                              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  Solution SQL
                                </h5>
                                <SqlViewerWithCopy sql={selectedEntry.sol_sql.join('\n')} />
                              </div>
                            )}

                            {selectedEntry.preprocess_sql.length > 0 && (
                              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                  </svg>
                                  Preprocess SQL
                                </h5>
                                <SqlViewerWithCopy sql={selectedEntry.preprocess_sql.join('\n')} />
                              </div>
                            )}

                            {selectedEntry.clean_up_sqls.length > 0 && (
                              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                  </svg>
                                  Clean Up SQL
                                </h5>
                                <SqlViewerWithCopy sql={selectedEntry.clean_up_sqls.join('\n')} />
                              </div>
                            )}

                            {selectedEntry.external_knowledge.length > 0 && (
                              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                  </svg>
                                  Required External Knowledge
                                </h5>
                                <div className="space-y-3">
                                  {selectedEntry.external_knowledge.map((id) => {
                                    const knowledgeEntry = getKnowledgeById(id);
                                    return (
                                      <div key={id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-start mb-2">
                                          <p className="font-medium text-gray-900">{knowledgeEntry ? knowledgeEntry.knowledge : `Knowledge ID ${id}`}</p>
                                          <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium">ID: {id}</span>
                                        </div>
                                        {knowledgeEntry ? (
                                          <>
                                            <p className="text-sm text-gray-600 mb-2">{knowledgeEntry.description}</p>
                                            <p className="text-sm font-mono bg-gray-50 p-2 rounded border border-gray-100 mb-2">{knowledgeEntry.definition}</p>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Type: {knowledgeEntry.type}</span>
                                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Children: {formatChildrenKnowledge(knowledgeEntry.children_knowledge)}</span>
                                            </div>
                                          </>
                                        ) : (
                                          <p className="text-gray-500 italic">Knowledge ID {id} not found</p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {selectedEntry.test_cases && selectedEntry.test_cases.length > 0 && (
                              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                  </svg>
                                  Test Cases
                                </h5>
                                {renderTestCases(selectedEntry.test_cases)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h3 className="text-xl font-semibold text-white">Data Entries</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {data.map((entry) => (
                        <div
                          key={entry.instance_id}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                            selectedEntry?.instance_id === entry.instance_id 
                              ? 'bg-blue-50 border-blue-200 shadow-sm' 
                              : 'bg-white border-gray-100 hover:border-blue-200'
                          }`}
                          onClick={() => handleEntrySelect(entry)}
                        >
                          <h4 className="font-medium text-gray-900">Instance ID: {entry.instance_id}</h4>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{entry.query}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Category: {entry.category}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Knowledge IDs: {entry.external_knowledge.join(', ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                    <h3 className="text-xl font-semibold text-white">Knowledge Base</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {knowledge.map((entry) => (
                        <div key={entry.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{entry.knowledge}</h4>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-medium">ID: {entry.id}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                          <p className="text-sm font-mono bg-gray-50 p-2 rounded border border-gray-100 mb-2">{entry.definition}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Type: {entry.type}</span>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Children: {formatChildrenKnowledge(entry.children_knowledge)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </section>
  );
} 