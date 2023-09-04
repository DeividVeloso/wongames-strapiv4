import styled, { css, DefaultTheme } from 'styled-components'
import { RibbonColors, RibbonProps } from '.'
import { darken } from 'polished'

const wrapperModifiers = {
  color: (theme: DefaultTheme, color: RibbonColors) => `
    background-color: ${theme.colors[color]};

    &::before {
      border-left-color: ${darken(0.2, theme.colors[color])};
      border-top-color: ${darken(0.2, theme.colors[color])};
    }
  `,
  normal: (theme: DefaultTheme) => `
    height: 3.6rem;
    font-size: ${theme.font.sizes.small};

    padding: 0 ${theme.spacings.small};
    right: -2rem;

    &::before {
      top: 3.6rem;
      border-top-width: 1rem;
      border-right-width: 2rem;
    }
  `,
  small: (theme: DefaultTheme) => `
    height: 2.6rem;
    font-size: ${theme.font.sizes.xsmall};

    padding: 0 ${theme.spacings.xsmall};
    right: -1.5rem;

    &::before {
      top: 2.6rem;
      border-top-width: 0.7rem;
      border-right-width: 1.5rem;
    }
  `
}

export const Wrapper = styled.div<Omit<RibbonProps, 'children'>>`
  ${({ theme, color, size }) => css`
    position: absolute;
    top: ${theme.spacings.xsmall};
    right: -16px;

    font-weight: ${theme.font.bold};
    color: ${theme.colors.white};
    z-index: ${theme.layers.base};

    display: flex;
    align-items: center;

    &::before {
      content: '';
      position: absolute;
      right: 0;
      border-style: solid;
      border-bottom-width: 1rem;
      border-left-width: 0rem;
      border-right-color: transparent;
      border-bottom-color: transparent;
    }

    ${!!size && wrapperModifiers[size](theme)};
    ${!!color && wrapperModifiers.color(theme, color)};
  `}
`
