import React from 'react';
import PropTypes from 'prop-types';
import { useGesture } from 'react-use-gesture';
import { useSpring, animated, config, interpolate } from 'react-spring';

const limit = (max, min, scale) => (scale > max ? max : scale < min ? min : scale);

const Panzoom = ({ children, maxZoom = 8, minZoom = 0.2 }) => {
  const [{ xy, scale }, set] = useSpring(() => ({
    xy: [0, 0],
    scale: 1,
    config: config.default
  }));
  const pan = useGesture({
    onDrag: ({ local }) => set({ xy: local })
  });
  const zoom = useGesture({
    onWheel: ({ xy: [, y], previous: [, lastY] }) => {
      let s = scale.getValue();
      let diff = -(y - lastY);
      set({ scale: limit(maxZoom, minZoom, s + (diff / 50) * s) });
    }
  });

  return (
    <div
      style={{
        overflow: 'hidden',
        height: '100vh',
        width: '100vw'
      }}
      {...pan()}
    >
      <animated.div
        {...zoom()}
        style={{
          transform: interpolate(
            [xy, scale],
            ([x, y], scale) => `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          )
        }}
      >
        {children}
      </animated.div>
    </div>
  );
};

Panzoom.propTypes = {
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number
};

export default Panzoom;
