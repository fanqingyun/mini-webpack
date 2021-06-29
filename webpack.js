const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const path = require('path')
const babel = require('@babel/core')
let ID = 0
// 获取一个文件的依赖
function creatAsset(filePath) {
  // 读取文件的内容
  const content = fs.readFileSync(filePath, 'utf-8')
  // 为了文件的依赖，借助babylon将内容转为AST， 参考：https://astexplorer.net/#/2uBU1BLuJ1
  const ast = parser.parse(content, {
    sourceType: 'module', // 识别ES Module
  })
  // 存储依赖
  const dependencies = []
  // 为了获取文件的依赖, 需要能够遍历ast，拿到ImportDeclaration节点， 于是引入@babel/traverse
  traverse(ast, {
    ImportDeclaration({ node }) {
      dependencies.push(node.source.value)
    },
  })

  // 编译@babel/core，参考https://babeljs.io/repl#?browsers=&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=JYWwDg9gTgLgBAQwB7AgZzgMyhEcDkyqa-A3AFDkCmSkscAJlZggK4A28R6pQA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env&prettier=true&targets=&version=7.14.4&externalPlugins=
  // @babel/preset-env 编译成什么格式
  // 注意babel应该配套使用，不然会因为版本不同而报错
  // 将ast编译成预设格式的js代码
  const { code } = babel.transformFromAstSync(ast, null, {
    presets:["@babel/preset-env"]
  })
  return {
    id: ID++,
    filePath,
    dependencies,
    code
  }
}
// 创建依赖图
function createGraph(entry) {
  const mainAsset = creatAsset(entry)
  let graph = [mainAsset]
  for (let asset of graph) {
    const dir = path.dirname(asset.filePath)
    asset.mapping = {}
    for (let relativePath of asset.dependencies) {
      // 这里做路径转化，让被依赖的文件相对与当前文件filePath，而不是webpack.js
      let childAsset = creatAsset(path.join(dir, relativePath))
      // 由于数组是动态的，这一步可以让数组遍历新推进的元素childAsset
      graph.push(childAsset)
      asset.mapping[relativePath] = childAsset.id
    }
  }
  return graph
}
// 打包
function bundle (graph) {
    let modules = ''
    graph.forEach(module => {
        modules += `${module.id}: [function (require, module, exports) {
            ${module.code}
        }, ${JSON.stringify(module.mapping)}],`
    })
    return `(function(modules) {
        function require(id) {
            const [fn, mapping] = modules[id]
            const module = {exports: {} }
            function localRequie(relativePath) { // 由于在文件内，使用import通过文件名称引入，但是我们自定义的require使用的是id，所以使用模块的mapping做一个转换
                return require(mapping[relativePath])
            }
            fn(localRequie, module, module.exports)
            console.log(module.exports)
            return module.exports
        }
        // 入口
        require(0)
    })({${modules}})`
}
const graph = createGraph('./src/index.js')
const result = bundle(graph)
console.log(result)