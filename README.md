🚀 AI-Powered Self-Healing CI/CD for Microservices
<p align="center">




</p>
📖 Project Overview

This project implements a production-style DevOps platform for a microservice application.

It demonstrates:

Infrastructure as Code

Container orchestration

CI/CD automation

Observability

Security best practices

AI-assisted deployment debugging

Self-healing infrastructure

The system automatically builds, deploys, monitors, and recovers services when failures occur.

🏗 System Architecture
Developer Push
      │
      ▼
GitHub Actions CI/CD
      │
      ├── Build Docker Images
      │
      ├── Push to AWS ECR
      │
      └── Deploy to Kubernetes
              │
              ▼
        AWS EKS Cluster
              │
     ┌────────┼─────────┐
     │        │         │
Catalog   Auth Service  Monitoring
Service                 (Prometheus)
     │        │
     ▼        ▼
Grafana Dashboards

If deployment fails:
      │
      ▼
AI Log Analyzer
      │
      ▼
Self-Healing Controller
      │
      ▼
Automatic Rollback
✨ Key Features
📦 Microservice Architecture

Two backend services:

Service	Description
Catalog Service	Provides car marketplace API
Auth Service	Handles authentication and JWT verification

Both services are containerized and deployed with Kubernetes.

☁️ Infrastructure as Code

Infrastructure is fully managed with:

Terraform

Provisioned resources:

AWS VPC

Subnets

EKS Cluster

Node Groups

IAM Roles

ECR Container Registry

⚙️ CI/CD Pipeline

Automated using:

GitHub Actions

Pipeline stages:

Build → Push → Deploy → Verify Rollout

Images are tagged using commit SHA for traceable deployments.

Example:

catalog-service:3f9c2ab
📊 Observability

Monitoring stack:

Tool	Purpose
Prometheus	Collect metrics
Grafana	Visual dashboards

Metrics monitored:

Pod CPU usage

Memory usage

Node health

Deployment performance

🔐 Security Hardening

Implemented best practices:

Kubernetes Secrets

IAM Roles for Service Accounts (IRSA)

Network Policies

Pod Security Context

This ensures secure access to AWS services without storing credentials in containers.

🤖 AI-Assisted Debugging

If a deployment fails, the pipeline automatically:

1️⃣ Fetches pod logs
2️⃣ Sends logs to an LLM
3️⃣ AI analyzes root cause

Example output:

AI Diagnosis:

The container failed because the JWT_SECRET
environment variable is missing.

Ensure the Kubernetes Secret is configured properly.
🔄 Self-Healing Infrastructure

A Kubernetes controller continuously monitors pod health.

If a failure occurs:

CrashLoopBackOff
ImagePullBackOff

The system automatically performs:

kubectl rollout undo

This restores the last stable deployment.

📁 Project Structure
.
├── backend
├── auth-service
├── frontend
│
├── k8s
│   ├── catalog-deployment.yaml
│   ├── auth-deployment.yaml
│   ├── services.yaml
│   └── network-policy.yaml
│
├── infra
│   └── terraform
│
├── ai
│   └── analyze_logs.py
│
├── self-healing-agent
│   ├── monitor.py
│   └── Dockerfile
│
└── .github
    └── workflows
        └── deploy.yml
🛠 Technologies Used
Category	Tools
Frontend	React + Vite
Backend	Node.js + Express
Containers	Docker
Orchestration	Kubernetes
Cloud	AWS
Infrastructure	Terraform
CI/CD	GitHub Actions
Monitoring	Prometheus + Grafana
AI	Groq LLM
Registry	AWS ECR
▶️ Running the Project Locally

Run services locally using Docker Compose:

docker compose up --build

Access services:

Service	URL
Frontend	http://localhost:5173

Catalog API	http://localhost:3000/api/cars

Auth Service	http://localhost:4000
📸 Demo

Example API response:

Example request:

http://localhost:3000/api/cars

Response:

{
 "data":[
  {"id":1,"name":"Tesla Model S","price":80000},
  {"id":2,"name":"BMW M4","price":75000}
 ]
}
🚀 Deploying to Kubernetes

Provision infrastructure:

terraform apply

Deploy application:

kubectl apply -f k8s/

Check pods:

kubectl get pods
🧪 Self-Healing Flow
New deployment pushed
        ↓
Pod crashes
        ↓
Self-healing agent detects failure
        ↓
Automatic rollback triggered

System recovers without human intervention.

🔮 Future Improvements

Possible enhancements:

GitOps deployment with ArgoCD

Distributed tracing (OpenTelemetry)

Canary deployments

Chaos engineering tests

👨‍💻 Author

Harsh Ranjan
Computer Science Engineering Student

⭐ Why This Project Is Interesting

This project demonstrates real-world DevOps practices, including:

Kubernetes orchestration

Cloud infrastructure automation

AI-based debugging

Self-healing deployment systems

It combines DevOps + AI + Cloud Engineering concepts in a single platform.
