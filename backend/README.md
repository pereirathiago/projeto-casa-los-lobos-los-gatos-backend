# Backend - Casa Los Lobos e Los Gatos

## Instalação

1. Clone o repositório
2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

3. Execute com Docker Compose:

```bash
docker-compose up -d
```

2. Instale as dependências:

```bash
yarn install
```

4. Execute as migrations:

```bash
yarn migrate:latest
```

5. Inicie o servidor de desenvolvimento:

```bash
yarn dev
```

## Scripts Disponíveis

- `yarn dev` - Inicia o servidor em modo desenvolvimento
- `yarn migrate:latest` - Executa as migrations mais recentes
- `yarn migrate:rollback` - Desfaz a última migration
- `yarn migrate:make <nome>` - Cria uma nova migration
- `yarn seed:run` - Executa os seeds
- `yarn seed:make <nome>` - Cria um novo seed
