# 1) Image de base légère avec Python
FROM python:3.11-slim

# 2) Répertoire de travail
WORKDIR /app

# 3) Optimisations Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# 4) Installer les deps (avec cache efficace)
COPY requirements.txt .
RUN pip install -r requirements.txt

# 5) Copier le code
COPY app/ ./app

# 6) Port d’écoute de l’app (uvicorn)
EXPOSE 8000

# 7) Commande de démarrage (prod-friendly)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
