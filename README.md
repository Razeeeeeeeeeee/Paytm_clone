- Clone the repo

```jsx
git clone https://github.com/Razeeeeeeeeeee/Paytm_clone
```

- npm install
- You can choose to run a postgres either locally or on the cloud using services like neon.tech

```jsx
docker run  -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

- Update .env files everywhere with the right db url
- Go to `packages/db`
    - npx prisma migrate dev
    - npx prisma db seed
- Go to the repo , run `turbo run dev --no-cache`
- Try logging in using phone - 1111111111 , password - alice (See `seed.ts`)