After creating virtualenv and installing poetry...

- Poetry add Django
- django-admin startproject backend
- python manage.py startapp APP (could be users/api/...)

Be sure to install:

- django-cors-headers
- djangorestframework
- environs
- whitenoise
- django-cryptography
- psycopg2-binary (if using PostgreSQL)

and more...

`pyproject.toml` example below:

```toml
[tool.poetry]
name = "backend"
version = "0.1.0"
description = ""
authors = ["Guilherme Morone <guimorone@gmail.com>"]

[tool.poetry.dependencies]
python = "^3.11"
django = "^4.2.5"
django-cors-headers = "^4.2.0"
djangorestframework = "^3.14.0"
environs = "^9.5.0"
psycopg2-binary = "^2.9.7"
whitenoise = "^6.5.0"
django-cryptography = "^1.1"
djangorestframework-api-key = "^2.3.0"
djangorestframework-simplejwt = "^5.3.0"
xmltodict = "^0.13.0"
django-phonenumber-field = {extras = ["phonenumbers"], version = "^7.2.0"}
validate-docbr = "^1.10.0"
django-constance = {extras = ["database"], version = "^3.1.0"}
pillow = "^10.1.0"
brazilcep = "^6.2.0"

[build-system]
requires = ["poetry-core==1.6.1"]
build-backend = "poetry.core.masonry.api"
```

Example of settings in `settings.py`.
If wanted a custom local database, run `docker compose up -d` (See `docker-compose.yml`).
