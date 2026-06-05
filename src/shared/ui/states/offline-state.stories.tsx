import type { Meta, StoryObj } from '@storybook/react'
import { OfflineState } from './offline-state'

const meta: Meta<typeof OfflineState> = {
  title: 'UI/States/OfflineState',
  component: OfflineState,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['full', 'banner'] },
  },
}

export default meta
type Story = StoryObj<typeof OfflineState>

export const Full: Story = { args: { variant: 'full' } }
export const Banner: Story = { args: { variant: 'banner' } }
