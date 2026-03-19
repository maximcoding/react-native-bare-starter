---
title: Use Galeria for Image Galleries and Lightbox
impact: MEDIUM
impactDescription:
  native shared element transitions, pinch-to-zoom, pan-to-close
tags: images, gallery, lightbox, ui
---

## Use Galeria for Image Galleries and Lightbox

For image galleries with lightbox (tap to fullscreen), use `@nandorojo/galeria`.
It provides native shared element transitions with pinch-to-zoom, double-tap
zoom, and pan-to-close. Works with any image component including `react-native-fast-image` or built-in `Image`.

**Incorrect (custom modal implementation):**

```tsx
function ImageGallery({ urls }: { urls: string[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      {urls.map((url) => (
        <Pressable key={url} onPress={() => setSelected(url)}>
          <Image source={{ uri: url }} style={styles.thumbnail} />
        </Pressable>
      ))}
      <Modal visible={!!selected} onRequestClose={() => setSelected(null)}>
        <Image source={{ uri: selected! }} style={styles.fullscreen} />
      </Modal>
    </>
  )
}
```

**Correct (Galeria with Image):**

```tsx
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'react-native'

function ImageGallery({ urls }: { urls: string[] }) {
  return (
    <Galeria urls={urls}>
      {urls.map((url, index) => (
        <Galeria.Image index={index} key={url}>
          <Image source={{ uri: url }} style={styles.thumbnail} />
        </Galeria.Image>
      ))}
    </Galeria>
  )
}
```

**Single image:**

```tsx
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'react-native'

function Avatar({ url }: { url: string }) {
  return (
    <Galeria urls={[url]}>
      <Galeria.Image>
        <Image source={{ uri: url }} style={styles.avatar} />
      </Galeria.Image>
    </Galeria>
  )
}
```

**With low-res thumbnails and high-res fullscreen:**

```tsx
<Galeria urls={highResUrls}>
  {lowResUrls.map((url, index) => (
    <Galeria.Image index={index} key={url}>
      <Image source={{ uri: url }} style={styles.thumbnail} />
    </Galeria.Image>
  ))}
</Galeria>
```

**With FlashList:**

```tsx
<Galeria urls={urls}>
  <FlashList
    data={urls}
    renderItem={({ item, index }) => (
      <Galeria.Image index={index}>
        <Image source={{ uri: item }} style={styles.thumbnail} />
      </Galeria.Image>
    )}
    numColumns={3}
    estimatedItemSize={100}
  />
</Galeria>
```

Works with `react-native` Image, `react-native-fast-image`, or any image
component.

Reference: [Galeria](https://github.com/nandorojo/galeria)
