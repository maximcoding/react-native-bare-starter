// src/features/home/screens/HomeScreen.tsx

import { FlashList } from '@shopify/flash-list'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import { Animated, Platform, Pressable, ScrollView, View } from 'react-native'
import { useFeedQuery } from '@/features/home/hooks/useFeedQuery'
import type { FeedItem } from '@/features/home/types'
import { useT } from '@/i18n/useT'
import type { RootStackParamList } from '@/navigation/root-param-list'
import { ROUTES } from '@/navigation/routes'
import { ScreenHeader } from '@/shared/components/ui/ScreenHeader'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { useTheme } from '@/shared/theme/useTheme'

type HomeNavProp = NativeStackNavigationProp<RootStackParamList>

const TAB_BAR_CLEARANCE = 88

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────
function useShimmer() {
  const anim = useRef(new Animated.Value(0.4)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [anim])
  return anim
}

function SkeletonCard({ shimmer }: { shimmer: Animated.Value }) {
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  return (
    <View
      style={{
        marginHorizontal: sp.lg,
        marginBottom: sp.xs,
        backgroundColor: c.surface,
        borderRadius: r.xl,
        borderWidth: 1,
        borderColor: c.border,
        paddingHorizontal: sp.md,
        paddingVertical: sp.md,
        gap: sp.xs,
      }}
    >
      <Animated.View style={{ opacity: shimmer, gap: sp.xs }}>
        <View style={{ height: 15, width: '85%', borderRadius: r.sm, backgroundColor: c.surfaceSecondary }} />
        <View style={{ height: 13, width: '60%', borderRadius: r.sm, backgroundColor: c.surfaceSecondary }} />
        <View style={{ height: 11, width: '45%', borderRadius: r.sm, backgroundColor: c.surfaceSecondary }} />
      </Animated.View>
    </View>
  )
}

function HomeScreenSkeleton() {
  const { theme } = useTheme()
  const shimmer = useShimmer()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE, backgroundColor: c.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <Animated.View
        style={{
          opacity: shimmer,
          paddingHorizontal: sp.lg,
          paddingTop: sp.lg,
          paddingBottom: sp.md,
          gap: sp.xs,
        }}
      >
        <View style={{ height: 12, width: 100, borderRadius: r.sm, backgroundColor: c.surfaceSecondary }} />
        <View style={{ height: 28, width: 200, borderRadius: r.md, backgroundColor: c.surfaceSecondary }} />
      </Animated.View>

      {/* Section header */}
      <Animated.View
        style={{
          opacity: shimmer,
          height: 11,
          width: 80,
          borderRadius: r.sm,
          backgroundColor: c.surfaceSecondary,
          marginHorizontal: sp.lg,
          marginBottom: sp.sm,
        }}
      />

      {/* Story card skeletons */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <SkeletonCard key={i} shimmer={shimmer} />
      ))}
    </ScrollView>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useGreetingKey():
  | 'home.greeting_morning'
  | 'home.greeting_afternoon'
  | 'home.greeting_evening' {
  const h = new Date().getHours()
  if (h < 12) return 'home.greeting_morning'
  if (h < 17) return 'home.greeting_afternoon'
  return 'home.greeting_evening'
}

function dotColor(
  type: FeedItem['type'],
  c: ReturnType<typeof useTheme>['theme']['colors'],
): string {
  switch (type) {
    case 'success': return c.success
    case 'task':    return c.primary
    case 'message': return c.info
    case 'alert':   return c.warning
  }
}

// ─── Greeting ─────────────────────────────────────────────────────────────────
function GreetingSection({
  greetingKey,
}: {
  greetingKey: ReturnType<typeof useGreetingKey>
}) {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const ty = theme.typography
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <View style={{ paddingHorizontal: sp.lg, paddingTop: sp.lg, paddingBottom: sp.md, gap: sp.xxs }}>
      <Text style={[ty.bodySmall, { color: c.textTertiary }]}>{today}</Text>
      <Text style={[ty.displaySmall, { color: c.textPrimary }]}>{t(greetingKey)}</Text>
    </View>
  )
}

