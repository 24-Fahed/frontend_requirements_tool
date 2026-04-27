/**
 * 前端代码结构提取脚本
 * 使用 vue-component-meta 提取所有 Vue 组件的 props、methods、computed、emits、slots
 * 同时使用 babel/parser 提取 JS 服务文件的函数和导出
 */
import pkg from 'vue-component-meta'
const { createComponentMetaChecker } = pkg
import { parse } from '@babel/parser'
import fs from 'fs'
import path from 'path'

const tsconfigPath = path.resolve('tsconfig.json')
// 如果没有 tsconfig，用虚拟配置
const checker = createComponentMetaChecker(
  path.resolve('tsconfig.json'),
  undefined,
  {
    // 不强制要求 tsconfig 存在
  }
)

console.log('=== Vue 组件分析 ===\n')

const vueFiles = [
  'src/modules/ui/components/AppHeader.vue',
  'src/modules/ui/components/SideBar.vue',
  'src/modules/ui/components/ContentArea.vue',
  'src/modules/ui/components/SimulatorArea.vue',
  'src/modules/interactive/components/PhoneFrame.vue',
  'src/modules/interactive/components/SimNode.vue',
  'src/modules/interactive/components/ComponentPanel.vue',
  'src/modules/requirement/components/TableRenderer.vue',
  'src/modules/requirement/components/QuestionRow.vue',
  'src/App.vue',
]

for (const file of vueFiles) {
  const filePath = path.resolve(file)
  console.log(`\n--- ${file} ---`)
  if (!fs.existsSync(filePath)) {
    console.log('  [文件不存在]')
    continue
  }
  try {
    const meta = checker.getComponentMeta(filePath)
    console.log('  组件名:', meta.componentName || '(未命名)')

    if (meta.props && meta.props.length > 0) {
      console.log('  Props:')
      meta.props.forEach(p => {
        console.log(`    - ${p.name}: ${p.type || 'any'}${p.required ? ' (required)' : ''}${p.default ? ` = ${p.default}` : ''}`)
      })
    }

    if (meta.events && meta.events.length > 0) {
      console.log('  Emits:')
      meta.events.forEach(e => {
        console.log(`    - ${e.name}: ${e.type || 'any'}`)
      })
    }

    if (meta.slots && meta.slots.length > 0) {
      console.log('  Slots:')
      meta.slots.forEach(s => {
        console.log(`    - ${s.name}: ${s.description || ''}`)
      })
    }

    if (meta.exposed && meta.exposed.length > 0) {
      console.log('  Exposed:')
      meta.exposed.forEach(e => {
        console.log(`    - ${e.name}: ${e.type || 'any'}`)
      })
    }
  } catch (e) {
    console.log('  [解析错误]:', e.message)
  }
}

// 解析 JS 服务文件
console.log('\n\n=== JS 服务文件分析 ===\n')

const jsFiles = [
  'src/modules/interactive/services/componentLoader.js',
  'src/stores/app.js',
  'src/stores/simulator.js',
  'src/api/index.js',
  'src/main.js',
]

for (const file of jsFiles) {
  const filePath = path.resolve(file)
  console.log(`\n--- ${file} ---`)
  if (!fs.existsSync(filePath)) {
    console.log('  [文件不存在]')
    continue
  }

  const code = fs.readFileSync(filePath, 'utf-8')
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy', 'classProperties', 'exportDefaultFrom'],
    })

    for (const node of ast.program.body) {
      if (node.type === 'ExportDefaultDeclaration') {
        const decl = node.declaration
        if (decl.type === 'ObjectExpression') {
          console.log('  export default { ... }')
          for (const prop of decl.properties) {
            if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier') {
              if (prop.key.name === 'state' && prop.value.type === 'ObjectExpression') {
                console.log('    state:')
                prop.value.properties.forEach(p => {
                  if (p.key?.name) console.log(`      - ${p.key.name}`)
                })
              } else if (prop.key.name === 'getters' && prop.value.type === 'ObjectExpression') {
                console.log('    getters:')
                prop.value.properties.forEach(p => {
                  if (p.key?.name) console.log(`      - ${p.key.name}`)
                })
              } else if (prop.key.name === 'actions' && prop.value.type === 'ObjectExpression') {
                console.log('    actions:')
                prop.value.properties.forEach(p => {
                  if (p.key?.name) {
                    const params = p.params?.map(pp => pp.name || pp.left?.name || '?').join(', ') || ''
                    console.log(`      - ${p.key.name}(${params})`)
                  }
                })
              }
            }
          }
        }
      }
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration?.type === 'FunctionDeclaration') {
          const fn = node.declaration
          const params = fn.params.map(p => p.name || '?').join(', ')
          console.log(`  export function ${fn.id?.name}(${params})`)
        }
        if (node.declaration?.type === 'VariableDeclaration') {
          for (const decl of node.declaration.declarations) {
            if (decl.id?.type === 'Identifier') {
              console.log(`  export const ${decl.id.name}`)
            }
            if (decl.id?.type === 'ObjectPattern') {
              // 解构导出
            }
          }
        }
        if (node.declaration?.type === 'ClassDeclaration') {
          const cls = node.declaration
          console.log(`  export class ${cls.id?.name}`)
          cls.body.body.forEach(member => {
            if (member.type === 'ClassMethod') {
              const params = member.params.map(p => p.name || '?').join(', ')
              console.log(`    ${member.kind} ${member.key?.name}(${params})`)
            }
            if (member.type === 'ClassProperty') {
              console.log(`    property: ${member.key?.name}`)
            }
          })
        }
      }
      if (node.type === 'VariableDeclaration') {
        for (const decl of node.declarations) {
          if (decl.id?.type === 'Identifier' && decl.init?.type === 'CallExpression') {
            const callee = decl.init.callee
            if (callee.type === 'Identifier' && callee.name === 'defineStore') {
              console.log(`  defineStore: ${decl.init.arguments[0]?.value}`)
            }
          }
        }
      }
    }
  } catch (e) {
    console.log('  [解析错误]:', e.message)
  }
}
