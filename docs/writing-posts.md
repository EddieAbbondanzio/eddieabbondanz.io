# Writing Posts

Hugo expects all posts to be under `content/post`. Each post series gets it's own sub directory to try and help keep things organized.

## Post Front Matter

The following properties are currently supported:

- `title`: The title to display atop the page and in the summary.
- `date`: Post date
- `summary`: Allows for overriding the default summary that hugo will generate.
- `type`: Must be "post" so Hugo knows what it is.
- `series`: Helpful way to group multiple posts together.
- `thumbnail`: The path to the thumbnail image to use in the summary. Defaults to `images/thumbnail.jpg`

## Adding Images

Each post should be stored in it's own directory with a `images` subdir for any images it'll contain.

For example a Foo Bar post would look like:

```
/foo-bar
  images
  index.md
```

Where index.md is the markdown content of the post and images is a subdir.

The blog theme will automatically look for a `thumbnail.jpg` to use from `images` but if needed a new path can be specified via the `thumbnail` front matter property.

Ideal thumbnail dimensions are 500x281.

## Custom Markdown Rendering

Hugo allows for customizing markdown rendering via hooks. These can be found in `layouts/_default/_markup`

See: https://gohugo.io/templates/render-hooks/
