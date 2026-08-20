# 🏥 MedVerify AI — Explainable Clinical Laboratory Report Verification Engine

> **A privacy-first, zero-hallucination clinical AI engine designed to ingest, validate, extract, and cross-verify diagnostic medical laboratory reports with 6-step explainable evidence chains.**

---

## 🌟 Key Highlights

- **🔒 100% Client-Side & Privacy First:** Zero cloud data leakage. Ingests PDFs and images directly in the browser via `pdfjs-dist` and `tesseract.js`.
- **🛡️ Strict Clinical Guardrail:** Automatically rejects non-medical documents (invoices, receipts, essays, code) with descriptive clinical alerts.
- **🧬 Comprehensive Diagnostic Extraction:** Dynamically extracts parameters across Hematology (CBC 14-parameter differential), Glycemic, Lipid, Hepatic (LFT), Renal (KFT), Thyroid, and Vitals.
- **⚡ Multi-System Clinical Consistency Engine:** Automatically cross-checks:
  - **Hematology Rule of 3** ($PCV \approx 3 \times Hb$)
  - **Differential Leucocyte Count (DLC)** 100% arithmetic sum verification
  - **Glycemic Concordance** (Acute Fasting Glucose vs. 3-Month HbA1c)
  - **Liver Transaminases** (AST/ALT De Ritis ratio)
  - **Renal Nitrogen Clearance** (Blood Urea to Creatinine ratio)
- **🌿 Verified Normal Health Synthesis:** Dynamically synthesizes green physiological confirmation for completely healthy baseline panels.
- **👓 Dual View Modes:**
  - **Clinician View:** LOINC codes, reference intervals, Rule of 3, and ICMR standards.
  - **Patient View:** Plain-English, non-jargon health synthesis and reassurance.
- **📄 1-Click Print & PDF Dossier:** Clean print optimization for single-page physician summaries.
- **🎨 Fluid Framer Motion UX:** iOS-style sliding active category pill, spring-physics range gauges, and cascading table rows.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Document & OCR Ingestion:** `pdfjs-dist`, `tesseract.js`
- **Icons:** Lucide React
- **State Management:** Zustand

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/medverify-ai.git

# 2. Navigate to project directory
cd medverify-ai

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏥 Clinical Diagnostic Coverage

| Diagnostic Panel | Tested Parameters | Standard Reference Benchmark |
| :--- | :--- | :--- |
| **Complete Blood Count (CBC)** | Hemoglobin, RBC, PCV, MCV, MCH, MCHC, RDW, WBC, Neutrophils, Lymphocytes, Eosinophils, Monocytes, Basophils, Platelets | ICMR / WHO Hematology Standards |
| **Glycemic Profile** | Fasting Blood Sugar, Post Prandial Sugar, HbA1c | ADA Standards of Care |
| **Lipid Profile** | Total Cholesterol, HDL, LDL, Triglycerides | NCEP ATP III |
| **Liver Function (LFT)** | SGPT / ALT, SGOT / AST, Bilirubin Total | ACG Guidelines |
| **Renal Function (KFT)** | Serum Creatinine, Blood Urea / BUN | KDIGO Guidelines |
| **Thyroid Profile** | TSH, Total T3, Total T4 | ATA Guidelines |
| **Vitals & Outpatient Summary** | Body Mass Index (BMI), Blood Pressure, Resting Heart Rate | AHA / WHO Guidelines |

---

## 📄 License
MIT License. Built for clinical transparency and patient empowerment.
