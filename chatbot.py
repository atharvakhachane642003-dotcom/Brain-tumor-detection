import requests
import json
import os

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def ask_gemini(question, tumor_class):
    """
    Sends a question to OpenRouter (e.g., LLaMA or Mistral) contextualized by tumor type.
    """
    if not OPENROUTER_API_KEY:
        return {"error": "Missing OpenRouter API key in .env file"}

    try:
        prompt = f"""
        You are a medical assistant specialized in tumor information.
        The predicted tumor type is: {tumor_class}.
        Answer the user's question only in the context of this tumor type.
        Be concise, factual, and medically accurate.
        User's question: {question}
        """

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "X-Title": "TumorAI Assistant"
            },
            data=json.dumps({
                "model": "meta-llama/llama-3.3-8b-instruct:free",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }),
            timeout=60
        )

        if response.status_code != 200:
            return {
                "error": f"OpenRouter API failed: {response.status_code}",
                "details": response.text
            }

        data = response.json()
        # ✅ For LLaMA models, content is plain text — not a list
        answer = data["choices"][0]["message"]["content"]
        return {"response": answer}

    except Exception as e:
        return {"error": str(e)}
