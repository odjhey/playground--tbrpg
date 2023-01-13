## init repo with below

```sh
yarn create vite # web side
npx fastify-cli generate api --lang=ts # api side
# then setup trpc
```

## todo

- fix test on both sides

## core concepts

### components

components or component groups

- have own state
- have signal handlers

### system
- have components
- sends signals to components
