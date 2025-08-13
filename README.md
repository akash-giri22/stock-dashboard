# 📊 Stock Market Dashboard

A full-stack **Stock Market Dashboard** built with **FastAPI (Python)** for the backend and **ReactJS** for the frontend.  
It displays **real-time and historical stock data** with interactive charts using **Recharts** and `yfinance`.

---

## 🚀 Features
- 📜 **Scrollable Left Panel** with a list of companies (10+)
- 📈 Interactive **stock price chart**
- 📊 Historical price table with Open, High, Low, and Close values
- 🔄 Live API integration with FastAPI backend
- 🎨 Clean and responsive UI design
- 📅 Click company name to instantly load data
- 🌙 Dark mode theme

---

## 🛠 Tech Stack

**Frontend:**  
- ReactJS  
- CSS  
- Recharts (charting library)  

**Backend:**  
- FastAPI (Python)  
- yfinance (stock data)  

**Other Tools:**  
- Git & GitHub  
- VS Code  

---

## ⚙️ Development Approach
1. **Backend (FastAPI)** – Created REST API endpoints:
   - `/companies` → Returns list of companies  
   - `/prices?symbol=XYZ` → Returns historical stock data  
2. **Frontend (ReactJS)** – Used `fetch()` to call backend API and display results in a responsive layout.
3. **Charting** – Used **Recharts** for plotting interactive line charts.
4. **UI/UX** – Designed a clean, responsive dashboard with a scrollable company list and a main chart view.
5. **Testing** – Ran the project locally to verify data fetching and chart rendering.
6. **Version Control** – Used Git for code management and GitHub for hosting the repository.

---

## 🧩 Challenges Faced
- Understanding how to fetch live stock data using **yfinance** in Python.
- Connecting the FastAPI backend with the React frontend (CORS handling).
- Making the left panel scrollable without breaking the layout.
- Ensuring the chart updates instantly on company selection.

---

## 📷 Scr<img width="1919" height="951" alt="Screenshot 2025-08-13 200138" src="https://github.com/user-attachments/assets/bdf62e0f-97e5-48bf-90f8-56ad9f9bed75" />
<img width="1919" height="951" alt="Screenshot 2025-08-13 200138" src="https://github.com/user-attachments/assets/eb7d1bc5-5687-42cd-ac36-89031e847074" />
eenshots

### Dashboard View



---

## 📌 How to Run Locally

### Backend
```bash
cd backend
uvicorn main:app --reload
