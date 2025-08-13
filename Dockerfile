# Use Node 20 Alpine
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Cria um volume para node_modules antes de instalar
VOLUME ["/app/node_modules"]

# Instala dependências
RUN npm ci

# Copia o restante do código
COPY . .

# Define comando padrão (para o container backend)
CMD ["npm", "run", "dev"]
