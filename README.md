# TCC

TCC

## Dependências

- Python v3.12.3
- pip v24.1.2
- Node.js v20.16.0
- npm v10.8.2

## Desenvolvimento local

### Docker

Se possuir docker instalado, basta rodar o seguinte comando (lembre-se de criar o arquivo `frontend/.env` antes):

```sh
  docker compose up -d
```

Acesse a aplicação em `http://localhost:5173`.

### Back-End

Certifique-se de que está usando a versão correta do `Python`.

#### Dependências

Veja as dependências no arquivo `./backend/requirements.txt`.

#### Instruções

- Crie um ambiente virtual para desenvolvimento, conforme os passos abaixo:

```sh
  cd backend && virtualenv -p python3 venv && source venv/bin/activate
```

ou

```sh
cd backend && pyenv virtualenv X.X.X venv-name && pyenv activate venv-name
```

- Atualize o arquivo `.env`.
  Para isso, se você não quiser utilizar o Google Cloud Vision, você terá que baixar o executável do Tesseract-OCR na sua máquina e passar o caminho completo no arquivo `.env`. O nome da variável é `TESSERACT_PATH`, como pode ser visto em `.env.template`.
  Segue links para instalação abaixo:

1. [Debian/Ubuntu](https://github.com/tesseract-ocr/tesseract/releases)
2. [Windows](https://github.com/UB-Mannheim/tesseract/wiki)

- Instale os pacotes necessários:

```sh
  pip install -r requirements.txt
```

- Em seguida, digite a linha de comando abaixo no terminal:

```sh
  python main.py
```

Pronto, o backend irá rodar na URL `http://localhost:5000`.

### Front-End

Certifique-se de que está usando o `Prettier` como formatador oficial para o VsCode. Além disso, cheque as versões do seu `Node.js` e `npm`.

#### Dependências

Veja as dependências no arquivo `./frontend/package.json`.

#### Instruções

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

## Credenciais

- O arquivo `frontend/.env` pode ser atualizado com as informações presentes em `frontend/.env.default`.
