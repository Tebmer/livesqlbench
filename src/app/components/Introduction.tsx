import Image from 'next/image';

const Introduction = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-6 bg-white rounded-lg shadow-sm">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Introduction</h2>
                <div className="mx-auto h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>

            <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl shadow-sm">
                    <p className="text-base text-gray-700 leading-relaxed mb-4">
                        <strong className="text-blue-600">LiveSQLBench</strong> is a contamination-free, continuously evolving benchmark designed to evaluate LLMs on complex, real-world SQL tasks. The current version, <strong className="text-purple-600">LiveSQLBench-Lite</strong>, features 18 databases with 270 samples, serving as our initial release. We are actively expanding the benchmark to include more databases and 600+ samples in the upcoming version.
                    </p>

                    <ul className="space-y-2">
                        {[
                            {
                                title: "Live Databases",
                                desc: "Constructed dynamically from extensive and regularly updated CSV datasets."
                            },
                            {
                                title: "Live User Queries and SQL",
                                desc: "Each task pairs unambiguous user queries with annotated, gold-standard SQL statements."
                            },
                            {
                                title: "Contextual Reasoning",
                                desc: "Every database scenario includes an external knowledge document for grounding beyond the schema. Knowledge has dependencies, requiring the LLM's multi-hop reasoning ability."
                            },
                            {
                                title: "Full SQL Spectrum",
                                desc: "Supports not just SELECT queries, but also UPDATE, CREATE, and other database management operations."
                            },
                            {
                                title: "Automated Evaluation",
                                desc: "Each question includes verifiable test cases for accurate, reproducible scoring."
                            },
                            {
                                title: "Truly Live",
                                desc: "New databases and tasks are added over time to ensure fresh, realistic evaluation conditions."
                            }
                        ].map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                                    {index + 1}
                                </span>
                                <div>
                                    <strong className="text-gray-900 text-sm block mb-0.5">{item.title}:</strong>
                                    <span className="text-gray-700 text-sm">{item.desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-base text-gray-700 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
                    LiveSQLBench offers a robust, real-world setting to drive progress in LLMs' ability to understand, interact with, and manage dynamic database environments. Starting with LiveSQLBench-Lite, we are committed to continuously expanding our benchmark to provide an even more comprehensive evaluation platform.
                </p>
            </div>
        </div>
    );
}

export default Introduction;