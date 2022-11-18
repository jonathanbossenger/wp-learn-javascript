# Build a Basic Block using plain JavaScript

## Part 1: The Basics

### Create the main plugin file

The first thing you need to do is create the main plugin file. This file will be loaded by WordPress and will be responsible for registering the block. The name of the file is fairly arbritrary, but it's common to use the plugin slug (ie the directory name) as the name of the main file. In this case, the plugin slug is `wp-learn-javascript` so main plugin file is `wp-learn-javascript.php`.

The first section of code after the opening PHP tag contains the [plugin header](https://developer.wordpress.org/plugins/plugin-basics/header-requirements/), which is required for all plugins. The plugin header contains information about the plugin, such as the name, description, author, version, and more. In this case, just set the Plugin Name.

```php
/**
 * Plugin Name: WP Learn Javascript: JavaScript Block
 */
```

The next section of code registers the block type, using the register_block_type() function. This function is hooked into the `init` hook, so that it fires when WordPress initialises.
register_block_type() is the recommended way to register a block type using metadata stored in a `block.json` file. By passing it the PHP __DIR__ constant, it will automatically look for a `block.json` file in the same directory as the main plugin file.

```php
add_action( 'init', 'wp_learn_javascript_register_block' );
function wp_learn_javascript_register_block() {
	register_block_type( __DIR__ );
}
```

### Create the block.json file

Next, create the block.json file. This is the file that contains all [metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/) about the block, including it's title, name, category, icon and the JavaScript file that contains the block's code (the `editorScript` value).

```json
{
  "apiVersion": 2,
  "title": "WP Learn: Javascript Block",
  "name": "wp-learn-javascript/javascript-block",
  "category": "layout",
  "icon": "media-code",
  "editorScript": "file:./block.js"
}
```

### Create the block.js file

Next, create the actual block code, by creating the file specified in the `editorScript` value in the block.json file. In this case, the file is `block.js`.

```js
( function ( blocks, element ) {
    var el = element.createElement;

    blocks.registerBlockType( 'wp-learn-javascript/javascript-block', {
        edit: function () {
            return el( 'p', {}, 'Hello JavaScript World (from the editor).' );
        },
        save: function () {
            return el( 'p', {}, 'Hello JavaScript World (from the frontend).' );
        },
    } );
} )( window.wp.blocks, window.wp.element );
```

1. The first line of code sets up the function as an [Immediately-Invoked Function Expression](https://developer.wordpress.org/block-editor/how-to-guides/javascript/scope-your-code/#automatically-execute-anonymous-functions) (or IIFE for short). Essentially this is a function that will automaticallly run, it doesnt need to be called from anywhere. The function itself has two parameters, `blocks` and `element`. The values of these parameters are the values of the [blocks](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/) and [element](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/) modules from the `wp` global, which you can see being passed to the IIFE in the last line of this code. This is a common pattern in JavaScript, and is used to avoid polluting the global namespace.
2. The next line of code creates a variable called `el` and sets it to the `createElement` [function](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/#createelement) from the `element` module. This will allow you to use the `el` variable to create elements, instead of having to type `element.createElement` every time.
3. The next line of code registers the block type, using the `registerBlockType` function from the `blocks` module. The first parameter is the block name, which is the same as the name in the block.json file. The second parameter is an object containing the `edit` and `save` functions. These functions are responsible for rendering the block in the editor and on the frontend, respectively.
4. The `edit` function returns a paragraph element, using the `el` variable created in step 2. The first parameter is the element type, in this case `p` for paragraph. The second parameter is an object containing the attributes for the element. In this case, there are no attributes, so an empty object is passed. The third parameter is the element descendants, or children. In this case, it's a string containing the text to be displayed.
5. The `save` function is very similar to the `edit` function, except that it doesn't need to return the element, it just needs to return the value. In this case, the value is the same as the `edit` function, so it's just returned directly.
6. Notice with both the edit and save functions, the element is returned. This return value is what is used to render the block in the editor and on the frontend.

### Create the block.asset.php file

Because you're not using Node.js/npm to build the transpiled code from JSX, the final step is to create the `block.asset.php` file. This file is used by when the block type is registered, to determine of the block has any specific dependancies, and to only enqueue the block JavaScript once those dependancies are loaded. 

```php
<?php return
	array( 'dependencies' =>
		       array(
			       'wp-blocks',
			       'wp-element',
			       'wp-polyfill'
		       ),
	       'version' => '0.1'
	);
```

The code in this file simply returns a PHP array with a list of dependencies, and a block version number. You'll notice the dependencies are the same as the modules from the `wp` global used in the `block.js` file, as well as an additional `wp-polyfill` dependency. This is needed because we're using plain JavaScript. The version number is usually the same as the plugin version number.
