import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Try: React.FC = () => 
{
	const [url, setUrl] = useState("");
	const [shouldCategorize, setShouldCategorize] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isFetching, setIsFetching] = useState(false);

	const handleScrape = async () => 
	{
		setIsFetching(true);
        
		try 
		{
			let apiUrl = `https://kl0-6.com/api/datasift/datasift-p2p-incomingAPI?url_to_scrape=${encodeURIComponent(url)}&token=DataSift_7f9b56b70bcf5cab44adc57f52042b6fac4df5d38a4880174cb1dbb79c4f0617`;
			
			if (shouldCategorize) 
			{
				apiUrl += `&shouldCategorize=true`;
			}

			const response = await fetch(apiUrl);
			
			if (!response.ok) 
			{
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const data = await response.json();
			setResult(JSON.stringify(data, null, 2)); // Beautifies the JSON output with 2 spaces indentation
			setError(null);
            setIsFetching(false);
		} 
		catch (err) 
		{
			setError("Failed to fetch data. Please try again.");
			setResult(null);
            setIsFetching(false);
		}
	};

	return (
		<motion.div className="flex flex-col items-center justify-center min-h-screen bg-white" initial="hidden" animate="visible" variants={fadeInUp}>
			<motion.h1 className="text-4xl md:text-6xl font-bold mb-8 text-center" variants={fadeInUp} transition={{ duration: 0.3 }}>Scrape a Website</motion.h1>
			<motion.div className="w-full max-w-lg" variants={fadeInUp} transition={{ duration: 0.3 }}>
				<input type="text" placeholder="Enter URL" className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary mb-4" value={url} onChange={(e) => setUrl(e.target.value)} disabled={isFetching} />
				<div className="flex items-center mb-4">
					<input type="checkbox" className="mr-2" checked={shouldCategorize} onChange={() => setShouldCategorize(!shouldCategorize)} disabled={isFetching && shouldCategorize} />
					<label className="text-gray-700">Enable Categorization (May take 10+ seconds)</label>
				</div>
				{shouldCategorize && <p className="text-red-500 mb-4">Warning: Enabling categorization may cause delays of 10+ seconds depending on the website size.</p>}
				<motion.button className="w-full bg-primary text-white py-3 px-8 rounded-full text-lg" onClick={handleScrape} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} disabled={isFetching}>Scrape</motion.button>
			</motion.div>
			{result && <pre className="mt-8 p-4 bg-gray-100 rounded-lg w-full max-w-lg overflow-x-auto">{result}</pre>}
			{error && <p className="mt-8 text-red-500">{error}</p>}
		</motion.div>
	);
};

export default Try;
