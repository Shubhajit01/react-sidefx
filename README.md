# react-sidefx

A collection of React primitives for managing side effects — built for React 19 with Suspense, concurrent features, and modern patterns in mind.

## Philosophy

Most side effect patterns in React are either too low-level (raw `useEffect`) or too opinionated (full data-fetching libraries). `react-sidefx` sits in between — small, composable primitives that do one thing well and get out of your way.

## Installation

```bash
npm install react-sidefx
```

## What's inside

### `createResource`

A Suspense-native async primitive with built-in caching. No loading states, no `useEffect`, no boilerplate — just your data.

```tsx
import { createResource } from "react-sidefx";
import { Suspense } from "react";

const userResource = createResource(getUser, "user");

function UserProfile() {
  const user = userResource.use("user-123");
  return <h1>{user.name}</h1>;
}

export default function App() {
  return (
    <Suspense fallback="Loading...">
      <UserProfile />
    </Suspense>
  );
}
```

## Requirements

- React 19+
- TypeScript 5+ (recommended)

## License

MIT
