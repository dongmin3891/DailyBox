# Pages Directory

This empty `pages` directory exists to prevent Next.js from trying to use `src/pages` as the Pages Router when using the App Router.

## Why is this necessary?

When using Next.js App Router with Feature-Sliced Design (FSD), there's a conflict:

-   Next.js expects the `app` folder to define routes and expects a flat structure
-   FSD requires a layered structure that doesn't align with Next.js routing expectations

## Solution

1. **App Router**: Moved to project root (`/app`) for Next.js routing
2. **FSD Layers**: Kept in `src/` with proper layer separation
3. **Empty Pages**: This directory prevents Next.js from using `src/pages` as Pages Router

## FSD Structure

The actual page logic lives in the FSD structure:

```
src/
├── 02-pages/         # FSD Pages Layer (business logic)
├── 03-widgets/       # UI composition
├── 04-features/      # Business features
├── 05-entities/      # Domain models
└── 06-shared/        # Shared utilities
```

## References

-   [FSD + Next.js Official Guide](https://feature-sliced.design/docs/guides/tech/with-nextjs)
-   [Feature-Sliced Design Documentation](https://feature-sliced.design/)
