import { Story, Meta } from '@storybook/react'
import Highlight, { HighlightProps } from '.'
import item from './mock'

export default {
  title: 'Highlight',
  component: Highlight,
  args: { ...item },
  parameters: {
    layout: 'fullscreen'
  }
} as Meta

export const Default: Story<HighlightProps> = (args) => <Highlight {...args} />

export const FloatImage: Story<HighlightProps> = (args) => (
  <Highlight {...args} floatImage="img/float-image.png" />
)
