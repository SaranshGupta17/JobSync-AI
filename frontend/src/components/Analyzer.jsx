import Sidebar from "./Sidebar"
import axios from '../Config/axios'
import { auth } from '../Config/Firebase_config'
import { useEffect, useState } from "react"

const AtsCheckItem = ({ label, passed }) => (
  <li className="flex items-center">
    {passed ? (
      <span className="text-green-500 mr-2">✅</span>
    ) : (
      <span className="text-red-500 mr-2">❌</span>
    )}
    <span className="text-gray-700">{label.replace(/_/g, ' ')}</span>
  </li>
);

const Analyzer = () => {
  
  const [analysisData,setanalysisData] = useState()
  const [isLoading, setIsLoading] = useState(true);
  useEffect(()=>{
    const fetchAnalysisData = async () => {
      // Ensure the user is logged in before fetching
      if (auth.currentUser) {
        try {
          const response = await axios.get(`/Analysis/${auth.currentUser.uid}`);
          // The response from the backend is already an object, no need to parse
          setanalysisData(response.data.analysis);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchAnalysisData();
  },[])

  if (isLoading) {
    return <div className="p-8 text-center">Loading your analysis... ⏳</div>;
  }

  

  return (
    <>
    
      <div className="flex size-full">
          <Sidebar/>
          <div className="flex-col justify-items-center size-full p-5 overflow-y-auto">
            <h1 className="text-4xl">Here is your resume's analysis.</h1>
            {/* <div className="h-[25%] w-[15%] border-2 rounded-2xl mt-[4%]"></div> */}
            <div>

              <aside className="space-y-8">
                <section className="p-6 bg-white rounded-xl shadow-sm text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Match Score</h2>
                  <p className="text-6xl font-bold text-indigo-600">{analysisData.Match_Score}%</p>
                </section>

                <section className="p-6 bg-white rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">ATS Compliance</h2>
                  <ul className="space-y-3">
                    {Object.entries(analysisData.ATS_Compliance_Check).map(([check, passed]) => (
                      <AtsCheckItem key={check} label={check} passed={passed} />
                    ))}
                  </ul>
                </section>
              </aside>

              {Object.entries(analysisData).map(([key, value]) => {
                if (key === 'Match_Score' || key === 'ATS_Compliance_Check') return null; // Skip these, they are in the sidebar
                
                let content;
                if (key === 'Actionable_Suggestions') {
                  content = (
                    <ul className="space-y-4">
                      {value.map((item, index) => (
                        <li key={index} className="p-4 bg-gray-50 rounded-lg">
                          <strong className="block text-blue-800">{item.area}</strong>
                          <p className="mt-1 text-gray-600">{item.suggestion}</p>
                        </li>
                      ))}
                    </ul>
                  );
                } else if (Array.isArray(value)) {
                  content = (
                    <ul className="list-disc list-inside pl-4 space-y-2 text-gray-700">
                      {value.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  );
                } else {
                  content = <p className="text-gray-700 leading-relaxed">{value.toString()}</p>;
                }

                return (
                  <section key={key} className="p-6 bg-white rounded-xl shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                      {key.replace(/_/g, ' ')}
                    </h2>
                    {content}
                  </section>
                );
              })}
            </div>
            
          </div>
      </div>

    </>
  )
}

export default Analyzer
