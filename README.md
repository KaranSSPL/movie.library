## Getting Started

First, Add credentials of PostgreSQL database in two files:

```needed Database Name, Username, password```

1. for database seeding 
file path:  ```src\db\config\config.js```

2. for database connection 
file path: ```src\lib\dbConnect.ts```

Run migration for PostgreSQL database:
Migration will run with Sequelize CLI with directory: src\db\config
```
npx sequelize-cli init

npx sequelize-cli db:migrate
```

Run database seeding for default user: 
```
npx sequelize-cli db:seed:all
```

Now all set next Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

use test user to access movie library:
email: example@example.com
password: test
