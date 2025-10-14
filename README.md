# EddieAbbondanz.io

My personal blog that I like to write up posts about various projects I'm working on.

# Tech Stack

Hugo with a sprinkle of Vue. Hugo is used for generating the static website (blog posts, about page, etc...) and Vue is used for more interactive features like calculators or widgets.

Styling is a mix of custom css, [Open Color](https://yeun.github.io/open-color/), and [Shoelace](https://shoelace.style/).

The website is hosted on Github Pages and uses a git submodule for the build dir. This setup is a little more complex than it needs to be now but back when I first built out the blog Github pages didn't support deploying from a sub dir.

## GitHub Pages

GH Pages doesn't play nice with files that start with an underscore so a `.nojekyll` file was added. ([Source](https://stackoverflow.com/questions/78633671/vue-app-getting-a-plugin-vue-export-helper-404-error-when-deployed))

# Dev

- Install nvm and run `nvm use`
- Install yarn `npm install -g yarn`
- Run `yarn` on the root dir
- Build widgets `yarn workspace widgets run build`
- Start app via `yarn run serve` (`cd` back to root dir)
