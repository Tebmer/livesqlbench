import Image from 'next/image';

const Introduction = () => {
    return (
        <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">Introduction</h2>
        <div className="mx-auto mb-6 h-0.5 w-16 bg-gradient-to-r from-gray-300 to-gray-100"></div>
        <p className="text-gray-700 font-medium">
          Benchmarks are important tools for tracking the rapid advancements in large language model (LLM) capabilities. However, benchmarks are not keeping pace in difficulty: LLMs now achieve over 90% accuracy on popular benchmarks like MMLU, limiting informed measurement of state-of-the-art LLM capabilities. In response, we introduce Humanity's Last Exam, a multi-modal benchmark at the frontier of human knowledge, designed to be the final closed-ended academic benchmark of its kind with broad subject coverage. The dataset consists of 2,700 challenging questions across over a hundred subjects. We publicly release these questions, while maintaining a private test set of held out questions to assess model overfitting.
        </p>
        <div className="w-full my-6"> {/* Set width to full for responsiveness */}
          <div className="flex justify-start">
            <Image 
              src="/figure1.png" 
              alt="Figure 1" 
              width={800} 
              height={533} 
              className="max-w-full h-auto"  // Responsive styling
            />
          </div>
          <p className="mt-4 text-sm text-left text-gray-700 max-w-2xl">
            Compared against the saturation of some existing benchmarks, Humanity's Last Exam accuracy remains low across several frontier models, demonstrating its effectiveness for measuring advanced, closed-ended, academic capabilities.
          </p>
        </div>
      </div>
    );
}

export default Introduction;