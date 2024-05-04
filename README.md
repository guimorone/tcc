# Template React + Django

React-Vite App (TS) with Django Template (Just README)

## Dependencies

- Python v3.12.3
- pip v24.0
- Node.js v22.1.0
- npm v10.7.0

## Desenvolvimento local

### Back-End

Certifique-se de que está usando a versão correta do `Python`.

#### Dependências

Veja as dependências no arquivo `./backend/requirements.txt`.

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
  pip install -r requirements.txt
```

- Em seguida, digite a linha de comando abaixo no terminal:

```sh
  python app.py
```

Pronto, o backend irá rodar na URL `http://localhost:8000`.

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