// ─── Section header with optional sync status ─────────────────────────────────
function SectionHeader({
  label,
  sublabel,
  sublabelIsOffline,
}: {
  label: string
  sublabel?: string | null
  sublabelIsOffline?: boolean
}) {
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: sp.lg,
        paddingBottom: sp.xs,
        gap: sp.xs,
      }}
    >
      <Text style={[ty.caps, { color: c.textTertiary, flex: 1 }]}>{label}</Text>
      {sublabel ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: sublabelIsOffline ? c.warning + '22' : c.success + '22',
            borderRadius: r.pill,
            paddingHorizontal: sp.xs,
            paddingVertical: 2,
            gap: 4,
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: sublabelIsOffline ? c.warning : c.success,
            }}
          />
          <Text style={[ty.labelSmall, { color: sublabelIsOffline ? c.warning : c.success }]}>
            {sublabel}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

// ─── News story card ──────────────────────────────────────────────────────────
const StoryCard = memo(function StoryCard({ item }: { item: FeedItem }) {
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography
  const accent = dotColor(item.type, c)
  const navigation = useNavigation<HomeNavProp>()

  const onPress = useCallback(() => {
    navigation.navigate(ROUTES.HOME_STORY, {
      id: item.id,
      title: item.title,
      url: item.url,
      points: item.points,
      author: item.author,
      numComments: item.numComments,
      time: item.time,
      domain: item.subtitle ?? undefined,
    })
  }, [navigation, item])

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      style={({ pressed }) => ({
        marginHorizontal: sp.lg,
        marginBottom: sp.xs,
        backgroundColor: pressed ? c.surfaceSecondary : c.surface,
        borderRadius: r.xl,
        borderWidth: 1,
        borderColor: c.border,
        paddingHorizontal: sp.md,
        paddingVertical: sp.md,
        gap: sp.xs,
        ...Platform.select({ ios: { ...theme.elevation.card }, android: { elevation: 1 } }),
      })}
    >
      <Text
        style={[ty.titleSmall, { color: c.textPrimary, lineHeight: ty.titleSmall.fontSize * 1.35 }]}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: sp.xs }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: accent }} />
        <Text style={[ty.labelSmall, { color: c.textTertiary, flex: 1 }]} numberOfLines={1}>
          {item.subtitle}
        </Text>
        {item.points != null && (
          <>
            <Text style={[ty.labelSmall, { color: c.textTertiary }]}>{'·'}</Text>
            <Text style={[ty.labelSmall, { color: c.textTertiary }]}>{`▲ ${item.points}`}</Text>
          </>
        )}
        {item.numComments != null && (
          <>
            <Text style={[ty.labelSmall, { color: c.textTertiary }]}>{'·'}</Text>
            <Text style={[ty.labelSmall, { color: c.textTertiary }]}>{`${item.numComments} comments`}</Text>
          </>
        )}
        <Text style={[ty.labelSmall, { color: c.textTertiary }]}>{'·'}</Text>
        <Text style={[ty.labelSmall, { color: c.textTertiary }]}>{item.time}</Text>
      </View>
    </Pressable>
  )
})

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const greetingKey = useGreetingKey()

  const { feed, isLoading: feedLoading, isRefetching, refetch, hasCache, syncedAtLabel } =
    useFeedQuery()
  const { isOffline } = useOnlineStatus()

  const sublabel = isOffline
    ? syncedAtLabel ? `Offline · ${syncedAtLabel}` : 'Offline'
    : syncedAtLabel ? `Synced ${syncedAtLabel}` : null

  const ListHeader = useCallback(
    () => (
      <>
        <GreetingSection greetingKey={greetingKey} />
        <SectionHeader
          label={t('home.recent_activity')}
          sublabel={sublabel}
          sublabelIsOffline={isOffline}
        />
      </>
    ),
    [greetingKey, t, sublabel, isOffline],
  )

  const ListFooter = useCallback(
    () => <View style={{ height: TAB_BAR_CLEARANCE }} />,
    [],
  )

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => <StoryCard item={item} />,
    [],
  )
  const keyExtractor = useCallback((item: FeedItem) => item.id, [])

  return (
    <ScreenWrapper header={<ScreenHeader title={t('home.title')} />}>
      {feedLoading && !hasCache ? (
        <HomeScreenSkeleton />
      ) : (
        <FlashList
          data={feed}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: c.background }}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </ScreenWrapper>
  )
}
