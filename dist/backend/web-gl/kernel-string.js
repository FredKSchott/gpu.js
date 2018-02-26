'use strict';

var utils = require('../../core/utils');
var kernelRunShortcut = require('../kernel-run-shortcut');

function removeFnNoise(fn) {
  if (/^function /.test(fn)) {
    fn = fn.substring(9);
  }
  return fn.replace(/[_]typeof/g, 'typeof');
}

function removeNoise(str) {
  return str.replace(/[_]typeof/g, 'typeof');
}

module.exports = function (gpuKernel, name) {
  return '() => {\n    ' + kernelRunShortcut.toString() + ';\n    const utils = {\n      allPropertiesOf: ' + removeNoise(utils.allPropertiesOf.toString()) + ',\n      clone: ' + removeNoise(utils.clone.toString()) + ',\n      splitArray: ' + removeNoise(utils.splitArray.toString()) + ',\n      getArgumentType: ' + removeNoise(utils.getArgumentType.toString()) + ',\n      getDimensions: ' + removeNoise(utils.getDimensions.toString()) + ',\n      dimToTexSize: ' + removeNoise(utils.dimToTexSize.toString()) + ',\n      flattenTo: ' + removeNoise(utils.flattenTo.toString()) + ',\n      flatten2dArrayTo: ' + removeNoise(utils.flatten2dArrayTo.toString()) + ',\n      flatten3dArrayTo: ' + removeNoise(utils.flatten3dArrayTo.toString()) + ',\n      systemEndianness: \'' + removeNoise(utils.systemEndianness()) + '\',\n      initWebGl: ' + removeNoise(utils.initWebGl.toString()) + ',\n      isArray: ' + removeNoise(utils.isArray.toString()) + '\n    };\n    const Utils = utils;\n    const canvases = [];\n    const maxTexSizes = {};\n    class ' + (name || 'Kernel') + ' {\n      constructor() {\n        this.maxTexSize = null;\n        this.argumentsLength = 0;\n        this._canvas = null;\n        this._webGl = null;\n        this.built = false;\n        this.program = null;\n        this.paramNames = ' + JSON.stringify(gpuKernel.paramNames) + ';\n        this.paramTypes = ' + JSON.stringify(gpuKernel.paramTypes) + ';\n        this.texSize = ' + JSON.stringify(gpuKernel.texSize) + ';\n        this.output = ' + JSON.stringify(gpuKernel.output) + ';\n        this.compiledFragShaderString = `' + gpuKernel.compiledFragShaderString + '`;\n\t\t    this.compiledVertShaderString = `' + gpuKernel.compiledVertShaderString + '`;\n\t\t    this.programUniformLocationCache = {};\n\t\t    this.textureCache = {};\n\t\t    this.subKernelOutputTextures = null;\n      }\n      ' + removeFnNoise(gpuKernel._getFragShaderString.toString()) + '\n      ' + removeFnNoise(gpuKernel._getVertShaderString.toString()) + '\n      validateOptions() {}\n      setupParams() {}\n      setCanvas(canvas) { this._canvas = canvas; return this; }\n      setWebGl(webGl) { this._webGl = webGl; return this; }\n      ' + removeFnNoise(gpuKernel.getUniformLocation.toString()) + '\n      ' + removeFnNoise(gpuKernel.setupParams.toString()) + '\n      ' + removeFnNoise(gpuKernel.build.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.run.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel._addArgument.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.getArgumentTexture.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.getTextureCache.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.getOutputTexture.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.renderOutput.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.updateMaxTexSize.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.setupOutputTexture.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.detachOutputTexture.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.detachTextureCache.toString()) + '\n    };\n    return kernelRunShortcut(new Kernel());\n  };';
};