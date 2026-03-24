// src/features/uikit/screens/UIKitScreen.tsx

import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconName } from '@assets/icons'
import { useT } from '@/i18n/useT'
import { Activity } from '@/shared/components/ui/Activity'
import { Button } from '@/shared/components/ui/Button'
import { IconSvg } from '@/shared/components/ui/IconSvg'
import { ScreenHeader } from '@/shared/components/ui/ScreenHeader'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { SuspenseBoundary } from '@/shared/components/ui/SuspenseBoundary'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

const ALL_ICONS: IconName[] = [
  IconName.HOME,
  IconName.SETTINGS,
  IconName.USER,
  IconName.CHECK,
  IconName.SUN,
  IconName.MOON,
  IconName.GLOBE,
  IconName.INFO,
  IconName.LOGOUT,
  IconName.LAYERS,
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme()
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text
        style={[
          theme.typography.caps,
          { color: theme.colors.textTertiary, paddingHorizontal: theme.spacing.xxs },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.xl,
            padding: theme.spacing.md,
            gap: theme.spacing.sm,
            ...theme.elevation.card,
          },
        ]}
      >
        {children}
      </View>
    </View>
  )
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  const { theme } = useTheme()
  return (
    <View style={[styles.swatchRow, { gap: theme.spacing.sm }]}>
      <View
        style={[
          styles.swatch,
          {
            backgroundColor: color,
            borderRadius: theme.radius.sm,
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
        ]}
      />
      <Text style={[theme.typography.labelSmall, { color: theme.colors.textSecondary, flex: 1 }]}>
        {label}
      </Text>
      <Text style={[theme.typography.mono, { color: theme.colors.textTertiary }]}>
        {color}
      </Text>
    </View>
  )
}

export default function UIKitScreen() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const ty = theme.typography

  const [activityVisible, setActivityVisible] = useState(true)
  const [loadingBtn, setLoadingBtn] = useState(false)

  const simulateLoading = () => {
    setLoadingBtn(true)
    setTimeout(() => setLoadingBtn(false), 2000)
  }

  return (
    <ScreenWrapper scroll header={<ScreenHeader title={t('uikit.title')} />}>
      <View style={{ padding: sp.lg, gap: sp.xl }}>

        {/* ── Buttons ── */}
        <Section title={t('uikit.section_buttons')}>
          <Button title="Primary" variant="primary" size="lg" onPress={() => {}} />
          <Button title="Secondary" variant="secondary" size="lg" onPress={() => {}} />
          <Button title="Outline" variant="outline" size="lg" onPress={() => {}} />
          <View style={[styles.row, { gap: sp.sm }]}>
            <View style={{ flex: 1 }}>
              <Button title="Medium" variant="primary" size="md" onPress={() => {}} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Disabled" variant="primary" size="md" disabled onPress={() => {}} />
            </View>
          </View>
          <Button
            title={loadingBtn ? 'Loading…' : 'Tap to load'}
            variant="secondary"
            size="md"
            loading={loadingBtn}
            onPress={simulateLoading}
          />
        </Section>

        {/* ── Typography ── */}
        <Section title={t('uikit.section_typography')}>
          {([
            ['displayLarge', 'Display Large'],
            ['displayMedium', 'Display Medium'],
            ['headlineLarge', 'Headline Large'],
            ['headlineMedium', 'Headline Medium'],
            ['headlineSmall', 'Headline Small'],
            ['titleLarge', 'Title Large'],
            ['titleMedium', 'Title Medium'],
            ['bodyLarge', 'Body Large'],
            ['bodyMedium', 'Body Medium'],
            ['bodySmall', 'Body Small'],
            ['labelLarge', 'Label Large'],
            ['labelMedium', 'Label Medium'],
            ['labelSmall', 'Label Small'],
            ['caps', 'CAPS LABEL'],
            ['mono', 'mono / code'],
          ] as const).map(([scale, sample]) => (
            <View
              key={scale}
              style={[
                styles.typographyRow,
                {
                  paddingVertical: sp.xs,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: c.divider,
                },
              ]}
            >
              <Text style={[ty[scale], { color: c.textPrimary, flex: 1 }]}>{sample}</Text>
              <Text style={[ty.labelSmall, { color: c.textTertiary }]}>{scale}</Text>
            </View>
          ))}
        </Section>

        {/* ── Icons ── */}
        <Section title={t('uikit.section_icons')}>
          <View style={[styles.iconGrid, { gap: sp.md }]}>
            {ALL_ICONS.map(name => (
              <View key={name} style={[styles.iconCell, { gap: sp.xxs }]}>
                <View
                  style={[
                    styles.iconBadge,
                    {
                      backgroundColor: c.surfaceSecondary,
                      borderRadius: theme.radius.md,
                      padding: sp.sm,
                    },
                  ]}
                >
                  <IconSvg name={name} size={22} color={c.primary} />
                </View>
                <Text
                  style={[ty.labelSmall, { color: c.textTertiary, textAlign: 'center' }]}
                  numberOfLines={1}
                >
                  {name.toLowerCase()}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        {/* ── Surfaces & States ── */}
        <Section title={t('uikit.section_surfaces')}>
          {/* Color swatches */}
          <Text style={[ty.labelMedium, { color: c.textSecondary }]}>Theme Colors</Text>
          <ColorSwatch color={c.primary} label="primary" />
          <ColorSwatch color={c.success} label="success" />
          <ColorSwatch color={c.danger} label="danger" />
          <ColorSwatch color={c.warning} label="warning" />
          <ColorSwatch color={c.info} label="info" />

          <View style={{ height: 1, backgroundColor: c.divider, marginVertical: sp.xs }} />

          {/* Activity toggle */}
          <Text style={[ty.labelMedium, { color: c.textSecondary }]}>Activity (visibility toggle)</Text>
          <Button
            title={activityVisible ? 'Hide content' : 'Show content'}
            variant="outline"
            size="md"
            onPress={() => setActivityVisible(v => !v)}
          />
          <Activity visible={activityVisible}>
            <View
              style={{
                backgroundColor: c.primaryAmbient,
                borderRadius: theme.radius.lg,
                padding: sp.md,
              }}
            >
              <Text style={[ty.bodySmall, { color: c.primary }]}>
                This content is toggled by Activity
              </Text>
            </View>
          </Activity>

          <View style={{ height: 1, backgroundColor: c.divider, marginVertical: sp.xs }} />

          {/* SuspenseBoundary fallback demo */}
          <Text style={[ty.labelMedium, { color: c.textSecondary }]}>SuspenseBoundary</Text>
          <SuspenseBoundary loadingLabel="Loading components…">
            <View
              style={{
                backgroundColor: c.surfaceSecondary,
                borderRadius: theme.radius.lg,
                padding: sp.md,
              }}
            >
              <Text style={[ty.bodySmall, { color: c.textPrimary }]}>
                Content resolved from Suspense
              </Text>
            </View>
          </SuspenseBoundary>
        </Section>

      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  typographyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconCell: {
    width: '20%',
    alignItems: 'center',
  },
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatch: {
    width: 28,
    height: 28,
  },
})
