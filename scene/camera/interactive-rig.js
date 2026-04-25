export const SLIDE_ANCHORS = [
  { pos: [9.8, 3.2, 10.5], look: [0, 1.8, 0] },
  { pos: [-10.3, 2.8, 8.8], look: [-1.4, 1.2, -0.6] },
  { pos: [6.5, 1.9, -11.4], look: [0.5, 1.3, -2.6] },
  { pos: [-7.6, 2.3, -10.2], look: [-0.8, 1.4, -1.9] },
  { pos: [0.2, 3.7, 13.4], look: [0, 1.4, 0] }
];

export const createInteractiveRig = (THREE, options = {}) => {
  const anchors = options.anchors || SLIDE_ANCHORS;

  const update = (slideIndex, pointer, target) => {
    const anchor = anchors[slideIndex] || anchors[0];
    target.pos.set(...anchor.pos);
    target.look.set(...anchor.look);

    target.pos.x += pointer.x * 0.9;
    target.pos.y += -pointer.y * 0.35;
    target.look.x += pointer.x * 0.45;
    target.look.y += -pointer.y * 0.18;
  };

  return { update, anchors };
};
