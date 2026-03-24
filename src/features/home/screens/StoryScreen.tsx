// src/features/home/screens/StoryScreen.tsx

import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useRef, useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import Svg, { Path, Polyline } from 'react-native-svg'
import WebView from 'react-native-webview'
import type { RootStackParamList } from '@/navigation/root-param-list'
import { ROUTES } from '@/navigation/routes'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.HOME_STORY>

const HN_ITEM_BASE = 'https://news.ycombinator.com/item?id='

export default function StoryScreen({ route, navigation }: Props) {
  const { id, title, url, domain } = route.params
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const ty = theme.typography
  const r = theme.radius

  const uri = url ?? `${HN_ITEM_BASE}${id}`
  const displayHost = domain ?? 'news.ycombinator.com'

  const [loading, setLoading] = useState(true)
  const [canGoBack, setCanGoBack] = useState(false)
  const webViewRef = useRef<WebView>(null)

  const iconProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: c.textPrimary,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  function handleBack() {
    if (canGoBack) {
      webViewRef.current?.goBack()
    } else {
      navigation.goBack()
    }
  }

  return (
    <ScreenWrapper
      header={
        <View
          style={{
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: sp.md,
            backgroundColor: c.background,
            borderBottomWidth: 1,
            borderBottomColor: c.border,
            gap: sp.xs,
          }}
        >
          {/* Back / WebView back */}
          <Pressable
            onPress={handleBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={canGoBack ? 'Go back in page' : 'Back to feed'}
            style={{ padding: sp.xs }}
          >
            <Svg {...iconProps}>
              <Polyline points="15 18 9 12 15 6" />
            </Svg>
          </Pressable>

          {/* Close (always goes to feed) */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={[ty.labelMedium, { color: c.textSecondary }]}
              numberOfLines={1}
            >
              {displayHost}
            </Text>
          </View>

          {/* Close button */}
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Close article"
            style={{
              padding: sp.xs,
              backgroundColor: c.surfaceSecondary,
              borderRadius: r.pill,
            }}
          >
            <Svg {...iconProps} stroke={c.textTertiary}>
              <Path d="M18 6 6 18M6 6l12 12" />
            </Svg>
          </Pressable>
        </View>
      }
    >
      <WebView
        ref={webViewRef}
        source={{ uri }}
        style={{ flex: 1, backgroundColor: c.background }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={state => setCanGoBack(state.canGoBack)}
        allowsBackForwardNavigationGestures
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
        startInLoadingState={false}
      />

      {/* Loading bar */}
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: c.primaryAmbient,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: c.primary,
              opacity: 0.8,
            }}
          />
          <ActivityIndicator
            size="small"
            color={c.primary}
            style={{ position: 'absolute', right: sp.md, top: -8 }}
          />
        </View>
      )}
    </ScreenWrapper>
  )
}
