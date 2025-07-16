// components/DecisionDetailsPage.jsx (example)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you use React Router
import {
  getDecision,
  generateProsConsGemini,
  getProsConsByDecision,
  addProsCons, // To add AI suggestions to user list
  getMindset,
  getGeminiSummary // For the analysis summary
} from '../services/api';
import ProConCard from './ProConCard'; // Assuming this path is correct
import { toast } from 'react-hot-toast'; // For notifications

export default function DecisionDetailsPage() {
  const { decisionId } = useParams();
  const [decision, setDecision] = useState(null);
  const [userProsCons, setUserProsCons] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingUserProsCons, setLoadingUserProsCons] = useState(false);
  const [mindset, setMindset] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);


  // Fetch decision details
  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await getDecision(decisionId);
        setDecision(res.data);
      } catch (error) {
        console.error('Error fetching decision:', error);
        toast.error('Failed to load decision details.');
      }
    };
    fetchDecision();
  }, [decisionId]);

  // Fetch user-added pros/cons
  const fetchUserProsCons = async () => {
    setLoadingUserProsCons(true);
    try {
      const res = await getProsConsByDecision(decisionId);
      // Filter out AI-sourced items that haven't been 'adopted' by the user yet
      setUserProsCons(res.data.filter(item => item.source === 'user' || item.source === 'ai'));
    } catch (error) {
      console.error('Error fetching user pros/cons:', error);
      toast.error('Failed to load user pros and cons.');
    } finally {
      setLoadingUserProsCons(false);
    }
  };

  useEffect(() => {
    fetchUserProsCons();
  }, [decisionId]);

  // Fetch AI-generated pros/cons
  const fetchAiSuggestions = async () => {
    if (!decision) return; // Wait for decision data to be loaded
    setLoadingAi(true);
    try {
      const result = await generateProsConsGemini({
        optionA: decision.optionA.title,
        optionB: decision.optionB.title,
      });
      setAiSuggestions(result);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      toast.error('Failed to generate AI suggestions.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Fetch mindset data
  useEffect(() => {
    const fetchMindset = async () => {
      try {
        const res = await getMindset(decisionId);
        setMindset(res.data);
      } catch (error) {
        console.error('Error fetching mindset:', error);
        // It's okay if no mindset exists, don't necessarily show an error toast
      }
    };
    fetchMindset();
  }, [decisionId]);

  // Fetch AI decision analysis
  const fetchDecisionAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const res = await getGeminiSummary(decisionId); // Use the correct API function for Gemini summary
      setAnalysis(res.data);
    } catch (error) {
      console.error('Error fetching decision analysis:', error);
      toast.error('Failed to generate AI analysis.');
    } finally {
      setLoadingAnalysis(false);
    }
  };


  // Handler to add an AI-suggested item to the user's saved list
  const handleAddAiItemToUserList = async (item) => {
    try {
      await addProsCons(item); // Call the API to save it to the database
      fetchUserProsCons(); // Refresh the user's list after saving
      // Optionally remove from AI suggestions list if you only want it to appear once
      setAiSuggestions(prev => {
        const newAiSuggestions = { ...prev };
        newAiSuggestions[item.option.toLowerCase()][`${item.type}s`] =
          newAiSuggestions[item.option.toLowerCase()][`${item.type}s`].filter(
            (text) => text !== item.text
          );
        return newAiSuggestions;
      });
      toast.success('Added to your list!');
    } catch (error) {
      console.error('Error adding AI item to user list:', error);
      toast.error('Failed to add AI suggestion to your list.');
    }
  };


  if (!decision) {
    return <div>Loading decision...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{decision.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Option A Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Option A: {decision.optionA.title}</h2>
          <p className="text-gray-600 mb-4">{decision.optionA.description}</p>

          {/* AI Generated Pros/Cons for Option A */}
          <h3 className="text-xl font-medium mb-3">AI Suggestions for Option A:</h3>
          <button
            onClick={fetchAiSuggestions}
            disabled={loadingAi}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 mb-4"
          >
            {loadingAi ? 'Generating...' : 'Generate AI Pros/Cons'}
          </button>
          {loadingAi && <p>Generating AI suggestions...</p>}
          {aiSuggestions && (
            <div className="mb-6">
              {/* Pros for Option A */}
              <h4 className="text-lg font-semibold text-green-700 mb-2">Pros:</h4>
              {aiSuggestions.optionA.pros.length > 0 ? (
                aiSuggestions.optionA.pros.map((proText, index) => (
                  <ProConCard
                    key={`ai-pro-A-${index}`}
                    item={{ text: proText, type: 'pro', option: 'A', source: 'ai' }}
                    decisionId={decisionId}
                    readOnly={true} // Mark as read-only for AI display
                    onAddAiItemToUserList={handleAddAiItemToUserList}
                  />
                ))
              ) : (
                <p>No AI pros generated for Option A.</p>
              )}

              {/* Cons for Option A */}
              <h4 className="text-lg font-semibold text-red-700 mt-4 mb-2">Cons:</h4>
              {aiSuggestions.optionA.cons.length > 0 ? (
                aiSuggestions.optionA.cons.map((conText, index) => (
                  <ProConCard
                    key={`ai-con-A-${index}`}
                    item={{ text: conText, type: 'con', option: 'A', source: 'ai' }}
                    decisionId={decisionId}
                    readOnly={true} // Mark as read-only for AI display
                    onAddAiItemToUserList={handleAddAiItemToUserList}
                  />
                ))
              ) : (
                <p>No AI cons generated for Option A.</p>
              )}
            </div>
          )}

          {/* User Added Pros/Cons for Option A */}
          <h3 className="text-xl font-medium mb-3">Your Pros/Cons for Option A:</h3>
          {loadingUserProsCons && <p>Loading your pros and cons...</p>}
          {!loadingUserProsCons && userProsCons
            .filter(item => item.option === 'A' && item.type === 'pro')
            .map(item => (
              <ProConCard key={item._id} item={item} decisionId={decisionId} onUpdate={fetchUserProsCons} />
            ))}
          {!loadingUserProsCons && userProsCons
            .filter(item => item.option === 'A' && item.type === 'con')
            .map(item => (
              <ProConCard key={item._id} item={item} decisionId={decisionId} onUpdate={fetchUserProsCons} />
            ))}
          {/* Add a form/button to add new user pro/con here */}
        </div>

        {/* Option B Section (similar structure) */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Option B: {decision.optionB.title}</h2>
          <p className="text-gray-600 mb-4">{decision.optionB.description}</p>

          {/* AI Generated Pros/Cons for Option B */}
          <h3 className="text-xl font-medium mb-3">AI Suggestions for Option B:</h3>
          {/* Button to generate AI suggestions is above, no need to repeat */}
          {loadingAi && <p>Generating AI suggestions...</p>} {/* Re-display loading for Option B */}
          {aiSuggestions && (
            <div className="mb-6">
              {/* Pros for Option B */}
              <h4 className="text-lg font-semibold text-green-700 mb-2">Pros:</h4>
              {aiSuggestions.optionB.pros.length > 0 ? (
                aiSuggestions.optionB.pros.map((proText, index) => (
                  <ProConCard
                    key={`ai-pro-B-${index}`}
                    item={{ text: proText, type: 'pro', option: 'B', source: 'ai' }}
                    decisionId={decisionId}
                    readOnly={true}
                    onAddAiItemToUserList={handleAddAiItemToUserList}
                  />
                ))
              ) : (
                <p>No AI pros generated for Option B.</p>
              )}

              {/* Cons for Option B */}
              <h4 className="text-lg font-semibold text-red-700 mt-4 mb-2">Cons:</h4>
              {aiSuggestions.optionB.cons.length > 0 ? (
                aiSuggestions.optionB.cons.map((conText, index) => (
                  <ProConCard
                    key={`ai-con-B-${index}`}
                    item={{ text: conText, type: 'con', option: 'B', source: 'ai' }}
                    decisionId={decisionId}
                    readOnly={true}
                    onAddAiItemToUserList={handleAddAiItemToUserList}
                  />
                ))
              ) : (
                <p>No AI cons generated for Option B.</p>
              )}
            </div>
          )}

          {/* User Added Pros/Cons for Option B */}
          <h3 className="text-xl font-medium mb-3">Your Pros/Cons for Option B:</h3>
          {loadingUserProsCons && <p>Loading your pros and cons...</p>}
          {!loadingUserProsCons && userProsCons
            .filter(item => item.option === 'B' && item.type === 'pro')
            .map(item => (
              <ProConCard key={item._id} item={item} decisionId={decisionId} onUpdate={fetchUserProsCons} />
            ))}
          {!loadingUserProsCons && userProsCons
            .filter(item => item.option === 'B' && item.type === 'con')
            .map(item => (
              <ProConCard key={item._id} item={item} decisionId={decisionId} onUpdate={fetchUserProsCons} />
            ))}
          {/* Add a form/button to add new user pro/con here */}
        </div>
      </div>

      <hr className="my-8" />

      {/* Decision Analysis Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Decision Analysis</h2>
        <button
          onClick={fetchDecisionAnalysis}
          disabled={loadingAnalysis}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
        >
          {loadingAnalysis ? 'Generating Analysis...' : 'Get AI Decision Analysis'}
        </button>

        {loadingAnalysis && <p>Generating AI decision analysis...</p>}
        {analysis && (
          <div>
            <p className="text-lg mb-2">
              <span className="font-semibold">Recommended Option:</span> {analysis.recommendedOption}
            </p>
            <p className="mb-4">{analysis.summary}</p>
            <h3 className="font-semibold text-gray-700">Key Strengths of Recommended Option:</h3>
            <ul className="list-disc list-inside mb-4">
              {analysis.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <h3 className="font-semibold text-gray-700">Overall Considerations:</h3>
            <ul className="list-disc list-inside">
              {analysis.considerations.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}