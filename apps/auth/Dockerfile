FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]

#======================================================
#         DOCKERFILE MULTI-STAGE BUILD CHEAT SHEET
#======================================================
#
#[ TECHNICAL WORKFLOW ]
#------------------------------------------------------
#[ DEVELOPMENT STAGE ]
#+----------------------------+
#| FROM node:alpine AS dev    |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| WORKDIR /usr/src/app       |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| COPY package.json           |
#| COPY pnpm-lock.yaml ./     |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| RUN npm install -g pnpm    |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| RUN pnpm install           |
#| (all dependencies)         |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| COPY . .                   |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| RUN pnpm run build         |
#| (outputs to dist/)         |
#+----------------------------+
#
#
#[ PRODUCTION STAGE ]
#+----------------------------+
#| FROM node:alpine AS prod   |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| ARG/ENV NODE_ENV=prod      |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| WORKDIR /usr/src/app       |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| COPY package.json           |
#| COPY pnpm-lock.yaml ./     |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| RUN npm install -g pnpm    |
#+----------------------------+
#        |
#        v
#+----------------------------+
#| RUN pnpm install --prod    |
#| (only prod deps)           |
#+----------------------------+
#        |
#        v
#+-------------------------------------------+
#| COPY --from=dev /usr/src/app/dist ./dist  |
#+-------------------------------------------+
#        |
#        v
#+-------------------------------------------+
#| CMD ["node", "dist/apps/auth/main"] |
#+-------------------------------------------+
#
#
#[ KITCHEN ANALOGY ]
#------------------------------------------------------
#KITCHEN 1: DEVELOPMENT
#----------------------
#- Bring in a small, clean kitchen (Node Alpine).
#- Set up the counter (/usr/src/app).
#- Put the recipe cards (package.json, pnpm-lock.yaml).
#- Install the cooking tool (pnpm).
#- Buy ALL ingredients (pnpm install).
#- Bring in all raw materials (COPY . .).
#- Cook the food (pnpm run build -> dist folder).
#
#Result: Finished dishes (compiled app in dist/).
#
#KITCHEN 2: PRODUCTION
#----------------------
#- Bring in a NEW, smaller kitchen (Node Alpine).
#- Tell chef "We’re serving customers" (NODE_ENV=production).
#- Set up the counter again (/usr/src/app).
#- Put recipe cards again (package.json, pnpm-lock.yaml).
#- Install cooking tool again (pnpm).
#- Buy ONLY serving ingredients (pnpm install --prod).
#- Bring in finished dishes from Kitchen 1 (COPY dist).
#- Serve food to customers (node dist/apps/reservations/main).
#
#Result: Customers get only the ready food — no extra mess!