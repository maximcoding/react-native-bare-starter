/**
 * @format
 */

import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import ReactTestRenderer, { act } from 'react-test-renderer'
import { Activity } from '@/shared/components/ui/Activity'

test('Activity keeps child mounted when hidden (same React subtree)', async () => {
  let effectRuns = 0
  function Child() {
    useEffect(() => {
      effectRuns += 1
    }, [])
    return <Text testID="child">child</Text>
  }

  function Harness() {
    const [visible, setVisible] = useState(true)
    return (
      <>
        <Activity visible={visible}>
          <Child />
        </Activity>
        <Text testID="toggle" onPress={() => setVisible(v => !v)}>
          toggle
        </Text>
      </>
    )
  }

  let renderer: ReactTestRenderer.ReactTestRenderer
  await act(async () => {
    renderer = ReactTestRenderer.create(<Harness />)
  })

  expect(effectRuns).toBe(1)
  expect(renderer!.root.findByProps({ testID: 'child' })).toBeDefined()

  await act(async () => {
    renderer!.root.findByProps({ testID: 'toggle' }).props.onPress()
  })

  expect(effectRuns).toBe(1)
  expect(renderer!.root.findByProps({ testID: 'child' })).toBeDefined()
})
