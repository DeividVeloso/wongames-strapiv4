import styled, { css } from 'styled-components'
import media from 'styled-media-query'
import { GameCardSliderProps } from '.'

export type WrapperProps = Pick<GameCardSliderProps, 'color'>

export const Wrapper = styled.main<WrapperProps>`
  ${({ theme, color }) => css`
    ${media.lessThan('huge')`
      overflow-x: hidden;
    `}

    .slick-track,
    .slick-list {
      diaply: flex;
    }

    .slick-slide > div {
      margin: 0 ${theme.spacings.xxsmall};
      flex: 1 0 auto;
      height: 100%;
    }

    .slick-list {
      margin: 0 -${theme.spacings.xxsmall};
    }

    ${media.greaterThan('large')`
      .slick-slide > div {
        margin: 0 ${theme.spacings.xsmall};
      }

      .slick-list {
        margin: 0 -${theme.spacings.xsmall};
      }
    `}

    .slick-prev,
    .slick-next {
      display: block;
      color: ${theme.colors[color!]};
      width: 2.5rem;
      height: 2.5rem;
      cursor: pointer;
      position: absolute;
      top: 50%;
      padding: 0;
      transform: translate(0, -50%);
      z-index: ${theme.layers.base};
    }

    .slick-prev {
      left: -${theme.spacings.xxlarge};
    }

    .slick-next {
      right: -${theme.spacings.xxlarge};
    }

    .slick-prev.slick-disabled,
    .slick-next.slick-disabled {
      visibility: hidden;
    }
  `}
`
