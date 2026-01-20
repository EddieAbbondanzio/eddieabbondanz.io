# EddieAbbondanz.io

My personal blog that I like to write up posts about various projects I'm working on.

# Tech Stack

Hugo with a sprinkle of Vue. Hugo is used for generating the static website (blog posts, about page, etc...) and Vue is used for more interactive features like calculators or widgets.

Styling is a mix of custom css, [Open Color](https://yeun.github.io/open-color/), and [Shoelace](https://shoelace.style/).

## git-lfs

To keep the repo size small all blog post pictures are stored in gft-lfs.

This was done when the repo hit the 5gb limit via `git lfs migrate import --everything --include="content/**/*.png,content/**/*.jpg,content/**/*.gif,content/**/*.svg"`

# Dev

- Clone repo
- Install `git-lfs` (for linux use `sudo apt-get install git-lfs` followed by `git lfs install`)
- Install nvm and run `nvm use`
- Install yarn `npm install -g yarn`
- Run `yarn` on the root dir
- Build widgets `yarn workspace widgets run build`
- Start app via `yarn run serve` (`cd` back to root dir)
