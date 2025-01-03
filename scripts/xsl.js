import fs from 'node:fs'
import Handlebars from 'handlebars'
import minify from 'minify-xml'
import glob from 'tiny-glob'

async function main() {
  const styles = fs.readFileSync('./public/rss-beauty.css', 'utf8')
  Handlebars.registerPartial('styles', `<style>${styles}</style>`)

  const partials = await glob('./src/xsl/partials/*.html')
  partials?.forEach((partial) => {
    const name = partial.split(/[/\\]/).pop().split('.')[0]
    Handlebars.registerPartial(name, fs.readFileSync(partial, 'utf8'))
  })

  const files = await glob('./src/xsl/*.xsl')
  files?.forEach((file) => {
    const name = file.split(/[/\\]/).pop().split('.')[0]
    const content = fs.readFileSync(file, 'utf8')
    const compiled = Handlebars.compile(content)
    fs.writeFileSync(`./public/${name}.xsl`, minify(compiled(), {
      removeUnusedNamespaces: false,
      shortenNamespaces: false,
    }))
  })
}

main()
