📏 FitVision Pro - AI-Powered Personal Stylist

FitVision Pro is an end-to-end Full-Stack solution that leverages Computer Vision and Spring Boot to solve the $600B problem of online apparel returns. By calculating real-time body metrics, it provides a brand-agnostic sizing engine for seamless e-commerce integration.

🏗️ System Architecture

The project follows a Decoupled 3-Tier Architecture, ensuring high availability and separation of concerns between the vision processing and the recommendation logic.

Presentation Layer: React.js (Vite) utilizing WebCam APIs for real-time frame capture.

Business Logic Layer: Java (Spring Boot) Microservice handling measurement normalization and brand-mapping algorithms.

Data Layer: MongoDB (NoSQL) for flexible storage of multi-brand sizing schemas (Nike, Zara, H&M).

🚀 Key Engineering Features
📷 Real-Time AI Scanner: Extracts body landmarks (Chest, Waist, Hips) via browser-based camera input.

⚖️ Brand Normalization Engine: A custom Java service that translates raw pixel data into standardized metric units (cm) and maps them against brand-specific thresholds.

📊 Fit History Analytics: Persistent tracking of user measurements over time to monitor fitness/styling progress.

⚡ Optimized Performance: Frontend built with Vite for sub-second load times and Tailwind CSS for a modern, responsive Dark Mode UI.

🛠️ Technical Deep Dive
Backend (The Core)
Framework: Spring Boot 3.x (Java)

Architecture: Layered Pattern (Controller ➔ Service ➔ Repository)

Data Persistence: MongoDB for schema-less brand data flexibility.

Build Tool: Maven for dependency management and lifecycle automation.

Frontend
Library: React.js + Tailwind CSS

Icons: Lucide React for a minimalist, professional aesthetic.

## 📂 Project Structure 

FitVision-Pro/
├── backend/                # Spring Boot Microservice
│   ├── src/main/java/      # Size Mapping & Normalization Logic
│   ├── src/main/resources/ # Brand Datasets & Config
│   └── pom.xml             # Maven Project Config
├── frontend/               # React.js Application
│   ├── src/components/     # Modular UI Components
│   └── src/hooks/          # Custom Camera Logic
└── README.md               # Engineering Specs
