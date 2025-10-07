# bun-react-tailwind-shadcn-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.13. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# DB
set the connection string in .env

```env
DATABASE_URL="postgresql://username:password@localhost:5432/warframe"
```

To seed/update database, send requests to `PUT /api/relic` and then `PUT /api/mission`
