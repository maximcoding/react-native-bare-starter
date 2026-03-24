// src/features/settings/screens/LanguagePickerModal.tsx

import React, { useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import i18n from '@/i18n/i18n'
import { useT } from '@/i18n/useT'
import { goBack } from '@/navigation/helpers/navigation-helpers'
import HalfSheet from '@/navigation/modals/half-sheet'
import { IconName } from '@assets/icons'
import { IconSvg } from '@/shared/components/ui/IconSvg'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

const LANGUAGE_OPTIONS: {
  code: string
  labelKey:
    | 'settings.language.english'
    | 'settings.language.russian'
    | 'settings.language.german'
  abbr: string
}[] = [
  { code: 'en', labelKey: 'settings.language.english', abbr: 'EN' },
  { code: 'ru', labelKey: 'settings.language.russian', abbr: 'RU' },
  { code: 'de', labelKey: 'settings.language.german', abbr: 'DE' },
]

export default function LanguagePickerModal() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const currentLang = i18n.language

  const handleClose = useCallback(() => goBack(), [])

  const handleSelect = useCallback((code: string) => {
    i18n.changeLanguage(code)
    goBack()
  }, [])

  return (
    <HalfSheet onClose={handleClose}>
      {/* Title */}
      <Text
        style={[ty.titleMedium, { color: c.textPrimary, marginBottom: sp.md }]}
      >
        {t('settings.language.label')}
      </Text>

      {/* Options */}
      <View style={{ gap: sp.xs }}>
        {LANGUAGE_OPTIONS.map(opt => {
          const selected = currentLang === opt.code
          return (
            <Pressable
              key={opt.code}
              onPress={() => handleSelect(opt.code)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: selected
                    ? c.primaryAmbient
                    : pressed
                      ? c.surfaceSecondary
                      : c.surface,
                  borderColor: selected ? c.primary : c.border,
                  borderRadius: r.xl,
                  paddingVertical: sp.md,
                  paddingHorizontal: sp.md,
                },
              ]}
            >
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: c.surfaceSecondary,
                    borderRadius: r.sm,
                    paddingHorizontal: sp.xs,
                    paddingVertical: sp.xxs,
                  },
                ]}
              >
                <Text style={[ty.labelSmall, { color: c.textSecondary }]}>
                  {opt.abbr}
                </Text>
              </View>
              <Text
                style={[
                  ty.bodyMedium,
                  {
                    flex: 1,
                    color: selected ? c.primary : c.textPrimary,
                    marginLeft: sp.sm,
                  },
                ]}
              >
                {t(opt.labelKey)}
              </Text>
              {selected ? (
                <IconSvg name={IconName.CHECK} size={18} color={c.primary} style={{ width: 18, height: 18 }} />
              ) : null}
            </Pressable>
          )
        })}
      </View>
    </HalfSheet>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
