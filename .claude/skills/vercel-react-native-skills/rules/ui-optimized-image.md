---
title: Use Optimized Image Component
impact: HIGH
impactDescription: memory efficiency, caching, progressive loading
tags: images, performance, ui
---

## Use Optimized Image for Lists

Use a caching image component instead of React Native's built-in `Image` for lists. Use `react-native-fast-image` for bare workflow.

**Incorrect (React Native Image in lists):**

```tsx
import { Image } from 'react-native'

function Avatar({ url }: { url: string }) {
  return <Image source={{ uri: url }} style={styles.avatar} />
}
```

**Correct (react-native-fast-image):**

```tsx
import FastImage from 'react-native-fast-image'

function Avatar({ url }: { url: string }) {
  return <FastImage source={{ uri: url }} style={styles.avatar} />
}
```

**With priority:**

```tsx
<FastImage
  source={{ uri: url, priority: FastImage.priority.high }}
  style={styles.hero}
/>
```

For bare workflow: use `react-native-fast-image` for caching. For managed workflow: use the SDK's built-in image component with caching support.
