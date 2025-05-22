'use client';

import { useState, useEffect } from 'react';
import type { DataEntry, KnowledgeEntry } from '@/utils/fileUtils';
import SqlViewer from '@/components/SqlViewer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

export default function DataViewer() {
  const [selectedDb, setSelectedDb] = useState<string>('');
  const [databases, setDatabases] = useState<string[]>([]);
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

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      const response = await fetch('/api/databases');
      if (!response.ok) throw new Error('Failed to fetch databases');
      const data = await response.json();
      setDatabases(data);
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

    try {
      const [dataResponse, knowledgeResponse] = await Promise.all([
        fetch(`/api/data/${dbName}`),
        fetch(`/api/knowledge/${dbName}`)
      ]);

      if (!dataResponse.ok || !knowledgeResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [dataEntries, knowledgeEntries] = await Promise.all([
        dataResponse.json(),
        knowledgeResponse.json()
      ]);

      setData(dataEntries);
      setKnowledge(knowledgeEntries);
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
    <section className="my-12" style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
      <h2 className="text-2xl font-bold mb-6 text-center">LiveSQLBench Data Viewer</h2>
      
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2 text-center">Select Database:</label>
        <div className="relative flex justify-center">
          <select
            className="w-full max-w-xs p-3 pl-4 pr-10 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            value={selectedDb}
            onChange={(e) => handleDbSelect(e.target.value)}
          >
            <option value="">Select a database...</option>
            {databases.map((db) => (
              <option key={db} value={db}>
                {db}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      ) : (
        selectedDb && (
          <>
            {/* Selected Entry Details - Shown at the top when an entry is selected */}
            {selectedEntry && showDetails && (
            <div className="w-full py-8">               {/* just a normal block */}
              <div                                        /* the actual card */
                id="entry-details"
                className="
                  mx-auto                                /* <-- centers the card */
                  max-w-7xl                              /* optional max width */
                  p-6 mb-8
                "
              >
                <div className="flex flex-col items-center w-full mb-4">
                  <h3 className="text-xl font-semibold mb-2">Selected Entry Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Hide Details
                  </button>
                </div>

                {/* columns */}
                <div
                  className="
                    flex flex-wrap lg:flex-nowrap        /* stack on small screens */
                    justify-center gap-8
                    px-6 pb-6
                  "
                >
                    {/* Main Query Information */}
                    <div className="flex-shrink-0" style={{ width: '550px' }}>
                      <div className="space-y-4">
                        {renderCollapsibleSection(
                          'mainQuery',
                          'Main Query Information',
                          <div className="space-y-4">
                            <div className="p-3 border rounded bg-gray-50">
                              <h5 className="font-medium mb-2">Query</h5>
                              <p className="text-gray-700">{selectedEntry.query}</p>
                            </div>

                            {selectedEntry.sol_sql.length > 0 && (
                              <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-medium mb-2">Solution SQL</h5>
                                <SqlViewerWithCopy sql={selectedEntry.sol_sql.join('\n')} />
                              </div>
                            )}

                            {selectedEntry.preprocess_sql.length > 0 && (
                              <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-medium mb-2">Preprocess SQL</h5>
                                <SqlViewerWithCopy sql={selectedEntry.preprocess_sql.join('\n')} />
                              </div>
                            )}

                            {selectedEntry.clean_up_sqls.length > 0 && (
                              <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-medium mb-2">Clean Up SQL</h5>
                                <SqlViewerWithCopy sql={selectedEntry.clean_up_sqls.join('\n')} />
                              </div>
                            )}

                            {selectedEntry.external_knowledge.length > 0 && (
                              <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-medium mb-2">External Knowledge</h5>
                                <div className="space-y-2">
                                  {selectedEntry.external_knowledge.map((id) => {
                                    const knowledgeEntry = getKnowledgeById(id);
                                    return (
                                      <div key={id} className="p-2 border rounded bg-white">
                                        <div className="flex justify-between items-start">
                                          <p className="font-medium">{knowledgeEntry ? knowledgeEntry.knowledge : `Knowledge ID ${id}`}</p>
                                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ID: {id}</span>
                                        </div>
                                        {knowledgeEntry ? (
                                          <>
                                            <p className="text-sm text-gray-600 mt-1">{knowledgeEntry.description}</p>
                                            <p className="text-sm font-mono mt-1">{knowledgeEntry.definition}</p>
                                            <div className="mt-1 text-xs text-gray-500">
                                              <span className="mr-2">Type: {knowledgeEntry.type}</span>
                                              <span>Children Knowledge: {formatChildrenKnowledge(knowledgeEntry.children_knowledge)}</span>
                                            </div>
                                          </>
                                        ) : (
                                          <p className="text-gray-500">Knowledge ID {id} not found</p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {selectedEntry.test_cases && selectedEntry.test_cases.length > 0 && (
                              renderTestCases(selectedEntry.test_cases)
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ambiguity Information */}
                    <div className="flex-shrink-0" style={{ width: '550px' }}>
                      <div className="space-y-4">
                        {renderCollapsibleSection(
                          'ambiguity',
                          'Ambiguity Information',
                          <div className="space-y-4">
                            <div className="p-3 border rounded bg-gray-50">
                              <h5 className="font-medium mb-2">Ambiguous User Query</h5>
                              <p className="text-gray-700">{selectedEntry.amb_user_query}</p>
                              {selectedEntry.difficulty_tier && (
                                <div className="mt-2">
                                  <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                    Difficulty Tier: {selectedEntry.difficulty_tier}
                                  </span>
                                </div>
                              )}
                            </div>

                            {selectedEntry.user_query_ambiguity && (
                              <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-medium mb-2">User Query Ambiguity</h5>
                                
                                {selectedEntry.user_query_ambiguity.critical_ambiguity.length > 0 && (
                                  <div className="mb-4">
                                    <h6 className="font-medium text-red-600">Critical Ambiguity</h6>
                                    <div className="space-y-2 mt-2">
                                      {selectedEntry.user_query_ambiguity.critical_ambiguity.map((item, index) => (
                                        <div key={index} className="p-2 border rounded bg-white">
                                          <p><span className="font-medium">Term:</span> {item.term}</p>
                                          <div className="mt-1">
                                            <p className="font-medium text-sm">SQL Snippet:</p>
                                            {renderSqlSnippet(item.sql_snippet)}
                                          </div>
                                          <p className="mt-1"><span className="font-medium">Type:</span> {item.type}</p>
                                          <p className="mt-1"><span className="font-medium">Need Masking:</span> {item.is_mask ? "Yes" : "No"}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {selectedEntry.user_query_ambiguity.non_critical_ambiguity.length > 0 && (
                                  <div>
                                    <h6 className="font-medium text-yellow-600">Non-Critical Ambiguity</h6>
                                    <div className="space-y-2 mt-2">
                                      {selectedEntry.user_query_ambiguity.non_critical_ambiguity.map((item, index) => (
                                        <div key={index} className="p-2 border rounded bg-white">
                                          <p><span className="font-medium">Term:</span> {item.term}</p>
                                          <div className="mt-1">
                                            <p className="font-medium text-sm">SQL Snippet:</p>
                                            {renderSqlSnippet(item.sql_snippet)}
                                          </div>
                                          <p className="mt-1"><span className="font-medium">Type:</span> {item.type}</p>
                                          <p className="mt-1"><span className="font-medium">Need Masking:</span> {item.is_mask ? "Yes" : "No"}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {selectedEntry.knowledge_ambiguity.length > 0 && (
                              <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-medium mb-2">Knowledge Ambiguity</h5>
                                <div className="space-y-2">
                                  {selectedEntry.knowledge_ambiguity.map((item, index) => (
                                    <div key={index} className="p-2 border rounded bg-white">
                                      <p><span className="font-medium">Term:</span> {item.term}</p>
                                      <div className="mt-1">
                                        <p className="font-medium text-sm">SQL Snippet:</p>
                                        {renderSqlSnippet(item.sql_snippet)}
                                      </div>
                                      <p className="mt-1"><span className="font-medium">Type:</span> {item.type}</p>
                                      <p className="mt-1"><span className="font-medium">Need Masking:</span> {item.is_mask ? "Yes" : "No"}</p>
                                      <p><span className="font-medium">Deleted Knowledge:</span> {item.deleted_knowledge}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Follow-up Information */}
                    <div className="flex-shrink-0" style={{ width: '550px' }}>
                      <div className="space-y-4">
                        {selectedEntry.follow_up && (
                          renderCollapsibleSection(
                            'followUp',
                            'Follow-up Information',
                            <div className="space-y-4">
                              <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-medium mb-2">Follow-up Query</h5>
                                <p className="text-gray-700">{selectedEntry.follow_up.query}</p>
                                {selectedEntry.follow_up.difficulty_tier && (
                                  <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                      Follow-up Difficulty Tier: {selectedEntry.follow_up.difficulty_tier}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="p-3 border rounded bg-gray-50">
                                <h5 className="font-medium mb-2">Follow-up Solution SQL</h5>
                                <SqlViewerWithCopy sql={selectedEntry.follow_up.sol_sql} />
                              </div>
                              
                              {selectedEntry.follow_up.external_knowledge.length > 0 && (
                                <div className="p-3 border rounded bg-gray-50">
                                  <h5 className="font-medium mb-2">Follow-up External Knowledge</h5>
                                  <div className="space-y-2">
                                    {selectedEntry.follow_up.external_knowledge.map((id) => {
                                      const knowledgeEntry = getKnowledgeById(id);
                                      return (
                                        <div key={id} className="p-2 border rounded bg-white">
                                          <div className="flex justify-between items-start">
                                            <p className="font-medium">{knowledgeEntry ? knowledgeEntry.knowledge : `Knowledge ID ${id}`}</p>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ID: {id}</span>
                                          </div>
                                          {knowledgeEntry ? (
                                            <>
                                              <p className="text-sm text-gray-600 mt-1">{knowledgeEntry.description}</p>
                                              <p className="text-sm font-mono mt-1">{knowledgeEntry.definition}</p>
                                              <div className="mt-1 text-xs text-gray-500">
                                                <span className="mr-2">Type: {knowledgeEntry.type}</span>
                                                <span>Children Knowledge: {formatChildrenKnowledge(knowledgeEntry.children_knowledge)}</span>
                                              </div>
                                            </>
                                          ) : (
                                            <p className="text-gray-500">Knowledge ID {id} not found</p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {selectedEntry.follow_up.test_cases && selectedEntry.follow_up.test_cases.length > 0 && (
                                renderTestCases(selectedEntry.follow_up.test_cases, "Follow-up Test Cases")
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data and Knowledge Base Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Data Entries</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {data.map((entry) => (
                    <div
                      key={entry.instance_id}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedEntry?.instance_id === entry.instance_id ? 'bg-blue-50 border-blue-500' : ''
                      }`}
                      onClick={() => handleEntrySelect(entry)}
                    >
                      <h4 className="font-medium">Instance ID: {entry.instance_id}</h4>
                      <p className="text-sm text-gray-600 mt-1">{entry.query}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="mr-2">Category: {entry.category}</span>
                        <span>Knowledge IDs: {entry.external_knowledge.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Knowledge Base</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {knowledge.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{entry.knowledge}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ID: {entry.id}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                      <p className="text-sm font-mono mt-2">{entry.definition}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="mr-2">Type: {entry.type}</span>
                        <span>Children Knowledge: {formatChildrenKnowledge(entry.children_knowledge)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )
      )}
    </section>
  );
} 