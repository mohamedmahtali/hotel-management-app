# Backend — FastAPI (SQLite, SQLModel)

## 🚀 Installation & Lancement

### 1) Créer l’environnement Python
```bash
cd backend
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
# .venv\Scripts\Activate.ps1

2) Installer les dépendances
```bash
pip install -r requirements.txt
```

### 3) Lancer le serveur FastAPI
```bash
uvicorn app.main:app --reload --port 8000
```   
Le serveur sera accessible à l’adresse [http://localhost:8000](http://localhost:8000).