import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock WebGL context
const mockWebGLContext = {
  getParameter: () => {},
  getExtension: () => null,
  createShader: () => {},
  createProgram: () => {},
  createBuffer: () => {},
  createTexture: () => {},
  createFramebuffer: () => {},
  createRenderbuffer: () => {},
  createVertexArray: () => {},
  bindBuffer: () => {},
  bindTexture: () => {},
  bindFramebuffer: () => {},
  bindRenderbuffer: () => {},
  bindVertexArray: () => {},
  shaderSource: () => {},
  compileShader: () => {},
  attachShader: () => {},
  linkProgram: () => {},
  useProgram: () => {},
  enable: () => {},
  disable: () => {},
  viewport: () => {},
  clear: () => {},
  clearColor: () => {},
  drawArrays: () => {},
  drawElements: () => {},
  bufferData: () => {},
  texImage2D: () => {},
  texParameteri: () => {},
  framebufferTexture2D: () => {},
  renderbufferStorage: () => {},
  framebufferRenderbuffer: () => {},
  checkFramebufferStatus: () => 36053, // FRAMEBUFFER_COMPLETE
  getShaderParameter: () => true,
  getProgramParameter: () => true,
  getShaderInfoLog: () => '',
  getProgramInfoLog: () => '',
  getAttribLocation: () => 0,
  getUniformLocation: () => {},
  uniform1f: () => {},
  uniform2f: () => {},
  uniform3f: () => {},
  uniform4f: () => {},
  uniform1i: () => {},
  uniformMatrix4fv: () => {},
  vertexAttribPointer: () => {},
  enableVertexAttribArray: () => {},
  createVertexArray: () => {},
  bindVertexArray: () => {},
  deleteShader: () => {},
  deleteProgram: () => {},
  deleteBuffer: () => {},
  deleteTexture: () => {},
  deleteFramebuffer: () => {},
  deleteRenderbuffer: () => {},
  deleteVertexArray: () => {}
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockWebGLContext);
