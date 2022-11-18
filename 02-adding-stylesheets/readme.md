# Build a Basic Block using plain JavaScript

## Part 2: Adding Stylesheets

### Add a class to the block element by implementing useBlockProps

In order to apply styles to the block's `p` element, you need to give it a `class` attribute value. There is a special `hook` available to us from the WordPress `blockEditor` package called `useBlockProps`. If we pass `useBlockProps` to the second parameter of the `el` function when creating the element, `useBlockProps` will add an automatically generated class to the HTML `p` tag of the element that's rendered. 

Therefore, the first change you need to make is to update the IIFE to accept the `blockEditor` package as a parameter, by adding `window.wp.blockEditor` to the list of modules being passed to the funciton, and by adding `blockEditor` as a function parameter.

```js
( function ( blocks, element, blockEditor ) {
    // the rest of the block code
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor );
```

Next, inside both the `edit` and the `save` functions of the block, just before the `return` create a variable called `blockProps` and assign it the value of `blockEditor.useBlockProps()`. 

```
var blockProps = blockEditor.useBlockProps();
```

Lastly, update the `el` function that creates the element, and replace the empty object with the `blockProps` variable.

```js
return el( 'p', blockProps, 'Hello JavaScript World (from the editor).' );
```

Do this for both the `edit` and the `save` function.

### Update your dependancies

Because you've added a new module as a dependency to your block, you need to make sure this is added as a dependancy in your `block.asset.php file`.

```php
<?php return
	array( 'dependencies' =>
		       array(
			       'wp-blocks',
			       'wp-element',
				   'wp-block-editor',
			       'wp-polyfill'
		       ),
	       'version' => '0.1'
	);
 ```

If you test this code in your WordPress install, you'll see that the `p` element now has a class attribute with a value of `wp-block-wp-learn-javascript-javascript-block`. This class name is generated from the name attribute from the `block.json` metadata file. `wp-learn-javascript/javascript-block` becomes a class value of `wp-block-wp-learn-javascript-javascript-block`.

The other thing you'll notice by implementing `useBlockProps` is that you can now access the block toolbar in the editor, and move the block around, or remove it. This is because `useBlockProps` adds the `wp-block` class to the element, which is required for the block toolbar to be displayed. 

### Update the block.json file to assign a stylesheet file

In order to use a stylesheet, you need to add a `style` property to the `block.json` metadata file. This property is a string, with contains a path to a stylesheet. 

```json
 "style": "file:./style.css"
```

The `file:` prefix is required, and the path is relative to the location of the `block.json` file.

Next, you can create the `style.css` file, and add some styles to it, using the class that's generated by `useBlockProps`. 

```css
.wp-block-wp-learn-javascript-javascript-block {
    background: #900;
    color: white;
    padding: 20px;
}
```

If you test this in your WordPress install, you'll see that the block now has a red background, white text, and some padding.

### Add and editor stylesheet 

Additionally, you can also add a stylesheet that's only loaded in the editor. This is useful if you want to add styles to the block in the editor, but not on the front end.

First, add the `editorStyle` property to the `block.json` file, and assign it a path to a stylesheet file. 

```json
  "editorStyle": "file:./editor.css",
```

As before, the `file:` prefix is required, and the path is relative to the location of the `block.json` file.

Next, create the `editor.css` file, and add some styles to it. 

```css
.wp-block-wp-learn-javascript-javascript-block {
    background: #090;
    color: white;
    padding: 20px;
}
```

If you test this in your WordPress install, you'll see that the block now has a green background, white text, and some padding, when you're editing the block. If you open your browser dev tools, you'll see that the original `style.css` file is still loaded, but the `editor.css` file overrides the first set of styles.