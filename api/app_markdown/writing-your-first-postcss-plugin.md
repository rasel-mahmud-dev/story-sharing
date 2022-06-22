# our First PostCSS Plugin      

​        By:         [James Steinbach](https://dockyard.com/blog/authors/james-steinbach)        •        February 2, 2018       

## Tags

- [                JavaScript ](https://dockyard.com/blog/categories/javascript)            
- [                Web Development ](https://dockyard.com/blog/categories/web-development)            
- [                UXD ](https://dockyard.com/blog/categories/uxd)            

​          ![Writing Your First PostCSS Plugin](https://assets.dockyard.com/images/20180201_postcss-tool_writing-your-first-postcss-plugin.jpg)      

## Why Use PostCSS?

You may already be using Sass or Less to add logic to your CSS  workflow: variables, if/else statements, functions, and mixins. However, there are some limitations to those preprocessors. What if you need to  add a CSS property or two based on the presence of other CSS properties? 

For example, we’ve worked a lot on [progressive web apps](https://dockyard.com/progressive-web-apps) here at DockYard lately. We want that nice native-feeling elastic/inertia scrolling whenever we have an element with `overflow: scroll` (or `overflow-x` / `overflow-y`). Everywhere we make an element scrollable, we’d need to add `-webkit-overflow-scrolling: touch`. Preprocessors don’t have a way to detect what properties are in a given selector block, so we’d need a verbose mixin solution. Additionally, we don’t use a preprocessor on every project, so we needed a PostCSS  solution.

For the sake of comparison, here’s how we might implement a Sass mixin for this scrolling behavior:

```scss
@mixin overflow-scroll($direction: false) {
  $property: if($direction, 'overflow-#{$direction}', 'overflow');

  #{$property}: overflow;
  -webkit-overflow-scrolling: touch;
}
```

*[See that mixin in use on Sassmeister](https://www.sassmeister.com/gist/3b69f51fab9ca39d6b1e9348d62f3187)*.

This approach works, but it has some significant shortcomings. First, you’re not writing spec CSS anymore: you’re writing a more verbose  abstraction. Any dev who comes to this codebase has to learn another  abstraction. Second, this isn’t well-automated. If you forget to use the mixin, you don’t get the extra property.

PostCSS, on the other hand, automates this fully with no need for a  written abstraction. A PostCSS plugin can find any selector block with a scrolling overflow and insert the additional property automatically.

## What Is PostCSS?

Before we get into the actual plugin writing process, let’s  understand what PostCSS is. PostCSS allows us to manipulate our CSS with JavaScript functions. It does 3 things to accomplish that:

1. PostCSS turns your CSS file into a JS object.
2. PostCSS plugins can loop through the object and add/remove/modify selectors and properties.
3. PostCSS converts that object back to a CSS file.

If you’re interested in practical value of PostCSS, you can read more about [why DockYard transitioned to PostCSS](https://dockyard.com/blog/2016/02/11/transition-to-postcss) and [our PostCSS package: Narwin-Pack](https://dockyard.com/blog/2016/05/27/narwin-pack-the-postcss-package).

There are [dozens of PostCSS plugins](https://www.postcss.parts/) already available, openly maintained, and published to npm.

What if you have a use case that’s not covered by an existing plugin? (Perhaps like the one we discussed above?)

## Writing a PostCSS Plugin

The PostCSS team has done a great job removing obstacles to writing  your own plugin. The rest of this tutorial assumes a few things about  your skill level:

1. that you’re comfortable with [git](https://git-scm.com/book/en/v2) and the [command line](http://linuxcommand.org/lc3_learning_the_shell.php),
2. that you can [write JavaScript functions](https://www.javascript.com/), and 
3. that you have [node installed](https://nodejs.org/en/download/) and know how to [install npm modules](https://www.npmjs.com/)

### Clone the PostCSS Plugin Boilerplate Repo

Head over to your terminal and clone the [PostCSS Plugin Boilerplate](https://github.com/postcss/postcss-plugin-boilerplate) repo

```sh
$ git clone git@github.com:postcss/postcss-plugin-boilerplate.git
```

Next, run the wizard script from that repo:

```sh
$ node ./postcss-plugin-boilerplate/start
```

This script will ask you several questions in your terminal. It’ll pull your name and email address from your local git profile (if you’ve set that  up), and then ask you for your Github username.

Next, you’ll choose your plugin name. It’ll begin with `postcss-` and you’ll complete the name. The wizard will then ask you to finish a  sentence describing what your plugin will do. Finally, it’ll start a  comma-separated list of tags for you to complete.

!['PostCSS Plugin Boilerplate wizard'](https://i.imgur.com/mJlzNku.jpg)

Once you’ve finished this setup, you’ll have a boilerplate directory: the wizard created it with the same name that you chose for your plugin while answering the script’s questions. Let’s head over to that  directory:

```sh
$ cd postcss-test-plugin
```

In it, you’ll find some familiar components of a node-based project: `index.ts`, `package.json`, a `node_modules` directory. You’ll put your logic in `index.ts`: the functions that manipulate the CSS. If you have any other node module dependencies for your plugin, `package.json` will manage them and install them in `node_modules`.

### The Boilerplate Code in `index.ts`

Let’s start by looking at the boilerplate code provided in `index.ts`:

```js
var postcss = require('postcss');
```

The first thing it does is grab the necessary prerequisite: the PostCSS  library itself. The code that follows relies on having access to  PostCSS.

```js
module.exports = postcss.plugin('postcss-test-plugin', function (opts) {
    opts = opts || {};
    // Work with options here
    return function (root, result) {
        // Transform CSS AST here
    };
});
```

This block of code is the part that actually contains instructions for manipulating your CSS. 

The first thing we’ll need to do is walk through all the declaration blocks in the stylesheet. The `root` parameter inside the `return` function has a method for that: `.walkRules()`.

### Looping Through Each Selector Block

We’ll upgrade the boilerplate with `.walkRules()` to loop through every declaration block and let us access the styles in it:

```js
root.walkRules(function(rule) {
  // We'll put more code here in a moment…
});
```

Now that we’re walking through each selector block, we need to see if it contains a `overflow` property. To access those properties, we’ll use the `.walkDecls()` method that’s part of the `rule` passed to the function above.

### Looping Through Each Property

```js
rule.walkDecls(function(decl) {
  // We work with each `decl` object here.
});
```

Inside this loop, `decl` is an object representing a style declaration. It contains data about  the property-value pair as well as some methods for manipulating it. The two most important things for our case are `decl.prop` (the property name) and `decl.value` (the property value).

### Finding Overflow Properties

To detect if a `decl` is `overflow`-related, we could put an `if` statement inside this loop: `if (decl.prop.indexOf('overflow') === 0)`, but there’s a more efficient way to do that. PostCSS lets us filter for specific properties in the `.walkDecls()` method. You can find this in the [PostCSS API Documentation](http://api.postcss.org/Root.html#walkDecls). We don’t need that `if` statement if we filter for the `overflow` property like this:

```js
rule.walkDecls('overflow', function(decl) {
  // We work with the `decl` object here.
});
```

This isn’t quite right, however. It’s only going to find the `overflow` property. If we want to account for `overflow-x` and `overflow-y` also (and we do), we need to adjust that filter a bit. This `prop` parameter doesn’t take an array of property names (I tried `['overflow', 'overflow-x', 'overflow-y']`, but no luck). To match multiple properties, we’ll have to use a bit of RegEx: `/^overflow-?/`. Here’s a quick explanation for that syntax: the `^` means the property name has to start with `overflow`; the `-?` means “there might or might not be a `-` after the word `overflow`. Notice that we don’t use `''` around the regex. This brings us to:

```js
rule.walkDecls(/^overflow-?/, function(decl) {
  // We work with the `decl` object here.
});
```

### Preventing Duplicate Properties

It’s taken a bit of time, but now we’re almost there: this code will  loop through all the selector blocks in our stylesheet, then loop  through all the `overflow`-related properties  in those selectors. All that’s left to do is insert our property. The  next block of code will check to see if the `overflow`-related property’s value is `scroll` and if so, add the property that makes it feel more native.

```js
if (decl.value === 'scroll') {
  rule.append({
    prop: '-webkit-overflow-scrolling',
    value: 'touch'
  });
}
```

In this case, we are resorting to an `if` statement. The loop we wrote a moment ago filtered properties so this function only runs on `decl` objects where the property starts with `overflow-?`. Now, if `decl.value` is `scroll`, we’ll add a property-value pair to the parent `rule` object. We’re *almost* done now. It’s possible that someone might have *already* included the `-webkit-overflow-scrolling` property. We don’t want to duplicate it. PostCSS has a function that  lets us check to see if a given property is already in a selector block:

```js
var hasTouch = rule.some(function(i) {
  return i.prop === '-webkit-overflow-scrolling';
});
if (!hasTouch) {
  rule.append({
    prop: '-webkit-overflow-scrolling',
    value: 'touch'
  });
}
```

Now we’ve got a better function: if a developer intentionally put the `-webkit-overflow-scrolling` where it was needed, we won’t duplicate it.

## Conclusion

In just 20 lines of code, we’ve created a useful PostCSS plugin.

```js
var postcss = require('postcss');
module.exports = postcss.plugin('postcss-test-plugin', function() {
  return function(root) {
    root.walkRules(function(rule) {
      rule.walkDecls(/^overflow-?/, function(decl) {
        if (decl.value === 'scroll') {
          var hasTouch = rule.some(function(i) {
            return i.prop === '-webkit-overflow-scrolling';
          });
          if (!hasTouch) {
            rule.append({
              prop: '-webkit-overflow-scrolling',
              value: 'touch'
            });
          }
        }
      });
    });
  };
});
```

Of course, there are more complications that we’d consider for production purposes: 

- We could add a CSS comment syntax that allows developers to exclude  certain selector blocks from getting elastic scrolling added. 
- We may want to allow option parameters so that this plugin only automates elastic scrolling on the `x` or `y` axis.
- We need to work on `index.test.js` so we can ensure this keeps working through any code updates.

But, all things considered, we did put together a working plugin  pretty quickly. Hopefully, you’re able to take this walk-through and put together your own PostCSS plugins in the future!
