# Template NextJS with Lucia authentication

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

1. Copy file .env.example to .env

```sh
cp .env.example .env
```

2. Configuration database url in env

```sh
DATABASE_URL="mysql://root:password@localhost:3306/nextjs_template_lucia"
```

3. Install dependecy

```sh
yarn install
```

4. Run prisma migrate

```sh
yarn prisma migrate dev
```

5. Start application development

```sh
yarn dev
```
