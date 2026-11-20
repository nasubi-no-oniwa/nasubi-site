// 縦書きの「…」は、端末や書体によって横向きに出てしまう。文字に頼らず、点を3つ縦に描いて置きかえる（横書きの言葉ではそのまま）
let VERT = true;
export const setVertical = (v) => { VERT = v; };
export const DOTS = '<span class="dots">口</span>';
export const dots = (s) => (VERT ? s.replace(/…/g, DOTS) : s);
