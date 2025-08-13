FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json primeiro
COPY package*.json ./

# Ajusta permissões do diretório para o usuário node
RUN chown -R node:node /app

# Usa o usuário node
USER node

# Instala dependências principais
RUN npm install

# Instala ts-jest e types de Jest
RUN npm install --save-dev ts-jest @types/jest

# Copia o restante do projeto
COPY --chown=node:node . .

# Comando padrão
CMD ["npm", "start"]
