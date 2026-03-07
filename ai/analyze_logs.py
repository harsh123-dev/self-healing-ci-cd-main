import os
from groq import Groq  

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def analyze_logs(log_text):
    prompt = f"""
    A Kubernetes deployment failed.

    Analyze the logs below and explain:
    1. What caused the failure
    2. How to fix it

    Logs:
    {log_text}
    """

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    return completion.choices[0].message.content


if __name__ == "__main__":
    with open("pod_logs.txt") as f:
        logs = f.read()

    result = analyze_logs(logs)

    print("\nAI Diagnosis:\n")
    print(result)