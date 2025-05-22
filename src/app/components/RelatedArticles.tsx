import React from 'react';

const RelatedArticles = () => {
  const articles = [
    {
      source: "The New York Times",
      domain: "www.nytimes.com",
      title: "When A.I. Passes This Test, Look Out",
      description: "The creators of a new test called 'Humanity's Last Exam' argue we may soon lose the ability to create tests hard enough for A.I. models.",
      url: "https://www.nytimes.com/2025/01/23/technology/ai-test-humanitys-last-exam.html"
    },
    {
      source: "Reuters",
      domain: "www.reuters.com",
      title: "AI experts ready 'Humanity's Last Exam' to stump powerful tech",
      description: "A team of technology experts issued a global call on Monday seeking the toughest questions to pose to artificial intelligence systems, which increasingly have handled popular benchmark tests like child's play.",
      url: "https://www.reuters.com/technology/artificial-intelligence/ai-experts-ready-humanitys-last-exam-stump-powerful-tech-2024-09-16/"
    }
  ];

  return (
    <section className="w-full mb-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-3">
          Related Articles
        </h2>
        
        <div className="h-0.5 w-16 mx-auto mb-4 bg-gradient-to-r from-gray-300 to-gray-100" />
        
        <div className="space-y-2">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors"
            >
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-gray-50">
                <div className="flex flex-col space-y-1.5 p-6 py-2 px-3">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${article.domain}&sz=16`}
                        alt={`${article.source} icon`}
                        className="w-4 h-4 mr-1"
                      />
                      <p className="text-xs text-gray-500">{article.source}</p>
                    </div>
                    <span className="text-gray-300 mx-1">|</span>
                    <h3 className="font-semibold tracking-tight text-sm">
                      {article.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {article.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;