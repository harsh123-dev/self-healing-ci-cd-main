from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ai_decision(logs):

    prompt = f"""
    A Kubernetes pod crashed.

    Decide whether to:
    1. Restart pod
    2. Rollback deployment

    Logs:
    {logs}
    """

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content