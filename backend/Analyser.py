from dotenv import load_dotenv
import json
import os
import fitz
import google.generativeai as genai


load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash')
json_generation_config = genai.GenerationConfig(response_mime_type="application/json")

def create_gemini_prompt(resume_text, job_description):
    prompt = f"""
Act as an expert technical recruiter and a modern ATS analysis engine, combined into one. Your task is to perform a comprehensive analysis of the provided resume against the given job description.

Your output must be only a valid JSON object. Do not include any introductory text or markdown formatting like json.

Resume Text:
---
{resume_text}
---

Job Description:
---
{job_description}
---

Your Analysis and Suggestions:
Based on the comparison, provide the following in a clear, structured JSON format:

Match_Score: A percentage score from 0 to 100, strictly evaluating how well the resume's skills and experience align with the job description's requirements.

Missing_Key_Skills: A JSON array of strings listing crucial skills, technologies, and qualifications mentioned in the job description that are absent from the resume.

ATS_Compliance_Check: A JSON object analyzing key structural and keyword elements for ATS compatibility. Include boolean checks for the presence of 'Contact_Info' (email, phone, address), 'Correct_Job_Title', and 'Standard_Date_Formatting'.

Actionable_Suggestions: A JSON array of objects, where each object contains two keys: 'area' (e.g., "Quantify Achievements", "ATS Keyword Optimization") and 'suggestion' (a specific, actionable piece of advice for that area).

Improved_Summary: A single string containing a rewritten professional summary that is perfectly tailored to the job description and optimized with relevant keywords.
    """
    
    return prompt

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    resume_text = ""
    for page in doc:
        resume_text += page.get_text()
    doc.close()
    return resume_text

def analyze(resume,description):
    resume_text = extract_text_from_pdf(resume)
    
    if resume_text:
        # 4. Create the detailed prompt
        prompt = create_gemini_prompt(resume_text,description)
        response = model.generate_content(
            prompt,
            generation_config=json_generation_config
        )
        json_data=json.loads(response.text)
        return json_data
    

    
