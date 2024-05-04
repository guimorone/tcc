# Template React + Django

React-Vite App (TS) with Django Template (Just README)

## Dependencies

- Python vX.X.X
- Poetry vX.X.X
- Node.js v18.18.0
- npm v10.2.0

## Desenvolvimento local

### Back-End

Certifique-se de que está usando a versão correta do `Python`.

#### Dependências

Veja as dependências no arquivo `./backend/pyproject.toml`.

#### Instruções:

- Crie um ambiente virtual para desenvolvimento, conforme os passos abaixo:

```sh
  cd backend && virtualenv -p python3 venv && source venv/bin/activate
```

ou

```sh
cd backend && pyenv virtualenv X.X.X venv-name && pyenv activate venv-name
```

- Instale os pacotes necessários e os atualize para a última versão (se tiver algum problema, rode `poetry install` antes do update, mas geralmente não é necessário):

```sh
  pip install "poetry==X.X.X" && poetry update
```

- Atualize o arquivo `.env`.

- Se for necessário atualizar sua pasta `migrations`, rode o comando abaixo:

```sh
python manage.py makemigrations --merge --no-input
python manage.py migrate --no-input
```

- Em seguida, digite a linha de comando abaixo no terminal:

```sh
  python manage.py runserver
```

- Pronto, o backend irá rodar na URL `http://localhost:8000`.

Sempre que fizer uma alteração relacionado a banco de dados (modelos, serializadores, etc), execute o comando abaixo:

```sh
  python manage.py makemigrations && python manage.py migrate
```

#### Criando banco local:

- Atualizar o arquivo `.env` com as credenciais desejadas (variáveis de ambiente que começam com `DB_`).

- Subir o banco:

```sh
docker compose up -d
```

- Fechar o banco:

```sh
docker compose down
```

### Front-End

Certifique-se de que está usando o `Prettier` como formatador oficial para o VsCode. Além disso, cheque as versões do seu `Node.js` e `npm`.

#### Dependências

Veja as dependências no arquivo `./frontend/package.json`.

#### Instruções:

- Instale os pacotes necessários e os atualize para a última versão (se tiver algum problema, rode `npm i` antes do update, mas geralmente não é necessário):

```sh
  cd frontend
  npm update --save
```

- Atualize o arquivo `.env`.

- Em seguida, digite a linha de comando abaixo no terminal:

```sh
  npm run dev
```

- Pronto, o frontend irá rodar na URL `http://localhost:5173`.

Sempre que quiser checar possíveis erros ou warnings, digite o comando abaixo no terminal:

```sh
  npm run lint
```

ou, para ajeitar os erros de formatação também:

```sh
  npm run lint-fix
```
