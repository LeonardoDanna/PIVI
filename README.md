### 1. Clonar o repositório

```bash
git clone https://github.com/LeonardoDanna/PIVI.git
cd TodayFashion
```

### 2. Criar e ativar ambiente virtual

```
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependências

```
pip install -r requirements.txt
```

### 4. Migrar banco

```
python manage.py migrate
```

### 5. Rodar servidor

```
python manage.py runserver
```

### 6. Rodar o frontend em modo desenvolvimento

```
cd frontend
npm install
npm run dev
```

### 7. Rodar o frontend integrado no Django

```
cd frontend
npm run build
```
