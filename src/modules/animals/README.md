# Módulo Animals - API de Cadastro de Animais

## 📋 Visão Geral

Módulo completo para gerenciamento de animais (cães e gatos) para adoção, seguindo os princípios de Clean Architecture e SOLID.

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/modules/animals/
├── controllers/
│   └── AnimalController.ts           # Controller com métodos CRUD
├── dtos/
│   └── IAnimalDTO.ts                 # Data Transfer Objects
├── models/
│   ├── IAnimalModel.ts               # Model do animal
│   ├── IAnimalPhotoModel.ts          # Model de fotos
│   └── IAnimalTagModel.ts            # Model de tags
├── repositories/
│   ├── AnimalRepository.ts           # Implementação do repositório de animais
│   ├── AnimalPhotoRepository.ts      # Implementação do repositório de fotos
│   ├── AnimalTagRepository.ts        # Implementação do repositório de tags
│   └── interfaces/
│       ├── IAnimalRepository.ts      # Interface do repositório de animais
│       ├── IAnimalPhotoRepository.ts # Interface do repositório de fotos
│       └── IAnimalTagRepository.ts   # Interface do repositório de tags
├── useCases/
│   ├── CreateAnimalUseCase.ts        # Caso de uso para criar animal
│   ├── GetAnimalUseCase.ts           # Caso de uso para buscar animais
│   ├── UpdateAnimalUseCase.ts        # Caso de uso para atualizar animal
│   └── DeleteAnimalUseCase.ts        # Caso de uso para deletar animal
└── validations/
    ├── validateAnimal.ts             # Middlewares de validação
    └── schemas/
        └── animalValidation.ts       # Schemas Yup
```

## 🚀 Rotas da API

### Rotas Públicas

#### Listar todos os animais

```http
GET /animals
```

Query Parameters (opcionais):

- `type`: "dog" | "cat"
- `breed`: string
- `minAge`: number
- `maxAge`: number

#### Buscar animal por UUID

```http
GET /animals/:uuid
```

### Rotas Protegidas (Admin only)

#### Cadastrar animal

```http
POST /animals
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

Body:

- `name`: string (obrigatório)
- `type`: "dog" | "cat" (obrigatório)
- `breed`: string (obrigatório)
- `age`: number (0-30) (obrigatório)
- `description`: string (min 20 chars) (obrigatório)
- `photos`: File[] (1-3 arquivos, max 5MB cada) (obrigatório)
- `tags`: JSON string (opcional)

Exemplo de tags:

```json
[
  {
    "id": "1698765432000",
    "label": "Saudável",
    "color": "#10b981"
  }
]
```

#### Atualizar animal

```http
PUT /animals/:uuid
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

Body: (todos opcionais)

- `name`: string
- `type`: "dog" | "cat"
- `breed`: string
- `age`: number (0-30)
- `description`: string (min 20 chars)
- `photos`: File[] (1-3 arquivos, max 5MB cada)
- `tags`: JSON string

#### Deletar animal

```http
DELETE /animals/:uuid
Authorization: Bearer {token}
```

## 🗄️ Banco de Dados

### Tabelas

#### animals

- `id`: integer (PK)
- `uuid`: uuid (unique)
- `name`: varchar(255)
- `type`: enum('dog', 'cat')
- `breed`: varchar(255)
- `age`: decimal(4,1)
- `description`: text
- `photo_url`: varchar(500) - URL da foto principal
- `created_at`: timestamp
- `updated_at`: timestamp

#### animal_photos

- `id`: integer (PK)
- `uuid`: uuid (unique)
- `animal_id`: integer (FK → animals.id)
- `photo_url`: varchar(500)
- `order_index`: integer
- `created_at`: timestamp

#### animal_tags

- `id`: integer (PK)
- `uuid`: uuid (unique)
- `animal_id`: integer (FK → animals.id)
- `label`: varchar(100)
- `color`: varchar(7) - formato hex (#RRGGBB)
- `created_at`: timestamp

## 📝 Princípios Aplicados

### SOLID

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces seguem contratos bem definidos
- **I**nterface Segregation: Interfaces específicas para cada repositório
- **D**ependency Inversion: Dependências são injetadas via tsyringe

### Clean Architecture

- **Entities** (Models): Definem estrutura dos dados
- **Use Cases**: Lógica de negócio isolada
- **Interface Adapters** (Controllers/Repositories): Adaptam dados
- **Frameworks & Drivers**: Express, Knex, Multer

## 🔧 Validações

### Campos Obrigatórios (Create)

- Nome, tipo, raça, idade, descrição, pelo menos 1 foto

### Regras de Validação

- `age`: entre 0 e 30
- `description`: mínimo 20 caracteres
- `photos`: 1 a 3 arquivos, max 5MB cada
- `type`: apenas "dog" ou "cat"
- `tags.color`: formato hexadecimal (#RRGGBB)

### Tipos de Arquivo Aceitos

- jpeg, jpg, png, gif, webp

## 📦 Upload de Arquivos

Os arquivos são salvos em `/uploads/animals/` e servidos estaticamente via `/uploads/`.

Formato do nome: `animal-{timestamp}-{hash}.{ext}`

## 🔐 Autenticação

Rotas de criação, atualização e exclusão requerem:

1. Token JWT válido
2. Role de `admin`

## 💡 Exemplo de Uso

```javascript
// Criar FormData
const formData = new FormData()
formData.append('name', 'Rex')
formData.append('type', 'dog')
formData.append('breed', 'Labrador')
formData.append('age', '3')
formData.append('description', 'Um cachorro muito amigável e brincalhão')
formData.append('photos', file1)
formData.append('photos', file2)
formData.append('tags', JSON.stringify([{ id: '1', label: 'Saudável', color: '#10b981' }]))

// Fazer requisição
const response = await fetch('http://localhost:3333/animals', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
  },
  body: formData,
})
```

## 🧪 Testando

Execute as migrations:

```bash
yarn migrate:latest
```

Inicie o servidor:

```bash
yarn dev
```

As rotas estarão disponíveis em `http://localhost:3333/animals`

## 📚 Dependências

- `multer`: Upload de arquivos
- `yup`: Validação de schemas
- `tsyringe`: Injeção de dependências
- `knex`: Query builder
